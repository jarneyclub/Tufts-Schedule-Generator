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

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                           Edit Schedule Popup                            *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function EditScheduleName(props) {
  const { onClose, refreshPlans, planName, planID } = props;

  const [editName, setEditName] = useState(planName);

  const handleClose = () => {
    onClose();
  };
  const handleEdit = (e) => {
    setEditName(e.target.value);
  };
  const handleSaveEdit = () => {
    /* do something API?? pass in the selectedCards arr */
    patchEditName();
    refreshPlans();
    /* Then Close */
    onClose();
  };

  const patchEditName = async () => {
    const requestOption = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    };
    const url = "https://jarney.club/api/schedule"
      .concat(planID)
      .concat("/plan_name/")
      .concat(editName);
    console.log("requestOption for fetchCreatePrivateReqs", requestOption);
    await fetch(url, requestOption)
      .then((response) => response.json())
      .then((result) => console.log("result from editPlanName: ", result))
      .catch((error) => console.log("error from editPlanName: ", error));
  };

  return (
    <div className={pStyle.loginContainer}>
      <div className={pStyle.headerContainer}>
        <IconButton onClick={handleClose} className={pStyle.closeButton}>
          <CancelIcon />
        </IconButton>
        <div className={pStyle.headerBody}>EDIT PLAN NAME</div>

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
  const handleCheckDuplicate = () => {
    scheduleOptions?.map((opt) => {
      if (opt.sched_name === scheduleName) return true;
    });

    return false;
  };

  const handleAdd = () => {
    /* do something API?? pass in the selectedCards arr */
    if (!false) {
      onCreateSchedule(scheduleName);
      /* Then Close */
      onClose();
    } else {
      // give warning
    }
  };

  return (
    <div className={pStyle.loginContainer}>
      <div className={pStyle.headerContainer}>
        <IconButton onClick={handleClose} className={pStyle.closeButton}>
          <CancelIcon />
        </IconButton>
        <div className={pStyle.headerBody}>ADD SCHEDULE</div>
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
  const { onClose, planName, planID, refreshPlans } = props;

  const handleClose = () => {
    onClose();
  };

  const handleRemove = () => {
    /* do something API?? pass in the selectedCards arr */
    fetchDelete();
  };

  const fetchDelete = async () => {
    await fetch("https://jarney.club/api/degreeplan/".concat(planID), {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("result from Degree plan Delete", result);
        refreshPlans();
        onClose();
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
          Are you sure you want to remove {planName}?
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
