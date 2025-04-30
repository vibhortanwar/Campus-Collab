import React, { useRef, useState } from 'react'

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const imgRef = useRef(null);

  const isPending = false;
  const isError = false;

  const data = {
    profileImg: "https://cdn-icons-png.flaticon.com/512/6522/6522516.png"
  }

  const handleSubmit = (e) => {
    e.preventDefault();
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
        <div><img src = {data.profileImg}/></div>
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