"use client";
import React, { useEffect, useState } from "react";
import PostCard from "../components/Postcard";
import { Search } from "lucide-react";
import toast from "react-hot-toast";

const Page = () => {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchquery, setserchquery] = useState("");
  const [sortBy, setSortBy] = useState("Latest");

  const getallpost = async function (sortType = "Latest") {
    try {
      setLoading(true);
      const req = await fetch(`/api/post/getallposts?sort=${sortType}`);
      const res = await req.json();
      if (req.ok) {
        setPosts(res.posts || []);
      } else {
        toast.error("Error while Fetching Post");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Error while Fetching Post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getallpost(sortBy);
  }, [sortBy]);

  const filterpostbasedonsearch = (posts || []).filter((post) => {
    const normalizedSearch = searchquery.toLowerCase().trim();
    if (!normalizedSearch) return true;

    return (
      post.title?.toLowerCase().includes(normalizedSearch) ||
      post.content?.toLowerCase().includes(normalizedSearch) ||
      post.slug?.toLowerCase().includes(normalizedSearch)
    );
  });

  if (loading && !posts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="">
        <section className="relative border-b my-5 border-slate-100 bg-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_50%,rgba(139,92,246,0.06),transparent_50%),radial-gradient(circle_at_90%_50%,rgba(244,63,94,0.06),transparent_50%)]" />
          <div className="relative flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 md:px-12 py-16 gap-8">
            <div className="">
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3">
                Discover
              </p>
              <h1 className="text-6xl font-black font-heading leading-none mb-4">
                All Stories
              </h1>
              <p className="text-slate-500 max-w-lg leading-relaxed">
                Every article, essay, and guide published on Code Ink —
                searchable, filterable, and always worth your time.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <div className="relative group">
                <select
                  name="filter"
                  id="filter"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 rounded-full py-3 px-6 pr-12 text-xs font-black uppercase tracking-widest cursor-pointer outline-none focus:border-black transition-all hover:bg-slate-50 w-full"
                >
                  <option value="Latest">Latest Stories</option>
                  <option value="Trending">Trending Now</option>
                  <option value="Oldest">Oldest First</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-black transition-colors">
                  <svg
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="relative flex-1 sm:min-w-[320px]">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 size-4 group-focus-within:text-black transition-colors" />
                <input
                  onChange={(e) => setserchquery(e.target.value)}
                  type="text"
                  value={searchquery}
                  placeholder="Search stories..."
                  className="w-full bg-white border border-slate-200 rounded-full py-3 pl-12 pr-6 text-sm font-medium outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 py-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <div className="w-6 h-6 border-2 border-slate-200 border-t-black rounded-full animate-spin" />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Updating results...
              </p>
            </div>
          ) : filterpostbasedonsearch.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterpostbasedonsearch.map((item, idx) => (
                <PostCard key={item.id || idx} post={item} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-medium">
                No matches found for "{searchquery}"
              </p>
            </div>
          )}
        </div>

        <section className="my-32 max-w-7xl mx-auto bg-zinc-50 border border-zinc-100 rounded-[40px] p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden relative mx-6">
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-50/50 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-zinc-100 rounded-full blur-3xl -ml-32 -mb-32" />
        </section>
      </div>
    </>
  );
};

export default Page;
