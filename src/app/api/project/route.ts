import { NextRequest, NextResponse } from "next/server";
import * as Yup from "yup";
import { cookies } from "next/headers";
import { validateToken } from "@/lib/validateToken";
import { Project, projectRepository } from "@/models/Project";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";

const validate = Yup.object({
  name: Yup.string().required("Project name is required"),
  description: Yup.string().required("Description is required"),
  image: Yup.string().required("Image  is required"),
  tech_stack: Yup.string().required("Tech stack is required"),
  project_url: Yup.string().url("Invalid URL").optional(),
  repository_url: Yup.string().url("Invalid URL").optional(),
  created_at: Yup.date().optional(),
  updated_at: Yup.date().optional(),
}).noUnknown(true);

const repository = projectRepository();

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { status: 401, message: "User not authenticated" },
        { status: 401 }
      );
    } else {
      await validateToken(token);
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const detailProject = await repository.findById(id);
      if (detailProject) {
        return NextResponse.json({
          status: 200,
          message: "Success",
          data: detailProject,
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
    console.error("Error retrieving projects:", error);
    return NextResponse.json({
      status: 500,
      message: "Failed to retrieve data",
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { status: 401, message: "User not authenticated" },
        { status: 401 }
      );
    } else {
      await validateToken(token);
    }

    const req = await request.formData();

    const formDataToObject: Record<string, string | File> = {};
    req.forEach((value, key) => {
      formDataToObject[key] = value;
    });
    await validate.validate(formDataToObject, { abortEarly: false });

    const file = req.get("image") as File;
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + file.name.replaceAll(" ", "_");
    await writeFile(
      path.join(process.cwd(), "public/file/" + filename),
      buffer
    );

    const newProject = new Project();
    newProject.name = req.get("name") as string;
    newProject.description = req.get("description") as string;
    newProject.image = filename as string;
    newProject.tech_stack = JSON.parse(req.get("tech_stack") as string);
    newProject.project_url = req.get("project_url") as string;
    newProject.repository_url = req.get("repository_url") as string;
    newProject.created_at = new Date();

    const createdData = await repository.create(newProject);
    return NextResponse.json({
      status: 201,
      message: "Data successfully added",
      data: createdData,
    });
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

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { status: 401, message: "User not authenticated" },
        { status: 401 }
      );
    } else {
      await validateToken(token);
    }

    const req = await request.formData();

    const formDataToObject: Record<string, string | File> = {};
    req.forEach((value, key) => {
      formDataToObject[key] = value;
    });
    await validate.validate(formDataToObject, { abortEarly: false });

    const file = req.get("image") as File;
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + file.name.replaceAll(" ", "_");

    const oldImage = req.get("old_image") as string | undefined;
    if (oldImage) {
      const oldImagePath = path.join(process.cwd(), "public/file", oldImage);
      fs.exists(oldImagePath, (exists) => {
        if (exists) {
          fs.unlink(oldImagePath, (err) => {
            if (err) {
              console.error("Error deleting old file:", err);
            } else {
              console.log("Old file deleted successfully");
            }
          });
        }
      });
    } else {
      await writeFile(
        path.join(process.cwd(), "public/file", filename),
        buffer
      );
    }

    const data = await repository.findById(req.get("id") as string);
    if (data) {
      data.name = req.get("name") as string;
      data.description = req.get("description") as string;
      data.image = filename as string;
      data.tech_stack = JSON.parse(req.get("tech_stack") as string);
      data.project_url = req.get("project_url") as string;
      data.repository_url = req.get("repository_url") as string;
      data.updated_at = new Date();

      const updatedData = await repository.update(data);
      return NextResponse.json({
        status: 200,
        message: "Data successfully updated",
        data: updatedData,
      });
    } else {
      return NextResponse.json({
        status: 404,
        message: "Data not found",
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

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { status: 401, message: "User not authenticated" },
        { status: 401 }
      );
    } else {
      await validateToken(token);
    }

    const req = await request.json();

    if (!Array.isArray(req.id) || req.id.length === 0) {
      return NextResponse.json({
        status: 400,
        message: "No valid ID provided to delete",
      });
    }
    const notFoundIds: string[] = [];
    const deletePromises = req.id.map(async (id: string) => {
      const data = await repository.findById(id);
      if (data) {
        if (data.image) {
          const oldImagePath = path.join(
            process.cwd(),
            "public/file",
            data.image
          );
          try {
            await fs.promises.access(oldImagePath, fs.constants.F_OK);
            await fs.promises.unlink(oldImagePath);
          } catch (err) {
            console.error(`Error deleting file for ${id}:`, err);
          }
        }
        await repository.delete(id);
      } else {
        notFoundIds.push(id);
      }
    });

    await Promise.all(deletePromises);

    if (notFoundIds.length > 0) {
      return NextResponse.json({
        status: 404,
        message: `Some IDs not found: ${notFoundIds.join(", ")}`,
      });
    } else {
      return NextResponse.json({
        status: 200,
        message: "Data successfully deleted",
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Error delete data" + error,
    });
  }
}
