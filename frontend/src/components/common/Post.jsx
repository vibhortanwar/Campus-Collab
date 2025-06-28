import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";
import profile from "../../assets/Profile.jpg";
import { MdDelete } from "react-icons/md";

const ViewApplicantsModal = ({ applicants, isOpen, closeModal }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApplicants = applicants?.filter((applicant) => {
    const q = searchQuery.toLowerCase();
    return (
      applicant.fullName.toLowerCase().includes(q) ||
      applicant.enrollNo.toLowerCase().includes(q)
    );
  });

  return (
    <dialog open={isOpen} className="modal">
      <div className="modal-box max-w-lg">
        <h3 className="font-bold text-lg mb-4 text-white">Applicants</h3>

        <input
          type="text"
          placeholder="Search by name or enroll no..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-bordered w-full mb-4"
        />

        <div className="space-y-3 max-h-60 overflow-y-auto">
          {filteredApplicants?.length > 0 ? (
            filteredApplicants.map((applicant) => (
              <a
                key={applicant._id}
                href={`/profile/${applicant.enrollNo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-between items-center border border-[#d1d5db] shadow-sm rounded-md px-4 py-2 hover:bg-[#f5faff] transition duration-200"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-white hover:underline">
                    {applicant.fullName}
                  </span>
                  <span className="text-sm text-gray-500">
                    @{applicant.enrollNo}
                  </span>
                </div>
                <span className="text-xs text-gray-400">View Profile ↗</span>
              </a>
            ))
          ) : (
            <p className="text-center text-gray-600">No matching applicants</p>
          )}
        </div>

        <div className="modal-action">
          <button
            className="btn bg-white text-[#123458] hover:bg-gray-800 hover:text-white"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

const Post = ({ post }) => {
  const queryClient = useQueryClient();
  const [applicants, setApplicants] = useState([]);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [isFetchingApplicants, setIsFetchingApplicants] = useState(false);

  const { data: authUser, isLoading: isAuthLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
  });

  const postOwner = post.user;
  const isMyPost = authUser?._id === postOwner?._id;
  const isApplied =
    authUser &&
    post.applications?.some((app) =>
      typeof app === "object" ? app._id === authUser._id : app === authUser._id
    );

  const formattedDate = formatPostDate(post.createdAt);

  const hasExpired = post.expiresAt && new Date(post.expiresAt) <= new Date();

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const { mutate: toggleApplication, isPending: isApplying } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/applications/${post._id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success(isApplied ? "Withdrawn" : "Applied");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleDeletePost = () => deletePost();

  const handleApplyPost = () => {
    if (!authUser) {
      toast.error("Please login to apply.");
      return;
    }
    if (isApplying || isMyPost) return;
    toggleApplication();
  };

  const handleViewApplicantsClick = async () => {
    if (!authUser) {
      toast.error("Please login to view applicants.");
      return;
    }
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

  if (isAuthLoading) return <LoadingSpinner />;

  return (
    <div className="border border-[#123458] rounded-md p-4 mb-6 shadow-sm">
      <div className="flex items-center mb-3 gap-3">
        <Link to={`/profile/${postOwner.enrollNo}`}>
          <img
            src={postOwner.profileImg || profile}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        </Link>
        <div className="flex flex-col">
          <Link
            to={`/profile/${postOwner.enrollNo}`}
            className="font-medium text-[#123458] font-bold"
          >
            {postOwner.fullName}
          </Link>
          <span className="text-sm text-gray-500">
            @{postOwner.enrollNo} · {formattedDate}
          </span>
        </div>

        {isMyPost && (
          <button
            onClick={handleDeletePost}
            className="ml-auto p-2 rounded-full hover:bg-white transition-colors text-[#123458]"
            title="Delete Post"
          >
            {isDeleting ? (
              <span className="text-sm">Deleting...</span>
            ) : (
              <MdDelete className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      <div className="mb-4">
        <p className="mb-2 text-[#123458]">{post.text}</p>
        {post.img && (
          <img
            src={post.img}
            alt="post"
            className="max-w-full max-h-[400px] w-auto h-auto rounded-md object-contain mx-auto"
          />
        )}
      </div>

      <div className="flex items-center gap-3">
        {!isMyPost && (
          <button
            onClick={handleApplyPost}
            disabled={isApplying || hasExpired}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors duration-200 font-medium
              ${
                hasExpired
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : isApplied
                  ? "border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  : "bg-[#123458] text-white hover:bg-[#0f2d4d]"
              }
              ${isApplying ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {hasExpired
              ? "Closed"
              : isApplying
              ? "Processing..."
              : isApplied
              ? "Withdraw"
              : "Apply"}
          </button>
        )}

        <span className="text-sm text-gray-600">
          Total applications: {post.applications.length}
        </span>
      </div>

      {post.expiresAt && !hasExpired && (
        <p className="text-sm text-[#123458] mt-2">
          Deadline: {new Date(post.expiresAt).toLocaleString()}
        </p>
      )}

      {isMyPost && (
        <>
          <button
            onClick={handleViewApplicantsClick}
            disabled={isFetchingApplicants}
            className={`mt-3 px-4 py-1.5 text-sm rounded-md transition-colors duration-200 font-medium border
              ${
                isFetchingApplicants
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-white border-[#123458] text-[#123458] hover:bg-[#123458] hover:text-white"
              }
            `}
          >
            {isFetchingApplicants ? "Loading..." : "View Applicants"}
          </button>

          <ViewApplicantsModal
            applicants={applicants}
            isOpen={isApplicantsModalOpen}
            closeModal={() => setIsApplicantsModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default Post;
