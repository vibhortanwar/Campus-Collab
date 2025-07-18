import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType, enrollNo, userId }) => {
<<<<<<< HEAD
  const getPostEndpoint = () => {
    switch (feedType) {
      case "posts":
        return `/api/posts/user/${enrollNo}`;
      case "applications":
        return `/api/posts/applied/${userId}`;
      default:
        return "/api/posts/all";
    }
=======
	const getPostEndpoint = () => {
	  switch (feedType) {
		case "posts":
		  return `/api/posts/user/${enrollNo}`;
		case "applications":
		  return `/api/posts/applied/${userId}`;
		default:
		  return "/api/posts/all";
	  }
	};
  
	const POST_ENDPOINT = getPostEndpoint();
  
	const { data: posts, isLoading, refetch } = useQuery({
	  queryKey: ["posts", feedType, enrollNo, userId],
	  queryFn: async () => {
		const res = await fetch(POST_ENDPOINT);
		const data = await res.json();
		if (!res.ok) throw new Error(data.error || "Failed to fetch posts");
		return data;
	  },
	});
  
	useEffect(() => {
	  refetch();
	}, [feedType, enrollNo, userId]);
  
	return (
	  <div className="">
		{isLoading && (
		  <>
			<PostSkeleton />
			<PostSkeleton />
			<PostSkeleton />
		  </>
		)}
		{!isLoading && posts?.length === 0 && <p>No posts in this tab. Switch 👻</p>}
		{!isLoading && posts && posts.map((post) => (
		  <Post key={post._id} post={post} />
		))}
	  </div>
	);
>>>>>>> parent of 6b04c9d (Fiexed the footer)
  };

  const POST_ENDPOINT = getPostEndpoint();

  const {
    data: posts,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["posts", feedType, enrollNo, userId],
    queryFn: async () => {
      const res = await fetch(POST_ENDPOINT);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch posts");
      return data;
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, enrollNo, userId]);

  return (
    <div className="text-gray-900">
      {isLoading && (
        <>
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </>
      )}
      {!isLoading && posts?.length === 0 && (
        <p>No posts in this tab. Switch 👻</p>
      )}
      {!isLoading &&
        posts &&
        posts.map((post) => <Post key={post._id} post={post} />)}
    </div>
  );
};

export default Posts;
