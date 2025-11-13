"use client";
import { FaEye, FaEyeSlash, FaGoogle, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BarLoader } from "react-spinners";



export default function LoginFormtest() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

    
  const handleSubmit = async (e) => {
    e.preventDefault();
     try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (res.error) {
        console.log(res.error)
        setError("Try Agian");
        return;
      }
       const form = e.target;
       form.reset();
      router.replace("/dashboard");

    } catch (error) {
      console.log(error)
    }
  };
   

  return (
    <div className="grid place-items-center h-screen  ">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400  ">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-3 mt-3">
          <div>
            <label htmlFor="email" className="block">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              id="email"
              className="w-full border-2 border-gray-300 p-2 rounded-lg"
            />
          </div>
          <div>
            <label htmlFor="password" className="block">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              id="password"
              className="w-full border-2 border-gray-300 p-2 rounded-lg"
            />
          </div>

          <div className="text"></div>
          <button
            type="supmit"
            className="w-full bg-green-500 text-white p-2 rounded-lg"
          >
            Login
          </button>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2 ">
              {error}
            </div>
          )}
          <Link className="text-sm mt-3 text-right" href={"/register"}>
            Don't Have an account? <span className="underline"> Register</span>
          </Link>
        </form>
        <BarLoader />
      </div>
    </div>

    
  );
}
