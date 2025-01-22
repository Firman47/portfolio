import ablyClient from "@/lib/ably";
import { Comment, commentRepository } from "@/models/action/Comment";
import { userRepository } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import * as Yup from "yup";

const validate = Yup.object({
  user_id: Yup.string().required("user_id is required"),
  parent_id: Yup.string().optional(),
  content_id: Yup.string().required("content_id  is required"),
  text: Yup.string().required("text  is required"),
  content_type: Yup.string()
    .oneOf(["blog", "project"], "Invalid content_type")
    .required("content_type is required"),
}).noUnknown(true);

const repository = commentRepository();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const content_id = searchParams.get("content_id");
    const content_type = searchParams.get("content_type");

    if (!content_id || !content_type) {
      return NextResponse.json({
        status: false,
        message: "Missing required query parameters",
      });
    }

    const allData = await repository
      .whereEqualTo("content_id", content_id)
      .whereEqualTo("content_type", content_type)
      .orderByDescending("created_at")
      .find();

    const addUserAndChildren = async (data: Comment) => {
      const user = await userRepository().findById(data.user_id);

      let children = await repository.whereEqualTo("parent_id", data.id).find();

      if (children && children.length > 0) {
        children = await Promise.all(
          children.map(async (child) => {
            return await addUserAndChildren(child);
          })
        );
      }

      return {
        ...data,
        user,
        children,
      };
    };

    const allDataWithUser = await Promise.all(
      allData.map(async (data) => {
        if (!data.parent_id) {
          return await addUserAndChildren(data);
        }
        return null;
      })
    );

    const result = allDataWithUser.filter((data) => data !== null);

    if (result) {
      const channel = ablyClient.channels.get("comments");
      channel.publish("update", {
        content_id,
        content_type,
        countData: allData.length,
        data: result,
      });

      return NextResponse.json(
        {
          message: "Like berhasil ditemukan",
          content_id,
          content_type,
          countData: allData.length,
          data: result,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error in like action:", error);
    return NextResponse.json(
      { status: false, message: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    await validate.validate(req, { abortEarly: false });

    const newComment = new Comment();
    newComment.user_id = req.user_id;
    newComment.parent_id = req.parent_id;
    newComment.content_id = req.content_id;
    newComment.content_type = req.content_type;
    newComment.text = req.text;
    newComment.created_at = new Date();

    const newData = await repository.create(newComment);

    const allData = await repository
      .whereEqualTo("content_id", req.content_id)
      .whereEqualTo("content_type", req.content_type)
      .orderByDescending("created_at")
      .find();

    const addUserAndChildren = async (data: Comment) => {
      const user = await userRepository().findById(data.user_id);

      let children = await repository.whereEqualTo("parent_id", data.id).find();

      if (children && children.length > 0) {
        children = await Promise.all(
          children.map(async (child) => {
            return await addUserAndChildren(child);
          })
        );
      }

      return {
        ...data,
        user,
        children,
      };
    };

    const allDataWithUser = await Promise.all(
      allData.map(async (data) => {
        if (!data.parent_id) {
          return await addUserAndChildren(data);
        }
        return null;
      })
    );

    const result = allDataWithUser.filter((data) => data !== null);

    if (newData) {
      return NextResponse.json({
        message: "Like berhasil ditambahkan",
        content_id: req.content_id,
        content_type: req.content_type,
        countData: allData.length,
        data: result,
      });
    }
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    } else {
      return NextResponse.json({ message: "error: " + error }, { status: 500 });
    }
  }
}
