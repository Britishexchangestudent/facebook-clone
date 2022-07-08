import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import MenuItem from "./MenuItem";
import useOnClickOutside from "../../helpers/clickOutside";

function PostMenu({ post, setShowMenu }) {
  const { user } = useSelector((state) => ({ ...state }));

  const [test, setTest] = useState(post.user._id === user.id ? true : false);

  const menuRef = useRef();

  useOnClickOutside(menuRef, () => {
    setShowMenu(false);
  });

  const imageLength = post?.images?.length;

  return (
    <ul className="post_menu" ref={menuRef}>
      {test && <MenuItem icon="pin_icon" title="Pin Post" />}
      <MenuItem
        icon="save_icon"
        title="Save Post"
        subtitle="Add this to your saved items"
      />
      <div className="line"></div>
      {test && <MenuItem icon="edit_icon" title="Edit Post" />}
      {!test && (
        <MenuItem
          icon="turnOnNotification_icon"
          title="Turn on notifications for this post"
        />
      )}
      {imageLength && <MenuItem icon="download_icon" title="Download" />}
      {imageLength && (
        <MenuItem icon="fullscreen_icon" title="Enter Fullscreen" />
      )}
      {test && <MenuItem img="../../../icons/lock.png" title="Edit audience" />}
      {test && (
        <MenuItem
          icon="turnOffNotifications_icon"
          title="Turn off notifications for this post."
        />
      )}
      {test && <MenuItem icon="delete_icon" title="Turn off translations." />}
      {test && <MenuItem icon="date_icon" title="Edit Date" />}
      {test && (
        <MenuItem icon="refresh_icon" title="Refresh share attachment" />
      )}
      {test && <MenuItem icon="archive_icon" title="Move to archive" />}
      {test && (
        <MenuItem
          icon="trash_icon"
          title="Move to trash"
          subtitle="items in your trash are deleted after 30 days"
        />
      )}
      {!test && <div className="line"></div>}
      {!test && (
        <MenuItem
          img="../../../icons/report.png"
          title="Report Post"
          subtitle="I'm concerned about this post"
        />
      )}
    </ul>
  );
}

export default PostMenu;
