import React, { useState } from 'react';

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
  const [showCreatePost, setShowCreatePost] = useState(true);

  const toggleCreatePost = () => {
    setShowCreatePost(prev => !prev);
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={toggleCreatePost}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          {showCreatePost ? "Close" : "Create Post"}
        </button>
      </div>

      {showCreatePost && <CreatePost />}
      <Posts />
    </div>
  );
};

export default HomePage;
