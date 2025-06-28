import { Link } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const NotificationPage = () => {
	const queryClient = useQueryClient();

	const { data: notifications = [], isLoading, isError } = useQuery({
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
			const res = await fetch("/api/notifications", {
				method: "DELETE",
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
		onSuccess: () => {
			toast.success("Notifications deleted successfully");
			queryClient.invalidateQueries(["notifications"]);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const deleteOneNotification = useMutation({
		mutationFn: async (id) => {
			const res = await fetch(`/api/notifications/${id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Something went wrong");
			return data;
		},
		onSuccess: () => {
			toast.success("Notification deleted");
			queryClient.invalidateQueries(["notifications"]);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<div className='w-1/2 mx-auto p-4'>
			<div className='flex justify-between items-center'>
				<p className='text-lg font-bold text-gray-800'>Notifications</p>
				<div className='dropdown'>
					<div tabIndex={0} role='button'>
						<IoSettingsOutline className='w-5 h-5' />
					</div>
					<ul className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'>
						<li>
							<button onClick={() => deleteNotifications.mutate()}>
								Delete all notifications
							</button>
						</li>
					</ul>
				</div>
			</div>

			{isLoading ? (
				<div className='flex justify-center items-center'>
					<LoadingSpinner size='lg' />
				</div>
			) : notifications.length === 0 ? (
				<div className='text-center p-4 font-bold text-gray-500'>
					No notifications 🤔
				</div>
			) : (
				notifications.map((notification) => (
					<div className='border-b border-gray-300' key={notification._id}>
						<div className='flex items-center gap-3 p-4'>
							<FaCheckCircle className='w-5 h-5 text-green-500' />

							{/* Profile Image - Circular with no background */}
							<div className='shrink-0'>
								<img
									src={notification.from.profileImg || "/avatar-placeholder.png"}
									alt='profile'
									className='w-9 h-9 rounded-full object-cover'
								/>
							</div>

							<div className='text-sm flex-1 text-gray-800'>
								<div className='font-bold text-blue-600'>
									{notification.from.fullName}
								</div>{" "}
								applied for your post{" "}
								<div
									className='font-medium text-blue-400'
								>
									{notification.post.title}
								</div>{" "}
								<span className='text-sm text-gray-600'>({notification.count})</span>
							</div>

							<button
								onClick={() => deleteOneNotification.mutate(notification._id)}
								className='text-red-500 hover:text-red-700'
							>
								<MdDelete className='w-5 h-5' />
							</button>
						</div>
					</div>
				))
			)}
		</div>
	);
};

export default NotificationPage;
