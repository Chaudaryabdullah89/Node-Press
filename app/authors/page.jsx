"use client";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { MOCK_POSTS } from "../data";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  // Extract unique authors from MOCK_POSTS

  const [authors, setauthors] = useState();
  const [loading, setLoading] = useState(true);
  const getauthor = async function () {
    try {
      setLoading(true);
      const req = await fetch("/api/user/author/getauthors");
      const res = await req.json();
      if (req.ok) {
        setauthors(res.authors);
      } else {
        toast.error("Error while Getting Authors");
      }
    } catch (error) {
      toast.error("Error while Getting Authors");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getauthor();
  }, []);
  if (loading && !authors) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }
  return (
    <>
      <section className="relative border-b my-5 border-slate-100 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_50%,rgba(139,92,246,0.06),transparent_50%),radial-gradient(circle_at_90%_50%,rgba(244,63,94,0.06),transparent_50%)]" />
        <div className="relative flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16 gap-8">
          <div className="">
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-red-500 mb-3">
              The Collective
            </p>
            <h1 className="text-4xl md:text-6xl font-black font-heading leading-tight mb-4">
              Our <span className=" ">Authors</span>
            </h1>
            <p className="text-slate-500 max-w-lg leading-relaxed text-sm md:text-base">
              Meet the thinkers, writers, and creators who bring their unique
              perspectives to NodePress every week.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:min-w-[400px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input
                type="text"
                placeholder="Search authors by name or specialty..."
                className="w-full bg-white border border-slate-200 rounded-full py-4 pl-12 pr-6 text-sm font-medium outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {authors?.map((author) => (
            <Link
              key={author.username}
              href={`/authors/${author.user?.username}`}
              className="group flex flex-col items-center text-center p-8 rounded-[32px] border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-black/5 transition-all duration-500"
            >
              <div className="relative w-32 h-32 mb-8">
                <div className="absolute inset-0 bg-zinc-100 rounded-full scale-110 group-hover:scale-125 transition-transform duration-500" />
                <Image
                  src={author.user?.avatar}
                  alt={author.user?.name}
                  fill
                  className="rounded-full object-cover relative z-10 grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <h4 className="font-heading font-black text-2xl uppercase tracking-tight mb-2">
                {author.name}
              </h4>
              <p className="text-xs text-zinc-400 font-bold uppercase tracking-[0.2em] mb-6">
                Featured Contributor
              </p>
              <span className="text-[10px] font-black uppercase tracking-widest text-black border-b-2 border-black pb-1 group-hover:text-red-500 group-hover:border-red-500 transition-all">
                View Profile
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default Page;
