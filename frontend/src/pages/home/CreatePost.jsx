import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
  });

  const queryClient = useQueryClient();

  const { mutate: createPost, isPending, isError } = useMutation({
    mutationFn: async ({ text, img }) => {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, img }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      // ✅ Reset form
      setText("");
      setImg(null);
      if (imgRef.current) imgRef.current.value = "";
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() && !img) {
      toast.error("Cannot create an empty post.");
      return;
    }
    createPost({ text, img });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div>
        <div>
          {authUser?.profileImg && (
            <img src={authUser.profileImg} alt="User" />
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder='What is happening?!'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {img && (
          <div>
            <div
              onClick={() => {
                setImg(null);
                if (imgRef.current) imgRef.current.value = "";
              }}
              style={{ cursor: "pointer", color: "red" }}
            >
              IoCloseSharp
            </div>
            <img src={img} alt="Preview" />
          </div>
        )}

        <div>
          <div>
            <img
              src='asdf' // Replace with your icon/image URL
              alt="Add"
              onClick={() => imgRef.current && imgRef.current.click()}
              style={{ cursor: "pointer" }}
            />
          </div>

          <input
            type='file'
            hidden
            ref={imgRef}
            accept="image/*"
            onChange={handleImgChange}
          />

          <button type="submit" disabled={isPending}>
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>

        {isError && <div style={{ color: "red" }}>Something went wrong</div>}
      </form>
    </div>
  );
};

export default CreatePost;