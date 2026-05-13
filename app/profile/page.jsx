"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  Settings,
  Clock,
  LogOut,
  User,
  Camera,
  Bell,
  Shield,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { MOCK_POSTS } from "../data";
import PostCard from "../components/PostCard.jsx 22-59-55-958";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("saved");
  const [emailNotif, setEmailNotif] = useState(true);
  const [commentsNotif, setCommentsNotif] = useState(false);
  const [user, setUser] = useState();
  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    bio: "",
    avatar: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [updating, setUpdating] = useState(false);
  const getuser = async function () {
    const req = await fetch(`/api/user/getprofle?id=${session?.user?.id}`);
    const res = await req.json();
    if (req.ok) {
      setUser(res.user);
      setProfileData({
        name: res.user.name || "",
        username: res.user.username || "",
        bio: res.user.bio || "",
        avatar: res.user.avatar || "",
      });
    } else {
      toast.error("Error while Getting Profile");
    }
  };

  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Profile updated successfully");
        getuser(); // Refresh data
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      toast.error("Please fill in both password fields");
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password changed successfully");
        setPasswordData({ oldPassword: "", newPassword: "" });
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      toast.error("An error occurred while changing password");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "ARE YOU ABSOLUTELY SURE? This will permanently delete your account and all your stories/comments. This action cannot be undone.",
    );

    if (!confirmed) return;

    setUpdating(true);
    try {
      const res = await fetch("/api/user/delete", {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Account deleted. We're sorry to see you go.");
        signOut({ callbackUrl: "/" });
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to delete account");
      }
    } catch (error) {
      toast.error("An error occurred during account deletion");
    } finally {
      setUpdating(false);
    }
  };
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);
  useEffect(() => {
    if (session) {
      getuser();
    }
  }, [session]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Mock saved posts for demonstration
  const savedPosts = MOCK_POSTS.slice(0, 3);

  const tabs = [
    { id: "saved", label: "Saved Stories", icon: Bookmark },
    { id: "history", label: "Reading History", icon: Clock },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  const handleLogout = () => {
    router.push(`/logout?token=${session?.user?.id || ""}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 text-white font-bold text-3xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="uppercase">
                  {session?.user?.username?.substring(0, 1) ||
                    session?.user?.name?.substring(0, 1) ||
                    session?.user?.email?.substring(0, 1) ||
                    "U"}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">
                {session?.user?.name || session?.user?.username || "Reader"}
              </h1>
              <p className="text-slate-500 font-medium mb-3">
                {session?.user?.email}
              </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                <User size={12} /> Free Member
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-full transition-colors border border-red-100"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 p-2 shadow-sm sticky top-28">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      isActive
                        ? "bg-black text-white"
                        : "text-slate-500 hover:bg-slate-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={isActive ? "text-white" : "text-slate-400"}
                    />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm min-h-[500px]">
              {/* Saved Tab */}
              {activeTab === "saved" && (
                <div className="animate-in fade-in duration-300">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                    <h2 className="text-xl font-heading font-black">
                      Your Saved Stories
                    </h2>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {savedPosts.length} Articles
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === "history" && (
                <div className="animate-in fade-in duration-300 flex flex-col items-center justify-center text-center h-[400px]">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Clock size={24} className="text-slate-300" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 mb-2">
                    No Reading History
                  </h3>
                  <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
                    Stories you read will appear here. Start exploring our
                    editorial collection to build your reading history.
                  </p>
                  <Link
                    href="/stories"
                    className="px-6 py-2.5 bg-black text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Explore Stories
                  </Link>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="animate-in fade-in duration-300">
                  <div className="mb-8 pb-4 border-b border-slate-100">
                    <h2 className="text-xl font-heading font-black">
                      Account Settings
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Manage your personal information and preferences.
                    </p>
                  </div>

                  <div className="space-y-12 max-w-2xl">
                    {/* Profile Information */}
                    <section>
                      <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-2">
                        <User size={16} className="text-slate-400" /> Public
                        Profile
                      </h3>

                      <div className="flex flex-col sm:flex-row gap-8 items-start mb-6">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center gap-3">
                          <div className="relative w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300 overflow-hidden group cursor-pointer hover:border-black transition-colors">
                            {session?.user?.image ? (
                              <>
                                <Image
                                  src={session.user.image}
                                  alt="User"
                                  fill
                                  className="object-cover group-hover:opacity-50 transition-opacity"
                                />
                                <Camera
                                  size={24}
                                  className="absolute text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                />
                              </>
                            ) : (
                              <Camera
                                size={24}
                                className="text-slate-400 group-hover:text-black transition-colors"
                              />
                            )}
                          </div>
                          <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-black transition-colors">
                            Change Avatar
                          </button>
                        </div>

                        <div className="flex-1 w-full space-y-5">
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                              Display Name
                            </label>
                            <input
                              type="text"
                              value={profileData.name}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  name: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                              Username
                            </label>
                            <input
                              type="text"
                              value={profileData.username}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  username: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                              Short Bio
                            </label>
                            <textarea
                              rows={3}
                              value={profileData.bio}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  bio: e.target.value,
                                })
                              }
                              placeholder="Tell us a little about yourself..."
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all resize-none"
                            />
                          </div>
                          <button
                            onClick={handleUpdateProfile}
                            disabled={updating}
                            className="px-8 py-3 bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50"
                          >
                            {updating ? "Updating..." : "Save Changes"}
                          </button>
                        </div>
                      </div>
                    </section>

                    <div className="h-px bg-slate-100 w-full" />

                    {/* Account Security */}
                    <section>
                      <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-6 flex items-center gap-2">
                        <Shield size={16} className="text-slate-400" /> Account
                        Security
                      </h3>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                            Email Address
                          </label>
                          <div className="flex gap-3">
                            <input
                              type="email"
                              defaultValue={session?.user?.email || ""}
                              disabled
                              className="flex-1 px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 cursor-not-allowed"
                            />
                            <button className="px-5 py-3 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">
                              Update
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                              Current Password
                            </label>
                            <input
                              type="password"
                              value={passwordData.oldPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  oldPassword: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                setPasswordData({
                                  ...passwordData,
                                  newPassword: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <button
                              onClick={handleChangePassword}
                              disabled={updating}
                              className="px-8 py-3 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors disabled:opacity-50"
                            >
                              {updating ? "Processing..." : "Change Password"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>

                    <div className="h-px bg-slate-100 w-full" />

                    {/* Notifications */}

                    <div className="h-px bg-slate-100 w-full" />

                    {/* Save Action */}
                    <div className="flex justify-end pt-2">
                      <button className="px-8 py-3.5 bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-black/10">
                        Save All Changes
                      </button>
                    </div>

                    {/* Danger Zone */}
                    <section className="mt-16 pt-8 border-t-2 border-red-100">
                      <h3 className="text-sm font-black uppercase tracking-widest text-red-600 mb-4 flex items-center gap-2">
                        <Trash2 size={16} /> Danger Zone
                      </h3>
                      <p className="text-sm text-slate-500 mb-4">
                        Once you delete your account, there is no going back.
                        Please be certain.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={updating}
                        className="px-5 py-2.5 bg-white border border-red-200 text-red-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-50"
                      >
                        {updating ? "Deleting..." : "Delete Account"}
                      </button>
                    </section>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
