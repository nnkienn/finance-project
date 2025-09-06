"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [socialLoading, setSocialLoading] = useState<"google" | "facebook" | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password });
    router.push("/homepage");
  };

  const handleGoogle = () => {
    setSocialLoading("google");
    console.log("Redirect to Google OAuth...");
    setTimeout(() => {
      router.push("/homepage?social=1");
    }, 1000);
  };

  return (
    <div
      className="flex min-h-screen w-screen items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "url('https://ps-web-assets.s3.us-west-1.amazonaws.com/images/login/bg.jpg?v1-71ef4d00bba4f833b5b7818d3cea52d1')",
      }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-2xl overflow-hidden">
        {/* LEFT - Slogan */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-10">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg leading-snug">
            Be productive with <br /> your money, your way.
          </h2>
        </div>

        {/* RIGHT - Form */}
        <div className="md:w-1/2 w-full p-8 md:p-10 flex flex-col justify-center 
                        bg-white/80 backdrop-blur-md rounded-2xl shadow-lg">
          <h1 className="md:text-3xl text-gray-800 font-bold mb-4 text-center">
            Sign up to Kinance
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">

               <div>
              <span className="block px-2 text-gray-500 text-sm">Name</span>
              <input
                type="name"
                value={name}
                onChange={(e) => setPassword(e.target.value)}
                className="border w-full border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <span className="block px-2 text-gray-500 text-sm">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border w-full border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div>
              <span className="block px-2 text-gray-500 text-sm">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border w-full border-gray-300 rounded-xl px-4 py-2 text-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>



            <button
              type="submit"
              className="w-full rounded-full px-4 py-2 text-white font-bold bg-purple-700 hover:bg-purple-800 transition"
            >
              Sign In
            </button>
          </form>

          {/* Register link */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              If you have an account?{" "}
            </span>
            <Link
              href="/signin"
              className="text-sm text-green-600 font-semibold underline"
            >
              Please login here
            </Link>
          </div>

          {/* Divider */}
          <div className="mt-6 flex items-center">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="px-4 text-sm text-gray-500">Or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Social Login */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={!!socialLoading}
              className="w-full flex items-center justify-center gap-2 text-gray-700 font-medium border rounded-full px-4 py-2 hover:bg-gray-50"
            >
              <img src="/images/google.png" alt="google" className="h-5 w-5" />
              <span>
                {socialLoading === "google"
                  ? "Redirecting..."
                  : "Login with Google"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
