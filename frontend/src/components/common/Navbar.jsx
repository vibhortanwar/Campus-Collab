import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { data: authUser } = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			const res = await fetch("/api/auth/me");
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
	});

	const { mutate: logout, isPending } = useMutation({
		mutationFn: async () => {
			const res = await fetch("/api/auth/logout", {
				method: "POST",
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
		onSuccess: () => {
			toast.success("Logout Successful");
			queryClient.setQueryData(["authUser"], null); // Clear cached user
			navigate("/login");
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<div className="flex justify-between items-center p-4 border-b border-gray-700 bg-black text-white">
			<div className="flex gap-6 items-center">
				<Link to="/" className="hover:underline">Home</Link>
				<Link to="/notifications" className="hover:underline">Notifications</Link>
			</div>

			{authUser && (
				<div className="flex items-center gap-4">
					<Link to={`/profile/${authUser.enrollNo}`}>
						<img
							src={authUser.profileImg || "/avatar-placeholder.png"}
							className="h-8 w-8 rounded-full object-cover"
							alt="Profile"
						/>
					</Link>
					<div className="text-sm leading-tight">
						<p className="font-semibold">{authUser.fullName}</p>
						<p className="text-gray-400">{authUser.enrollNo}</p>
					</div>
					<button
						className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
						disabled={isPending}
						onClick={logout}
					>
						{isPending ? "Logging out..." : "Logout"}
					</button>
				</div>
			)}
		</div>
	);
};

export default Navbar;
