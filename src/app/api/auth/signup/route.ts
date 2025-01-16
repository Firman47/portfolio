import { User, userRepository } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { instanceToPlain } from "class-transformer";
import * as Yup from "yup";
import nodemailer from "nodemailer";
import jwt, { JwtPayload } from "jsonwebtoken";

const validateCreate = Yup.object({
  username: Yup.string().required("name is required"),
  full_name: Yup.string().required("full_name is required"),
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().required("Password is required"),
}).noUnknown(true);

const repository = userRepository();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.redirect("/auth/signin");
  }

  const data = await repository.whereEqualTo("email", email).findOne();
  if (data) {
    delete data.verificationCode;

    return NextResponse.json(
      {
        status: true,
        message: "Success",
        data: data,
      },
      { status: 200 }
    );
  } else {
    return NextResponse.json(
      {
        status: false,
        message: "Data not found",
      },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    await validateCreate.validate(req, { abortEarly: false });

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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationToken = jwt.sign(
      { email: req.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "5m" }
    );

    const verificationUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/verification?email=${req.email}&code=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.email,
      subject: "Hello ✔", // Subject line
      text: `Click here to verify your email`, // plain text body
      html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
    };

    await transporter.sendMail(mailOptions);

    const newUser = new User();
    newUser.role = "user";
    newUser.email = req.email;
    newUser.username = req.username;
    newUser.password = await bcrypt.hash(req.password, 10);
    newUser.full_name = req.full_name;
    newUser.created_at = new Date();
    newUser.verificationStatus = "unverified";

    const createdUser = instanceToPlain(await repository.create(newUser));
    // Simpan token dalam cookie
    const authToken = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
        username: createdUser.username,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" } // Token berlaku selama 7 hari
    );

    const response = NextResponse.json({
      status: true,
      message: "Data successfully added",
      data: createdUser,
    });

    response.cookies.set("auth_token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Akan aktif hanya di production
      maxAge: 60 * 60 * 24 * 7, // Cookie berlaku selama 7 hari
      path: "/",
    });

    return response;
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
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const code = searchParams.get("code");

    if (!email || !code) {
      return NextResponse.json({
        status: false,
        message: "Email or code parameter missing",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(
        code as string,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
    } catch (error) {
      return NextResponse.json({
        status: false,
        message: "Invalid or expired token" + error,
      });
    }

    // Verifikasi apakah email pada token sesuai dengan query parameter
    if (decoded.email !== email) {
      return NextResponse.json({
        status: false,
        message: "Token does not match the provided email",
      });
    }

    const data = await repository.whereEqualTo("email", email).findOne();
    if (data) {
      data.verificationStatus = "verified";

      const updated = await repository.update(data);

      if (updated) {
        return NextResponse.json({
          status: true,
          message: "Data successfully updated",
          data: updated,
        });
      } else {
        return NextResponse.json({
          status: false,
          message: "Failed to update data",
        });
      }
    } else {
      return NextResponse.json({
        status: false,
        message: "Data not found",
      });
    }
  } catch (err) {
    return NextResponse.json(
      {
        status: false,
        message: "error : " + err,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({
        status: false,
        message: "Email or code parameter missing",
      });
    }

    const data = await repository.whereEqualTo("email", email).findOne();

    if (data) {
      await repository.delete(data.id);

      return NextResponse.json({
        status: true,
        message: "Data successfully deleted",
      });
    } else {
      return NextResponse.json({
        status: false,
        message: "Data not found",
      });
    }
  } catch (err) {
    return NextResponse.json(
      {
        status: false,
        message: "error : " + err,
      },
      { status: 500 }
    );
  }
}
