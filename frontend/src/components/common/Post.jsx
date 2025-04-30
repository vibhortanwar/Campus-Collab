import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {Link} from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const Post = ({post}) => {
  const {data:authUser} = useQuery({queryKey: ['authUser']});
  const queryClient = useQueryClient();
  const {mutate:deletePost, isPending} = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/${post._id}`,{
          method:"DELETE",
        })
        const data = await res.json();

        if(!res.ok){
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      }catch(error){
        toast.error(error.message || "Something went wrong");
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfullhy");
      queryClient.invalidateQueries({queryKey: ["posts"]})
    }
  })
  const postOwner = post.user;
  const isApplied = false;
  const isMyPost = authUser._id === post.user._id;
  const formattedDate = "1h";
  const handleDeletePost = () => {
    deletePost();
  };

  const handleApplyPost = () => {};

  return (
    <div>
      <div className='avatar'>
        <Link to={`/profile/${postOwner.enrollNo}`}>
          <img src={postOwner.profileImg}/>
        </Link>
      </div>
      <div>
        <div>
          <Link to={`/profile/${postOwner.enrollNo}`}>
            {postOwner.fullName}
          </Link>
          <span>
            <Link to={`profile/${postOwner.enrollNo}`}>@{postOwner.enrollNo}</Link>
            <span>.</span>
            <span>{formattedDate}</span>
          </span>
          {isMyPost && (
            <span>
              <div onClick={handleDeletePost}>
                {isPending ? <LoadingSpinner/>: "Delete"}
              </div>
            </span>
          )}
        </div>
        <div>
          <spam>{post.text}</spam>
          {post.img && (
            <img src={post.img} alt=''/>
          )}
        </div>
        <div>
          <div>
            <div>
              <div onClick={handleApplyPost}>
                {!isApplied && (<div>Apply</div>)}
                {isApplied && (<div>concile</div>)}
                <span>
                  {post.applications.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post