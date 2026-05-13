"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
const SignupPage = () => {
  const [name, setName] = useState("");
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  const router = useRouter();

  // signup handler function for signup

  const handlesignup = async () => {
    setloading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
        }),
      });
      const user = await res.json();
      console.log(user, " user");
      if (!res.ok) {
        toast.error("error while signup ");

        setloading(false);
        return;
      } else {
        toast.success("Signup Sucessfully");
        setloading(false);
        const signin = await signIn("credentials", {
          email: email,
          password: password,
          redirect: false,
        });
        if (signin.error) {
          toast("error while sigin redirecting you too manual sigin");
          setloading(false);
          router.push("/login?autosigin=fail&redirectedfrom=signup");
        } else {
          setloading(false);
          router.push("/?signup=sucess?login=true");
        }
      }
    } catch (error) {
      toast.error("something went wrong ");
      setloading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col mb-8">
            <span className="text-2xl font-blasck uppercase tracking-tight leading-none">
              Node<span className="text-zinc-400">Press</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-bold mt-1">
              Journal
            </span>
          </Link>
          <h1 className="text-3xl font-heading font-black tracking-tighter uppercase mb-2">
            Join the Collective
          </h1>
          <p className="text-slate-500 text-sm">
            Create your account to start sharing your stories.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-slate-100 p-8 rounded-[40px] shadow-2xl shadow-black/5">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                <input
                  onChange={(e) => setName(e.target.value)}
                  name="name"
                  type="text"
                  placeholder="Julian Voss"
                  className="w-full bg-zinc-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:border-black focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 size-4 opacity-50" />
                <input
                  onChange={(e) => setusername(e.target.value)}
                  name="username"
                  type="text"
                  placeholder="julian_voss"
                  className="w-full bg-zinc-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:border-black focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                <input
                  onChange={(e) => setemail(e.target.value)}
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-zinc-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:border-black focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
                <input
                  onChange={(e) => setpassword(e.target.value)}
                  type="password"
                  placeholder="Create a strong password"
                  className="w-full bg-zinc-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:border-black focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              onClick={handlesignup}
              className="w-full bg-black text-white font-black uppercase tracking-[0.2em] py-4 rounded-2xl hover:bg-zinc-800 transition-all active:scale-[0.98] text-xs flex items-center justify-center gap-2"
            >
              <UserPlus size={14} />
              {loading ? "Creating your Account" : " Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative px-4 bg-white text-[10px] font-black uppercase tracking-widest text-slate-400">
              Or sign up with
            </span>
          </div>

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-100 rounded-2xl hover:bg-zinc-50 transition-all active:scale-[0.95]">
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
              <span className="text-[10px] font-black uppercase tracking-widest">
                Google
              </span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-100 rounded-2xl hover:bg-zinc-50 transition-all active:scale-[0.95]">
              <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-widest">
                Github
              </span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <p className="mt-8 text-center text-slate-500 text-xs font-medium">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-black font-black uppercase tracking-widest hover:text-red-500 transition-colors ml-1"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
