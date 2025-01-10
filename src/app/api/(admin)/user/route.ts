import { User, userRepository } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { instanceToPlain } from "class-transformer";
import * as Yup from "yup";

const validateCreate = Yup.object({
  username: Yup.string().required("name is required"),
  full_name: Yup.string().required("full_name is required"),
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().required("Password is required"),
}).noUnknown(true);

const validateUpdate = Yup.object({
  id: Yup.string().required("ID is required"),
  username: Yup.string().required("name is required"),
  full_name: Yup.string().required("full_name is required"),
  email: Yup.string().email().required("Email is required"),
}).noUnknown(true);

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();

    await validateCreate.validate(req, { abortEarly: false });

    const repository = userRepository();

    const existingUserName = await repository
      .whereEqualTo("username", req.username)
      .findOne();

    if (existingUserName) {
      return NextResponse.json({
        status: false,
        message: "Username already exists",
      });
    }

    const existingUserEmail = await repository
      .whereEqualTo("email", req.email)
      .findOne();

    if (existingUserEmail) {
      return NextResponse.json({
        status: false,
        message: "Email already exists",
      });
    }

    const newUser = new User();
    newUser.role = "user";
    newUser.email = req.email;
    newUser.username = req.username;
    newUser.password = await bcrypt.hash(req.password, 10);
    newUser.full_name = req.full_name;
    newUser.created_at = new Date();

    const createdUser = instanceToPlain(await repository.create(newUser));

    if (createdUser) {
      return NextResponse.json(
        { status: true, message: "Data successfully added", data: createdUser },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { status: false, message: "failed" },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    if (error instanceof Yup.ValidationError) {
      return NextResponse.json(
        { status: false, message: "Validation error", errors: error.errors },
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
      data.username = req.name;
      data.email = req.email;
      data.updated_at = new Date();

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
