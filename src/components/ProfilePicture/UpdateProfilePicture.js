import React, { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../../helpers/getCroppedImg";
import { useSelector } from "react-redux";
import { uploadImages } from "../../functions/uploadImages";
import { updateProfilePic } from "../../functions/user";
import { createPost } from "../../functions/post";

function UpdateProfilePicture({ image, setImage, setShow, error, setError }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const sliderRef = useRef();
  const { user } = useSelector((state) => ({ ...state }));

  const zoomOut = () => {
    sliderRef.current?.stepDown();
    setZoom(sliderRef?.current?.value);
  };
  const zoomIn = () => {
    sliderRef.current?.stepUp();
    setZoom(sliderRef?.current?.value);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  const [description, setDescription] = useState("");

  const getCroppedImage = useCallback(
    async (crop) => {
      try {
        const img = await getCroppedImg(image, croppedAreaPixels);
        if (crop === "crop") {
          setZoom(1);
          setCrop({ x: 0, y: 0 });

          setImage(img);
          console.log(`img`, img);
          console.log(`show`);
        } else {
          console.log(`img`, img);
          setImage(img);

          return img;
        }
      } catch (error) {
        console.log(`error`, error);
      }
    },
    [croppedAreaPixels]
  );

  const updateProfilePicture = async () => {
    try {
      let img = await getCroppedImage();

      let blob = await fetch(img).then((b) => b.blob());

      const path = `${user.username}/profile_pictures`;
      let formData = new FormData();
      formData.append("file", blob);
      formData.append("path", path);
      const res = await uploadImages(formData, path, user.token);
      console.log(`res[0]`, res[0]);
      const updatedPic = await updateProfilePic(res[0].url, user.token);
      console.log(`updatedPic`, updatedPic);
      if (updatedPic === "data") {
        const new_post = await createPost(
          "profilePicture",
          null,
          description,
          res,
          user.id,
          user.token
        );
        if (new_post === "data") {
        } else {
          setError(new_post);
          console.log(`babababa`);
        }
      } else {
        setError(updatedPic);
        console.log(`wawawawawa`);
      }
    } catch (error) {
      setError(error.response.data.error);
      console.log(`zazazaaza`);
    }
  };

  return (
    <div className="postBox update_img">
      <div className="box_header">
        <div className="small_circle" onClick={() => setImage("")}>
          <i className="exit_icon"></i>
        </div>
        <span>Update Profile Picture</span>
      </div>
      <div className="update_image_desc">
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea_blue details_input"
        ></textarea>
      </div>
      <div className="update_center">
        <div className="cropper">
          <Cropper
            image={image}
            crop={crop}
            cropShape="round"
            zoom={zoom}
            aspect={1 / 1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            showGrid={false}
          />
        </div>
        <div className="slider_container">
          <div className="slider_circle" onClick={() => zoomOut()}>
            <i className="minus_icon"></i>
          </div>
          <input
            type="range"
            min={1}
            step={0.2}
            ref={sliderRef}
            max={3}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            className="slider"
          />
          <div className="slider_circle" onClick={() => zoomIn()}>
            <i className="plus_icon"></i>
          </div>
        </div>
      </div>
      <div className="flex_up">
        <button className="gray_btn">
          <i className="crop_icon"></i>
          Crop Photo
        </button>
        <button className="gray_btn">
          <i className="temp_icon"></i>
          Make Temporary
        </button>
      </div>

      <div className="flex_p_t">
        <i className="public_icon"></i>
        Your profile picture is public
      </div>
      <div className="update_submit_wrap">
        <div className="blue_link">Cancel</div>
        <button className="blue_btn" onClick={() => updateProfilePicture()}>
          Save
        </button>
      </div>
    </div>
  );
}

export default UpdateProfilePicture;
