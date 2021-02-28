import React from "react";
import {
  CLEAR_EDITOR,
  UPDATE_EDITOR_VALUE,
  UPDATE_QUESTIONS,
  UPDATE_USER,
} from "./ActionTypes";

const Reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_EDITOR_VALUE:
      return {
        ...state,
        editorValue: action.value,
      };
    case UPDATE_QUESTIONS:
      return {
        ...state,
        questions: action.questions,
      };
    case CLEAR_EDITOR:
      return {
        ...state,
        clearEditor: action.value,
      };
    case UPDATE_USER:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};

export default Reducer;
