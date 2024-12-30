import { User, userRepository } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { instanceToPlain } from "class-transformer";
import * as Yup from "yup";

const validateCreate = Yup.object({
  name: Yup.string().required("name is required"),
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().required("Password is required"),
}).noUnknown(true);

const validateUpdate = Yup.object({
  id: Yup.string().required("ID is required"),
  name: Yup.string().required("name is required"),
  email: Yup.string().email().required("Email is required"),
}).noUnknown(true);

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();

    await validateCreate.validate(req, { abortEarly: false });

    const repository = userRepository();

    const existingUser = await repository
      .whereEqualTo("email", req.email)
      .findOne();

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    const newUser = new User();
    newUser.name = req.name;
    newUser.email = req.email;
    newUser.password = await bcrypt.hash(req.password, 10);
    newUser.createdAt = new Date();

    const createdUser = instanceToPlain(await repository.create(newUser));

    if (createdUser) {
      return NextResponse.json(
        { message: "Data successfully added", data: createdUser },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "failed" }, { status: 400 });
    }
  } catch (error: unknown) {
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

    await validateUpdate.validate(req, { abortEarly: false });

    const repository = userRepository();

    const data = await repository.findById(req.id);

    if (data) {
      data.name = req.name;
      data.email = req.email;
      data.updatedAt = new Date();

      const updatedData = instanceToPlain(await repository.update(data));

      if (updatedData) {
        return NextResponse.json(
          { message: "Data successfully updated", data: updatedData },
          { status: 200 }
        );
      } else {
        return NextResponse.json({ message: "failed" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
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
