import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
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

function Profile({ setCreatePostVisible }) {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState({});

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

  console.log(`photos`, photos);

  useEffect(() => {
    getProfile();
  }, [userName]);

  var visitor = userName === user.username ? false : true;

  const [othername, setOthername] = useState();

  useEffect(() => {
    setOthername(profile?.details?.otherName);
  }, [profile]);

  return (
    <div className="profile">
      <Header page="profile" />

      <div className="profile_top">
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
            <div className="profile_grid">
              <div className="profile_left">
                <Intro detailss={profile.details} visitor={visitor} setOthername={setOthername} />
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
