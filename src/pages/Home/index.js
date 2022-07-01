import React, { useRef, useState } from "react";
import Header from "../../components/Header";
import useClickOutside from "../../helpers/clickOutside";

function Home() {
  const [visible, setVisible] = useState(true);
  const el = useRef(null);
  useClickOutside(el, () => {
    setVisible(false);
  });
  return (
    <div>
      <Header />
    </div>
  );
}

export default Home;
