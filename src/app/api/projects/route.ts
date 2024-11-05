// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { retrieveData, retrieveDataById } from "@/lib/firebase/service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const detailProject = await retrieveDataById("projdects", id);
      if (detailProject) {
        return NextResponse.json({
          status: 200,
          message: "Success",
          data: detailProject,
        });
      }
    }

    const data = await retrieveData("projects");
    return NextResponse.json({ status: 200, message: "Success", data });
  } catch (error) {
    console.error("Error retrieving projects:", error);
    return NextResponse.json({
      status: 500,
      message: "Failed to retrieve data",
    });
  }
}
