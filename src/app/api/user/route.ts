import { signUp } from "@/lib/firebase/service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const status = await signUp(data);
    if (status) {
      return NextResponse.json({ message: "success" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "failed" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ message: "error: " + error }, { status: 500 });
  }
}
