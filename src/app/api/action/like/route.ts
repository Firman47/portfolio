import { NextRequest, NextResponse } from "next/server";
import * as Yup from "yup";
import { Like, likeRepository } from "@/models/action/Like";
import ablyClient from "@/lib/ably";

const repository = likeRepository();
const validate = Yup.object({
  user_id: Yup.string().required("user_id is required"),
  content_id: Yup.string().required("content_id  is required"),
  content_type: Yup.string()
    .oneOf(["blog", "project", "comment"], "Invalid content_type")
    .required("content_type is required"),
}).noUnknown(true);

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();

    await validate.validate(req);
    const { user_id, content_id, content_type } = req;

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

      likedByUser = await repository
        .whereEqualTo("user_id", user_id)
        .whereEqualTo("content_id", content_id)
        .whereEqualTo("content_type", content_type)
        .findOne();
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

      likedByUser = await repository
        .whereEqualTo("user_id", user_id)
        .whereEqualTo("content_id", content_id)
        .whereEqualTo("content_type", content_type)
        .findOne();
    }

    const channel = ablyClient.channels.get("likes");
    channel.publish("update", {
      content_id,
      content_type,
      data: allData,
      likedByUser: likedByUser?.user_id,
    });

    return NextResponse.json(
      {
        message: likedByUser
          ? "Like berhasil ditambahkan"
          : "Like berhasil dihapus",
        data: allData,
        content_id,
        likedByUser: likedByUser?.user_id,
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

    if (!content_id || !content_type) {
      return NextResponse.json({
        status: false,
        message: "Missing required query parameters",
      });
    }

    let userData;
    if (user_id) {
      userData = await repository
        .whereEqualTo("user_id", user_id)
        .whereEqualTo("content_id", content_id)
        .whereEqualTo("content_type", content_type)
        .findOne();
    }

    const allData = await repository
      .whereEqualTo("content_id", content_id)
      .whereEqualTo("content_type", content_type)
      .find();

    const channel = ablyClient.channels.get("likes");
    channel.publish("update", {
      content_id,
      content_type,
      data: allData,
      likedByUser: userData?.user_id,
    });

    return NextResponse.json(
      {
        message: "Like berhasil ditemukan",
        data: allData,
        content_id,
        likedByUser: userData?.user_id,
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
