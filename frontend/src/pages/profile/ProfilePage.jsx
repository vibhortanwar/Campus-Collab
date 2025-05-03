import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import profile from "../../assets/Profile.jpg";
import { POSTS } from "../../utils/db/dummy";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Post from "../../components/common/Post";

const ProfilePage = () => {
	const [profileImg, setProfileImg] = useState(null);
	const [cvFile, setCvFile] = useState(null); // ✅ NEW
	const [feedType, setFeedType] = useState("posts");

	const profileImgRef = useRef(null);
	const cvInputRef = useRef(null); // ✅ NEW
	const { enrollNo } = useParams();

	const queryClient = useQueryClient();
	const authUser = queryClient.getQueryData(["authUser"]);
	const isMyProfile = authUser?.enrollNo === enrollNo;

	const { data: user, isLoading } = useQuery({
		queryKey: ["userProfile", enrollNo],
		queryFn: async () => {
			try {
				const res = await fetch(`/api/user/profile/${enrollNo}`);
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				toast.error(error.message);
				throw error;
			}
		},
	});

	const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
		mutationFn: async () => {
			const updatedData = {
				fullName: user.fullName, // You could allow editing too
				profileImg: profileImg || undefined,
				cvFile: cvFile || undefined,
			};
		
			const res = await fetch(`/api/user/update`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedData),
			});
		
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error || "Something went wrong");
			}
			return data;
		},
		onSuccess: async () => {
			toast.success("Profile updated successfully");
			setProfileImg(null);
			setCvFile(null); // ✅ Clear CV
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["authUser"] }),
				queryClient.invalidateQueries({ queryKey: ["userProfile", enrollNo] }),
			]);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	
	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setProfileImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleProfileUpdate = () => {
		if (!profileImg && !cvFile) {
			toast.error("Please select something to update.");
			return;
		}
		updateProfile();
	};

	return (
		<div className='flex-[4_4_0] border-r border-gray-700 min-h-screen'>
			{isLoading && <ProfileHeaderSkeleton />}
			{!isLoading && !user && <p className='text-center text-lg mt-4'>User not found</p>}

			{user && (
				<>
					<div className='flex gap-10 px-4 py-2 items-center'>
						<Link to='/'>
							<FaArrowLeft className='w-4 h-4' />
						</Link>
						<div className='flex flex-col'>
							<p className='font-bold text-lg'>{user.fullName}</p>
							<span className='text-sm text-slate-500'>{POSTS.length} posts</span>
						</div>
					</div>

					{/* USER AVATAR */}
					<div className='relative'>
						<input
							type='file'
							hidden
							ref={profileImgRef}
							onChange={handleImgChange}
						/>
						<div className='avatar absolute -bottom-16 left-4'>
							<div className='w-32 rounded-full relative group/avatar'>
								<img src={profileImg || user.profileImg || profile} />
								{isMyProfile && (
									<div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
										<MdEdit
											className='w-4 h-4 text-white'
											onClick={() => profileImgRef.current.click()}
										/>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className='flex justify-end px-4 mt-5'>
						{isMyProfile && <EditProfileModal />}
						{(profileImg || cvFile) && (
							<button
								className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
								onClick={handleProfileUpdate}
							>
								{isUpdatingProfile ? "Updating..." : "Update"}
							</button>
						)}
					</div>

					<div className='flex flex-col gap-4 mt-14 px-4'>
						<div className='flex flex-col'>
							<span className='font-bold text-lg'>{user.fullName}</span>
							<span className='text-sm text-slate-500'>{user.enrollNo}</span>
						</div>

						<div className='flex gap-2 flex-wrap'>
							<div className='flex gap-2 items-center'>
								<IoCalendarOutline className='w-4 h-4 text-slate-500' />
							</div>
						</div>

						{/* ✅ IPU Rank Link and CV Link */}
						{user.ipuRankLink && (
							<a
								href={user.ipuRankLink}
								target="_blank"
								rel="noopener noreferrer"
								className='text-blue-400 underline text-sm'
							>
								View IPU Rank
							</a>
						)}
						{user.cvFile && (
							<a
								href={user.cvFile}
								download={`cv_${user.enrollNo}.pdf`} // 👈 triggers browser download with filename
								target="_blank"
								rel="noopener noreferrer"
								className='text-blue-400 underline text-sm'
							>
								View CV
							</a>
						)}

						{/* ✅ Upload/Edit CV */}
						{isMyProfile && (
							<div className="flex items-center gap-2">
								<input
									type="file"
									hidden
									ref={cvInputRef}
									accept="application/pdf"
									onChange={(e) => {
										const file = e.target.files[0];
										if (file) {
											const reader = new FileReader();
											reader.onload = () => {
												const result = reader.result;
												if (result.startsWith("data:application/pdf")) {
													setCvFile(result);
												} else {
													toast.error("Invalid file type. Only PDF is allowed.");
												}
											};
											reader.readAsDataURL(file);
										}
									}}
								/>
								<button
									className='btn btn-outline btn-sm'
									onClick={() => cvInputRef.current.click()}
								>
									{user.cvFile ? "Edit CV" : "Add CV"}
								</button>
								{cvFile && <span className="text-xs text-green-400">✓ Ready to upload</span>}
							</div>
						)}
											</div>

					<div className='flex w-full border-b border-gray-700 mt-4'>
						<div
							className={`flex justify-center flex-1 p-3 ${feedType === "posts" ? "text-white" : "text-slate-500"} hover:bg-secondary transition duration-300 relative cursor-pointer`}
							onClick={() => setFeedType("posts")}
						>
							Posts
							{feedType === "posts" && (
								<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
							)}
						</div>
						<div
							className={`flex justify-center flex-1 p-3 ${feedType === "applications" ? "text-white" : "text-slate-500"} hover:bg-secondary transition duration-300 relative cursor-pointer`}
							onClick={() => setFeedType("applications")}
						>
							Applications
							{feedType === "applications" && (
								<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
							)}
						</div>
					</div>

					<Posts feedType={feedType} enrollNo={enrollNo} userId={user?._id} />
				</>
			)}
		</div>
	);
};

export default ProfilePage;
