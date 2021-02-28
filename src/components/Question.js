import React, { useEffect, useState } from "react";
import HTMLReactParser from "html-react-parser";
import firebase from "firebase";
import moment from "moment";

import "../css/Question.css";
import { Avatar, IconButton } from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
import DescriptionIcon from "@material-ui/icons/Description";

import Answer from "./Answer";
import TextEditor from "./TextEditor";
import { db } from "../utility/firebase";
import { useStateValue } from "../state/StateProvider";
import { CLEAR_EDITOR } from "../state/ActionTypes";

const Question = ({
  id,
  title,
  description,
  userAsked,
  userImage,
  timestamp,
}) => {
  const [{ editorValue, user }, dispatch] = useStateValue();

  const [expandEditor, setExpandEditor] = useState(false);
  const [expandDescription, setExpandDescription] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [countAnswers, setCountAnswers] = useState(1);

  // Submit answer to the firestore
  const handleAnswerSubmit = () => {
    db.collection("questions")
      .doc(id)
      .collection("answers")
      .add({
        user: {
          displayName: user.displayName,
          image: "no_image",
          description: "",
        },
        answer: editorValue,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        setShowConfirm(true);
        setTimeout(() => setShowConfirm(false), 3000);
      });

    // Clear the editor
    dispatch({
      type: CLEAR_EDITOR,
      value: true,
    });
  };

  // Fetch the answers of current question from the firestore
  useEffect(() => {
    db.collection("questions")
      .doc(id)
      .collection("answers")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setAnswers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            username: doc.data().user.displayName,
            userImage: doc.data().user.image,
            userDescription: doc.data().user.description,
            html: doc.data().answer,
            timestamp: doc.data().timestamp,
          }))
        )
      );
  }, []);

  return (
    <div className="question">
      {/* Question title and subtitle */}
      <h2 className="question__title">{title}</h2>

      <div className="question__subtitle">
        <div className="question__subtitleUser">
          <small>
            Asked by <strong>{userAsked}</strong>
          </small>
          <Avatar
            src={userImage}
            alt={userAsked}
            className="avatar question__subtitleAvatar"
          />
        </div>
        <small className="question__subtitleTimestamp">
          Asked {moment(timestamp?.toDate()).startOf("second").fromNow()}
        </small>
      </div>

      {/* Question Buttons */}
      <div className="question__btnContainer">
        {user && (
          <div
            className={`question__btn question__answerBtn ${
              expandEditor && "selected"
            }`}
            onClick={() => {
              setExpandDescription(false);
              setExpandEditor(!expandEditor);
            }}
          >
            <CreateIcon />
            <p>Answer</p>
          </div>
        )}

        <div
          className={`question__btn question__answerBtn ${
            expandDescription && "selected"
          }`}
          onClick={() => {
            setExpandEditor(false);
            setExpandDescription(!expandDescription);
          }}
        >
          <DescriptionIcon />
          <p>Description</p>
        </div>
      </div>

      {/* Question Description */}
      <div className={`question__description ${expandDescription && "expand"}`}>
        <div className="htmlContent question__descriptionHtml">
          {HTMLReactParser(description)}
        </div>
      </div>

      <div className={`question__textEditor ${expandEditor && "expand"}`}>
        <TextEditor
          toolbarOptions={{
            options: ["inline", "list", "textAlign", "link", "emoji", "image"],
            list: { options: ["ordered", "unordered"] },
          }}
        />
      </div>

      <button
        className={`question__submitAnswer ${expandEditor && "expand"}`}
        onClick={handleAnswerSubmit}
      >
        Submit
      </button>

      <p className={`question__answerConfirmation ${showConfirm && "expand"}`}>
        Your answer has been submitted successfully!
      </p>

      <div className="question__answerTitle">
        {answers?.length > 0 ? (
          <>
            <h3>Answers ({answers.length})</h3>
            <div className="divider"></div>
          </>
        ) : (
          <h3 className="question__answerTitleNo">No Answers Yet</h3>
        )}
      </div>

      {/* Render all the answers */}
      {answers?.slice(0, countAnswers).map((answer) => (
        <Answer
          key={answer.id}
          questionId={id}
          answerId={answer.id}
          username={answer.username}
          userImage={answer.userImage}
          userDescription={answer.userDescription}
          timestamp={answer.timestamp}
          html={answer.html}
        />
      ))}

      {/* Render another answer on request */}
      {countAnswers < answers.length && (
        <h4
          className="question__showMoreAnswers"
          onClick={() => setCountAnswers((countAnswers) => countAnswers + 1)}
        >
          See another answer +
        </h4>
      )}
    </div>
  );
};

export default Question;
