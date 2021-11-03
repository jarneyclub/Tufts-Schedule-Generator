/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * JarUserLogin.js
 * This
 * Inherited Props:
 *      o
 *
 */

import React, { useEffect, useState } from "react";
import CancelIcon from "@material-ui/icons/Cancel";
import { IconButton, Button, CircularProgress } from "@material-ui/core";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import SnackBarAlert from "./SnackBarAlert";
import "./reusableStyles/LoginForm.module.css";
import jStyle from "./reusableStyles/JarUserLogin.module.css";
import { string } from "prop-types";

/* scripts */

// function JarUserLogin(props) {
const JarUserLogin = React.forwardRef((props, ref) => {
  const {
    onClose,
    onSwitch,
    loginState,
    signupState,
    forcedPopup,
    switchLogged,
  } = props;
  const [loginValues, setLoginValues] = useState({});
  const [loadMessage, setLoadMessage] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState();
  const [alertSeverity, setAlertSeverity] = useState();

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleClose = () => {
    onClose();
  };

  /*  switches from login to signup, vice versa  */
  const handleSwitch = () => {
    onSwitch();
  };

  const handleAlert = (severity: Boolean, message: String) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);
  };

  const handleSubmit = async (values) => {
    setLoadMessage(true);

    const requestOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    };

    if (loginState) {
      await fetch("https://jarney.club/api/auth/login", requestOption)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failed to login.");
        })
        .then((result) => {
          setLoadMessage(false);
          switchLogged && switchLogged();
          onClose();

          
        })
        .catch((error) => {
          setLoadMessage(false);
          handleAlert("error", "Error: Failed to Login");
        });
    } else {
      await fetch("https://jarney.club/api/auth/register", requestOption)
        .then((response) => {
          return response.json();
        })
        .then((result) => {
          if (result.errors.length === 0) {
            setLoadMessage(false);
            switchLogged && switchLogged();
            onClose();
          } else {
            setLoadMessage(false);
            setAlertMessage(result.errors[0].detail);
            setAlertSeverity("warning");
            setShowAlert(true);
          }
          
        })
        .catch((error) => {});
    }
  };

  return (
    <div className={jStyle.loginContainer}>
      <div className={jStyle.headerContainer}>
        {!forcedPopup && (
          <IconButton onClick={handleClose} className={jStyle.closeButton}>
            <CancelIcon />
          </IconButton>
        )}

        <div className={jStyle.headerBody}>
          {loginState ? "Open my JAR" : "Get my JAR"}&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        {!forcedPopup && <div />}
      </div>
      {loadMessage && <CircularProgress />}
      {!loadMessage && (
        <div className={jStyle.formContainer}>
          {loginState ? (
            <div>
              <LoginForm onSubmit={handleSubmit} />
            </div>
          ) : (
            <div>
              <SignupForm onSubmit={handleSubmit} />
            </div>
          )}
        </div>
      )}
      {!loadMessage && (
        <Button onClick={handleSwitch} className={jStyle.linkButton}>
          {loginState
            ? "--- Create my JAR Account ---"
            : "--- Log in to my JAR Account---"}
        </Button>
      )}
      <SnackBarAlert
        showAlert={showAlert}
        onCloseAlert={handleCloseAlert}
        severity={alertSeverity}
        message={alertMessage}
      />
    </div>
  );
});

export default JarUserLogin;
