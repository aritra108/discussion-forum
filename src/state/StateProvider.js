import { createContext, useContext, useReducer } from "react";
import Reducer from "./Reducer";

const initialState = {
  editorValue: null,
  questions: [],
  clearEditor: false,
  user: null,
};

export const StateContext = createContext();

export const StateProvider = ({ children }) => (
  <StateContext.Provider value={useReducer(Reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

export const useStateValue = () => useContext(StateContext);
