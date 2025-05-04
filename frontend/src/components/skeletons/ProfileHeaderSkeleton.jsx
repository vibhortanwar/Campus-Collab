const ProfileHeaderSkeleton = () => {
	return (
		<div className="w-full flex justify-center pt-8">
			<div className="w-full max-w-2xl bg-[#161b22] border border-gray-800 rounded-xl p-6 animate-pulse">
				{/* Profile picture */}
				<div className="flex justify-start mb-12">
					<div className="h-20 w-20 rounded-full border-4 border-[#0d1117] bg-gray-700" />
				</div>

				{/* Buttons */}
				<div className="flex justify-end mb-4">
					<div className="skeleton h-6 w-20 rounded-full bg-gray-700" />
				</div>

				{/* Info fields */}
				<div className="space-y-3">
					<div className="skeleton h-4 w-24 rounded-full bg-gray-700" />
					<div className="skeleton h-4 w-32 rounded-full bg-gray-700" />
					<div className="skeleton h-4 w-1/2 rounded-full bg-gray-700" />
				</div>
			</div>
		</div>
	);
};

export default ProfileHeaderSkeleton;
