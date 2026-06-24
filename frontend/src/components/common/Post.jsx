import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";
import profile from "../../assets/Profile.jpg";
import { MdDelete } from "react-icons/md";
import { IoCopyOutline } from "react-icons/io5";
import { FiUsers } from "react-icons/fi";

/* ─── Applicants Modal ──────────────────────────────────────── */
const ViewApplicantsModal = ({ applicants, isOpen, closeModal }) => {
  const [searchQuery, setSearchQuery] = useState("");
  if (!isOpen) return null;

  const filtered = applicants?.filter((a) => {
    const q = searchQuery.toLowerCase();
    return a.fullName.toLowerCase().includes(q) || a.enrollNo.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
      <div className="relative w-full max-w-md bg-[#0f1923] border border-[#2d4a6e] rounded-2xl shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-5 border-b border-[#1e2d3d]">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <FiUsers className="text-blue-400" /> Applicants ({applicants?.length || 0})
          </h3>
          <button onClick={closeModal} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1e2d3d] transition-colors">✕</button>
        </div>

        <div className="p-4">
          <input
            type="text"
            placeholder="Search by name or enroll no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mb-4 px-3 py-2 bg-[#0d1117] border border-[#2d4a6e] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
            autoFocus
          />

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {filtered?.length > 0 ? filtered.map((applicant) => (
              <a
                key={applicant._id}
                href={`/profile/${applicant.enrollNo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-between items-center border border-[#1e2d3d] rounded-xl px-4 py-3 hover:bg-[#1e2d3d] hover:border-[#2d4a6e] transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-sm font-bold">
                    {applicant.fullName?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-200 text-sm group-hover:text-white transition-colors">{applicant.fullName}</span>
                    <span className="text-xs text-slate-500">@{applicant.enrollNo}</span>
                  </div>
                </div>
                <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">View ↗</span>
              </a>
            )) : (
              <p className="text-center text-slate-500 py-6 text-sm">No matching applicants</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Post Card ─────────────────────────────────────────────── */
const Post = ({ post }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [applicants, setApplicants] = useState([]);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [isFetchingApplicants, setIsFetchingApplicants] = useState(false);
  const [justApplied, setJustApplied] = useState(false);

  const { data: authUser, isLoading: isAuthLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!res.ok) return null;
      return data;
    },
    retry: false,
  });

  if (!post?._id) return null;

  const postOwner = post.user;

  // Guard: if the populated user is missing, skip rendering this post
  if (!postOwner) return null;

  if (isAuthLoading) return <LoadingSpinner />;

  const isMyPost = authUser?._id === postOwner?._id;
  const isApplied = authUser && post.applications?.some((app) =>
    typeof app === "object" ? app._id === authUser._id : app === authUser._id
  );
  const formattedDate = formatPostDate(post.createdAt);
  const hasExpired = post.expiresAt && new Date(post.expiresAt) <= new Date();
  const appCount = post.applications?.length || 0;

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: toggleApplication, isPending: isApplying } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/applications/${post._id}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      if (!isApplied) setJustApplied(true);
      toast.success(isApplied ? "Application withdrawn" : "Applied successfully! 🎉");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setTimeout(() => setJustApplied(false), 1000);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleApplyPost = () => {
    if (!authUser) {
      toast.error("Please login to apply.");
      navigate("/login");
      return;
    }
    if (isApplying || isMyPost) return;
    toggleApplication();
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/home`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Could not copy link.");
    }
  };

  const handleViewApplicants = async () => {
    if (!authUser) { toast.error("Please login to view applicants."); return; }
    setIsFetchingApplicants(true);
    try {
      const res = await fetch(`/api/posts/applications/${post._id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch applicants");
      setApplicants(data.applicants || []);
      setIsApplicantsModalOpen(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsFetchingApplicants(false);
    }
  };

  return (
    <>
      <div className="border border-[#1e2d3d] rounded-xl p-5 mb-4 bg-[#0f1923] card-hover animate-slide-up group">
        {/* Post Header */}
        <div className="flex items-start mb-4 gap-3">
          <Link to={authUser ? `/profile/${postOwner.enrollNo}` : "/login"} className="flex-shrink-0">
            <img
              src={postOwner.profileImg || profile}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-[#2d4a6e] hover:border-blue-500 transition-colors"
            />
          </Link>

          <div className="flex flex-col flex-1 min-w-0">
            <Link
              to={authUser ? `/profile/${postOwner.enrollNo}` : "/login"}
              className="font-semibold text-white hover:text-blue-400 transition-colors leading-tight"
            >
              {postOwner.fullName}
            </Link>
            <span className="text-xs text-slate-500">@{postOwner.enrollNo} · {formattedDate}</span>
          </div>

          {/* Delete — only post owner */}
          {isMyPost && (
            <button
              onClick={() => deletePost()}
              className="ml-auto p-2 rounded-lg hover:bg-red-900/30 transition-colors text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100"
              title="Delete Post"
            >
              {isDeleting
                ? <span className="text-xs text-slate-400">...</span>
                : <MdDelete className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Post Content */}
        <div className="mb-4 pl-[52px]">
          <p className="text-slate-200 leading-relaxed whitespace-pre-wrap text-[15px]">{post.text}</p>
          {post.img && (
            <img
              src={post.img}
              alt="post"
              className="mt-3 w-full max-h-[420px] object-cover rounded-xl border border-[#1e2d3d] hover:border-[#2d4a6e] transition-colors"
            />
          )}
        </div>

        {/* Deadline / Expired badge */}
        {post.expiresAt && (
          <div className="pl-[52px] mb-3">
            {hasExpired ? (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                🔒 Closed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-900/30 text-amber-400 border border-amber-800/40">
                ⏰ Deadline: {new Date(post.expiresAt).toLocaleString()}
              </span>
            )}
          </div>
        )}

        {/* Action Row */}
        <div className="pl-[52px] flex items-center gap-2 pt-3 border-t border-[#1e2d3d]">
          {/* Apply / Withdraw — not my post */}
          {!isMyPost && (
            <button
              onClick={handleApplyPost}
              disabled={isApplying || hasExpired}
              className={`px-4 py-1.5 text-sm rounded-full font-medium transition-all duration-200 active:scale-95
                ${hasExpired
                  ? "bg-[#1a2333] text-slate-500 cursor-not-allowed border border-[#1e2d3d]"
                  : !authUser
                    ? "border border-blue-500/40 text-blue-300 hover:bg-blue-600/20"
                    : isApplied
                      ? "border border-red-500/50 text-red-400 hover:bg-red-900/20"
                      : `bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-cyan-400 shadow-md shadow-blue-900/30 ${justApplied ? "scale-105" : ""}`
                }
                ${isApplying ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {hasExpired ? "Closed"
                : isApplying ? "..."
                  : !authUser ? "Login to Apply"
                    : isApplied ? "Withdraw"
                      : "Apply"}
            </button>
          )}

          {/* View Applicants — post owner only */}
          {isMyPost && (
            <button
              onClick={handleViewApplicants}
              disabled={isFetchingApplicants}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border border-[#2d4a6e] text-slate-300 hover:bg-[#1e3050] hover:text-white hover:border-blue-500 transition-all duration-200"
            >
              <FiUsers className="w-3.5 h-3.5" />
              {isFetchingApplicants ? "Loading..." : "Applicants"}
            </button>
          )}

          {/* Application count badge */}
          {appCount > 0 && (
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <FiUsers className="w-3 h-3" />
              {appCount}
            </span>
          )}
        </div>
      </div>

      <ViewApplicantsModal
        applicants={applicants}
        isOpen={isApplicantsModalOpen}
        closeModal={() => setIsApplicantsModalOpen(false)}
      />
    </>
  );
};

export default Post;
