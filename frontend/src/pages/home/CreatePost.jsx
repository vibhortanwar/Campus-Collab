import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlineImage } from "react-icons/md";
import { MdSchedule } from "react-icons/md";
import profile from "../../assets/Profile.jpg";

const MAX_CHARS = 500;

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [expiresAt, setExpiresAt] = useState("");
  const [showDeadlineInput, setShowDeadlineInput] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const imgRef = useRef(null);
  const queryClient = useQueryClient();
  const remaining = MAX_CHARS - text.length;
  const isOverLimit = remaining < 0;

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
  });

  const { mutate: createPost, isPending } = useMutation({
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
      toast.success("Post created! 🎉");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setText("");
      setImg(null);
      setExpiresAt("");
      setShowDeadlineInput(false);
      setIsFocused(false);
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
    if (isOverLimit) {
      toast.error("Post exceeds character limit.");
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
    <div className={`rounded-xl border transition-all duration-300 bg-[#0f1923] ${
      isFocused ? "border-[#2d4a6e] shadow-lg shadow-blue-900/20" : "border-[#1e2d3d]"
    }`}>
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <img
            src={authUser?.profileImg || profile}
            alt="User"
            className="w-10 h-10 rounded-full object-cover border-2 border-[#2d4a6e] flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <textarea
              placeholder="Share an opportunity, project, or update..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setIsFocused(true)}
              className="w-full bg-transparent text-slate-200 placeholder-slate-500 resize-none focus:outline-none text-[15px] leading-relaxed min-h-[80px]"
              rows={isFocused ? 4 : 2}
            />

            {/* Image preview */}
            {img && (
              <div className="relative mt-2 rounded-xl overflow-hidden border border-[#1e2d3d] animate-scale-in">
                <button
                  type="button"
                  onClick={() => {
                    setImg(null);
                    if (imgRef.current) imgRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors z-10"
                >
                  <IoCloseSharp className="w-4 h-4" />
                </button>
                <img
                  src={img}
                  alt="Preview"
                  className="w-full max-h-[280px] object-cover"
                />
              </div>
            )}

            {/* Deadline input */}
            {(showDeadlineInput || expiresAt) && (
              <div className="mt-3 animate-slide-down">
                <label className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <MdSchedule className="w-4 h-4 text-blue-400" />
                  Application Deadline
                </label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0d1117] border border-[#2d4a6e] text-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            )}
          </div>
        </div>

        {/* Action bar */}
        <div className={`flex items-center justify-between mt-3 pt-3 border-t border-[#1e2d3d] transition-all duration-300 ${isFocused ? "opacity-100" : "opacity-70"}`}>
          <div className="flex items-center gap-1">
            {/* Image button */}
            <button
              type="button"
              onClick={() => imgRef.current?.click()}
              className="p-2 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all duration-200"
              title="Add Image"
            >
              <MdOutlineImage className="w-5 h-5" />
            </button>
            <input type="file" hidden ref={imgRef} accept="image/*" onChange={handleImgChange} />

            {/* Deadline button */}
            {!showDeadlineInput && !expiresAt && (
              <button
                type="button"
                onClick={() => setShowDeadlineInput(true)}
                className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 transition-all duration-200"
                title="Add Deadline"
              >
                <MdSchedule className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Character counter */}
            {text.length > 0 && (
              <span className={`text-xs font-medium tabular-nums transition-colors ${
                isOverLimit ? "text-red-400" :
                remaining < 50 ? "text-amber-400" :
                "text-slate-500"
              }`}>
                {remaining}
              </span>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isPending || isOverLimit || (!text.trim() && !img)}
              className="px-5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold
                hover:from-blue-500 hover:to-cyan-500 transition-all duration-200
                disabled:opacity-40 disabled:cursor-not-allowed
                active:scale-95 shadow-md shadow-blue-900/30"
            >
              {isPending ? (
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Posting...
                </span>
              ) : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
