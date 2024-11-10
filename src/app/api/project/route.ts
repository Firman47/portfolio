// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  createData,
  deleteData,
  retrieveData,
  retrieveDataById,
  updateData,
} from "@/lib/firebase/service";

import * as Yup from "yup";
const projectSchema = Yup.object({
  name: Yup.string().required("Project name is required"),
  description: Yup.string().required("Description is required"),
  // image_url: Yup.string()
  //   .url("Invalid image URL")
  //   .required("Image URL is required"),
  // tech_stack: Yup.object()
  //   .test(
  //     "is-valid-tech-stack",
  //     "Tech stack must be a valid object with keys as technology names and array of versions",
  //     (value) => {
  //       // Custom validation for tech_stack
  //       if (typeof value !== "object" || Array.isArray(value)) return false;
  //       return Object.values(value).every(
  //         (techVersions) =>
  //           Array.isArray(techVersions) &&
  //           techVersions.every((version) => typeof version === "string")
  //       );
  //     }
  //   )
  //   .required("Tech stack is required"),
  // project_url: Yup.string().url("Invalid URL").optional(),
  // repository_url: Yup.string().url("Invalid URL").optional(),
  // created_at: Yup.date().required("Creation date is required"),
  // updated_at: Yup.date().required("Update date is required"),
});

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
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    await projectSchema.validate(data, { abortEarly: false });
    const createdData = await createData("projects", data);

    return NextResponse.json({
      status: 201,
      message: "Data created",
      data: createdData,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Error creating data",
      error,
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...data } = await req.json();
    const updatedData = await updateData("projects", id, data);

    return NextResponse.json({
      status: 200,
      message: "Data updated",
      data: updatedData,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Error updating data",
      error,
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (id) {
      const data = await deleteData("projects", id);

      if (data) {
        return NextResponse.json({
          status: 200,
          message: `id ${id} berhasil di hapus`,
        });
      }
    } else {
      return NextResponse.json({
        status: 500,
        message: `id ${id} tidak ditemukan`,
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Error delete data",
      error,
    });
  }
}
