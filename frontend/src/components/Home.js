/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Home.js
 *
 * This is a page that prompts the user to choose between login into an
 * existing account, create an account, or use the app as a guest user.
 */

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@material-ui/core";
import hStyle from "./style/Home.module.css";
import LoginGraphic from "./res/homepage_final.gif";
import SandglassGraphic from "./res/favicon_2.png";
import InstagramIcon from "@mui/icons-material/Instagram";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightIcon from "@mui/icons-material/Flight";
import DegreeGraphic from "./res/Icon_DegreePlanner.png";
import SchedulerGraphic from "./res/Icon_Scheduler.png";
import JarneyGraphic from "./res/JARney.png";
import Popup from "./reusable/Popup";
import JarUserLogin from "./reusable/JarUserLogin";
import { Link } from "react-router-dom";
import EventIcon from "@mui/icons-material/Event";
function Home(props) {
  const { handleLogRequired } = props;
  const [loginPopup, setLoginPopup] = useState(false);
  const [signupPopup, setSignupPopup] = useState(false);

  const handleLoginPopup = () => {
    setLoginPopup((prev) => !prev);
  };

  const handleSignupPopup = () => {
    setSignupPopup((prev) => !prev);
  };

  useEffect(() => {
    handleLogRequired(false);
  }, []);

  return (
    <div className={hStyle.homeContainer}>
      <Helmet>
        <title>JARney | Home</title>
      </Helmet>

      <div
        className={hStyle.mainVerticalContainer}
        style={{ backgroundColor: "#f1edfa" }}
      >
        <div>
          <img
            src={LoginGraphic}
            alt="LoginGraphic"
            className={hStyle.loginImage}
          />
        </div>

        <h1>
          JARney<span style={{ color: "#fc4e4e !important" }}>.</span>
        </h1>

        <div className={hStyle.content}>
          <h2>
            Let us plan out your Tufts journey: from your degree requirements,
            degree plan, to your semesterly schedule!{" "}
          </h2>
          <br />
          Created by Tufts students, for Tufts students. HAHAHAHAHAHAHAHA
          <br />
          <br />
          <div className={hStyle.buttonContainer}>
            <Link to="/Schedule" style={{ textDecoration: "none" }}>
              <Button
                type="submit"
                className={hStyle.button}
                startIcon={<EventIcon />}
              >
                Quick Schedule
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* <div className={hStyle.horizontalContainer}> */}
      <div className={hStyle.verticalContainer}>
        <img
          src={SandglassGraphic}
          alt="Degree Planner Graphic"
          className={hStyle.loginImage}
        />
        <div className={hStyle.content}>
          <h3>Not sure where to start?</h3>
          <br />
          You are a click away from all the majors and minors requirement at
          Tufts.
          <br />
          Look for an existing degree requirement and add it to your list!
          <br />
          <br />
          <Link to="/DegreeRequirement" style={{ textDecoration: "none" }}>
            <Button
              type="submit"
              className={hStyle.button}
              startIcon={<FlightTakeoffIcon />}
            >
              Search
            </Button>
          </Link>
          <br />
          <br /> <br />
        </div>
      </div>

      <div className={hStyle.verticalContainer}>
        <img
          src={DegreeGraphic}
          alt="Degree Planner Graphic"
          className={hStyle.loginImage}
        />
        <div className={hStyle.content}>
          <h3>
            Ready to plan your <h1>JARney</h1> with us?
          </h3>
          <br />
          Fall, Spring, Summer, or Annual.
          <br />
          We have the complete list of courses, so plan ahead for your college
          journey using our degree planner!
          <br />
          <br />
          <Link to="/DegreePlan" style={{ textDecoration: "none" }}>
            <Button
              type="submit"
              className={hStyle.button}
              startIcon={<FlightIcon />}
            >
              Plan
            </Button>
          </Link>
          <br />
          <br />
        </div>
      </div>

      <div
        className={hStyle.verticalContainer}
        style={{ backgroundColor: "#efebf9" }}
      >
        <img
          src={SchedulerGraphic}
          alt="Scheduler Graphic"
          className={hStyle.loginImage}
        />
        <div className={hStyle.content}>
          <h3>Hate Mondays, Fridays, and 8AM classes?</h3>
          <br />
          Plan for each semester with the help of our semesterly scheduling
          tool.
          <br />
          From time preferences to attribute-filtering, easily create the most
          efficient schedule for your semester!
          <br />
          <br />
          <Link to="/Schedule" style={{ textDecoration: "none" }}>
            <Button
              type="submit"
              className={hStyle.button}
              startIcon={<EventIcon />}
            >
              Quick Schedule
            </Button>
          </Link>
          <br />
        </div>
      </div>

      {/* </div> */}

      {/* <div
        className={hStyle.footerContainer}
        style={{ backgroundColor: "#a0c3d1" }}
      >
        <img
          src={JarneyGraphic}
          alt="Scheduler Graphic"
          className={hStyle.logoImage}
        />
        <div className={hStyle.footerContent}>
          Hope you enjoyed this upgraded SIS.
          <br />
          Visit us on instagram for most updated information!
          <br />
          <a
            href="https://www.instagram.com/jarneyclub/"
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <Button
              type="submit"
              className={hStyle.button}
              startIcon={<InstagramIcon />}
            >
              jarneyclub
            </Button>
          </a>
        </div>
      </div> */}

      {(loginPopup || signupPopup) && (
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
          ></JarUserLogin>
        </Popup>
      )}
    </div>
  );
}

export default Home;
