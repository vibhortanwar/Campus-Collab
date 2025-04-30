import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";

import { POSTS } from "../../utils/db/dummy";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const ProfilePage = () => {
	const [profileImg, setProfileImg] = useState(null);
	const [feedType, setFeedType] = useState("posts");

	const profileImgRef = useRef(null);
	const isLoading = false;
	const isMyProfile = false;

	const user = {
		_id: "1",
		fullName: "John Doe",
		erollNo: "01319051923",
		profileImg: "https://cdn-icons-png.flaticon.com/512/6522/6522516.png",
		bio: "Aspiring web developer 🚀",
		link: "https://youtube.com/@asaprogrammer_"
	};

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

	return (
		<>
			<div className='flex-[4_4_0] border-r border-gray-700 min-h-screen'>
				{isLoading && <ProfileHeaderSkeleton />}
				{!isLoading && !user && <p className='text-center text-lg mt-4'>User not found</p>}

				<div className='flex flex-col'>
					{!isLoading && user && (
						<>
							<div className='flex gap-10 px-4 py-2 items-center'>
								<Link to='/'>
									<FaArrowLeft className='w-4 h-4' />
								</Link>
								<div className='flex flex-col'>
									<p className='font-bold text-lg'>{user?.fullName}</p>
									<span className='text-sm text-slate-500'>{POSTS?.length} posts</span>
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
										<img src={profileImg || user?.profileImg || "/avatar-placeholder.png"} />
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
								{profileImg && (
									<button
										className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
										onClick={() => alert("Profile updated successfully")}
									>
										Update
									</button>
								)}
							</div>

							<div className='flex flex-col gap-4 mt-14 px-4'>
								<div className='flex flex-col'>
									<span className='font-bold text-lg'>{user?.fullName}</span>
									<span className='text-sm text-slate-500'>{user?.erollNo}</span>
									<span className='text-sm my-1'>{user?.bio}</span>
								</div>

								<div className='flex gap-2 flex-wrap'>
									{user?.link && (
										<div className='flex gap-1 items-center'>
											<FaLink className='w-3 h-3 text-slate-500' />
											<a
												href={user.link}
												target='_blank'
												rel='noreferrer'
												className='text-sm text-blue-500 hover:underline'
											>
												{user.link.replace("https://", "")}
											</a>
										</div>
									)}
									<div className='flex gap-2 items-center'>
										<IoCalendarOutline className='w-4 h-4 text-slate-500' />
										<span className='text-sm text-slate-500'>Joined July 2021</span>
									</div>
								</div>
							</div>

							<div className='flex w-full border-b border-gray-700 mt-4'>
								<div
									className={`flex justify-center flex-1 p-3 ${
										feedType === "posts" ? "text-white" : "text-slate-500"
									} hover:bg-secondary transition duration-300 relative cursor-pointer`}
									onClick={() => setFeedType("posts")}
								>
									Posts
									{feedType === "posts" && (
										<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
									)}
								</div>
								<div
									className={`flex justify-center flex-1 p-3 ${
										feedType === "applications" ? "text-white" : "text-slate-500"
									} hover:bg-secondary transition duration-300 relative cursor-pointer`}
									onClick={() => setFeedType("applications")}
								>
									Applications
									{feedType === "applications" && (
										<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
									)}
								</div>
							</div>
						</>
					)}

					{/* Render posts or applications based on tab */}
					{feedType === "posts" && <Posts />}
					{feedType === "applications" && <div className='p-4 text-center text-slate-400'>No applications yet.</div>}
				</div>
			</div>
		</>
	);
};

export default ProfilePage;
