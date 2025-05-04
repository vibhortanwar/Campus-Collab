import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import profile from "../../assets/Profile.jpg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { IoCalendarOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";

const ProfilePage = () => {
  const [profileImg, setProfileImg] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const profileImgRef = useRef(null);
  const cvInputRef = useRef(null);
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
        fullName: user.fullName,
        profileImg: profileImg || undefined,
        cvFile: cvFile || undefined,
      };

      const res = await fetch(`/api/user/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: async () => {
      toast.success("Profile updated successfully");
      setProfileImg(null);
      setCvFile(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile", enrollNo] }),
      ]);
    },
    onError: (error) => toast.error(error.message),
  });

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImg(reader.result);
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
    <div className="w-full flex justify-center min-h-screen p-4">
      <div className="w-full lg:w-1/2 p-6">
        {isLoading && <ProfileHeaderSkeleton />}
        {!isLoading && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}
        {user && (
          <>
            {/* Avatar + Edit Profile + Update in one flex row */}
			<div className="flex items-center justify-between gap-4 w-full mb-2">
				<input type="file" hidden ref={profileImgRef} onChange={handleImgChange} />
				<div className="avatar relative">
					<div className="w-28 h-28 rounded-full overflow-hidden relative group/avatar">
					<img
						src={profileImg || user.profileImg || profile}
						className="w-full h-full object-cover"
					/>
					{isMyProfile && (
						<div
						className="absolute top-2 right-2 p-1 bg-[#123458] rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer"
						onClick={() => profileImgRef.current.click()}
						>
						<MdEdit className="w-4 h-4 text-white" />
						</div>
					)}
				</div>
			</div>

			{/* Edit + Update + Cancel Buttons */}
			<div className="flex items-center gap-2 ml-auto">
				{isMyProfile && <EditProfileModal />}
				
				{(profileImg || cvFile) && (
				<>
					<button
					className="bg-[#123458] text-white rounded-full px-4 py-1 text-sm hover:bg-[#0f2e4c] transition"
					onClick={handleProfileUpdate}
					>
					{isUpdatingProfile ? "Updating..." : "Update"}
					</button>
					<button
					className="bg-red-600 text-white rounded-full px-4 py-1 text-sm hover:bg-red-700 transition"
					onClick={() => {
						setProfileImg(null);
						setCvFile(null);
					}}
					>
					Cancel
					</button>
				</>
				)}
			</div>
		</div>

            {/* User Info */}
            <div className="space-y-1">
				<p className="text-[#123458] font-bold text-lg">{user.fullName}</p>
				<p className="text-sm text-slate-400">{user.enrollNo}</p>
			</div>


            {/* Rank & CV Links */}
            <div className="mt-4 space-y-1">
              {user.ipuRankLink && (
                <a
                  href={user.ipuRankLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline text-sm"
                >
                  View IPU Rank
                </a>
              )}<br/>
              {user.cvFile && (
                <a
                  href={user.cvFile}
                  download={`cv_${user.enrollNo}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline text-sm"
                >
                  View CV
                </a>
              )}
            </div>

            {/* CV Upload */}
            {isMyProfile && (
              <div className="flex items-center gap-2 mt-2">
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
                        if (reader.result.startsWith("data:application/pdf")) {
                          setCvFile(reader.result);
                        } else {
                          toast.error("Invalid file type. Only PDF allowed.");
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <button
                  className="text-sm border border-[#123458] text-[#123458] px-3 py-1 rounded-full hover:text-white hover:bg-gray-800 transition"
                  onClick={() => cvInputRef.current.click()}
                >
                  {user.cvFile ? "Edit CV" : "Add CV"}
                </button>
                {cvFile && (
                  <span className="text-xs text-green-400">✓ Ready to upload</span>
                )}
              </div>
            )}

            {/* Tabs */}
            <div className="flex w-full border-b border-gray-700 mt-6 mb-6">
              <div
                className={`flex justify-center flex-1 p-3 ${
                  feedType === "posts" ? "text-[#123458] hover:text-white" : "text-slate-500"
                } hover:bg-[#123458] transition relative cursor-pointer`}
                onClick={() => setFeedType("posts")}
              >
                Posts
                {feedType === "posts" && (
                  <div className="absolute bottom-0 w-10 h-1 rounded-full bg-[#123458]" />
                )}
              </div>
              <div
                className={`flex justify-center flex-1 p-3 ${
                  feedType === "applications" ? "text-[#123458] hover:text-white" : "text-slate-500"
                } hover:bg-[#123458] transition relative cursor-pointer`}
                onClick={() => setFeedType("applications")}
              >
                Applications
                {feedType === "applications" && (
                  <div className="absolute bottom-0 w-10 h-1 rounded-full bg-[#123458]" />
                )}
              </div>
            </div>

            {/* Feed */}
            <Posts feedType={feedType} enrollNo={enrollNo} userId={user?._id} />
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
