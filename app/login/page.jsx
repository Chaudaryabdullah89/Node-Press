"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      toast.error("Failed to sign in with Google");
      setGoogleLoading(false);
    }
  };

  const handlelogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (res?.error) {
      toast.error(res.error);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col mb-8">
            <span className="text-2xl font-black uppercase tracking-tight leading-none">
              Node<span className="text-zinc-400">Press</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold mt-1">
              Journal
            </span>
          </Link>
          <h1 className="text-3xl font-heading font-black tracking-tighter uppercase mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-sm">
            Enter your credentials to access your account.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-slate-100 p-8 rounded-[40px] shadow-2xl shadow-black/5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input
                type="email"
                onChange={(e) => setemail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-zinc-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:border-black focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Password
              </label>
              <Link
                href={`forgetpassword?email=${email}`}
                className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input
                onChange={(e) => setpassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full bg-zinc-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:border-black focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            onClick={handlelogin}
            disabled={loading}
            className="w-full bg-black my-5 text-white font-black uppercase tracking-[0.2em] py-4 rounded-2xl hover:bg-zinc-800 transition-all active:scale-[0.98] text-xs flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative px-4 bg-white text-[10px] font-black uppercase tracking-widest text-slate-400">
              Or continue with
            </span>
          </div>

          {/* Social Auth */}
          <div className="grid grid-cols-1 gap-4">
            <button
              disabled={googleLoading}
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-3 py-4 border border-slate-100 rounded-2xl hover:bg-zinc-50 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {googleLoading ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="size-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span className="text-[10px] font-black uppercase tracking-widest">
                {googleLoading ? "Connecting..." : "Sign in with Google"}
              </span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="mt-8 text-center text-slate-500 text-xs font-medium">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-black font-black uppercase tracking-widest hover:text-red-500 transition-colors ml-1"
          >
            Join the collectives
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
