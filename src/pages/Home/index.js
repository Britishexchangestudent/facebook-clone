import React from "react";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import LeftHome from "../../components/Home/Left";
import RightHome from "../../components/Home/Right";

function Home() {
  const { user } = useSelector((user) => ({ ...user}))
  return (
    <div>
      <Header />
      <LeftHome user={user} />
      <RightHome  />
    </div>
  );
}

export default Home;
