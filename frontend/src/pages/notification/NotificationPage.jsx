import { Link } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const NotificationPage = () => {
	const isLoading = false;

	const notifications = [
		{
			_id: "1",
			from: {
				_id: "user123",
				fullName: "John Doe",
				profileImg: "/avatars/boy1.png",
			},
			type: "applied",
			post: {
				_id: "post123",
				title: "React Developer Internship",
			},
			count: 3,
		},
		{
			_id: "2",
			from: {
				_id: "user456",
				fullName: "Jane Doe",
				profileImg: "/avatars/girl1.png",
			},
			type: "applied",
			post: {
				_id: "post456",
				title: "Frontend Mentor Challenge",
			},
			count: 1,
		},
	];

	const deleteNotifications = () => {
		alert("All notifications deleted");
	};

	return (
		<div>
			<div className='flex justify-between p-4 items-center'>
				<p className='text-lg font-bold'>Notifications</p>
				<div className='dropdown'>
					<div tabIndex={0} role='button'>
						<IoSettingsOutline className='w-5 h-5' />
					</div>
					<ul
						tabIndex={0}
						className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
					>
						<li>
							<a onClick={deleteNotifications}>Delete all notifications</a>
						</li>
					</ul>
				</div>
			</div>

			{isLoading ? (
				<div className='flex justify-center h-full items-center'>
					<LoadingSpinner size='lg' />
				</div>
			) : notifications.length === 0 ? (
				<div className='text-center p-4 font-bold'>No notifications 🤔</div>
			) : (
				notifications.map((notification) => (
					<div className='border-b border-gray-700' key={notification._id}>
						<div className='flex items-center gap-3 p-4'>
							<FaCheckCircle className='w-6 h-6 text-green-500' />

							<Link to={`/profile/${notification.from._id}`}>
								<div className='avatar'>
									<div className='w-9 rounded-full'>
										<img src={notification.from.profileImg || "/avatar-placeholder.png"} />
									</div>
								</div>
							</Link>

							<div className='text-sm'>
								<Link className='font-bold' to={`/profile/${notification.from._id}`}>
									{notification.from.fullName}
								</Link>{" "}
								applied for your post{" "}
								<Link className='font-medium text-blue-400' to={`/post/${notification.post._id}`}>
									{notification.post.title}
								</Link>{" "}
								({notification.count})
							</div>
						</div>
					</div>
				))
			)}
		</div>
	);
};

export default NotificationPage;
