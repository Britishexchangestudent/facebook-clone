import React from "react";
import { useSelector } from "react-redux";
import CreatePost from "../../components/CreatePost";
import Header from "../../components/Header";
import LeftHome from "../../components/Home/Left";
import RightHome from "../../components/Home/Right";
import SendVerification from "../../components/Home/SendVerification";
import Stories from "../../components/Home/Stories";

import "./styles.css";

function Home({setCreatePostVisible}) {
  const { user } = useSelector((state) => ({ ...state }));
  return (
    <div className="home">
      <Header />
      <LeftHome user={user} />
      <div className="home_middle">
        <Stories />
        {user.verified === false && <SendVerification user={user} />}
        <CreatePost user={user} setCreatePostVisible={setCreatePostVisible} />
      </div>
      <RightHome />
    </div>
  );
}

export default Home;
