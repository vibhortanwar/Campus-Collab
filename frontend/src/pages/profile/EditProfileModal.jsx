import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";

const EditProfileModal = () => {
	const queryClient = useQueryClient();

	const [formData, setFormData] = useState({
		fullName: "",
		enrollNo: "",
		email: "",
		newPassword: "",
		confirmPassword: "",
		currentPassword: "",
	});

	const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
		mutationFn: async (updatedData) => {
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
		onSuccess: async (_, updatedData) => {
			toast.success("Profile updated successfully");

			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["authUser"] }),
				queryClient.invalidateQueries({ queryKey: ["userProfile", updatedData.enrollNo] }),
			]);

			document.getElementById("edit_profile_modal").close();

			setFormData({
				fullName: "",
				enrollNo: "",
				email: "",
				newPassword: "",
				confirmPassword: "",
				currentPassword: "",
			});

			// ✅ Force page reload to reflect updated profile
			window.location.reload();
		},
		onError: (error) => {
			toast.error(error.message);
		},
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
		updateProfile(formData);
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
						<button
							className='btn btn-primary rounded-full btn-sm text-white'
							disabled={isUpdatingProfile}
						>
							{isUpdatingProfile ? "Updating..." : "Update"}
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
