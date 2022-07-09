import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CreatePost from "../../components/CreatePost";
import Header from "../../components/Header";
import LeftHome from "../../components/Home/Left";
import RightHome from "../../components/Home/Right";
import SendVerification from "../../components/Home/SendVerification";
import Stories from "../../components/Home/Stories";
import Post from "../../components/Post";

import "./styles.css";

function Home({ setCreatePostVisible, posts }) {
  const { user } = useSelector((state) => ({ ...state }));

  const middle = useRef();

  const [height, setHeight] = useState();

  useEffect(() => {
    setHeight(middle.current.clientHeight);
  }, []);

  return (
    <div className="home" style={{ height: `${height + 150}px` }}>
      <Header page="home" />
      <LeftHome user={user} />
      <div className="home_middle" ref={middle}>
        <Stories />
        {user.verified === false && <SendVerification user={user} />}
        <CreatePost user={user} setCreatePostVisible={setCreatePostVisible} />
        <div className="posts">
          {posts.map((post, i) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      </div>
      <RightHome />
    </div>
  );
}

export default Home;
