import React from "react";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import LeftHome from "../../components/Home/Left";
import RightHome from "../../components/Home/Right";
import Stories from "../../components/Home/Stories";

import './styles.css'

function Home() {
  const { user } = useSelector((user) => ({ ...user }));
  return (
    <div className="home">
      <Header />
      <LeftHome user={user} />
      <div className="home_middle">
        <Stories />
      </div>
      <RightHome />
    </div>
  );
}

export default Home;
