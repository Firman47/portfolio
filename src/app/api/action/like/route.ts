import { NextRequest, NextResponse } from "next/server";
import * as Yup from "yup";
import { Like, likeRepository } from "@/models/action/Like";
import { blogRepository } from "@/models/Blog";
import { userRepository } from "@/models/User";
import ably from "@/lib/ably";

const repository = likeRepository();
const validate = Yup.object({
  user_id: Yup.string().required("user_id is required"),
  content_id: Yup.string().required("content_id  is required"),
  content_type: Yup.string()
    .oneOf(["blog", "project"], "Invalid content_type")
    .required("content_type is required"),
}).noUnknown(true);

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();

    await validate.validate(req);
    const { user_id, content_id, content_type } = req;

    const checkBlog = await blogRepository()
      .whereEqualTo("id", content_id)
      .findOne();
    if (!checkBlog) {
      return NextResponse.json({
        status: false,
        message: "Blog tidak ditemukan",
      });
    }

    const cekUser = await userRepository()
      .whereEqualTo("id", user_id)
      .findOne();
    if (!cekUser) {
      return NextResponse.json({
        status: false,
        message: "User tidak ditemukan",
      });
    }

    const likeExist = await repository
      .whereEqualTo("user_id", user_id)
      .whereEqualTo("content_id", content_id)
      .whereEqualTo("content_type", content_type)
      .findOne();

    let allData = [];
    let likedByUser;

    if (likeExist) {
      await repository.delete(likeExist.id);

      allData = await repository
        .whereEqualTo("content_id", content_id)
        .whereEqualTo("content_type", content_type)
        .find();

      likedByUser = false;
    } else {
      const newLike = new Like();
      newLike.user_id = user_id;
      newLike.content_id = content_id;
      newLike.content_type = content_type;
      newLike.created_at = new Date();

      await repository.create(newLike);

      allData = await repository
        .whereEqualTo("content_id", content_id)
        .whereEqualTo("content_type", content_type)
        .find();

      likedByUser = true;
    }

    const channel = ably.channels.get("likes");
    channel.publish("update", {
      content_id,
      content_type,
      likes: allData.length,
      likedByUser,
    });

    return NextResponse.json(
      {
        message: likedByUser
          ? "Like berhasil ditambahkan"
          : "Like berhasil dihapus",
        data: allData,
        content_id,
        likedByUser,
      },
      { status: likedByUser ? 201 : 200 }
    );
  } catch (error) {
    console.error("Error in like action:", error);
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");
    const content_id = searchParams.get("content_id");
    const content_type = searchParams.get("content_type");

    if (!user_id || !content_id || !content_type) {
      return NextResponse.json({
        status: false,
        message: "Missing required query parameters",
      });
    }

    const checkBlog = await blogRepository()
      .whereEqualTo("id", content_id)
      .findOne();
    if (!checkBlog) {
      return NextResponse.json({
        status: false,
        message: "Blog tidak ditemukan",
      });
    }

    const cekUser = await userRepository()
      .whereEqualTo("id", user_id)
      .findOne();
    if (!cekUser) {
      return NextResponse.json({
        status: false,
        message: "User tidak ditemukan",
      });
    }

    const userData = await repository
      .whereEqualTo("user_id", user_id)
      .whereEqualTo("content_id", content_id)
      .whereEqualTo("content_type", content_type)
      .findOne();

    const allData = await repository
      .whereEqualTo("content_id", content_id)
      .whereEqualTo("content_type", content_type)
      .find();

    const channel = ably.channels.get("likes");
    channel.publish("update", {
      content_id,
      content_type,
      likes: allData.length,
      likedByUser: userData ? true : false,
    });

    return NextResponse.json(
      {
        message: "Like berhasil ditemukan",
        data: allData,
        content_id,
        likedByUser: userData ? true : false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in like action:", error);
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
// export const addLike = async (
//   req: Request,
//   res: Response,
//   io: Server
// ): Promise<void> => {
//   const { user_id, content_id, content_type } = req.body;

//   const validContentTypes: ("blog" | "project")[] = ["blog", "project"];

//   if (!validContentTypes.includes(content_type)) {
//     res.status(400).json({ message: "Invalid content_type" });
//     return;
//   }

//   if (!user_id || !content_id || !content_type) {
//     res
//       .status(400)
//       .json({ message: "user_id, content_id, and content_type are required" });
//     return;
//   }

//   try {
//     const cekBLog = await blogRepository()
//       .whereEqualTo("id", content_id)
//       .findOne();
//     if (!cekBLog) {
//       res
//         .status(404)
//         .json({ message: "Blog ID tidak ditemukan. Harap periksa kembali." });
//       return;
//     }

//     const cekUser = await userRepository()
//       .whereNotEqualTo("id", user_id)
//       .findOne();
//     if (!cekUser) {
//       res
//         .status(404)
//         .json({ message: "User ID tidak ditemukan. Harap periksa kembali." });
//       return;
//     }

//     const data = await repository
//       .whereEqualTo("content_type", content_type)
//       .whereEqualTo("content_id", content_id)
//       .whereEqualTo("user_id", user_id)
//       .findOne();

//     if (data) {
//       await repository.delete(data.id);

//       res.status(201).json({ message: "Like berhasil dihapus" });
//     } else {
//       const newLike = new Like();
//       newLike.user_id = user_id;
//       newLike.content_id = content_id;
//       newLike.content_type = content_type; // Sudah type-safe
//       newLike.created_at = new Date();

//       // Menyimpan data like ke database
//       const createdData = await repository.create(newLike);

//       res
//         .status(200)
//         .json({ message: "Like berhasil ditambahkan", data: createdData });
//     }
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ message: "Terjadi kesalahan saat menyimpan like", error: err });
//   }
// };

// export const getAll = async (
//   req: Request,
//   res: Response,
//   io: Server
// ): Promise<void> => {
//   try {
//     const { content_id, content_type } = req.body;

//     const validContentTypes: ("blog" | "project")[] = ["blog", "project"];

//     if (!validContentTypes.includes(content_type)) {
//       res.status(400).json({ message: "Invalid content_type" });
//       return;
//     }

//     if (!content_id || !content_type) {
//       res.status(400).json({
//         message: " content_id, and content_type are required",
//       });
//       return;
//     }

//     const cekBLog = await blogRepository()
//       .whereEqualTo("id", content_id)
//       .findOne();
//     if (!cekBLog) {
//       res
//         .status(404)
//         .json({ message: "Blog ID tidak ditemukan. Harap periksa kembali." });
//       return;
//     }

//     const data = await repository
//       .whereEqualTo("content_type", content_type)
//       .whereEqualTo("content_id", content_id)
//       .find();

//     if (data) {
//       const likesUpdatePayload = {
//         content_id,
//         content_type,
//         updatedLikes: data,
//       };
//       io.emit("likes_updated", likesUpdatePayload);

//       res
//         .status(200)
//         .json({ message: "Like berhasil ditampilkan", data: data });
//     } else {
//       res.status(200).json({ message: "like tidak ditemukan" });
//     }
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ message: "Terjadi kesalahan saat menyimpan like", error: err });
//   }
// };

// export const getByUser = async (
//   req: Request,
//   res: Response,
//   io: Server
// ): Promise<void> => {
//   try {
//     const { user_id, content_id, content_type } = req.body;

//     const validContentTypes: ("blog" | "project")[] = ["blog", "project"];

//     if (!validContentTypes.includes(content_type)) {
//       res.status(400).json({ message: "Invalid content_type" });
//       return;
//     }

//     if (!user_id || !content_id || !content_type) {
//       res.status(400).json({
//         message: "user_id, content_id, and content_type are required",
//       });
//       return;
//     }

//     const cekBLog = await blogRepository()
//       .whereEqualTo("id", content_id)
//       .findOne();
//     if (!cekBLog) {
//       res
//         .status(404)
//         .json({ message: "Blog ID tidak ditemukan. Harap periksa kembali." });
//       return;
//     }

//     const cekUser = await userRepository()
//       .whereNotEqualTo("id", user_id)
//       .findOne();
//     if (!cekUser) {
//       res
//         .status(404)
//         .json({ message: "User ID tidak ditemukan. Harap periksa kembali." });
//       return;
//     }

//     const data = await repository
//       .whereEqualTo("content_type", content_type)
//       .whereEqualTo("content_id", content_id)
//       .whereEqualTo("user_id", user_id)
//       .find();

//     if (data) {
//       io.emit("likes_updated", data);

//       res
//         .status(200)
//         .json({ message: "Like berhasil ditampilkan", data: data });
//     } else {
//       res.status(200).json({ message: "like tidak ditemukan" });
//     }
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ message: "Terjadi kesalahan saat menyimpan like", error: err });
//   }
// };