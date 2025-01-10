import { NextRequest, NextResponse } from "next/server";
import * as Yup from "yup";
import { Category, categoryRepository } from "@/models/Category";

const validate = Yup.object({
  name: Yup.string().required("name is required"),
}).noUnknown(true);

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

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    await validate.validate(req, { abortEarly: false });

    const newCategory = new Category();
    newCategory.name = req.name as string;
    newCategory.created_at = new Date();

    const createdData = await repository.create(newCategory);

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

    if (data) {
      data.name = req.name as string;
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
