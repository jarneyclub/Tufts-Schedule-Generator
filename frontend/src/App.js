/* eslint-disable import/extensions */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * App.js
 *
 * This is the main react App. Routes to different pages according to the url
 * path.
 *
 */
import { useState, useEffect } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./components/Home"; // routest to diff pages

import WelcomePage from "./components/WelcomePage";

import DegreePlan1 from "./components/DegreePlan1";
import DegreePlan2 from "./components/DegreePlan2";

import Scheduler from "./components/Scheduler";
import Header from "./components/reusable/HeaderUser";

import Eina from "./fonts/Eina03-SemiBold.ttf";

const THEME = createMuiTheme({
  typography: {
    fontFamily: { Eina },
  },
});

export default function App() {
  // const [scrollHorizontal, setScrollHorizontal] = useState(0);
  const [shrink, setShrink] = useState(window.innerWidth < 630);
  // setScrollHorizontal(elem.scrollLeft);

  // useEffect(() => {
  //   const elem = document.getElementById("headerContainer");
  //   function updateScroll() {
  //     console.log("App.js scrollLeft: ", elem.scrollLeft);
  //     setScrollHorizontal(elem.scrollLeft);
  //   }
  //   function scrollUpdate() {
  //     elem.scrollTo(scrollHorizontal, 0);
  //     // console.log("App.js scrollUpdate Called");
  //   }

  //   elem.addEventListener("scroll", updateScroll);
  //   elem.addEventListener("click", scrollUpdate);

  //   return () => {
  //     elem.removeEventListener("scroll", updateScroll);
  //     elem.removeEventListener("click", scrollUpdate);
  //   };
  // }, []);
  useEffect(() => {
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
      <div>
        {/* A <Switch> looks through its children <Route>s and
                    renders the first on that matches the current URL
                */}
        <BrowserRouter>
          <Header id="headerContainer" shrink={shrink} />

          <Switch>
            <Route path="/Dashboard">
              <WelcomePage />
            </Route>

            <Route path="/DegreePlan1">
              <DegreePlan1 />
            </Route>
            <Route path="/DegreePlan2">
              <DegreePlan2 shrink={shrink} />
            </Route>

            <Route path="/Scheduler">
              <Scheduler />
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
