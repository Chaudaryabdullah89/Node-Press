"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const RssIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
  </svg>
);

const footerLinks = {
  Explore: [
    { name: "Stories", path: "/stories" },
    { name: "Topics", path: "/topics" },
    { name: "Community", path: "/community" },
    { name: "Authors", path: "/authors" },
  ],
  Company: [
    { name: "About", path: "/about" },
    { name: "Careers", path: "/careers" },
    { name: "Press", path: "/press" },
    { name: "Blog", path: "/blog" },
  ],
  Support: [
    { name: "Help Center", path: "/help-center" },
    { name: "Privacy", path: "/privacy" },
    { name: "Terms", path: "/terms" },
    { name: "Contact", path: "/contact" },
  ],
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Welcome! Check your email for a confirmation.");
        setEmail("");
      } else {
        toast.error(data.error || "Subscription failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#0a0a0a] text-white mt-20">
      {/* Newsletter Banner */}
      <div className="border-b border-white/10">
        <div className="max-w-[1300px] mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3">
              Stories worth{" "}
              <span className="text-zinc-400 ">reading every week.</span>
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mb-6 lg:mb-0">
              Join 50,000+ curious readers who get our best hand-picked articles
              delivered straight to their inbox.
            </p>
          </div>
          <div>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-0 max-w-md"
            >
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-white/5 border border-white/15 sm:border-r-0 text-white placeholder-zinc-500 px-5 py-3 text-sm outline-none focus:border-white/40 transition-colors rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"
              />
              <button
                disabled={loading}
                type="submit"
                className="bg-white text-black font-black text-xs uppercase tracking-widest px-6 py-4 sm:py-3 hover:bg-zinc-200 transition-colors whitespace-nowrap rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  "Subscribe →"
                )}
              </button>
            </form>
            <p className="text-zinc-600 text-[10px] sm:text-xs mt-3 text-center sm:text-left">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1300px] mx-auto px-6 py-14 grid grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-1 space-y-5">
          <Link href="/" className="inline-flex flex-col">
            <span className="text-lg font-black uppercase tracking-tight leading-none">
              Node<span className="text-zinc-400">Press</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold mt-0.5">
              Journal
            </span>
          </Link>
          <p className="text-zinc-500 text-xs leading-relaxed max-w-[200px]">
            A premium publishing platform for thoughtful creators and curious
            readers.
          </p>
          {/* Social Icons */}
          <div className="flex gap-3">
            {[
              { icon: <TwitterIcon />, href: "#", label: "Twitter" },
              { icon: <YoutubeIcon />, href: "#", label: "YouTube" },
              { icon: <InstagramIcon />, href: "#", label: "Instagram" },
              { icon: <RssIcon />, href: "#", label: "RSS" },
            ].map(({ icon, href, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:border-white/40 transition-all duration-300"
              >
                {icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Nav Columns */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title} className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
              {title}
            </h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-sm text-zinc-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1300px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-600">
            © {currentYear} Node Press. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {[
              { name: "Privacy Policy", path: "/privacy" },
              { name: "Terms of Use", path: "/terms" },
              { name: "Cookie Settings", path: "#" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
