/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * LoginPage.js
 *
 * This is a page that prompts the user to choose between login into an
 * existing account, create an account, or use the app as a guest user.
 */

import { useState } from "react";
import { Button } from "@material-ui/core";
import hStyle from "./style/Home.module.css";
import LoginGraphic from "./res/JARney_Img.png";
import DegreeGraphic from "./res/Icon_DegreePlanner.png";
import SchedulerGraphic from "./res/Icon_Scheduler.png";
import Popup from "./reusable/Popup";
import JarUserLogin from "./reusable/JarUserLogin";

function Home() {
  const [loginPopup, setLoginPopup] = useState(false);
  const [signupPopup, setSignupPopup] = useState(false);

  const handleLoginPopup = () => {
    setLoginPopup((prev) => !prev);
  };

  const handleSignupPopup = () => {
    setSignupPopup((prev) => !prev);
  };

  return (
    <div className={hStyle.homeContainer}>
      <div className={hStyle.horizontalContainer}>
        <div className={hStyle.loginGraphicContainer}>
          <img
            src={LoginGraphic}
            alt="LoginGraphic"
            className={hStyle.loginImage}
          />
        </div>
        <div className={hStyle.verticalContainer}>
          <div className={hStyle.bodyContainer}>
            <h1 style={{ fontSize: "70px" }}>JARney.</h1>
            <div className={hStyle.content}>
              Plan out your Tufts experience, from four-year (or five-year!)
              plans to semesterly schedules.
              <br />
              Created by Tufts students, for Tufts students.
            </div>
          </div>

          <div className={hStyle.buttonContainer}>
            <Button
              type="submit"
              className={hStyle.button}
              onClick={() => setLoginPopup(true)}
            >
              Start Your JARney 🏊
            </Button>
            <br />
          </div>
        </div>
      </div>
      <div className={hStyle.horizontalContainer}>
        <img
          src={DegreeGraphic}
          alt="Degree Planner Graphic"
          className={hStyle.loginImage}
        />
        <div className={hStyle.content}>
          <h2>Degree Planner</h2>
          Plan ahead for your college journey using our degree planner!
        </div>
      </div>
      <div className={hStyle.horizontalContainer}>
        <div className={hStyle.content}>
          <h2>Semesterly Scheduling</h2>
          Plan for each semester with the help of our semesterly scheduling
          tool! From time preferences to attribute-filtering, easily create the
          most efficient schedule for your semester.
        </div>
        <img
          src={SchedulerGraphic}
          alt="Scheduler Graphic"
          className={hStyle.schedulerImage}
        />
      </div>

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
