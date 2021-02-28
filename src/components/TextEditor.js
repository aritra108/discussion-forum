import React, { useEffect, useState } from "react";

import { ContentState, convertToRaw, EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";

import "../css/TextEditor.css";
import { useStateValue } from "../state/StateProvider";
import { CLEAR_EDITOR, UPDATE_EDITOR_VALUE } from "../state/ActionTypes";

const TextEditor = ({ toolbarOptions }) => {
  const [{ clearEditor }, dispatch] = useStateValue();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    dispatch({
      type: UPDATE_EDITOR_VALUE,
      value: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    });
  }, [editorState]);

  // Clear the editor state on submission
  useEffect(() => {
    if (clearEditor) {
      const _editorState = EditorState.push(
        editorState,
        ContentState.createFromText("")
      );
      setEditorState(_editorState);
      dispatch({ type: CLEAR_EDITOR, value: false });
    }
  }, [clearEditor]);

  return (
    <div className="textEditor">
      <Editor
        editorState={editorState}
        onEditorStateChange={(e) => setEditorState(e)}
        toolbar={toolbarOptions}
        editorClassName="textEditor__editor"
      />
    </div>
  );
};

export default TextEditor;
