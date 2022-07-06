import { Routes, Route } from "react-router-dom";
import LoggedInRoutes from "./routes/LoggedInRoutes";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";
import Activate from "./pages/Home/activate";
import Reset from "./pages/Reset";
import CreatePostPopup from "./components/CreatePostPopup";
import { useSelector } from "react-redux";
import { useState } from "react";

function App() {
  const [createPostVisible, setCreatePostVisible] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  return (
    <div>
      {createPostVisible && <CreatePostPopup user={user} setCreatePostVisible={setCreatePostVisible} />}

      <Routes>
        <Route element={<LoggedInRoutes />}>
          <Route path="/profile" element={<Profile />} exact />
          <Route
            path="/"
            element={<Home setCreatePostVisible={setCreatePostVisible} />}
            exact
          />
          <Route path="/activate/:token" element={<Activate />} exact />
        </Route>
        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} exact />
        </Route>
        <Route path="/reset" element={<Reset />} />
      </Routes>
    </div>
  );
}

export default App;
