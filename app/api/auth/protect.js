import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function protectApi(allowedRoles = []) {
  const session = await getServerSession(authOptions);
  console.log("Session in protectApi:", session);

  // لو مفيش session أو user → Unauthorized
  if (!session?.user) {
    return { ok: false, status: 401, message: "غير مصرح: يجب تسجيل الدخول" };
  }

  const userRole = session.user.role;

  // تحقق من الأدوار
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return { ok: false, status: 403, message: "ممنوع: ليس لديك صلاحية" };
  }

  // ✅ مستخدم مسجّل + له صلاحية
  return { ok: true, user: session.user };
}
