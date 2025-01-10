import { userRepository } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({
        status: false,
        message: "Email harus diisi",
      });
    }
    const user = await userRepository().whereEqualTo("email", email).findOne();

    if (!user) {
      return NextResponse.json({
        status: false,
        message: "Email tidak ditemukan",
      });
    }

    if (user.verificationStatus === "verified") {
      return NextResponse.json({
        status: false,
        message: "Akun sudah terverifikasi",
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
      { email: email },
      process.env.NEXT_PUBLIC_JWT_SECRET as string,
      { expiresIn: "5m" }
    );

    const verificationUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/verification?email=${email}&code=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Hello ✔", // Subject line
      text: `Click here to verify your email`, // plain text body
      html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      status: true,
      message: "Kode verifikasi telah dikirim ulang ke email Anda.",
    });
  } catch (error) {
    return NextResponse.json({
      status: false,
      message: "Terjadi kesalahan.",
      error: error,
    });
  }
}
