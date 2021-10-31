/* eslint-disable no-unused-vars */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * SchedulerPopup.js
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
 *                           Edit Schedule Popup                            *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function EditScheduleName(props) {
  const {
    scheduleID,
    scheduleName,
    onClose,
    refreshSchedules,
    onShowAlert,
    setAlertMessage,
    setAlertSeverity,
  } = props;

  const [editName, setEditName] = useState(scheduleName);

  const handleClose = () => {
    onClose();
  };
  const handleEdit = (e) => {
    setEditName(e.target.value);
  };
  const handleSaveEdit = () => {
    /* do something API?? pass in the selectedCards arr */
    patchEditName();
  };

  const patchEditName = async () => {
    const requestOption = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sched_id: scheduleID,
        new_name: editName,
      }),
    };
    console.log("requestOption for fetchCreatePrivateReqs", requestOption);
    await fetch("https://jarney.club/api/schedule/name", requestOption)
      .then((response) => response.json())
      .then((result) => {
        console.log("result from editScheduleName: ", result);

        if (!result.error) {
          setAlertMessage("Schedule name changed!");
          setAlertSeverity("success");
          onShowAlert();
          refreshSchedules();
          onClose();
        } else {
          setAlertMessage(result.error);
          setAlertSeverity("warning");
          onShowAlert(true);
        }
      })
      .catch((error) => {
        console.log("error from editPlanName: ", error);
      });
  };

  return (
    <div className={pStyle.loginContainer}>
      <div className={pStyle.headerContainer}>
        <IconButton onClick={handleClose} className={pStyle.closeButton}>
          <CancelIcon />
        </IconButton>
        <div className={pStyle.headerBody}>
          EDIT PLAN NAME&nbsp;&nbsp;&nbsp;&nbsp;
        </div>

        <div />
      </div>
      <div className={pStyle.formContainer}>
        <div className={pStyle.inputBarContainer}>
          <TextField value={editName} onChange={handleEdit} />
        </div>

        <Button className={pStyle.submitButton} onClick={handleSaveEdit}>
          SAVE CHANGE
        </Button>
      </div>
    </div>
  );
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                          Add Schedule Popup                               *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function AddSchedule(props) {
  const { onClose, onCreateSchedule, scheduleOptions } = props;

  const [scheduleName, setScheduleName] = useState("");

  const handleClose = () => {
    onClose();
  };
  const handleNameChange = (e) => {
    setScheduleName(e.target.value);
  };

  const handleAdd = () => {
    /* do something API?? pass in the selectedCards arr */

    onCreateSchedule(scheduleName);
  };

  return (
    <div className={pStyle.loginContainer}>
      <div className={pStyle.headerContainer}>
        <IconButton onClick={handleClose} className={pStyle.closeButton}>
          <CancelIcon />
        </IconButton>
        <div className={pStyle.headerBody}>
          ADD SCHEDULE&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <div />
      </div>
      <div className={pStyle.formContainer}>
        <div className={pStyle.inputBarContainer}>
          <TextField value={scheduleName} onChange={handleNameChange} />
        </div>
        <Button className={pStyle.submitButton} onClick={handleAdd}>
          ADD
        </Button>
      </div>
    </div>
  );
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                            Remove Schedule Popup                          *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function RemoveSchedule(props) {
  const {
    onClose,
    scheduleName,
    scheduleID,
    refreshPlans,
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
    await fetch("https://jarney.club/api/schedule", {
      method: "DELETE",
      body: JSON.stringify({sched_id: scheduleID})
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("result from Degree plan Delete", result);

        if (!result.error) {
          refreshPlans();
          setAlertMessage("Schedule deleted!");
          setAlertSeverity("success");
          onShowAlert();
          onClose();
        } else {
          setAlertMessage(result.error);
          setAlertSeverity("warning");
          onShowAlert(true);
        }
      })
      .catch((error) => console.log("error from Degree Plan Delete", error));
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
          Are you sure you want to remove {scheduleName}?
        </div>
        <Button className={pStyle.cancelButton} onClick={handleClose}>
          CANCEL
        </Button>
        <br />
        <Button className={pStyle.submitButton} onClick={handleRemove}>
          REMOVE
        </Button>
      </div>
    </div>
  );
}

export { EditScheduleName, AddSchedule, RemoveSchedule };
