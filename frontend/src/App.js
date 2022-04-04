/* eslint-disable import/extensions */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * App.js
 *
 * This is the main react App. Routes to different pages according to the url
 * path.
 *
 */
import { useState, useEffect } from 'react';
import { MuiThemeProvider, createTheme } from '@material-ui/core';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './components/Home'; // routest to diff pages

import DegreeRequirement from './components/DegreeRequirement';
import DegreePlan from './components/DegreePlan';

import Scheduler from './components/Scheduler';
import HelpPage from './components/HelpPage';
import Header from './components/reusable/HeaderUser';

import EinaBold from './fonts/Eina03-SemiBold.ttf';
import EinaRegular from './fonts/Eina03-Regular.ttf';

const THEME = createTheme({
  typography: {
    fontFamily: { EinaRegular },
  },
});

export default function App() {
  const [shrink, setShrink] = useState(window.innerWidth < 630);
  const [logged, setLogged] = useState(false);
  const [logRequired, setLogRequired] = useState(false);

  const [loginPopup, setLoginPopup] = useState(false);
  const [signupPopup, setSignupPopup] = useState(false);

  const handleLoginPopup = (not: Boolean, set: Boolean) => {
    if (not) {
      setLoginPopup((prev) => !prev);
    } else {
      setLoginPopup(set);
    }
  };

  const handleLogRequired = (bit) => {
    setLogRequired(bit);
  };

  const handleSignupPopup = (not: Boolean, set: Boolean) => {
    if (not) {
      setSignupPopup((prev) => !prev);
    } else {
      setSignupPopup(set);
    }
  };

  const switchLogged = () => {
    setLogged((prev) => !prev);
  };

  const fetchQuickLogin = async () => {
    const requestOption = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    };
    await fetch('https://jarney.club/api/auth/login_cookie', requestOption)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Quick Login Failed. User needs to Login');
      })
      .then((result) => setLogged(result.data))
      .catch((error) => {});
  };

  useEffect(() => {
    fetchQuickLogin();

    const checkResize = () => {
      if (window.innerWidth < 670) {
        setShrink(true);
      } else {
        setShrink(false);
      }
    };

    window.addEventListener('resize', checkResize);

    return () => {
      window.removeEventListener('resize', checkResize);
    };
  }, []);

  return (
    <MuiThemeProvider theme={THEME}>
      <div>
        {/* A <Switch> looks through its children <Route>s and
                    renders the first on that matches the current URL
                */}
        <BrowserRouter>
          <Header
            id="headerContainer"
            shrink={shrink}
            logged={logged}
            switchLogged={switchLogged}
            loginPopup={loginPopup}
            signupPopup={signupPopup}
            logRequired={logRequired}
          />

          <Switch>
            <Route path="/DegreeRequirement">
              <DegreeRequirement
                shrink={shrink}
                logged={logged}
                switchLogged={switchLogged}
                loginPopup={loginPopup}
                signupPopup={signupPopup}
                handleLoginPopup={handleLoginPopup}
                handleSignupPopup={handleSignupPopup}
                handleLogRequired={handleLogRequired}
              />
            </Route>
            <Route path="/DegreePlan">
              <DegreePlan
                shrink={shrink}
                logged={logged}
                switchLogged={switchLogged}
                loginPopup={loginPopup}
                signupPopup={signupPopup}
                handleLoginPopup={handleLoginPopup}
                handleSignupPopup={handleSignupPopup}
                handleLogRequired={handleLogRequired}
              />
            </Route>

            <Route path="/Schedule">
              <Scheduler
                shrink={shrink}
                logged={logged}
                switchLogged={switchLogged}
                loginPopup={loginPopup}
                signupPopup={signupPopup}
                handleLoginPopup={handleLoginPopup}
                handleSignupPopup={handleSignupPopup}
                handleLogRequired={handleLogRequired}
              />
            </Route>

            <Route path="/HelpPage">
              <HelpPage
                shrink={shrink}
                logged={logged}
                switchLogged={switchLogged}
                loginPopup={loginPopup}
                signupPopup={signupPopup}
                handleLoginPopup={handleLoginPopup}
                handleSigninPopup={handleSignupPopup}
              />
            </Route>

            <Route path="/">
              <Home handleLogRequired={handleLogRequired} />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </MuiThemeProvider>
  );
}
