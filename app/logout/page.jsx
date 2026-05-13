"use client";
import React, { useEffect } from "react";
import { signOut } from "next-auth/react";

const LogoutPage = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      signOut({ callbackUrl: "/" });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex ite items-center justify-center bg-zinc-50">
      <div className="text-center">
        <h1 className="text-2xl font-heading font-black uppercase tracking-tighter mb-4">
          Logging you out
        </h1>
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-500 text-sm">Please wait a moment...</p>
      </div>
    </div>
  );
};

export default LogoutPage;
