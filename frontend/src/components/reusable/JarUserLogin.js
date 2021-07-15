/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * JarUserLogin.js
 * This
 * Inherited Props:
 *      o
 *
 */

import { useEffect, useState } from "react";
import CancelIcon from "@material-ui/icons/Cancel";
import { IconButton, Button, CircularProgress } from "@material-ui/core";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import "./reusableStyles/LoginForm.module.css";
import jStyle from "./reusableStyles/JarUserLogin.module.css";

/* scripts */

function JarUserLogin(props) {
  const { onClose, onSwitch, loginState, signupState } = props;
  const [loginValues, setLoginValues] = useState({});
  const [loadMessage, setLoadMessage] = useState(false);

  const handleClose = () => {
    onClose();
  };

  /*  switches from login to signup, vice versa  */
  const handleSwitch = () => {
    onSwitch();
  };

  const handleSubmit = async (values) => {
    console.log("handleSubmit clicked ", values);
    setLoadMessage(true);
    if (loginState) {
      await fetch("https://jarney.club/api/auth/login", values)
        .then((response) => response.json())
        .then(
          (result) => {
            console.log("data: ", result.data);
            setLoadMessage(false);
            onClose();
          },
          (error) => {
            console.log("error: ", error);
          }
        );
    } else {
      const requestOption = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      };
      await fetch("https://jarney.club/api/auth/register", requestOption)
        .then((response) => response.json())
        .then(
          (result) => {
            console.log("data: ", result);
            setLoadMessage(false);
            onClose();
          },
          (error) => {
            console.log("error: ", error);
          }
        );
    }
  };

  return (
    <div className={jStyle.loginContainer}>
      <div className={jStyle.headerContainer}>
        <IconButton onClick={handleClose} className={jStyle.closeButton}>
          <CancelIcon />
        </IconButton>
        <div className={jStyle.headerBody}>
          {loginState ? "Open my JAR" : "Get my JAR"}
        </div>
        <div />
      </div>
      {loadMessage && <CircularProgress />}
      {!loadMessage && (
        <div className={jStyle.formContainer}>
          {loginState ? (
            <div>
              <LoginForm handleSubmit={handleSubmit} />
            </div>
          ) : (
            <div>
              <SignupForm handleSubmit={handleSubmit} />
            </div>
          )}
        </div>
      )}

      <Button onClick={handleSwitch} className={jStyle.linkButton}>
        {loginState
          ? "--- Create my JAR Account ---"
          : "--- Log in to my JAR Account---"}
      </Button>
    </div>
  );
}

export default JarUserLogin;
