import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import ProfileActionsModal from "./ProfileActionModel";

const EditProfileModal = () => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    fullName: "",
    enrollNo: "",
    email: "",
    newPassword: "",
    confirm: "",
    currentPassword: "",
  });

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: async (updatedData) => {
      const res = await fetch(`/api/user/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: async (_, updatedData) => {
      toast.success("Profile updated successfully");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile", updatedData.enrollNo] }),
      ]);
      document.getElementById("edit_profile_modal")?.close();
      setFormData({
        fullName: "",
        enrollNo: "",
        email: "",
        newPassword: "",
        confirm: "",
        currentPassword: "",
      });
      window.location.reload();
    },
    onError: (error) => toast.error(error.message),
  });

  const { mutate: logout, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success("Logout Successful");
      queryClient.setQueryData(["authUser"], null);
      window.location.href = "/login";
    },
    onError: (error) => toast.error(error.message),
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirm) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    updateProfile(formData);
  };

  return (
    <>
      <button
        className='btn btn-outline rounded-full btn-sm text-[#123458] hover:text-white hover:bg-[#123458]'
        onClick={() => document.getElementById("profile_actions_modal").showModal()}
      >
        Account Options
      </button>

      <ProfileActionsModal
        onEdit={() => document.getElementById("edit_profile_modal").showModal()}
        onLogout={logout}
        isLoggingOut={isPending}
      />

      <dialog id='edit_profile_modal' className='modal'>
        <div className='modal-box rounded-3xl max-w-xl w-full shadow-md'>
          <form onSubmit={handleSubmit} className='space-y-6 overflow-y-auto max-h-[80vh] p-1'>
            <div className='flex justify-between items-center mb-9'>
              <h3 className='text-xl font-semibold'>Edit Your Profile</h3>
              <button
                type='button'
                className='text-gray-500 hover:text-gray-800 text-sm'
                onClick={() => document.getElementById("edit_profile_modal").close()}
              >
                ✕
              </button>
            </div>

            <div className='grid md:grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium'>Full Name</label>
                <input
                  type='text'
                  name='fullName'
                  className='input input-bordered w-full'
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className='text-sm font-medium'>Enrollment No</label>
                <input
                  type='text'
                  name='enrollNo'
                  className='input input-bordered w-full'
                  value={formData.enrollNo}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label className='text-sm font-medium'>Email</label>
              <input
                type='email'
                name='email'
                className='input input-bordered w-full'
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className='grid md:grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium'>Current Password</label>
                <input
                  type='password'
                  name='currentPassword'
                  className='input input-bordered w-full'
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className='text-sm font-medium'>New Password</label>
                <input
                  type='password'
                  name='newPassword'
                  className='input input-bordered w-full'
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div className='md:col-span-2'>
                <label className='text-sm font-medium'>Confirm New Password</label>
                <input
                  type='text'
                  name='confirm'
                  className='input input-bordered w-full'
                  value={formData.confirm}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className='flex justify-end gap-2'>
              <button
                type='button'
                className='btn btn-ghost rounded-full'
                onClick={() => document.getElementById("edit_profile_modal").close()}
              >
                Cancel
              </button>
              <button
                type='submit'
                className='btn btn-primary rounded-full px-6 bg-transparent border border-white hover:bg-white hover:text-[#123458]'
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default EditProfileModal;
