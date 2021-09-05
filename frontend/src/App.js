/* eslint-disable import/extensions */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * App.js
 *
 * This is the main react App. Routes to different pages according to the url
 * path.
 *
 */
import { useState, useEffect } from "react";
import { MuiThemeProvider, createTheme } from "@material-ui/core";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./components/Home"; // routest to diff pages

import DegreePlan1 from "./components/DegreePlan1";
import DegreePlan2 from "./components/DegreePlan2";

import Scheduler from "./components/Scheduler";
import Header from "./components/reusable/HeaderUser";

import Eina from "./fonts/Eina03-SemiBold.ttf";

const THEME = createTheme({
  typography: {
    fontFamily: { Eina },
  },
});

export default function App() {
  const [shrink, setShrink] = useState(window.innerWidth < 630);
  const [logged, setLogged] = useState(false);

  const [loginPopup, setLoginPopup] = useState(false);
  const [signupPopup, setSignupPopup] = useState(false);

  const handleLoginPopup = (not: Boolean, set: Boolean) => {
    if (not) {
      setLoginPopup((prev) => !prev);
    } else {
      setLoginPopup(set);
    }
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
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    };
    await fetch("https://jarney.club/api/auth/login_cookie", requestOption)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Quick Login Failed. User needs to Login");
      })
      .then((result) => setLogged(result.data))
      .catch((error) => console.log("error from quick login: ", error));
  };


  useEffect(() => {
    console.log("before fetchQuickLogin");
    fetchQuickLogin();

    const checkResize = () => {
      if (window.innerWidth < 670) {
        console.log("HeaderUser width smaller: ", window.innerWidth);

        setShrink(true);
      } else {
        console.log("HeaderUser width larger: ", window.innerWidth);

        setShrink(false);
      }
    };

    window.addEventListener("resize", checkResize);

    return () => {
      window.removeEventListener("resize", checkResize);
    };
  }, []);

  return (
    <MuiThemeProvider theme={THEME}>
      <div
        style={{
          background:
            "linear-gradient(-45deg, #ccbeee, #d9cef2, #fed7d7, #fec2c2)",
          minHeight: "100vh",
        }}
      >
        {/* A <Switch> looks through its children <Route>s and
                    renders the first on that matches the current URL
                */}
        <BrowserRouter>
          <Header id="headerContainer" shrink={shrink} />

          <Switch>
            <Route path="/DegreePlan1">
              <DegreePlan1
                shrink={shrink}
                logged={logged}
                switchLogged={switchLogged}
                loginPopup={loginPopup}
                signupPopup={signupPopup}
                handleLoginPopup={handleLoginPopup}
                handleSignupPopup={handleSignupPopup}
              />
            </Route>
            <Route path="/DegreePlan2">
              <DegreePlan2
                shrink={shrink}
                logged={logged}
                switchLogged={switchLogged}
                loginPopup={loginPopup}
                signupPopup={signupPopup}
                handleLoginPopup={handleLoginPopup}
                handleSignupPopup={handleSignupPopup}
              />
            </Route>

            <Route path="/Scheduler">
              <Scheduler
                shrink={shrink}
                logged={logged}
                switchLogged={switchLogged}
                loginPopup={loginPopup}
                signupPopup={signupPopup}
                handleLoginPopup={handleLoginPopup}
                handleSignupPopup={handleSignupPopup}
              />
            </Route>

            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </MuiThemeProvider>
  );
}
