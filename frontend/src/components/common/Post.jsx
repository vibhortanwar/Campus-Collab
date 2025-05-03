import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { formatPostDate } from "../../utils/date";

const ViewApplicantsModal = ({ applicants, isOpen, closeModal }) => {
  return (
    <dialog open={isOpen} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Applicants</h3>
        <div className="space-y-2">
          {applicants?.length > 0 ? (
            applicants.map((applicant) => (
              <a
                key={applicant._id}
                href={`/profile/${applicant.enrollNo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-between items-center border-b py-1 hover:bg-gray-100 px-2 rounded"
              >
                <span className="text-blue-600 hover:underline">{applicant.fullName}</span>
                <span className="text-sm text-gray-500">@{applicant.enrollNo}</span>
              </a>
            ))
          ) : (
            <p className="text-center">No applicants yet</p>
          )}
        </div>
        <div className="modal-action">
          <button className="btn" onClick={closeModal}>Close</button>
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
  const isMyPost = authUser?._id === post.user._id;
  const isApplied = post.applications?.some(app =>
    typeof app === 'object' ? app._id === authUser?._id : app === authUser?._id
  );
  const formattedDate = formatPostDate(post.createdAt);

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
    }
  });

  const { mutate: toggleApplication, isPending: isApplying } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/applications/${post._id}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success(isApplied ? "Conciled" : "Applied");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  const handleDeletePost = () => deletePost();

  const handleApplyPost = () => {
    if (!authUser || isApplying || isMyPost) return;
    toggleApplication();
  };

  const handleViewApplicantsClick = async () => {
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

  if (isAuthLoading || !authUser) return <LoadingSpinner />;

  return (
    <div className="border border-gray-300 rounded-md p-4 mb-6 shadow-sm">
      <div className="flex items-center mb-3 gap-3">
        <Link to={`/profile/${postOwner.enrollNo}`}>
          <img
            src={postOwner.profileImg}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        </Link>
        <div className="flex flex-col">
          <Link
            to={`/profile/${postOwner.enrollNo}`}
            className="font-medium text-gray-800"
          >
            {postOwner.fullName}
          </Link>
          <span className="text-sm text-gray-500">@{postOwner.enrollNo} · {formattedDate}</span>
        </div>
        {isMyPost && (
          <button
            onClick={handleDeletePost}
            className="ml-auto text-sm text-red-500 hover:underline"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>

      <div className="mb-4">
        <p className="mb-2 text-gray-800">{post.text}</p>
        {post.img && (
          <img
            src={post.img}
            alt="post"
            className="w-full rounded-md max-h-[300px] object-cover"
          />
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleApplyPost}
          disabled={isMyPost || isApplying}
          className="btn btn-sm btn-outline"
        >
          {isApplying ? "Processing..." : isApplied ? "Concile" : "Apply"}
        </button>
        <span className="text-sm text-gray-600">
          Total applications: {post.applications.length}
        </span>
      </div>

      {isMyPost && (
        <>
          <button
            onClick={handleViewApplicantsClick}
            disabled={isFetchingApplicants}
            className="btn btn-sm mt-3"
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
