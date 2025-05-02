import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { formatPostDate } from "../../utils/date";


const Post = ({ post }) => {
  const queryClient = useQueryClient();

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
      try {
        const res = await fetch(`/api/posts/${post._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        toast.error(error.message || "Something went wrong");
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    }
  });

  const { mutate: toggleApplication, isPending: isApplying } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/applications/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        toast.error(error.message || "Something went wrong");
        throw error;
      }
    },
    onSuccess: () => {
      toast.success(isApplied ? "Conciled successfully" : "Applied successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Refetch posts
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });


  const handleDeletePost = () => {
    deletePost();
  };

  const handleApplyPost = () => {
    if (!authUser || isApplying || isMyPost) return;
    toggleApplication();
  };

  if (isAuthLoading || !authUser) return <LoadingSpinner />;

  return (
    <div>
      <div className="avatar">
        <Link to={`/profile/${postOwner.enrollNo}`}>
          <img src={postOwner.profileImg} alt="profile" />
        </Link>
      </div>
      <div>
        <div>
          <Link to={`/profile/${postOwner.enrollNo}`}>
            {postOwner.fullName}
          </Link>
          <span>
            <Link to={`/profile/${postOwner.enrollNo}`}>@{postOwner.enrollNo}</Link>
            <span> · </span>
            <span>{formattedDate}</span>
          </span>
          {isMyPost && (
            <span>
              <div onClick={handleDeletePost}>
                {isApplying ? <LoadingSpinner /> : "Delete"}
              </div>
            </span>
          )}
        </div>
        <div>
          <span>{post.text}</span>
          {post.img && <img src={post.img} alt="post" />}
        </div>
        <div>
          <button onClick={handleApplyPost} disabled={isMyPost || isApplying}>
            <div>{isApplied ? "Concile" : "Apply"}</div>
            <span>Total applications: {post.applications.length}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
