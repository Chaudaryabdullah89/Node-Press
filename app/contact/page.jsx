"use client";
import React from "react";
import { Mail, MessageSquare, MapPin, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const Page = () => {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Message sent! Check your email for confirmation.");
        setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
      } else {
        toast.error(data.error || "Failed to send message");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="relative border-b my-5 border-slate-100 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_50%,rgba(139,92,246,0.06),transparent_50%),radial-gradient(circle_at_90%_50%,rgba(244,63,94,0.06),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-red-500 mb-3">
            Get in touch
          </p>
          <h1 className="text-4xl md:text-6xl font-black font-heading leading-tight mb-4">
            Contact <span className="">Us</span>
          </h1>
          <p className="text-slate-500 max-w-lg leading-relaxed text-sm md:text-base">
            Have a story to share, a question to ask, or just want to say hello?
            Our team is always ready to listen.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-12">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">
                Our Offices
              </h3>
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-black shrink-0 border border-slate-100">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-tight mb-1">
                      New York
                    </h4>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      123 Editorial Plaza, Manhattan
                      <br />
                      NY 10001, United States
                    </p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-black shrink-0 border border-slate-100">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-tight mb-1">
                      London
                    </h4>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      45 Story Lane, Shoreditch
                      <br />
                      London E1 6PJ, UK
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">
                Direct Contact
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                    <Mail size={16} />
                  </div>
                  <span className="text-sm font-medium">
                    hello@nodepress.com
                  </span>
                </div>
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                    <MessageSquare size={16} />
                  </div>
                  <span className="text-sm font-medium">
                    Support Chat Available 24/7
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-slate-100 p-8 lg:p-12 rounded-[40px] shadow-2xl shadow-black/5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Julian Voss"
                    className="w-full bg-zinc-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm outline-none focus:border-black focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="julian@example.com"
                    className="w-full bg-zinc-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm outline-none focus:border-black focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2 mb-8">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                  Subject
                </label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-zinc-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm outline-none focus:border-black focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option>General Inquiry</option>
                  <option>Write for Us</option>
                  <option>Advertising</option>
                  <option>Bug Report</option>
                </select>
              </div>
              <div className="space-y-2 mb-10">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                  Your Message
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you?"
                  rows={6}
                  className="w-full bg-zinc-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm outline-none focus:border-black focus:bg-white transition-all resize-none"
                />
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-black text-white font-black uppercase tracking-[0.2em] py-3 rounded-xl text-sm hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
