import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlineImage } from "react-icons/md";
import profile from "../../assets/Profile.jpg";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [expiresAt, setExpiresAt] = useState("");
  const [showDeadlineInput, setShowDeadlineInput] = useState(false);

  const imgRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
  });

  const { mutate: createPost, isPending, isError } = useMutation({
    mutationFn: async ({ text, img, expiresAt }) => {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, img, expiresAt }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    onSuccess: () => {
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setText("");
      setImg(null);
      setExpiresAt("");
      setShowDeadlineInput(false);
      if (imgRef.current) imgRef.current.value = "";
    },
    onError: (error) => toast.error(error.message || "Something went wrong"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() && !img) {
      toast.error("Cannot create an empty post.");
      return;
    }
    createPost({ text, img, expiresAt });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 rounded-lg shadow-lg max-w-xl mx-auto text-[#123458] border border-[#123458]">
      <div className="flex items-center mb-4">
          <img
            src={authUser.profileImg || profile}
            alt="User"
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
        <span className="font-medium">{authUser?.fullName || "User"}</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          placeholder='What is happening?!'
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="p-3 rounded-md border border-gray-700 focus:outline-none resize-none"
          rows={4}
        />

        {img && (
          <div className="relative w-full max-w-sm">
            <button
              type="button"
              onClick={() => {
                setImg(null);
                if (imgRef.current) imgRef.current.value = "";
              }}
              className="absolute top-1 right-1 bg-black bg-opacity-60 rounded-full p-1 hover:bg-opacity-80"
            >
              <IoCloseSharp className="text-[#123458] w-5 h-5" />
            </button>
            <img
              src={img}
              alt="Preview"
              className="rounded-md w-full border border-gray-700"
            />
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => imgRef.current && imgRef.current.click()}
              className="flex items-center gap-1 text-sm text-[#123458] hover:underline"
            >
              <MdOutlineImage className="w-5 h-5" />
              Add Image
            </button>
            <input
              type='file'
              hidden
              ref={imgRef}
              accept="image/*"
              onChange={handleImgChange}
            />
          </div>

          {!showDeadlineInput && !expiresAt && (
            <button
              type="button"
              onClick={() => setShowDeadlineInput(true)}
              className="text-sm text-gray-400 hover:text-[#123458]"
            >
              Add Deadline
            </button>
          )}
        </div>

        {showDeadlineInput || expiresAt ? (
          <label className="flex flex-col gap-1 text-sm text-[#123458]">
            Deadline:
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="p-2 rounded border border-gray-700 text-[#123458]"
            />
          </label>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="btn text-[#123458] bg-white border-none hover:bg-[#123458] hover:text-white transition-colors duration-200 rounded-full px-6 py-2 mt-2"
        >
          {isPending ? "Posting..." : "Post"}
        </button>

        {isError && <div className="text-red-400 text-sm">Something went wrong.</div>}
      </form>
    </div>
  );
};

export default CreatePost;
