import React, { useEffect, useState } from "react";

import "../css/Header.css";
import { Avatar } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import Login from "./Login";
import { useStateValue } from "../state/StateProvider";
import { auth } from "../utility/firebase";
import { UPDATE_USER } from "../state/ActionTypes";

const Header = () => {
  const [{ user }, dispatch] = useStateValue();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);

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
  }, [user]);

  // Handle Dropdown Expand and Collapse
  useEffect(() => {
    window.addEventListener("click", (e) => {
      const profileDropdown = document?.querySelector(
        ".header__profileDropdown"
      );
      const headerProfile = document.querySelector(".header__profile");
      const avatar = document?.querySelector(".header__avatar");
      const clickedElement = e.target;

      if (
        avatar?.contains(clickedElement) &&
        headerProfile.contains(clickedElement)
      ) {
        // Avatar is clicked
        setOpenDropdown((openDropdown) => !openDropdown);
      } else if (!profileDropdown?.contains(clickedElement)) {
        // Outside dropdown
        setOpenDropdown(setOpenDropdown(false));
      }
    });
  }, []);

  // Handle Modal Open and Close
  useEffect(() => {
    window.addEventListener("click", (e) => {
      const clickedElement = e.target;
      const modal = document.querySelector(".header__modal");
      const loginBtn = document?.querySelector(".header__loginBtn");

      if (loginBtn?.contains(clickedElement)) {
        setOpenLogin(true);
      } else if (!modal.contains(clickedElement)) {
        setOpenLogin(false);
      }
    });
  }, []);

  // Handle Signout
  const handleSignout = () => {
    auth.signOut();
  };

  return (
    <div className="header">
      <div className="header__container">
        <h2 className="logo">Quest</h2>

        {/* Header Profile */}
        <div className="header__profile">
          {user ? (
            <>
              <Avatar
                src="not_yet_set"
                alt={user.displayName}
                className="avatar header__avatar"
              />
              <div
                className={`header__profileDropdown ${
                  openDropdown && "expand"
                }`}
              >
                <div className="header__profileDropdownTriangle"></div>
                <div className="header__profileDescription">
                  <p className="header__profileDescriptionWelcome">Welcome, </p>
                  <p className="header__profileDescriptionName">
                    <strong>{user.displayName}</strong>
                  </p>
                  <small>{user.email}</small>
                </div>
                <ul>
                  <li onClick={handleSignout}>
                    <ExitToAppIcon fontSize="small" />
                    <p>Logout</p>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <h4 className="header__loginBtn">Login</h4>
          )}
        </div>

        {/* Modal */}
        <div className={`header__modalOverlay ${openLogin && "expand"}`}>
          <div className="header__modal">
            <Login setOpenModal={setOpenLogin} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
