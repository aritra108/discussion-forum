import React, { useEffect, useState } from "react";
import "../css/Discussions.css";
import { db } from "../utility/firebase";
import { UPDATE_QUESTIONS } from "../state/ActionTypes";
import { useStateValue } from "../state/StateProvider";
import AddQuestion from "./AddQuestion";
import Question from "./Question";

const Discussions = () => {
  const [{ user }, dispatch] = useStateValue();
  const [questions, setQuestions] = useState([]);

  // Fetch all the questions from the cloud firestore
  useEffect(() => {
    db.collection("questions")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setQuestions(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            description: doc.data().description,
            userAsked: doc.data().user.displayName,
            userImage: doc.data().user.image,
            answers: doc.data().user.answers,
            timestamp: doc.data().timestamp,
          }))
        )
      );
  }, []);

  // Populate the context with the questions fetched from firestore
  useEffect(() => {
    dispatch({
      type: UPDATE_QUESTIONS,
      questions,
    });
  }, [questions]);

  return (
    <div className="discussions">
      {user && <AddQuestion />}
      {questions.map((question) => (
        <Question
          key={question.id}
          id={question.id}
          title={question.title}
          description={question.description}
          userAsked={question.userAsked}
          userImage={question.userImage}
          answers={question.answers}
          timestamp={question.timestamp}
        />
      ))}
    </div>
  );
};

export default Discussions;
