"use client";

import { useParams, useSearchParams } from "next/navigation";
import { MOCK_POSTS } from "../../data";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Cross,
  CrossIcon,
  Heart,
  MessageCircle,
  X,
  Share2,
  Bookmark,
} from "lucide-react";
import toast from "react-hot-toast";
import PostCard from "../../components/Postcard";

const Page = () => {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [post, setPost] = useState(null);
  const [opencommentpanel, setOpenCommentPanel] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState();
  const [guestcommentname, setGuestCommentName] = useState();
  const [like, setLike] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentloading, setCommentLoading] = useState(false);
  const [morePosts, setMorePosts] = useState([]);
  const session = useSession();
  const articleref = useRef();
  const [ReadingProcess, setReadProgress] = useState();
  //   setting the matched slug post

  const fetchPost = async () => {
    setLoading(true);
    try {
      let query = id ? `id=${id}` : `slug=${slug}`;
      if (session?.data?.user?.id) {
        query += `&userId=${session.data.user.id}`;
      }

      const res = await fetch(`/api/post/getpost?${query}`);
      const data = await res.json();
      if (res.ok) {
        setPost(data.post);
        setComments(data.post.comments || []);
        setLike(data.isLiked || false);
        setSaved(data.isBookmarked || false);
      } else {
        toast.error("Story not found");
      }
    } catch (error) {
      toast.error("Error loading story");
    } finally {
      setLoading(false);
    }
  };

  // const fetchMorePosts = async () => {
  //   try {
  //     const res = await fetch("/api/post/getposts");
  //     const data = await res.json();
  //     if (res.ok) {
  //       setMorePosts(data.latestPosts || []);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching more stories", error);
  //   }
  // };

  useEffect(() => {
    if (id || slug) {
      fetchPost();
      // fetchMorePosts();
    }
  }, [id, slug]);

  //   use to make the background unuseable while comment panel is open

  useEffect(() => {
    if (opencommentpanel) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to ensure scrolling is restored if component unmounts

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [opencommentpanel]);

  //   comment panel opener handler

  const handlecommentpanel = () => {
    setOpenCommentPanel((prev) => !prev);
  };

  //   handler for submiting commnet too uplaod too backend and adding too state

  const submitcomment = async () => {
    if (!comment) return toast.error("Please write a comment first");
    setCommentLoading(true);
    try {
      const payload = {
        userId: session?.data?.user?.id,
        postId: post.id,
        content: comment,
        email: session?.data?.user?.email || null,
        name: session?.data?.user?.name || guestcommentname || "Guest",
      };

      //  POST REQUEST => Comment Services or Api

      const req = await fetch("/api/post/comment", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const res = await req.json();

      if (req.ok) {
        const newCommentForState = {
          ...res.newComment,
          user: {
            name: payload.name,
            avatar:
              session?.data?.user?.image ||
              `https://i.pravatar.cc/150?u=${payload.name}`,
          },
        };
        setComments((prev) => [newCommentForState, ...prev]);
        toast.success("Comment Posted ");
        setComment(null);
      } else {
        toast.error(res.message || "error posting comment try again later");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setCommentLoading(false);
    }
  };

  //   handler funtion too like and unlike the post

  const handlelikepost = async () => {
    if (session.status !== "authenticated") {
      toast.error("Please login to like posts");
      return;
    }
    setLike((prev) => !prev);

    try {
      const req = await fetch("/api/post/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.data.user.id,
          postId: post.id,
        }),
      });

      const res = await req.json();

      if (req.ok) {
        toast.success(res.message);
      } else {
        setLike((prev) => !prev);

        toast.error(res.message || "Error updating like");
      }
    } catch (error) {
      toast.error("Connection error");
    }
  };

  //   save post handler

  const handleSavePost = async () => {
    //  POST REQUEST => Savepost  Services or Api
    if (session.status !== "authenticated") {
      toast.error("Please login to save post ");
      return;
    }

    try {
      const req = await fetch("/api/post/bookmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.data.user.id,
          postId: post.id,
        }),
      });

      const res = await req.json();

      if (req.ok) {
        setSaved((prev) => !prev);
        toast.success(res.message);
      } else {
        toast.error(res.message || "Error saving post");
      }
    } catch (error) {
      toast.error("Connection error");
    }
  };

  //   copy Post Link too the ClipBoard

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  // use too get reading progess percentage

  useEffect(() => {
    let lastProgress = 0;
    const onscroll = () => {
      const el = articleref.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = Math.min(
        100,
        Math.max(0, (-top / (height - windowHeight)) * 100),
      );

      if (
        Math.abs(progress - lastProgress) > 0.5 ||
        progress === 100 ||
        progress === 0
      ) {
        setReadProgress(progress);
        lastProgress = progress;
      }
    };
    window.addEventListener("scroll", onscroll, { passive: true });
    return () => window.removeEventListener("scroll", onscroll);
  }, [post]);

  const fetchRelatedPosts = async () => {
    if (!post) return;
    try {
      const tagParams = post.postTags
        ?.map((pt) => `tagId=${pt.tagId}`)
        .join("&");
      console.log(tagParams);
      const categoryParam = post.categoryId
        ? `categoryId=${post.categoryId}`
        : "";

      const query = [tagParams, categoryParam, `postId=${post.id}`]
        .filter(Boolean)
        .join("&");

      const res = await fetch(`/api/post/getrealtedpost?${query}`);
      const data = await res.json();
      console.log(data);

      if (res.ok) {
        setMorePosts(data || []);
        console.log(morePosts);
      }
    } catch (error) {
      console.error("Error fetching related posts", error);
    }
  };

  useEffect(() => {
    if (post) {
      fetchRelatedPosts();
    }
  }, [post]);
  if (!post)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <div ref={articleref}>
      <div
        className="fixed top-0 left-0 bg-black h-1 z-[100] transition-all duration-100"
        style={{ width: `${ReadingProcess}%` }}
      ></div>
      <div className="fixed bottom-8 bg-white/90 backdrop-blur-md rounded-full border border-gray-200 shadow-lg max-w-[420px] h-12 z-50 left-1/2 -translate-x-1/2 flex items-center px-4">
        <div className="flex items-center w-full justify-around">
          <div className="border-r border-slate-200 pr-2">
            <button
              onClick={handlelikepost}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-all duration-300 group"
            >
              <Heart
                className={`${like ? "border-red-500" : ""} hover:scale-110 transition-all duration-300 group-hover:text-red-500`}
                fill={`${like ? "red" : "white"}`}
                size={18}
              />
              <span
                className={`${like ? "text-red-500" : "text-slate-500"} text-xs font-bold group-hover:text-red-500`}
              >
                {post?._count?.likes}
              </span>
            </button>
          </div>

          <div className="border-r border-slate-200 pr-2">
            <button
              onClick={() => setOpenCommentPanel((prev) => !prev)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-all duration-300 group"
            >
              <MessageCircle
                className={`${opencommentpanel ? "text-blue-500" : "text-slate-500"} hover:scale-110 transition-all duration-300 group-hover:text-blue-500`}
                size={18}
              />
              <span
                className={`${opencommentpanel ? "text-blue-500" : "text-slate-500"} text-xs font-bold group-hover:text-blue-500`}
              >
                {comments.length}
              </span>
            </button>
          </div>

          <div className="border-r border-slate-200 pr-2">
            <button
              onClick={handleSavePost}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-all duration-300 group"
            >
              <Bookmark
                className={`${saved ? "text-amber-500" : "text-slate-500"} hover:scale-110 transition-all duration-300 group-hover:text-amber-500`}
                fill={saved ? "currentColor" : "none"}
                size={18}
              />
              <span
                className={`${saved ? "text-amber-500" : "text-slate-500"} text-xs font-bold group-hover:text-amber-500`}
              >
                {saved ? "Saved" : "Save"}
              </span>
            </button>
          </div>

          <div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-all duration-300 group"
            >
              <Share2
                className="text-slate-500 hover:scale-110 transition-all duration-300 group-hover:text-green-500"
                size={18}
              />
              <span className="text-slate-500 text-xs font-bold group-hover:text-green-500">
                Share
              </span>
            </button>
          </div>
          <div className="pl-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 tabular-nums">
              <span className="text-xs font-black">
                {Math.round(ReadingProcess || 0)}%
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        {/* botoom bar */}

        {/* commnet panel  */}
        {opencommentpanel && (
          <div className="fixed right-0  transition-all duration-300 top-0 bottom-0 z-50 w-[400px]  bg-white">
            <div className="flex justify-between text-slate-500 flex-row-reverse p-8 border-b border-gray-100">
              <span className="">
                <X
                  className="cursor-pointer hover:text-black transition-colors"
                  onClick={handlecommentpanel}
                />
              </span>
              <span>
                <h2 className="text-xl font-heading text-black font-bold">
                  Responses{" "}
                  <span className="text-slate-400">({comments.length})</span>
                </h2>
              </span>
            </div>

            <div className="p-8 overflow-y-auto h-[100vh]">
              {comments.length > 0 ? (
                <div className="space-y-8">
                  {comments.map((comment, idx) => (
                    <div key={idx} className="group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src={comment.user.avatar}
                            alt={comment.user.name}
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">
                            {comment.user.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <MessageCircle
                    size={40}
                    className="mx-auto text-gray-200 mb-4"
                  />
                  <p className="text-gray-400 text-sm italic">
                    No responses yet. Be the first to share your thoughts!
                  </p>
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-30">
              <div className="space-y-4">
                {session?.data?.user ? (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Commenting as
                    </span>
                    <span className="text-xs font-bold text-blue-600">
                      {session.data.user.name}
                    </span>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      onChange={(e) => setGuestCommentName(e.target.value)}
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-2 text-sm border border-gray-100 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50 transition-all text-black"
                    />
                  </div>
                )}

                <div className="relative">
                  <textarea
                    onChange={(e) => setComment(e.target.value)}
                    rows="3"
                    placeholder="What are your thoughts?"
                    className="w-full px-4 py-3 text-sm border border-gray-100 rounded-xl focus:outline-none focus:border-blue-500 bg-gray-50 transition-all resize-none text-black"
                  />
                </div>

                <button
                  onClick={submitcomment}
                  disabled={commentloading}
                  className="w-full bg-black text-white text-sm font-bold py-3 rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {commentloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post Response"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Dark Backdrop Overlay */}
        {opencommentpanel && (
          <div
            className="fixed inset-0 bg-black/60 z-40 transition-opacity"
            onClick={handlecommentpanel} // Clicking the background closes the panel
          />
        )}

        <section
          className={`  h-[60vh] overflow-hidden text-white w-full relative`}
        >
          <Image
            className="object-cover bg-center"
            src={post.imageUrl}
            alt={post.title}
            fill
            sizes="100vw"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 z-10" />

          {/* Content Container */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center text-white px-8 md:px-16 lg:px-24">
            <div className="max-w-4xl">
              <div className="flex items-center gap-2 text-xs font-medium mb-4 uppercase tracking-widest opacity-90">
                <Link
                  href="/"
                  className="hover:text-blue-400 transition-colors"
                >
                  Home
                </Link>
                <span className="w-1 h-1 bg-white rounded-full mx-1" />
                <Link
                  href="/stories"
                  className="hover:text-blue-400 transition-colors"
                >
                  Stories
                </Link>
                <span className="w-1 h-1 bg-white rounded-full mx-1" />
                <span className="text-blue-400 hover:text-blue-300 transition-colors">
                  {post.slug || post.catagory || "Uncategorized"}
                </span>
              </div>

              <div className="inline-block text-xs bg-white text-black px-2 py-1   rounded-full font-bold  uppercase tracking-[0.1em]">
                {post.categories?.[0]?.category?.name || "No Category"}
              </div>

              <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold mb-8 leading-[1.2]">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm font-medium opacity-80">
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  5 min read
                </span>
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  {post.viewCount} views
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className=" max-w-4xl mx-auto flex gap-10">
          <article className=" px-6 py-16">
            {/* Author Info */}
            <div className="flex justify-between ">
              <div className="flex items-center gap-4 mb-10 pb-10 border-b border-gray-100">
                {post.author?.avatar && (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="font-bold text-gray-900">
                    {post.author?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    @{post.author?.username}
                  </div>
                </div>
              </div>
              <div
                onClick={handlelikepost}
                className="flex text-slate-400 group font-bold  cursor-pointer  mt-4 relative right-10 gap-2 "
              >
                <span>
                  <Heart
                    className={`${like ? " border-red-500 " : "    "} hover:scale-110 transition-all duration-300 group-hover:text-red-500`}
                    fill={`${like ? "red" : "white"}`}
                    size={18}
                  />
                </span>
                <span
                  className={` ${like ? "text-red-500" : ""} text-sm group-hover:text-red-500`}
                >
                  {post._count?.likes}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none text-black">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed italic">
                {post.excerpt}
              </p>
              <div className="text-gray-800 leading-loose whitespace-pre-wrap">
                {post.content}
              </div>
            </div>
            <div className="tag. my-10 flex gap-4  ">
              <span className="text-slate-500 font-bold text-sm">TAGGED :</span>
              {["LIFESTYLE ", "FASION"].map((tag, idx) => (
                <>
                  <span className="text-slate-500 text-xs border font-bold border-gray-300  bg-gray-100 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                </>
              ))}
            </div>
            <div
              onClick={handlecommentpanel}
              className="flex cursor-pointer text-slate-400 text-bold border border-gray-200 bg-gray-100 w-fit rounded-full px-4 py-1 gap-2"
            >
              <span>
                <MessageCircle size={16} className="mt-0.5" />
              </span>
              <span className="text-sm  font-bold">
                Read Comments ({comments.length})
              </span>
            </div>
          </article>
          <div className="sticky h-fit mt-16 top-24 mb-10 min-w-[280px] max-w-[350px]">
            {/* About the Author */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">
                About the Author
              </p>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow-md">
                  <Image
                    src={
                      post.author?.avatar ||
                      "https://i.pravatar.cc/150?u=marcus"
                    }
                    alt={post.author?.name || "Author"}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div>
                  <p className="font-black text-sm">
                    {post.author?.name || "Marcus Thorne"}
                  </p>
                  <p className="text-slate-400 text-xs">
                    @{post.author?.username || "chef_marcus"}
                  </p>
                </div>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                {post.author.bio ||
                  "A passionate writer contributing to the NodePress editorial collective. "}
              </p>
              <Link
                href={`/author/${post.author.username}`}
                className="inline-block text-[10px] font-black uppercase tracking-widest border-b border-black pb-0.5 hover:text-slate-500 transition-colors"
              >
                View Author Profile →
              </Link>

              <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Article Stats
                </p>
                {[
                  { label: "Views", value: post.viewCount },
                  { label: "Read Time", value: "1 min" },
                  { label: "Likes", value: post._count?.likes },
                  { label: "Responses", value: post._count?.comments },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between items-center"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                      {label}
                    </span>
                    <span className="text-xs font-black">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* More Stories Section */}
        <section className="bg-slate-50 py-20 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-heading font-black mb-2">
                  More Stories
                </h2>
                <div className="h-1 w-20 bg-red-600 rounded-full" />
              </div>
              <Link
                href="/stories"
                className="text-xs  mt-6 font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-colors"
              >
                View All Stories →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {morePosts
                .filter((p) => p.slug !== slug)
                .slice(0, 3)
                .map((relatedPost) => (
                  <PostCard key={relatedPost.id} post={relatedPost} />
                ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
