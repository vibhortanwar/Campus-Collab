import { Link } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { FiUsers, FiBell } from "react-icons/fi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";

const NotificationPage = () => {
  const queryClient = useQueryClient();
  const [showMenu, setShowMenu] = useState(false);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
  });

  const deleteNotifications = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/notifications", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success("All notifications cleared");
      queryClient.invalidateQueries(["notifications"]);
      setShowMenu(false);
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteOneNotification = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="flex justify-center min-h-screen pt-8 pb-20 px-4 animate-fade-in">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
              <FiBell className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Notifications</h1>
              {notifications.length > 0 && (
                <p className="text-xs text-slate-500">{notifications.length} notification{notifications.length !== 1 ? "s" : ""}</p>
              )}
            </div>
          </div>

          {/* Settings menu */}
          {notifications.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowMenu((p) => !p)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1e2d3d] transition-all duration-200"
              >
                <IoSettingsOutline className="w-5 h-5" />
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-10 z-20 w-52 bg-[#0f1923] border border-[#2d4a6e] rounded-xl shadow-2xl animate-scale-in overflow-hidden">
                    <button
                      onClick={() => deleteNotifications.mutate()}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                    >
                      <MdDelete className="w-4 h-4" />
                      Clear all notifications
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : notifications.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 gap-4 animate-slide-up">
            <div className="w-20 h-20 rounded-2xl bg-[#0f1923] border border-[#1e2d3d] flex items-center justify-center">
              <FiBell className="w-9 h-9 text-slate-600" />
            </div>
            <div className="text-center">
              <p className="text-slate-300 font-semibold text-lg">You're all caught up!</p>
              <p className="text-slate-500 text-sm mt-1">New notifications will appear here.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2 stagger">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#0f1923] border border-[#1e2d3d] hover:border-[#2d4a6e] transition-all duration-200 card-hover group animate-slide-up"
              >
                {/* Unread dot */}
                <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 animate-badge-pop" />

                {/* Profile image */}
                <img
                  src={notification.from?.profileImg || "/avatar-placeholder.png"}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#2d4a6e] flex-shrink-0"
                />

                {/* Text */}
                <div className="flex-1 min-w-0 text-sm">
                  <Link
                    to={`/profile/${notification.from?.enrollNo}`}
                    className="font-semibold text-white hover:text-blue-400 transition-colors"
                  >
                    {notification.from?.fullName}
                  </Link>
                  <span className="text-slate-400"> applied for your post</span>
                  {notification.post?.title && (
                    <span className="text-blue-400 font-medium"> "{notification.post.title}"</span>
                  )}
                  {notification.count > 1 && (
                    <span className="ml-2 inline-flex items-center gap-1 text-xs text-slate-500">
                      <FiUsers className="w-3 h-3" /> {notification.count} total
                    </span>
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteOneNotification.mutate(notification._id)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-900/20 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  title="Dismiss"
                >
                  <MdDelete className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
