import { User, userRepository } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { instanceToPlain } from "class-transformer";
// export async function POST(req: NextRequest) {
//   try {
//     const data = await req.json();

//     const status = await signUp(data);

//     if (status) {
//       return NextResponse.json({ message: "success" }, { status: 200 });
//     } else {
//       return NextResponse.json({ message: "failed" }, { status: 400 });
//     }
//   } catch (error) {
//     return NextResponse.json({ message: "error: " + error }, { status: 500 });
//   }
// }

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const repository = userRepository();
    const cekEmail = await repository
      .whereEqualTo("email", data.email)
      .findOne();
    if (cekEmail) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    const newUser = new User();
    newUser.name = data.name;
    newUser.email = data.email;
    newUser.password = await bcrypt.hash(data.password, 10);
    newUser.createdAt = new Date();

    const user = instanceToPlain(await repository.create(newUser));
    if (user) {
      return NextResponse.json(
        { message: "success", data: user },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "failed" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ message: "error: " + error }, { status: 500 });
  }
}
