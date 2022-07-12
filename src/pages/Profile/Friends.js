import React, { useEffect, useReducer } from "react";
import { photosReducer } from "../../functions/reducers";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Friends({ friends }) {
  return (
    <div className="profile_card">
      <div className="profile_card_header">
        Photos
        <div className="profile_header_link">See all friends</div>
      </div>
      {friends && (
        <div className="profile_card_count">
          {friends?.length === 0
            ? ""
            : friends?.length === 1
            ? "1 friend"
            : `${friends?.length} friends`}
        </div>
      )}
      <div className="profile_card_grid"></div>
    </div>
  );
}

export default Friends;
