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
  const { shrink, logged, switchLogged, logRequired } = props;

  const [shrinkExpandable, setShrinkExpandable] = useState(false);
  const [barMenu, setBarMenu] = useState(false);

  const [loginPopup, setLoginPopup] = useState(false);
  const [signupPopup, setSignupPopup] = useState(false);

  const navbarRef = useRef();

  console.log("pathName: ", window.location.pathname);

  const handleLoginPopup = () => {
    setLoginPopup((prev) => !prev);
    switchLogged();
  };

  const handleSignupPopup = () => {
    setSignupPopup((prev) => !prev);
    switchLogged();
  };

  const handleLoginSignupPopup = () => {
    if (logged) {
      /*  Sign Out */
      switchLogged();
    } 
    else {
      setLoginPopup(true);
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
            !shrink && (
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

        {!shrink && (
          <div className={hStyle.navbarContainer} ref={navbarRef}>
            { !((!logRequired && loginPopup)  || signupPopup) &&
              <div>
                <Button
                  onClick={handleLoginSignupPopup}
                  className={hStyle.button}
                  style={{ padding: "5px" }}
                >
                  {logged ? "Sign out" : "Log in"}
                </Button>
              </div>
            }
            <div>
              <IconButton
                className={hStyle.button}
                style={{
                  padding: "5px",
                  color: "#5a32bf",
                  textDecoration: "none",
                }}
                aria-label="help"
              >
                <Link to="/HelpPage" style={{ textDecoration: "none" }}>
                  <HelpIcon />
                </Link>
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

      {((!logRequired && loginPopup) || signupPopup) && (
        <Popup onClose={handleLoginPopup}>
          <JarUserLogin
            loginState={loginPopup}
            signupState={signupPopup}
            onClose={() => {
              setLoginPopup(false);
              setSignupPopup(false);
            }}
            onSwitch={() => {
              handleLoginPopup();
              handleSignupPopup();
            }}
            switchLogged={switchLogged}
          />
        </Popup>
      )}
    </div>
  );
}

export default HeaderUser;
