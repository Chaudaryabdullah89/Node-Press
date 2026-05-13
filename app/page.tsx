"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MOCK_POSTS } from "./data";
import PostCard from "./components/Postcard";
import { ArrowBigLeft, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
interface Post {
  id: string;
  title: string;
  slug: string;
  category?: { name: string };
  author?: {
    name?: string;
    user?: {
      name?: string;
      avatar?: string;
    };
    avatar?: string;
    avator?: string; // fallback for your older data
    username?: string;
  };
}
export default function Home() {
  const [data, setData] = useState({
    featured: [] as Post[],
    latest: [] as Post[],
    trending: [] as Post[],
    insights: [] as Post[],
  });
  const [authors, setauthors] = useState();
  const [loading, setLoading] = useState(true);

  const getdata = async function () {
    setLoading(true);
    try {
      const req = await fetch("/api/post/getposts");
      const res = await req.json();

      if (req.ok) {
        setData({
          featured: res.featuredPosts || [],
          latest: res.latestPosts || [],
          trending: res.trendingPosts || [],
          insights: res.insightPosts || [],
        });
      } else {
        toast.error("Error while fetching posts");
        // Fallback to mock data structure
      }
    } catch (error) {
      toast.error("Fetch error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const getauthor = async function () {
    try {
      const req = await fetch("/api/user/author/topauthors");
      const res = await req.json();
      if (req.ok) {
        setauthors(res.authors);
      } else {
        toast.error("Error while fetching featured authors");
      }
    } catch (error) {
      console.error("Error fetching authors:", error);
    }
  };

  useEffect(() => {
    getdata();
    getauthor();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-slate-300" />
      </div>
    );
  }

  return (
    <div className="max-w-[1300px] mx-auto px-6 py-12">
      <section className="grid grid-cols-3 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className=" flex justify-between  my-5  border-b-1  border-slate-300">
            <h2 className="text-3xl  font-heading font-black tracking-tighter mb-2  uppercase ">
              Featured Stories
            </h2>
            <h2 className="flex gap-2 mt-2 hover:text-red-500 transition-all duration-300">
              <Link
                href={"/stories?featuredstories=true"}
                className="items-center  font-bold "
              >
                Read More{" "}
              </Link>
              <span>
                <ArrowRight size={16} className="relative top-1" />
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.featured.map((item, idx) => (
              <PostCard key={item.id || idx} post={item} />
            ))}
          </div>
        </div>
        <div className="lg:col-span-1 space-y-8">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 pb-4">
            Latest Insights
          </h2>
          {data.insights.map((post) => (
            <div
              key={post.id}
              className="border-b border-slate-50 pb-6 last:border-0 group"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-2 block">
                {post.category?.name || "Topics"}
              </span>
              <Link
                href={`/stories/${post.slug}?id=${post.id}`}
                className="text-lg font-heading font-black leading-tight group-hover:text-zinc-500 transition-colors block mb-2"
              >
                {post.title}
              </Link>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                By {post.author?.user?.name || post.author?.name || "Anonymous"}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className=" my-20">
        <div className=" flex justify-between  my-5  border-b-1  border-slate-300">
          <h2 className="text-3xl  font-heading font-black tracking-tighter mb-2  uppercase ">
            Latest News
          </h2>
          <h2 className="flex gap-2 mt-2 hover:text-red-500 transition-all duration-300">
            <Link
              href={"/stories?Latestpost=true"}
              className="items-center  font-bold "
            >
              Read More{" "}
            </Link>
            <span>
              <ArrowRight size={16} className="relative top-1" />
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {data.latest.map((item, idx) => (
            <PostCard key={item.id || idx} post={item} />
          ))}
        </div>
      </section>

      {/* Trending Section */}
      <section className="my-32">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-red-500">
            Now Trending
          </h2>
          <div className="flex-1 h-[1px] bg-slate-200" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-16">
          {data.trending.map((post, idx) => (
            <div key={post.id} className="flex gap-6 group">
              <span className="text-5xl font-heading font-black text-slate-100 group-hover:text-red-500/10 transition-colors duration-500 leading-none">
                0{idx + 1}
              </span>
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                  {post.category?.name || "Journal"}
                </span>
                <Link
                  href={`/stories/${post.slug}?id=${post.id}`}
                  className="text-lg font-heading font-black leading-tight group-hover:text-zinc-500 transition-colors block"
                >
                  {post.title}
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 relative">
                    <Image
                      src={
                        post.author?.user?.avatar ||
                        post.author?.avatar ||
                        post.author?.avator ||
                        "https://i.pravatar.cc/150?u=anon"
                      }
                      alt="Author"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                    {post.author?.user?.name ||
                      post.author?.name ||
                      "Anonymous"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="my-32 bg-zinc-50 border border-zinc-100 rounded-[40px] p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative">
        <div className="max-w-xl relative z-10">
          <h2 className="text-sm font-black uppercase tracking-[0.4em] text-red-500 mb-6">
            Stay Informed
          </h2>
          <h3 className="text-4xl lg:text-5xl font-heading font-black tracking-tighter uppercase leading-[1.1] mb-6">
            The world's best stories,{" "}
            <span className=" text-zinc-400 text-3xl lg:text-4xl">
              delivered to your inbox.
            </span>
          </h3>
          <p className="text-slate-500 text-lg leading-relaxed">
            Join 50,000+ curious minds and get our weekly digest of the most
            thought-provoking articles.
          </p>
        </div>
        <div className="w-full lg:w-auto relative z-10">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="px-8 py-4 bg-white border border-slate-200 rounded-full outline-none focus:border-black transition-colors min-w-[300px] text-sm font-medium"
            />
            <button
              type="submit"
              className="px-10 py-4 bg-black text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-zinc-800 transition-all hover:shadow-lg active:scale-95"
            >
              Subscribe
            </button>
          </form>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4 text-center sm:text-left">
            No spam. Only inspiration.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50/50 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-zinc-100 rounded-full blur-3xl -ml-32 -mb-32" />
      </section>

      {/* Authors Spotlight */}
      <section className="my-32">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400 mb-4">
              The Minds Behind
            </h2>
            <h3 className="text-4xl font-heading font-black tracking-tighter uppercase leading-none">
              Featured <span className=" text-zinc-400">Authors</span>
            </h3>
          </div>
          <Link
            href="/authors"
            className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-red-500 hover:border-red-500 transition-all"
          >
            All Contributors
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(authors || []).slice(0, 4).map((author: any) => (
            <Link
              key={author.id}
              href={`/authors/${author.username}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 bg-zinc-100 rounded-full scale-110 group-hover:scale-125 transition-transform duration-500" />
                <Image
                  src={
                    author.user?.avatar || "https://i.pravatar.cc/150?u=anon"
                  }
                  alt={author.user?.name || "Author"}
                  fill
                  className="rounded-full object-cover relative z-10 grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <h4 className="font-heading font-black text-xl uppercase tracking-tight mb-1">
                {author.user?.name || "Anonymous"}
              </h4>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em]">
                Contributor
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
