/* eslint-disable no-unused-vars */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DegreePlan1Popup.js
 *
 *
 */

import { useEffect, useState } from "react";
import {
  Button,
  InputAdornment,
  TextField,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import AddBoxIcon from "@material-ui/icons/AddBox";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import CancelIcon from "@material-ui/icons/Cancel";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

import pStyle from "../reusable/reusableStyles/Popup.module.css";
import Popup from "../reusable/Popup";
import PlanCard from "../reusable/PlanCard";
import Dropdown from "../reusable/Dropdown";
import CourseSearchBar from "../reusable/CourseSearchBar";
import SnackBarAlert from "../reusable/SnackBarAlert";
import DegreeReqDisplay from "../reusable/DegreeReqDisplay";
import JarUserLogin from "../reusable/JarUserLogin";
import { json } from "body-parser";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                      Remove Private Requirement Popup                     *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function RemovePrivReq(props) {
  const {
    onClose,
    privateReqName,
    privateReqID,
    refreshPrivateReq,
    onShowAlert,
    setAlertMessage,
    setAlertSeverity,
  } = props;

  const handleClose = () => {
    onClose();
  };

  const handleRemove = () => {
    /* do something API?? pass in the selectedCards arr */
    fetchDelete();
  };

  const fetchDelete = async () => {
    await fetch(
      "https://jarney.club/api/degreereq/private/".concat(privateReqID),
      {
        method: "DELETE",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (!result.error) {
          refreshPrivateReq();
          setAlertMessage("Private requirement deleted!");
          setAlertSeverity("success");
          onShowAlert();
          onClose();
        } else {
          setAlertMessage(result.error);
          setAlertSeverity("warning");
          onShowAlert(true);
        }
      })
      .catch((error) => {});
  };

  return (
    <div className={pStyle.loginContainer}>
      <div className={pStyle.headerContainer}>
        <IconButton onClick={handleClose} className={pStyle.closeButton}>
          <CancelIcon />
        </IconButton>
        <div className={pStyle.headerBody}>&nbsp;</div>
        <div />
      </div>
      <div className={pStyle.formContainer}>
        <div className={pStyle.inputBarContainer}>
          Are you sure you want to remove {privateReqName}?
        </div>
        <Button className={pStyle.cancelButton} onClick={handleClose}>
          CANCEL
        </Button>
        <Button className={pStyle.submitButton} onClick={handleRemove}>
          REMOVE
        </Button>
      </div>
    </div>
  );
}

export { RemovePrivReq };
