import React from "react";
import Link from "next/link";
import { Clock, User } from "lucide-react";
import Image from "next/image";
const PostCard = ({ post }) => {
  if (!post) return null;

  // Change this:
  const category = post.category?.name || "Uncategorized";
  const authorName =
    post.author?.user?.name || post.author?.name || "Anonymous";

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-slate-100 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1 font-body">
      <Link
        href={`/stories/${post.slug}?id=${post.id}`}
        className="block aspect-[16/10] overflow-hidden relative"
      >
        <Image
          src={
            post.imageUrl ||
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800"
          }
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm text-black">
            {category}
          </span>
        </div>
      </Link>

      <div className="p-8">
        <div className="flex items-center gap-4 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <User size={12} /> {authorName}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} /> {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        <Link href={`/stories/${post.slug}`}>
          <h3 className="text-xl font-heading font-black leading-tight mb-4 group-hover:text-red-600 transition-colors">
            {post.title}
          </h3>
        </Link>

        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-6">
          {post.excerpt || post.content?.substring(0, 120)}...
        </p>

        <Link
          href={`/stories/${post.slug}`}
          className="inline-flex items-center text-[11px] font-black uppercase tracking-widest text-black group-hover:gap-2 transition-all duration-300 "
        >
          Read Article <span className="ml-1">→</span>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
