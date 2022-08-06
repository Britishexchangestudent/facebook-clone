import axios from "axios";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { profileReducer } from "../../functions/reducers";
import Header from "../../components/Header/index";
import "./styles.css";
import Cover from "./Cover";
import ProfilePictureInfo from "./ProfilePictureInfo";
import ProfileMenu from "./ProfileMenu";
import PplYouMayKnow from "./PplYouMayKnow";
import CreatePost from "../../components/CreatePost/index";
import Post from "../../components/Post/index";
import GridPosts from "./GridPosts";
import Photos from "./Photos";
import Friends from "./Friends";
import Intro from "../../components/Intro";
import { useMediaQuery } from "react-responsive";
import useClickOutside from "../../helpers/clickOutside";
import CreatePostPopup from "../../components/CreatePostPopup";

function Profile({ getAllPosts }) {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState({});

  const [createPostVisible, setCreatePostVisible] = useState(false);

  const { username } = useParams();

  const { user } = useSelector((state) => ({ ...state }));

  let userName = username === undefined ? user.username : username;

  const [{ loading, error, profile }, dispatch] = useReducer(profileReducer, {
    loading: false,
    error: "",
    profile: {},
  });

  const path = `${userName}/*`;
  const max = 30;
  const sort = "desc";

  const getProfile = async () => {
    try {
      dispatch({
        type: "PROFILE_REQUEST",
      });

      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getProfile/${userName}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      if (data.ok === false) {
        navigate("/profile");
      } else {
        try {
          const images = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/listImages`,
            { path, sort, max },
            {
              headers: { Authorization: `Bearer ${user?.token}` },
            }
          );
          setPhotos(images.data);
        } catch (error) {
          console.log(`error`, error);
        }
        dispatch({
          type: "PROFILE_SUCCESS",
          payload: data,
        });
      }
    } catch (error) {
      dispatch({
        type: "PROFILE_ERROR",
        payload: error.response.data.message,
      });
    }
  };

  useEffect(() => {
    getProfile();
  }, [userName]);

  var visitor = userName === user.username ? false : true;

  const [othername, setOthername] = useState();

  useEffect(() => {
    setOthername(profile?.details?.otherName);
  }, [profile]);

  const profileTop = useRef(null);
  const [height, setHeight] = useState();
  const leftSide = useRef(null);
  const [leftHeight, setLeftHeight] = useState();
  const [scrollHeight, setScrollHeight] = useState();
  useEffect(() => {
    setHeight(profileTop.current.clientHeight + 300);
    setLeftHeight(leftSide.current.clientHeight);
    window.addEventListener("scroll", getScroll, { passive: true });
    return () => {
      window.addEventListener("scroll", getScroll, { passive: true });
    };
  }, [loading, scrollHeight]);

  const check = useMediaQuery({
    query: "(min-width: 901px)",
  });

  const getScroll = () => {
    setScrollHeight(window.pageYOffset);
  };

  return (
    <div className="profile">
      {createPostVisible && (
        <CreatePostPopup
          user={user}
          setCreatePostVisible={setCreatePostVisible}
          post={profile?.posts}
          dispatch={dispatch}
          profile
        />
      )}

      <Header page="profile" getAllPosts={getAllPosts}/>

      <div className="profile_top" ref={profileTop}>
        <div className="profile_container">
          <Cover
            cover={profile?.cover}
            visitor={visitor}
            photos={photos.resources}
          />
          <ProfilePictureInfo
            profile={profile}
            visitor={visitor}
            photos={photos.resources}
            othername={othername}
          />
          <ProfileMenu />
        </div>
      </div>

      <div className="profile_bottom">
        <div className="profile_container">
          <div className="bottom_container">
            <PplYouMayKnow />
            <div
              className={`profile_grid ${
                check && scrollHeight >= height && leftHeight > 1000
                  ? "scrollFixed showLess"
                  : check &&
                    scrollHeight >= height &&
                    leftHeight < 1000 &&
                    "scrollFixed showMore"
              }`}
            >
              <div className="profile_left" ref={leftSide}>
                <Intro
                  detailss={profile.details}
                  visitor={visitor}
                  setOthername={setOthername}
                />
                <Photos username={userName} photos={photos} />
                <Friends friends={profile.friends} />
                <div className={`fb_copyright ${"relative_fb_copyright"}`}>
                  <Link to="/">Privacy </Link>
                  <span>. </span>
                  <Link to="/">Terms </Link>
                  <span>. </span>
                  <Link to="/">Advertising </Link>
                  <span>. </span>
                  <Link to="/">Ad Choices </Link>
                  <span>. </span>
                  <Link to="/">Cookies </Link>
                  <span>. </span>
                  <Link to="/">More </Link>
                  <span>. </span>
                </div>
              </div>

              <div className="profile_right">
                {!visitor && (
                  <CreatePost
                    user={user}
                    profile
                    setCreatePostVisible={setCreatePostVisible}
                  />
                )}
                <GridPosts />
                <div className="posts">
                  {profile.posts && profile.posts.length ? (
                    profile?.posts.map((post) => (
                      <Post post={post} user={user} key={post._id} profile />
                    ))
                  ) : (
                    <div className="no_posts">
                      {profile?.first_name} hasn't uploaded any posts yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
