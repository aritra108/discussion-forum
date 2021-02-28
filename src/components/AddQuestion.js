import React, { useState } from "react";
import firebase from "firebase";

import TextEditor from "./TextEditor";
import { db } from "../utility/firebase";

import "../css/AddQuestion.css";
import AddIcon from "@material-ui/icons/Add";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { IconButton } from "@material-ui/core";
import { useStateValue } from "../state/StateProvider";
import { CLEAR_EDITOR } from "../state/ActionTypes";

const AddQuestion = () => {
  const [{ editorValue, user }, dispatch] = useStateValue();
  const [question, setQuestion] = useState("");

  const [expand, setExpand] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Add to firebase cloud firestore
  const handleSubmit = () => {
    if (question.length < 7 || question.length >= 100) {
      alert(
        "Length must be greater than 6 characters and less than 100 characters"
      );
      return;
    }

    // Add to firebase
    db.collection("questions")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        user: {
          displayName: user.displayName,
          image: "no_image",
        },
        title: question,
        description: editorValue,
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

    setQuestion(""); // Clear the input
  };

  return (
    <div className="addQuestion">
      <div className="addQuestion__title">
        <h2>Ask a New Question</h2>
        {expand ? (
          <IconButton onClick={() => setExpand(false)}>
            <ExpandLessIcon />
          </IconButton>
        ) : (
          <IconButton onClick={() => setExpand(true)}>
            <AddIcon />
          </IconButton>
        )}
      </div>

      <div className={`addQuestion__details ${expand && "expand"}`}>
        <h3>Give a Question Title:</h3>
        <input
          type="text"
          placeholder="Write your question here..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <div className="addQuestion__inputUnderline"></div>

        <h3>
          Give a Description: <span>(optional)</span>
        </h3>
        <TextEditor
          toolbarOptions={{
            options: ["inline", "list", "emoji", "link"],
            inline: { options: ["bold", "italic", "underline"] },
            list: { options: ["unordered", "ordered"] },
          }}
        />

        <button className="addQuestion__submit" onClick={handleSubmit}>
          Submit
        </button>

        <p className={`addQuestion__confirmation ${showConfirm && "expand"}`}>
          Your question has been submitted successfully!
        </p>
      </div>
    </div>
  );
};

export default AddQuestion;
