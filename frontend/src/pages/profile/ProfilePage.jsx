import { useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import profile from "../../assets/Profile.jpg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MdEdit } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import { FiFileText, FiAward, FiUsers, FiBookOpen } from "react-icons/fi";

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
      const res = await fetch(`/api/user/profile/${enrollNo}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
  });

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async () => {
      const updatedData = {
        fullName: user.fullName,
        profileImg: profileImg || undefined,
        cvFile: cvFile || undefined,
      };
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: async () => {
      toast.success("Profile updated!");
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

  const handleCvChange = (e) => {
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
  };

  const handleProfileUpdate = () => {
    if (!profileImg && !cvFile) {
      toast.error("Please select something to update.");
      return;
    }
    updateProfile();
  };

  const tabs = [
    { key: "posts", label: "Posts", icon: <FiBookOpen className="w-4 h-4" /> },
    { key: "applications", label: "Applications", icon: <FiUsers className="w-4 h-4" /> },
  ];

  return (
    <div className="flex justify-center min-h-screen animate-fade-in">
      <div className="w-full max-w-2xl">
        {isLoading && <ProfileHeaderSkeleton />}

        {!isLoading && !user && (
          <div className="text-center text-slate-400 py-20">
            <p className="text-lg font-semibold">User not found</p>
            <Link to="/home" className="text-blue-400 hover:underline text-sm mt-2 block">← Back to Home</Link>
          </div>
        )}

        {user && (
          <>
            {/* Cover Banner */}
            <div className="relative h-40 bg-gradient-to-br from-[#0f2847] via-[#1a3a5c] to-[#0d1117] overflow-hidden">
              {/* Abstract grid pattern */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #2d4a6e 1px, transparent 0)`,
                backgroundSize: "32px 32px"
              }} />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0d1117] to-transparent" />
            </div>

            {/* Avatar + Actions Row */}
            <div className="px-6 -mt-14 flex items-end justify-between mb-4">
              <div className="relative group">
                <input type="file" hidden ref={profileImgRef} onChange={handleImgChange} />
                <img
                  src={profileImg || user.profileImg || profile}
                  alt={user.fullName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#0d1117] shadow-xl transition-all duration-200 group-hover:border-blue-500/60"
                />
                {isMyProfile && (
                  <button
                    onClick={() => profileImgRef.current?.click()}
                    className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <MdEdit className="w-6 h-6 text-white" />
                  </button>
                )}
              </div>

              {/* Edit / Update / Cancel */}
              <div className="flex items-center gap-2 pb-1">
                {isMyProfile && <EditProfileModal />}

                {(profileImg || cvFile) && (
                  <>
                    <button
                      onClick={handleProfileUpdate}
                      disabled={isUpdatingProfile}
                      className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold hover:from-blue-500 hover:to-cyan-400 transition-all duration-200 disabled:opacity-50"
                    >
                      {isUpdatingProfile ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => { setProfileImg(null); setCvFile(null); }}
                      className="px-4 py-1.5 rounded-full border border-slate-600 text-slate-300 text-sm hover:bg-slate-700 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="px-6 mb-5">
              <h1 className="text-2xl font-bold text-white">{user.fullName}</h1>
              <p className="text-slate-400 text-sm mt-0.5">@{user.enrollNo}</p>

              {/* Links row */}
              <div className="flex flex-wrap items-center gap-4 mt-3">
                {user.ipuRankLink && (
                  <a
                    href={user.ipuRankLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <FiAward className="w-3.5 h-3.5" />
                    IPU Rank
                  </a>
                )}
                {user.cvFile && (
                  <a
                    href={user.cvFile}
                    download={`cv_${user.enrollNo}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <FiFileText className="w-3.5 h-3.5" />
                    View CV
                  </a>
                )}
                {isMyProfile && (
                  <>
                    <input type="file" hidden ref={cvInputRef} accept="application/pdf" onChange={handleCvChange} />
                    <button
                      onClick={() => cvInputRef.current?.click()}
                      className="flex items-center gap-1.5 text-sm border border-[#2d4a6e] text-slate-400 px-3 py-1 rounded-full hover:text-white hover:border-blue-500 transition-all duration-200"
                    >
                      <FiFileText className="w-3.5 h-3.5" />
                      {user.cvFile ? "Update CV" : "Add CV"}
                    </button>
                    {cvFile && <span className="text-xs text-green-400">✓ Ready to upload</span>}
                  </>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#1e2d3d]" />

            {/* Tabs */}
            <div className="flex border-b border-[#1e2d3d] px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFeedType(tab.key)}
                  className={`flex items-center gap-2 px-4 py-4 text-sm font-medium transition-all duration-200 border-b-2 -mb-px
                    ${feedType === tab.key
                      ? "border-blue-500 text-white"
                      : "border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-600"
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Feed */}
            <div className="px-6 pt-4">
              <Posts feedType={feedType} enrollNo={enrollNo} userId={user?._id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
