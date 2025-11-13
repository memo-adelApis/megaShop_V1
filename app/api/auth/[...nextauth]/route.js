import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectMongoDB } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Examble@email.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          await connectMongoDB();
          const user = await User.findOne({ email: credentials.email });
          console.log(user);
          if (!user) {
            return null;
          }
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) {
            return null;
          }
          return user;
        } catch (err) {
          console.log(err);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    //signOut: '/logout',
    //error: '/login'
  },
  callbacks: {
    // Modify the JWT to include user role
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user._id || user.id;
        token.email = user.email;
        token.role = user.role || "user"; // Assuming `role` field is in your User model
      }
      // إذا كان تسجيل الدخول عبر Google ولم يوجد role، أضف role افتراضي
      if (account?.provider === "google" && !token.role) {
        token.role = "user";
      }
      return token;
    },

    // Add the role to the session object
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role || "user"; // Always set a default role
      }
      return session;
    },
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
