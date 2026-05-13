"use client";
// import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LogOut, Pencil, Search, X } from "lucide-react";
import { useFormState } from "react-dom";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MOCK_POSTS } from "../data";
import Image from "next/image";
import toast from "react-hot-toast";
const Navbar = () => {
  // arrays and variables used

  const nav_link = ["home", "stories", "contact", "authors"];
  const autherwebappurl =
    process.env.NEXT_PUBLIC_AUTHOR_APP_URL || "http://localhost:3002";

  //   state hooks
  const [isauthor, setisauthor] = useState(false);
  const pathname = usePathname();
  const [search, setSearch] = useState(false);
  const [activenav, setactive] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allPosts, setAllPosts] = useState([]);

  //   session fetching

  const { data: session, status, update } = useSession();
  const isLogin = !!session;
  const searchParams = useSearchParams();

  // Fetch fresh role directly from DB (bypasses stale NextAuth JWT cache)
  const fetchFreshRole = async () => {
    try {
      const res = await fetch("/api/user/role");
      if (res.ok) {
        const data = await res.json();
        console.log("Navbar: Fresh DB role:", data.role);
        setisauthor(data.role === "AUTHOR");
      }
    } catch (e) {
      console.error("Navbar: Failed to fetch fresh role", e);
    }
  };

  useEffect(() => {
    console.log("Navbar: Current session role:", session?.user?.role);
    if (session?.user?.role === "AUTHOR") {
      setisauthor(true);
    } else if (session) {
      fetchFreshRole();
    }
  }, [session]);

  useEffect(() => {
    if (searchParams.get("refresh") === "true") {
      console.log(
        "Navbar: Refresh signal detected, fetching fresh role from DB...",
      );
      fetchFreshRole();
      update(); // Also update NextAuth session
      window.history.replaceState({}, "", pathname);
    }
  }, [searchParams, update, pathname]);

  // Fetch all posts for search indexing
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await fetch("/api/post/getallposts");
        const data = await res.json();
        if (res.ok) {
          setAllPosts(data.posts || []);
        }
      } catch (e) {
        console.error("Navbar: Failed to fetch posts for search", e);
      }
    };
    fetchAllPosts();
  }, []);

  const route = useRouter();

  //   search logic
  const handleSearch = () => {
    setSearch((prev) => !prev);
    if (search) setSearchTerm(""); // Clear search when closing
  };

  //   filter logic
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }
    const filtered = (allPosts.length > 0 ? allPosts : MOCK_POSTS)
      .filter(
        (post) =>
          post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .slice(0, 8);
    setSearchResults(filtered);
  }, [searchTerm]);

  //   logout handler
  const handlelogout = async () => {
    route.push(`/logout?token=${session.user.id}`);
  };

  //   scrool effect logic

  useEffect(() => {
    const handlescroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handlescroll);
    // window.addEventListener("sce")
    return () => window.removeEventListener("scroll", handlescroll);
  }, []);

  return (
    <div
      className={` top-0 sticky left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md fixed shadow-md border-b border-gray-200 py-1"
          : "bg-transparent border-transparent py-3"
      }`}
    >
      <div
        className={`max-w-[1300px]  mb-2  py-2 mt-2 mx-auto flex justify-between `}
      >
        <Link href={"/"} className="capitalize  uppercase   flex flex-col">
          <span className="text-md font-black -mb-2 font-extrabold capitalize uppercase">
            NodePress
          </span>
          <span className="text-sm">Journal</span>
        </Link>
        <div className=" flex items-center gap-4">
          {nav_link.map((link, idx) => {
            return (
              <Link
                key={idx}
                href={link == "home" ? "/" : link}
                className={`relative px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition-colors rounded-lg ${
                  activenav == link
                    ? "text-black bg-slate-100"
                    : "text-slate-500 hover:text-black hover:bg-slate-50"
                }`}
                onClick={() => setactive(link)}
              >
                {link}
              </Link>
            );
          })}
        </div>
        <div className="flex  items-center gap-3">
          <div className="flex gap-5">
            <div className="flex items-center gap-2 group relative">
              <div
                className={`flex items-center gap-2 transition-all duration-500 ease-out overflow-hidden ${
                  search
                    ? "w-64 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200"
                    : "w-0"
                }`}
              >
                <Search size={16} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search articles..."
                  autoFocus={search}
                  className="bg-transparent border-none outline-none text-[11px] font-bold text-slate-900 w-full placeholder:text-slate-400 placeholder:font-black placeholder:uppercase placeholder:tracking-widest"
                />
              </div>

              <button
                onClick={handleSearch}
                className="p-2 hover:bg-slate-100 rounded-full transition-all duration-300 group-hover:scale-110"
              >
                {search ? (
                  <X size={18} className="text-slate-500" />
                ) : (
                  <Search size={18} className="text-slate-500" />
                )}
              </button>

              {/* Search Results Popup */}
              {search && searchTerm && (
                <div className="absolute top-full right-0 mt-4 w-[400px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Search Results ({searchResults.length})
                    </p>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map((post) => (
                        <Link
                          key={post.id}
                          href={`/stories/${post.slug}`}
                          onClick={() => {
                            setSearch(false);
                            setSearchTerm("");
                          }}
                          className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors group/item"
                        >
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                              src={post.imageUrl}
                              alt={post.title}
                              fill
                              sizes="64px"
                              className="object-cover group-hover/item:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-widest text-red-600 mb-1">
                              {post.categories?.[0]?.category?.name}
                            </p>
                            <h4 className="text-sm font-black text-slate-900 leading-tight line-clamp-2">
                              {post.title}
                            </h4>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-10 text-center">
                        <Search
                          size={32}
                          className="mx-auto text-slate-200 mb-3"
                        />
                        <p className="text-xs font-bold text-slate-400">
                          No articles found for "{searchTerm}"
                        </p>
                      </div>
                    )}
                  </div>
                  {searchResults.length > 0 && (
                    <Link
                      href="/stories"
                      className="block p-4 text-center bg-slate-50 hover:bg-slate-100 transition-colors border-t border-slate-100"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        View All Stories →
                      </span>
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="border-r-1 pr-2 border-slate-300">
              {console.log("Navbar Session Check:", {
                email: session?.user?.email,
                tokenType: session?.user?.token?.includes(".")
                  ? "JWT"
                  : "OTHER",
                tokenLength: session?.user?.token?.length,
              })}
              {isLogin ? (
                <Link
                  href={
                    isauthor
                      ? `${autherwebappurl}/checkauthentication?redirectedfrom=node-press&loginstatus=${isLogin}&author=${isauthor}&name=${encodeURIComponent(session?.user?.name || session?.user?.username || "")}&email=${encodeURIComponent(session?.user?.email || "")}&token=${encodeURIComponent(session?.user?.token || "")}`
                      : `${autherwebappurl}/onboarding?redirectedfrom=node-press&token=${encodeURIComponent(session?.user?.token || "")}&loginstatus=${isLogin}&author=${isauthor}&name=${encodeURIComponent(session?.user?.name || session?.user?.username || "")}&email=${encodeURIComponent(session?.user?.email || "")}`
                  }
                >
                  <button className="px-4 bg-black py-1.5 cursor-pointer hover:-translate-y-1.5 hover:bg-gray-800 transition-all duration-300 text-sm font-bold text-white rounded-full">
                    {isauthor ? (
                      "Author Dashboard"
                    ) : (
                      <span className="flex gap-2 items-center">
                        <Pencil size={14} />
                        Become An Author
                      </span>
                    )}
                  </button>
                </Link>
              ) : (
                <Link href="/signup">
                  <button className="px-5 py-2 cursor-pointer  transition-all duration-300 text-xs font-black uppercase tracking-widest text-black rounded-xl flex gap-2.5 items-center cursor-pointer">
                    <Pencil size={14} />
                    <span>Write With Us</span>
                  </button>
                </Link>
              )}
            </div>
          </div>

          <div className=" ">
            <div className="flex items-center gap-5">
              {isLogin ? (
                <LogOut
                  onClick={handlelogout}
                  size={18}
                  className="cursor-pointer text-gray-500 hover:text-gray-900 hover:scale-110 transition-all duration-300"
                />
              ) : (
                <Link href={`/login?directedfrom=${pathname}`}>
                  <button className="font-bold text-sm cursor-pointer text-slate-500 ">
                    LOGIN
                  </button>
                </Link>
              )}
              {isLogin ? (
                <button className="group cursor-pointer relative h-8 w-8 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 text-white font-bold text-sm flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-110">
                  <Link
                    href={`/profile`}
                    className="relative group-hover:cursor-pointer z-10 uppercase"
                  >
                    {session?.user?.username?.substring(0, 1) ||
                      session?.user?.email?.substring(0, 1) ||
                      "U"}
                  </Link>
                </button>
              ) : (
                <Link href={`/signup?directedfrom=${pathname}`}>
                  <span className="px-8 inline-block bg-black py-1.5 cursor-pointer hover:-translate-y-1.5  hover:bg-gray-800 transition-all duration-300 text-sm font-bold text-white rounded-full">
                    JOIN
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
