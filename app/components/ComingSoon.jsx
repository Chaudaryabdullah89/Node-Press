import Link from "next/link";

const ComingSoon = ({ title }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-5xl lg:text-7xl font-heading font-black tracking-tighter mb-4 uppercase">
        {title}
      </h1>
      <div className="w-20 h-1 bg-red-500 mb-8"></div>
      <p className="text-xl text-slate-500 font-medium max-w-md mb-12">
        We're currently crafting something special. This page will be available
        soon.
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-black text-white text-sm font-black uppercase tracking-widest rounded-full hover:bg-zinc-800 transition-all"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default ComingSoon;
