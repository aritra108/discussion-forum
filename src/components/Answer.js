import React, { useEffect, useState } from "react";
import HTMLReactParser from "html-react-parser";
import moment from "moment";
import firebase from "firebase";

import "../css/Answer.css";
import { Avatar, IconButton } from "@material-ui/core";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import SendIcon from "@material-ui/icons/Send";

import Comment from "./Comment";
import { db } from "../utility/firebase";
import { useStateValue } from "../state/StateProvider";

const Answer = ({
  answerId,
  questionId,
  username,
  userImage,
  userDescription,
  timestamp,
  html,
}) => {
  const [{ user }, dispatch] = useStateValue();

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [commentCount, setCommentCount] = useState(3);

  // Fetch all comments of the current answer
  useEffect(() => {
    db.collection("questions")
      .doc(questionId)
      .collection("answers")
      .doc(answerId)
      .collection("comments")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setComments(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            image: doc.data().image,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
          }))
        )
      );
  }, []);

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    // Comment Validation
    if (comment.length < 3 && comment.length > 100) {
      alert(
        "Comment length must be at least 3 characters and atmost 100 characters long"
      );
      return;
    }

    // Send comment to firebase
    db.collection("questions")
      .doc(questionId) // Move to the respective question
      .collection("answers")
      .doc(answerId) // Move to the respective answer
      .collection("comments")
      .add({
        image: "no_image",
        name: user.displayName,
        text: comment,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

    // Clear the comment field
    setComment("");
  };

  return (
    <div className="answer">
      <div className="answer__title">
        <div className="answer__titleCredentials">
          <Avatar src={userImage} alt={username} className="avatar" />
          <div className="answer__titleCredentialsDetails">
            <p>
              <strong>{username}</strong>
            </p>
            <small>{userDescription}</small>
          </div>
        </div>
        <small className="answer__titleTimestamp">
          Answered {moment(timestamp?.toDate()).startOf("second").fromNow()}
        </small>
      </div>

      {/* Answer HTML */}
      <div className="answer__html htmlContent">{HTMLReactParser(html)}</div>

      {/* Answer Comments */}
      <div className="answer__comments">
        {comments.length > 0 ? (
          <h3>Comments ({comments.length})</h3>
        ) : (
          <h3>No Comments Yet</h3>
        )}

        <div className="divider"></div>

        {/* Add a Comment */}
        {user && (
          <div className="answer__addComment">
            <Avatar
              src="no_image"
              alt={user.displayName}
              className="avatar answer__addCommentAvatar"
            />
            <form onSubmit={handleCommentSubmit}>
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <SendIcon
                className="answer__addCommentSend"
                onClick={handleCommentSubmit}
              />
            </form>
          </div>
        )}

        {/* Other comments */}
        {comments?.slice(0, commentCount).map((comment) => (
          <Comment
            key={comment.id}
            name={comment.name}
            image={comment.image}
            text={comment.text}
            timestamp={comment.timestamp}
          />
        ))}

        <div className="answer__viewComments">
          {commentCount <= 3 && comments.length > 3 && (
            <h5 onClick={() => setCommentCount(comments.length)}>
              View All Comments
            </h5>
          )}
        </div>
      </div>

      {/* Answer Divider */}
      <div className="divider"></div>
    </div>
  );
};

export default Answer;
