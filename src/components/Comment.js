import React from "react";
import moment from "moment";

import "../css/Comment.css";
import { Avatar } from "@material-ui/core";

const Comment = ({ image, name, text, timestamp }) => {
  return (
    <div className="comment">
      <div className="comment__header">
        <div className="comment__headerUser">
          <Avatar src={image} alt={name} className="comment__avatar" />
          <p>{name}</p>
        </div>

        <div className="comment__timestamp">
          <small>
            {moment(timestamp?.toDate()).startOf("second").fromNow()}
          </small>
        </div>
      </div>

      <div className="comment__text">{text}</div>
    </div>
  );
};

export default Comment;
