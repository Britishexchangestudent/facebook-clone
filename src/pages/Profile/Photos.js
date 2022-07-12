import React, { useEffect, useReducer } from "react";
import { photosReducer } from "../../functions/reducers";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Photos({ username }) {
  const { user } = useSelector((state) => ({ ...state }));
  const navigate = useNavigate();
  const [{ loading, error, photos }, dispatch] = useReducer(photosReducer, {
    loading: false,
    error: "",
    photos: {},
  });
  const path = `${username}/*`;
  const max = 30;
  const sort = "desc";

  const getPhotos = async () => {
    try {
      dispatch({
        type: "PHOTOS_REQUEST",
      });

      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/listImages`,
        { path, sort, max },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );

      dispatch({
        type: "PHOTOS_SUCCESS",
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: "PHOTOS_ERROR",
        payload: error.response.data.message,
      });
    }
  };

  useEffect(() => {
    getPhotos();
  }, [username]);

  console.log(`photos`, photos);

  return (
    <div className="profile_card">
      <div className="profile_card_header">
        Photos
        <div className="profile_header_link">See all photos</div>
      </div>
      <div className="profile_card_count">
        {photos.total_count === 0
          ? ""
          : photos.total_count === 1
          ? "1 Photo"
          : `${photos.total_count} photos`}
      </div>
      <div className="profile_card_grid">
        {photos.resources &&
          photos.resources.slice(0, 9).map((img) => (
            <div className="profile_photo_card" key={img.public_id}>
              <img src={img.secure_url} alt="" />
            </div>
          ))}
      </div>
    </div>
  );
}

export default Photos;
