import User from "@/models/User"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    console.log(req.body);

    const hashedPassword = await bcrypt.hash(password, 12);
    await connectMongoDB();
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.log(error ,"in register route");
    return NextResponse.json({ message: error.message || 'Something went wrong!' }, { status: 500 });
  }
}