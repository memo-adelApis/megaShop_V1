"use server";

import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

/**
 * إرسال كود تحقق إلى البريد
 */
export async function forgetPassword(email) {
  try {
    await connectMongoDB();
    const user = await User.findOne({ email });
    if (!user) throw new Error("لا يوجد مستخدم بهذا البريد الإلكتروني");

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    user.lastCode = code;
    user.updatedAt = new Date();
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "رمز إعادة تعيين كلمة المرور",
      html: `<p>رمز التحقق الخاص بك هو:</p><h2>${code}</h2>`,
    });

    return { success: true, message: "تم إرسال رمز التحقق إلى بريدك الإلكتروني" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * التحقق من الكود
 */
export async function verifyCode(email, code) {
  try {
    await connectMongoDB();
    const user = await User.findOne({ email });
    if (!user) throw new Error("لا يوجد مستخدم بهذا البريد الإلكتروني");

    if (user.lastCode !== code) throw new Error("رمز التحقق غير صحيح");

    const diff = (Date.now() - new Date(user.updatedAt).getTime()) / 1000 / 60;
    if (diff > 10) throw new Error("انتهت صلاحية رمز التحقق");

    return { success: true, message: "رمز صحيح" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/**
 * إعادة تعيين كلمة المرور
 */
export async function resetPassword(email, code, newPassword) {
  try {
    const verified = await verifyCode(email, code);
    if (!verified.success) return verified;

    await connectMongoDB();
    const user = await User.findOne({ email });
    if (!user) throw new Error("لا يوجد مستخدم بهذا البريد الإلكتروني");

    user.password = await bcrypt.hash(newPassword, 10);
    user.lastCode = null;
    await user.save();

    return { success: true, message: "تم تغيير كلمة المرور بنجاح" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
