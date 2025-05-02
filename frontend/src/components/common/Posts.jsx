import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

function Posts({feedType, enrollNo ,userId}) {

	const getPostEndpoint = () => {
		switch(feedType){
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
		queryKey: ["posts"],
		queryFn: async () => {
			try {
				const res = await fetch(POST_ENDPOINT);
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}

				return data;
			} catch (error) {
				toast.error(error.message || "Something went wrong");
			}
		}
	});
	useEffect(() => {
		refetch();
	}, [feedType, refetch, enrollNo]);
	return (
		<>
			{isLoading && (
				<div>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && posts?.length === 0 && <p>No posts in this tab. Switch 👻</p>}
			{!isLoading && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
}
export default Posts;