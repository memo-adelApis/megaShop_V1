import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongoDB();
    const users = await User.find().select('');
    console.log(users)
      return NextResponse.json({ users });
   } catch (error) {
    console.error('Error:', error);
    //return NextResponse.json({ message: error.message || 'Something went wrong!' }, { status: 500 });
  }
}
