/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * HeaderUser.js
 *
 *
 */

import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, IconButton, ClickAwayListener } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import HelpIcon from "@material-ui/icons/Help";
import hStyle from "./reusableStyles/HeaderUser.module.css";
import logo from "../res/JARney.png";
import Popup from "./Popup";
import JarUserLogin from "./JarUserLogin";

/* scripts */

function HeaderUser(props) {
  const { shrink } = props;
  // const [shrink, setShrink] = useState(window.innerWidth < 630);
  const [shrinkExpandable, setShrinkExpandable] = useState(false);
  const [barMenu, setBarMenu] = useState(false);

  const [loginPopup, setLoginPopup] = useState(false);
  const [signupPopup, setSignupPopup] = useState(false);

  /*  tells if a user is logged in */
  const [jarUser, setJarUser] = useState(true);
  const navbarRef = useRef();

  console.log("pathName: ", window.location.pathname);

  const handleLoginPopup = () => {
    setLoginPopup((prev) => !prev);
  };

  const handleSignupPopup = () => {
    setSignupPopup((prev) => !prev);
  };

  const handleLoginSignupPopup = () => {
    if (jarUser) {
      /*  Sign Out */
      setJarUser(false);
    } else {
      /*  Log in */
      handleLoginPopup();
    }
  };

  return (
    <div className={hStyle.headerContainer} id="headerContainer">
      {/* Logo */}
      <div className={hStyle.splitContainer}>
        <div className={hStyle.logoContainer}>
          <Link to="/Home" style={{ textDecoration: "none" }}>
            <img src={logo} height="50px" href="/Home" alt="Return to Home" />
          </Link>
          {
            /*  Logged in JAR User jarUser = true */
            !shrink && jarUser && (
              <div className={hStyle.navbarContainer}>
                <div className={hStyle.verticalBar} />
                <NavLink
                  to="/DegreePlan1"
                  activeClassName={hStyle.activeNavOption}
                  className={hStyle.navOption}
                  style={{ textDecoration: "none" }}
                >
                  Degree Requirement
                </NavLink>

                <NavLink
                  to="/DegreePlan2"
                  activeClassName={hStyle.activeNavOption}
                  className={hStyle.navOption}
                  style={{ textDecoration: "none" }}
                >
                  Degree Plan
                </NavLink>

                <NavLink
                  to="/Scheduler"
                  activeClassName={hStyle.activeNavOption}
                  className={hStyle.navOption}
                  style={{ textDecoration: "none" }}
                >
                  Scheduler
                </NavLink>
              </div>
            )
          }
        </div>

        {
          /*  Guest User userJar = false */
          !shrink && !jarUser && (
            <div className={hStyle.navbarContainerGuest} ref={navbarRef}>
              <NavLink
                to="/Scheduler"
                // activeClassName={hStyle.activeNavOption}
                className={hStyle.navOption}
                style={{ textDecoration: "none" }}
              >
                SCHEDULER 📅
              </NavLink>
            </div>
          )
        }

        {!shrink && (
          <div className={hStyle.navbarContainer} ref={navbarRef}>
            <div>
              <Button
                onClick={handleLoginSignupPopup}
                className={hStyle.button}
                style={{ padding: "5px" }}
              >
                {jarUser ? "Sign out" : "Log in"}
              </Button>
            </div>
            <div>
              <IconButton
                className={hStyle.button}
                style={{ padding: "5px" }}
                aria-label="help"
              >
                <HelpIcon />
              </IconButton>
            </div>
          </div>
        )}

        {shrink && (
          <IconButton
            className={hStyle.shrinkNavbar}
            onClick={() => {
              setShrinkExpandable((prev) => !prev);
              setBarMenu(true);
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </div>

      {shrink && (
        <ClickAwayListener
          onClickAway={() => {
            !barMenu && setShrinkExpandable(false);
            setBarMenu(false);
          }}
        >
          <div className={hStyle.shrinkContainer}>
            {shrinkExpandable && (
              <div className={hStyle.expandableContainer}>
                <NavLink
                  to="/DegreePlan1"
                  activeClassName={hStyle.activeShrinkNavOption}
                  className={hStyle.shrinkNavOption}
                  onClick={() => setShrinkExpandable((prev) => !prev)}
                  style={{ textDecoration: "none" }}
                >
                  Degree Plan Editor
                </NavLink>
                <NavLink
                  to="/DegreePlan2"
                  activeClassName={hStyle.activeShrinkNavOption}
                  className={hStyle.shrinkNavOption}
                  onClick={() => setShrinkExpandable((prev) => !prev)}
                  style={{ textDecoration: "none" }}
                >
                  Degree Plan
                </NavLink>

                <NavLink
                  to="/Scheduler"
                  activeClassName={hStyle.activeShrinkNavOption}
                  className={hStyle.shrinkNavOption}
                  onClick={() => setShrinkExpandable((prev) => !prev)}
                  style={{ textDecoration: "none" }}
                >
                  Scheduler
                </NavLink>
              </div>
            )}
          </div>
        </ClickAwayListener>
      )}

      {(loginPopup || signupPopup) && (
        <Popup onClose={handleLoginPopup}>
          <JarUserLogin
            loginState={loginPopup}
            singupState={signupPopup}
            onClose={() => {
              setLoginPopup(false);
              setSignupPopup(false);
            }}
            onSwitch={() => {
              handleLoginPopup();
              handleSignupPopup();
            }}
          />
        </Popup>
      )}
    </div>
  );
}

export default HeaderUser;
