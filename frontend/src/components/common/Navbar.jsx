import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import profile from "../../assets/Profile.jpg"

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
							src={authUser.profileImg || profile}
							className="h-8 w-8 rounded-full object-cover"
							alt="Profile"
						/>
					</Link>
					<div className="text-sm leading-tight">
						<p className="font-semibold">{authUser.fullName}</p>
						<p className="text-gray-400">{authUser.enrollNo}</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default Navbar;
