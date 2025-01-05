import { NextRequest, NextResponse } from "next/server";
import { blogRepository } from "@/models/Blog";

const repository = blogRepository();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const detailBlog = await repository.whereEqualTo("slug", slug).find();

      if (detailBlog) {
        return NextResponse.json({
          status: 200,
          message: "Success",
          data: detailBlog,
        });
      } else {
        return NextResponse.json({
          status: 404,
          message: "Data not found",
        });
      }
    } else {
      const data = await repository.find();
      return NextResponse.json({ status: 200, message: "Success", data });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Failed to retrieve data" + error,
    });
  }
}
