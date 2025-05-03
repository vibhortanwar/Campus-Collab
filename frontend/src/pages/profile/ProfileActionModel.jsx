import React from "react";

const ProfileActionsModal = ({ onEdit, onLogout, isLoggingOut }) => {
	return (
		<dialog id="profile_actions_modal" className="modal">
			<div className="modal-box border border-gray-700 rounded">
				<h3 className="font-bold text-lg mb-4">Choose an action</h3>

				<div className="flex flex-col gap-3">
					<button
						className="btn btn-primary rounded-full text-white"
						onClick={() => {
							document.getElementById("profile_actions_modal").close();
							onEdit(); // Open the Edit modal
						}}
					>
						Update Profile
					</button>
					<button
						className="btn bg-red-500 hover:bg-red-600 text-white rounded-full"
						disabled={isLoggingOut}
						onClick={onLogout}
					>
						{isLoggingOut ? "Logging out..." : "Logout"}
					</button>
				</div>

				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</div>
		</dialog>
	);
};

export default ProfileActionsModal;
