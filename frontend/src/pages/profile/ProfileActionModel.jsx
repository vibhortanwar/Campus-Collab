import React from "react";

const ProfileActionsModal = ({ onEdit, onLogout, isLoggingOut }) => {
  return (
    <dialog id="profile_actions_modal" className="modal">
      <div className="modal-box border border-gray-700 rounded-3xl pb-2">
        <h3 className="font-bold text-lg mb-4">Choose an action</h3>

        <div className="flex flex-col gap-3">
          <button
            className="btn btn-primary rounded-full text-white border border-white bg-transparent hover:text-[#123458] hover:bg-white"
            onClick={() => {
              document.getElementById("profile_actions_modal").close();
              onEdit(); // Open the Edit modal
            }}
          >
            Update Profile
          </button>
          <button
            className="btn text-red-600 hover:text-white border border-red-600 hover:bg-red-600 rounded-full"
            disabled={isLoggingOut}
            onClick={onLogout}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        <div className="flex justify-end mt-2">
          <form method="dialog">
            <button className="btn btn-ghost rounded-full text-sm px-3 py-1.5">
              Cancel
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ProfileActionsModal;
