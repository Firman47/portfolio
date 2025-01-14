import { NextRequest, NextResponse } from "next/server";
import * as Yup from "yup";
import { Blog, blogRepository } from "@/models/Blog";
import { categoryRepository } from "@/models/Category";

type statusBlog = "draft" | "published" | "deleted";

const validate = Yup.object({
  title: Yup.string().required("title is required"),
  content: Yup.string().required("content  is required"),
  status: Yup.string()
    .oneOf(["draft", "published", "deleted"], "Invalid status")
    .required("status is required"),
  description: Yup.string().required("description  is required"),
  category_id: Yup.array().required("category_id is required"),
  created_at: Yup.date().optional(),
  updated_at: Yup.date().optional(),
}).noUnknown(true);

const repository = blogRepository();

function generateSlug(title: string, count: number = 0): string {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
  return count > 0 ? `${baseSlug}-${count}` : baseSlug;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const detailBlog = await repository.findById(id);
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

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    await validate.validate(req, { abortEarly: false });

    const notFoundCategory: string[] = [];
    await Promise.all(
      req.category_id.map(async (id: string) => {
        const category = await categoryRepository().findById(id); // Menunggu hasil findById
        if (!category) {
          notFoundCategory.push(id);
        }
      })
    );
    if (notFoundCategory.length > 0) {
      return NextResponse.json({
        status: 404,
        message: `Some category IDs not found: ${notFoundCategory.join(", ")}`,
      });
    }

    // Cek slug agar unik
    let slug = generateSlug(req.title);
    let attempt = 0;
    while ((await repository.whereEqualTo("slug", slug).find()).length > 0) {
      attempt++;
      slug = generateSlug(req.title, attempt);
    }

    const newBlog = new Blog();
    newBlog.title = req.title as string;
    newBlog.slug = slug;
    newBlog.content = req.content as string;
    newBlog.description = req.description as string;
    newBlog.status = req.status as statusBlog;
    newBlog.category_id = req.category_id as string[];
    newBlog.created_at = new Date();

    const createdData = await repository.create(newBlog);

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
    const req = await request.json();
    await validate.validate(req, { abortEarly: false });
    const data = await repository.findById(req.id as string);

    // Memeriksa dan menghasilkan slug yang unik
    let slug = generateSlug(req.title);
    let attempt = 0;
    const originalSlug = data.slug; // Menyimpan slug asli untuk perbandingan
    while (
      (await repository.whereEqualTo("slug", slug).find()).length > 0 &&
      slug !== originalSlug
    ) {
      attempt++;
      slug = generateSlug(req.title, attempt);
    }

    if (data) {
      data.title = req.title as string;
      data.slug = slug;
      data.content = req.content as string;
      data.description = req.description as string;
      data.status = req.status as statusBlog;
      data.category_id = req.category_id as string[];
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
