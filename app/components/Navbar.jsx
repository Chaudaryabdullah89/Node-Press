"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LogOut, Menu, Pencil, Search, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MOCK_POSTS } from "../data";
import Image from "next/image";

const Navbar = () => {
  const nav_link = ["home", "stories", "contact", "authors"];
  const autherwebappurl =
    process.env.NEXT_PUBLIC_AUTHOR_APP_URL || "http://localhost:3002";

  const [isauthor, setisauthor] = useState(false);
  const pathname = usePathname();
  const [search, setSearch] = useState(false);
  const [activenav, setactive] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: session, status, update } = useSession();
  const isLogin = !!session;
  const searchParams = useSearchParams();

  const fetchFreshRole = async () => {
    try {
      const res = await fetch("/api/user/role");
      if (res.ok) {
        const data = await res.json();
        setisauthor(data.role === "AUTHOR");
      }
    } catch (e) {
      console.error("Navbar: Failed to fetch fresh role", e);
    }
  };

  useEffect(() => {
    if (session?.user?.role === "AUTHOR") {
      setisauthor(true);
    } else if (session) {
      fetchFreshRole();
    }
  }, [session]);

  useEffect(() => {
    if (searchParams.get("refresh") === "true") {
      fetchFreshRole();
      update();
      window.history.replaceState({}, "", pathname);
    }
  }, [searchParams, update, pathname]);

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

  const handleSearch = () => {
    setSearch((prev) => !prev);
    if (search) setSearchTerm("");
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }
    const filtered = (allPosts.length > 0 ? allPosts : MOCK_POSTS)
      .filter(
        (post) =>
          post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 8);
    setSearchResults(filtered);
  }, [searchTerm]);

  const handlelogout = async () => {
    route.push(`/logout?token=${session.user.id}`);
  };

  useEffect(() => {
    const handlescroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handlescroll);
    return () => window.removeEventListener("scroll", handlescroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <div
        className={`top-0 sticky left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200 py-1"
            : "bg-white/70 backdrop-blur-sm border-b border-transparent py-2"
        }`}
      >
        <div className="max-w-[1300px] mx-auto px-4 md:px-6 flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none shrink-0">
            <span className="text-base font-black uppercase tracking-tight">
              Node<span className="text-zinc-400">Press</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 font-bold">
              Journal
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {nav_link.map((link, idx) => (
              <Link
                key={idx}
                href={link === "home" ? "/" : `/${link}`}
                className={`px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition-colors rounded-lg ${
                  activenav === link
                    ? "text-black bg-slate-100"
                    : "text-slate-500 hover:text-black hover:bg-slate-50"
                }`}
                onClick={() => setactive(link)}
              >
                {link}
              </Link>
            ))}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 group relative">
              <div
                className={`flex items-center gap-2 transition-all duration-500 ease-out overflow-hidden ${
                  search
                    ? "w-56 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200"
                    : "w-0"
                }`}
              >
                <Search size={14} className="text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search articles..."
                  autoFocus={search}
                  className="bg-transparent border-none outline-none text-[11px] font-bold text-slate-900 w-full placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={handleSearch}
                className="p-2 hover:bg-slate-100 rounded-full transition-all"
              >
                {search ? (
                  <X size={16} className="text-slate-500" />
                ) : (
                  <Search size={16} className="text-slate-500" />
                )}
              </button>

              {/* Search Results Popup */}
              {search && searchTerm && (
                <div className="absolute top-full right-0 mt-3 w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[60]">
                  <div className="p-3 border-b border-slate-50 bg-slate-50/50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Results ({searchResults.length})
                    </p>
                  </div>
                  <div className="max-h-[360px] overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map((post) => (
                        <Link
                          key={post.id}
                          href={`/stories/${post.slug}`}
                          onClick={() => { setSearch(false); setSearchTerm(""); }}
                          className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors"
                        >
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                              src={post.imageUrl || "/placeholder.jpg"}
                              alt={post.title}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-widest text-red-600 mb-0.5">
                              {post.category?.name}
                            </p>
                            <h4 className="text-sm font-black text-slate-900 leading-tight line-clamp-2">
                              {post.title}
                            </h4>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-xs font-bold text-slate-400">
                          No articles found for "{searchTerm}"
                        </p>
                      </div>
                    )}
                  </div>
                  {searchResults.length > 0 && (
                    <Link
                      href="/stories"
                      className="block p-3 text-center bg-slate-50 hover:bg-slate-100 transition-colors border-t border-slate-100"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        View All Stories →
                      </span>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Auth Actions */}
            {isLogin ? (
              <>
                <Link
                  href={
                    isauthor
                      ? `${autherwebappurl}/checkauthentication?redirectedfrom=node-press&loginstatus=${isLogin}&author=${isauthor}&name=${encodeURIComponent(session?.user?.name || "")}&email=${encodeURIComponent(session?.user?.email || "")}&token=${encodeURIComponent(session?.user?.token || "")}`
                      : `${autherwebappurl}/onboarding?redirectedfrom=node-press&token=${encodeURIComponent(session?.user?.token || "")}&loginstatus=${isLogin}&author=${isauthor}&name=${encodeURIComponent(session?.user?.name || "")}&email=${encodeURIComponent(session?.user?.email || "")}`
                  }
                >
                  <button className="px-4 py-1.5 bg-black text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-zinc-800 transition-all flex items-center gap-1.5">
                    <Pencil size={12} />
                    {isauthor ? "Dashboard" : "Write"}
                  </button>
                </Link>
                <Link href="/profile">
                  <button className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 text-white font-black text-sm flex items-center justify-center uppercase hover:scale-110 transition-all">
                    {session?.user?.name?.substring(0, 1) ||
                      session?.user?.email?.substring(0, 1) ||
                      "U"}
                  </button>
                </Link>
                <LogOut
                  onClick={handlelogout}
                  size={16}
                  className="cursor-pointer text-gray-400 hover:text-gray-900 transition-all"
                />
              </>
            ) : (
              <>
                <Link href={`/login?directedfrom=${pathname}`}>
                  <button className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-black transition-colors">
                    Login
                  </button>
                </Link>
                <Link href={`/signup?directedfrom=${pathname}`}>
                  <span className="px-5 py-2 bg-black text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-zinc-800 transition-all">
                    Join
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right: Search + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={handleSearch}
              className="p-2 hover:bg-slate-100 rounded-full transition-all"
            >
              {search ? (
                <X size={18} className="text-slate-600" />
              ) : (
                <Search size={18} className="text-slate-600" />
              )}
            </button>
            {isLogin && (
              <Link href="/profile">
                <button className="h-8 w-8 rounded-full bg-black text-white font-black text-sm flex items-center justify-center uppercase">
                  {session?.user?.name?.substring(0, 1) ||
                    session?.user?.email?.substring(0, 1) ||
                    "U"}
                </button>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 hover:bg-slate-100 rounded-full transition-all"
            >
              {mobileMenuOpen ? (
                <X size={20} className="text-slate-700" />
              ) : (
                <Menu size={20} className="text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {search && (
          <div className="md:hidden px-4 pb-3">
            <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2 border border-slate-200">
              <Search size={14} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
                autoFocus
                className="bg-transparent border-none outline-none text-sm text-slate-900 w-full placeholder:text-slate-400"
              />
            </div>
            {searchTerm && searchResults.length > 0 && (
              <div className="mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                {searchResults.map((post) => (
                  <Link
                    key={post.id}
                    href={`/stories/${post.slug}`}
                    onClick={() => { setSearch(false); setSearchTerm(""); }}
                    className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={post.imageUrl || "/placeholder.jpg"}
                        alt={post.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight line-clamp-2 flex-1">
                      {post.title}
                    </h4>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="relative ml-auto w-72 h-full bg-white shadow-2xl flex flex-col z-50">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <span className="text-lg font-black uppercase tracking-tight">
                Node<span className="text-zinc-400">Press</span>
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="p-6 space-y-1 flex-1">
              {nav_link.map((link, idx) => (
                <Link
                  key={idx}
                  href={link === "home" ? "/" : `/${link}`}
                  onClick={() => { setactive(link); setMobileMenuOpen(false); }}
                  className={`block px-4 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-colors ${
                    activenav === link
                      ? "bg-black text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {link}
                </Link>
              ))}
            </nav>

            <div className="p-6 border-t border-slate-100 space-y-3">
              {isLogin ? (
                <>
                  <Link
                    href={
                      isauthor
                        ? `${autherwebappurl}/checkauthentication?redirectedfrom=node-press&loginstatus=${isLogin}&author=${isauthor}&name=${encodeURIComponent(session?.user?.name || "")}&email=${encodeURIComponent(session?.user?.email || "")}&token=${encodeURIComponent(session?.user?.token || "")}`
                        : `${autherwebappurl}/onboarding?redirectedfrom=node-press&token=${encodeURIComponent(session?.user?.token || "")}&loginstatus=${isLogin}&author=${isauthor}&name=${encodeURIComponent(session?.user?.name || "")}&email=${encodeURIComponent(session?.user?.email || "")}`
                    }
                    className="block w-full px-4 py-3 bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl text-center"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Pencil size={12} />
                      {isauthor ? "Author Dashboard" : "Become An Author"}
                    </span>
                  </Link>
                  <button
                    onClick={handlelogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`/login?directedfrom=${pathname}`}
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-center text-slate-700 hover:bg-slate-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href={`/signup?directedfrom=${pathname}`}
                    className="block w-full px-4 py-3 bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Join the Collective
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
