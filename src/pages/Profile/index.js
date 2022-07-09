import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { profileReducer } from "../../functions/reducers";
import Header from "../../components/Header/index";
import "./styles.css";
import Cover from "./Cover";
import ProfilePictureInfo from "./ProfilePictureInfo";
import ProfileMenu from "./ProfileMenu";

function Profile() {
  const navigate = useNavigate();

  

  const { username } = useParams();

  const { user } = useSelector((state) => ({ ...state }));

  let userName = username === undefined ? user.username : username;

  const [{ loading, error, profile }, dispatch] = useReducer(profileReducer, {
    loading: false,
    error: "",
    profile: {},
  });

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

  console.log(`profile`, profile);

  return (
    <div>
      <Header page="profile" />

      <div className="profile_top">
        <div className="profile_container">
          <Cover
            cover={profile?.cover}
          />
          <ProfilePictureInfo profile={profile} />
          <ProfileMenu />
        </div>
      </div>
    </div>
  );
}

export default Profile;
