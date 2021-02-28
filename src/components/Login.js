import React, { useEffect, useState } from "react";

import "../css/Login.css";
import { UPDATE_USER } from "../state/ActionTypes";
import { useStateValue } from "../state/StateProvider";
import { auth } from "../utility/firebase";
import {
  validateEmailandPassword,
  validateUsernameEmailandPassword,
} from "../utility/validate";

const Login = ({ setOpenModal }) => {
  const [{ user }, dispatch] = useStateValue();

  const [showSignup, setShowSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Listening to Firebase authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // an user is already present
        dispatch({
          type: UPDATE_USER,
          user: authUser,
        });
      } else {
        dispatch({
          type: UPDATE_USER,
          user: null,
        });
      }
    });

    return () => unsubscribe();
  }, [user, username]);

  // Login Authentication
  const handleLogin = (e) => {
    e.preventDefault();

    // Login with Firebase
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    // Clear the input fields
    clearFields();

    // Close the modal
    setOpenModal(false);
  };

  // Sign Up Authentication
  const handleSignup = (e) => {
    e.preventDefault();

    // Form Validation
    if (!validateEmailandPassword(email, password)) {
      return;
    }

    // Sign up with Firebase
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) =>
        authUser.user.updateProfile({
          displayName: username,
        })
      )
      .catch((error) => alert(error.message));

    // Clear the input fields
    clearFields();

    // Close the modal
    setOpenModal(false);
  };

  // Clears all the input fields
  const clearFields = () => {
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="login">
      <h1 className="logo">Quest</h1>

      <div className="login__formContainer">
        <form
          className={`login__form login__loginForm ${!showSignup && "expand"}`}
          onSubmit={handleLogin}
        >
          <input
            type="text"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <form
          className={`login__form login__loginForm ${showSignup && "expand"}`}
          onSubmit={handleSignup}
        >
          <input
            type="text"
            placeholder="Enter an Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter an Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter a Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>

      <div className="login__toggle">
        {showSignup ? (
          <p>
            Already have an account?{" "}
            <span onClick={() => setShowSignup(false)}>Login</span>
          </p>
        ) : (
          <p>
            Don't have an account?{" "}
            <span onClick={() => setShowSignup(true)}>Sign Up</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
