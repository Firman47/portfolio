import { NextRequest, NextResponse } from "next/server";
import { categoryRepository } from "@/models/Category";

const repository = categoryRepository();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const detailCategory = await repository.findById(id);
      if (detailCategory) {
        return NextResponse.json({
          status: 200,
          message: "Success",
          data: detailCategory,
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
      message: "Failed to retrieve data, " + error,
    });
  }
}
