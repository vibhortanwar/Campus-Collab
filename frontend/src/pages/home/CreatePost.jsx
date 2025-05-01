import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import React, { useRef, useState } from 'react'
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

  const {mutate:createPost, isPending, isError} = useMutation({
    mutationFn: async ({text,img}) => {
      try{
        const res = await fetch("/api/posts/create",{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({text,img}),
        });
        const data = await res.json();
        if(!res.ok){
          throw new Error(data.error || "Something went wrong")
        }
        return data
      }catch(error){
        toast.success("Post created successfully");
        queryClient.invalidateQueries({queryKey: ['posts']});
      }
    }
  })


  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({text, img})
    alert("Post created successfully");
  }

  const handleImgChange = (e) => {
    const file = e.target.files[0]; // ✅ fixed here
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
        <div><img src = {authUser.profileImg}/></div>
      </div>
      <form onSubmit={handleSubmit}>
        <textarea placeholder='What is happening?!'
          value={text}
          onChange={(e)=>setText(e.target.value)}
        />
        {img && (<div>
          <div onClick={()=> {
            setImg(null);
            imgRef.current.value = null;
          }}>IoCloseSharp</div>
          <img src={img} />
        </div>)}
        <div>
          <div>
            <img src='asdf' onClick={() => imgRef.current.click()}/> 
          </div>
          <input type = 'file' hidden ref = {imgRef} onChange={handleImgChange} />
            <button>
              {isPending ? "Posting...": "Post"}
            </button>
        </div>
        {isError && <div>Something went Wrong</div>}
      </form>
    </div>
  )
}

export default CreatePost