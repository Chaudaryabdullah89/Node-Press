"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MOCK_POSTS } from "../../data";
import { MapPin, Calendar, BarChart2, FileText, Heart } from "lucide-react";
import toast from "react-hot-toast";

const AuthorProfilePage = () => {
  const { username } = useParams();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("articles");

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await fetch(
          `/api/user/author/getauthor?username=${username}`,
        );
        const data = await res.json();
        if (res.ok) {
          setAuthor(data.author);
          setPosts(data.author.posts || []);
        } else {
          console.error("Failed to fetch author:", data.message);
        }
      } catch (error) {
        console.error("Error fetching author:", error);
      }
    };

    if (username) {
      fetchAuthor();
    }
  }, [username]);

  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    { label: "Articles", value: posts.length, icon: FileText },
    {
      label: "Total Views",
      value: (author.totalViews || 0).toLocaleString(),
      icon: BarChart2,
    },
    {
      label: "Followers",
      value: (author.followerCount || 0).toLocaleString(),
      icon: Heart,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative h-52 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Author Info */}
      <div className="max-w-4xl mx-auto px-6">
        {/* Avatar — overlaps the hero */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between -mt-16 mb-6 gap-6 md:gap-0">
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden ring-4 ring-white shadow-xl flex-shrink-0">
            <Image
              src={
                author.avatar ||
                author.user?.avatar ||
                `https://i.pravatar.cc/150?u=${author.username}`
              }
              alt={author.user?.name || author.username}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 112px, 128px"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto justify-center md:justify-end">
            <Link
              href="/authors"
              className="flex-1 md:flex-none text-center px-5 py-2.5 border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors"
            >
              All Authors
            </Link>
            <button
              onClick={() => toast.success("Follow feature coming soon")}
              className="flex-1 md:flex-none px-5 py-2.5 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors"
            >
              Follow
            </button>
          </div>
        </div>

        {/* Name & Meta */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 mb-1">
            {author.user?.name || author.username}
          </h1>
          <p className="text-slate-400 text-sm font-bold mb-4">
            @{author.username}
          </p>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
            {author.bio || author.user?.bio || "No bio provided yet."}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <MapPin size={12} />
              New York, USA
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              Joined May 2024
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-100">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center gap-1"
            >
              <Icon size={16} className="text-slate-400 mb-1" />
              <span className="text-2xl font-black text-gray-900">{value}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Tab Bar */}
        <div className="flex gap-1 border-b border-slate-100 mb-10">
          {["articles"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all -mb-px ${
                activeTab === tab
                  ? "border-black text-black"
                  : "border-transparent text-slate-400 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Articles List */}
        <div className="space-y-0 mb-20">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <FileText size={40} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm font-bold">No articles published yet.</p>
            </div>
          ) : (
            posts.map((post, idx) => {
              const category = post.category?.name || "Uncategorized";
              return (
                <Link
                  key={post.id}
                  href={`/stories/${post.slug}`}
                  className="group flex flex-col md:flex-row gap-4 md:gap-6 items-start py-8 border-b border-slate-100 hover:bg-slate-50 -mx-4 md:-mx-6 px-4 md:px-6 transition-colors duration-200"
                >
                  {/* Index - Hidden on mobile */}
                  <span className="hidden md:flex text-slate-200 font-black text-4xl leading-none w-8 flex-shrink-0 mt-1 tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                  </span>

                  {/* Thumbnail - Top on mobile */}
                  <div className="relative w-full md:w-32 h-48 md:h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 128px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2 block">
                      {category} ·{" "}
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <h2 className="text-xl md:text-lg font-black text-gray-900 leading-snug mb-2 group-hover:text-red-600 transition-colors duration-200">
                      {post.title}
                    </h2>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>{post.viewCount?.toLocaleString()} views</span>
                      <span>5 min read</span>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthorProfilePage;
