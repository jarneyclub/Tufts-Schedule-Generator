/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * HeaderUser.js
 *
 *
 */

import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button, IconButton, ClickAwayListener } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import HelpIcon from '@material-ui/icons/Help';
import hStyle from './reusableStyles/HeaderUser.module.css';
import newLogo from '../res/jarney_word.png';
import Popup from './Popup';
import JarUserLogin from './JarUserLogin';

/* scripts */

function HeaderUser(props) {
  const { shrink, logged, switchLogged, logRequired } = props;

  const [shrinkExpandable, setShrinkExpandable] = useState(false);
  const [barMenu, setBarMenu] = useState(false);

  const [loginPopup, setLoginPopup] = useState(false);
  const [signupPopup, setSignupPopup] = useState(false);
  const [resetPopup, setResetPopup] = useState(false);

  const navbarRef = useRef();

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
      fetchLogout();
      switchLogged();
    } else {
      setLoginPopup(true);
    }
  };

  const fetchLogout = async () => {
    await fetch('https://qa.jarney.club/api/auth/logout', { method: 'POST' })
      .then((response) => response.json())
      .then((result) => {})
      .error((error) => {});
  };

  return (
    <div className={hStyle.headerContainer} id="headerContainer">
      {/* Logo */}
      <div className={hStyle.splitContainer}>
        <div className={hStyle.logoContainer}>
          <Link to="/Home" style={{ textDecoration: 'none' }}>
            <img
              src={newLogo}
              height="40px"
              href="/Home"
              alt="Return to Home"
            />
          </Link>
          {
            /*  Logged in JAR User jarUser = true */
            !shrink && (
              <div className={hStyle.navbarContainer}>
                <div className={hStyle.verticalBar} />
                <NavLink
                  to="/DegreeRequirement"
                  activeClassName={hStyle.activeNavOption}
                  className={hStyle.navOption}
                  style={{ textDecoration: 'none' }}
                >
                  Degree Requirement
                </NavLink>

                <NavLink
                  to="/DegreePlan"
                  activeClassName={hStyle.activeNavOption}
                  className={hStyle.navOption}
                  style={{ textDecoration: 'none' }}
                >
                  Degree Plan
                </NavLink>

                <NavLink
                  to="/Schedule"
                  activeClassName={hStyle.activeNavOption}
                  className={hStyle.navOption}
                  style={{ textDecoration: 'none' }}
                >
                  Schedule
                </NavLink>
              </div>
            )
          }
        </div>

        {!shrink && (
          <div className={hStyle.navbarContainer} ref={navbarRef}>
            <>
              <NavLink to="/HelpPage">
                <IconButton
                  className={hStyle.button}
                  style={{
                    padding: '5px',
                    color: '#5a32bf',
                    textDecoration: 'none',
                  }}
                  aria-label="help" 
                >
                  <HelpIcon />
                </IconButton>
              </NavLink>
            </>

            {!((!logRequired && loginPopup) || signupPopup) && (
              <>
                <Button
                  onClick={handleLoginSignupPopup}
                  className={hStyle.button}
                  style={{ padding: '5px'}}
                >
                  {logged ? 'Sign out' : 'Log in'}
                </Button>
              </>
            )}
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
          // className={hStyle.shrinkContainer}
        >
          {shrinkExpandable ? (
            <div className={hStyle.expandableContainer}>
              <NavLink
                to="/Home"
                activeClassName={hStyle.activeShrinkNavOption}
                className={hStyle.shrinkNavOption}
                onClick={() => setShrinkExpandable((prev) => !prev)}
                style={{ textDecoration: 'none' }}
              >
                Home
              </NavLink>
              <NavLink
                to="/DegreeRequirement"
                activeClassName={hStyle.activeShrinkNavOption}
                className={hStyle.shrinkNavOption}
                onClick={() => setShrinkExpandable((prev) => !prev)}
                style={{ textDecoration: 'none' }}
              >
                Degree requirement
              </NavLink>
              <NavLink
                to="/DegreePlan"
                activeClassName={hStyle.activeShrinkNavOption}
                className={hStyle.shrinkNavOption}
                onClick={() => setShrinkExpandable((prev) => !prev)}
                style={{ textDecoration: 'none' }}
              >
                Degree plan
              </NavLink>

              <NavLink
                to="/Schedule"
                activeClassName={hStyle.activeShrinkNavOption}
                className={hStyle.shrinkNavOption}
                onClick={() => setShrinkExpandable((prev) => !prev)}
                style={{ textDecoration: 'none' }}
              >
                Schedule
              </NavLink>
              <NavLink
                to="/HelpPage"
                activeClassName={hStyle.activeShrinkNavOption}
                className={hStyle.shrinkNavOption}
                onClick={() => setShrinkExpandable((prev) => !prev)}
                style={{ textDecoration: 'none' }}
              >
                Help
              </NavLink>
            </div>
          ) : (
            <div />
          )}
        </ClickAwayListener>
      )}

      {((!logRequired && loginPopup) || signupPopup) && (
        <Popup onClose={handleLoginPopup}>
          <JarUserLogin
            loginState={loginPopup}
            signupState={signupPopup}
            resetState={resetPopup}
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
