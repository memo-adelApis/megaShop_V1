// import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";

// export default withAuth(
//   function middleware(req) {
//     const token = req.nextauth.token;

//     // 🔒 لو مفيش token → رجّع المستخدم للـ login
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }

//     // 🛡️ لو المستخدم مسجل دخول وحاول الوصول إلى /login أو /register → رجّعه للصفحة الرئيسية
//     if (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register") {
//       return NextResponse.redirect(new URL("/", req.url)); // أو "/dashboard" إذا كانت صفحة لوحة التحكم
//     }

//     // 🛡️ لو دخل على /ui/admin → لازم role = admin
//     if (req.nextUrl.pathname.startsWith("/ui/admin")) {
//       if (token.role !== "admin") {
//         return new NextResponse(
//           JSON.stringify({ error: "Forbidden: Admins only" }),
//           { status: 403, headers: { "Content-Type": "application/json" } }
//         );
//       }
//     }

//     return NextResponse.next();
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token, // يتحقق من وجود session
//     },
//   }
// );

// // 🎯 تحديد المسارات اللي يطبق عليها الـ middleware
// export const config = {
//   matcher: [
//     "/ui/:path*",      // يحمي كل صفحات الواجهة
//     "/ui/admin/:path*", // يحمي صفحات الأدمن
//     "/login",          // يحمي صفحة تسجيل الدخول
//     "/register",       // يحمي صفحة التسجيل
//   ],
// };