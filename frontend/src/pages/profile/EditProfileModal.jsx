import { useState } from "react";

const EditProfileModal = () => {
	const [formData, setFormData] = useState({
		fullName: "",
		enrollNo: "",
		email: "",
		newPassword: "",
		confirmPassword: "",
		currentPassword: "",
	});

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (formData.newPassword !== formData.confirmPassword) {
			alert("New password and confirm password do not match.");
			return;
		}
		alert("Profile updated successfully");
	};

	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>
					<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Enrollment Number'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.enrollNo}
								name='enrollNo'
								onChange={handleInputChange}
							/>
						</div>
						<input
							type='email'
							placeholder='Email'
							className='input border border-gray-700 rounded p-2 input-md'
							value={formData.email}
							name='email'
							onChange={handleInputChange}
						/>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Current Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='New Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='Confirm New Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.confirmPassword}
								name='confirmPassword'
								onChange={handleInputChange}
							/>
						</div>
						<button className='btn btn-primary rounded-full btn-sm text-white'>
							Update
						</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};

export default EditProfileModal;
