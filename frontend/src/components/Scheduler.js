/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Scheduler.js
 *
 *
 */

import { useState, useEffect } from "react";
import {
  InputAdornment,
  TextField,
  Button,
  FormControlLabel,
  FormControl,
  CircularProgress,
  FormGroup,
  FormLabel,
  IconButton,
} from "@material-ui/core";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import SearchIcon from "@material-ui/icons/Search";
import AddBoxIcon from "@material-ui/icons/AddBox";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import PurpleSwitch from "./reusable/PurpleSwitch";
import sStyle from "./style/Scheduler.module.css";
import Dropdown from "./reusable/Dropdown";

import Calendar from "./reusable/Calendar";
import CourseSearchBar from "./reusable/CourseSearchBar";
import TimePrefSelector from "./reusable/TimePrefSelector";
import SnackBarAlert from "./reusable/SnackBarAlert";
import JarUserLogin from "./reusable/JarUserLogin";
import Popup from "./reusable/Popup";
import {
  AddSchedule,
  RemoveSchedule,
  EditScheduleName,
} from "./reusable/SchedulerPopup";
import {
  DegreeReqExpress,
} from "./reusable/TabSwitch";

const timeDefault = [
  {
    time_earliest: "08:00",
    time_latest: "08:30",
  },
  {
    time_earliest: "08:30",
    time_latest: "09:00",
  },
  {
    time_earliest: "09:00",
    time_latest: "09:30",
  },
  {
    time_earliest: "09:30",
    time_latest: "10:00",
  },
  {
    time_earliest: "10:00",
    time_latest: "10:30",
  },
  {
    time_earliest: "10:30",
    time_latest: "11:00",
  },
  {
    time_earliest: "11:00",
    time_latest: "11:30",
  },
  {
    time_earliest: "11:30",
    time_latest: "12:00",
  },
  {
    time_earliest: "12:00",
    time_latest: "12:30",
  },
  {
    time_earliest: "12:30",
    time_latest: "13:00",
  },
  {
    time_earliest: "13:00",
    time_latest: "13:30",
  },
  {
    time_earliest: "13:30",
    time_latest: "14:00",
  },
  {
    time_earliest: "14:00",
    time_latest: "14:30",
  },
  {
    time_earliest: "14:30",
    time_latest: "15:00",
  },
  {
    time_earliest: "15:00",
    time_latest: "15:30",
  },
  {
    time_earliest: "15:30",
    time_latest: "16:00",
  },
  {
    time_earliest: "16:00",
    time_latest: "16:30",
  },
  {
    time_earliest: "16:30",
    time_latest: "17:00",
  },
  {
    time_earliest: "17:00",
    time_latest: "17:30",
  },
  {
    time_earliest: "17:30",
    time_latest: "18:00",
  },
  {
    time_earliest: "18:00",
    time_latest: "18:30",
  },
  {
    time_earliest: "18:30",
    time_latest: "19:00",
  },
  {
    time_earliest: "19:00",
    time_latest: "19:30",
  },
  {
    time_earliest: "19:30",
    time_latest: "20:00",
  },
  {
    time_earliest: "20:00",
    time_latest: "20:30",
  },
  {
    time_earliest: "20:30",
    time_latest: "21:00",
  },
];

const timePrefDefault = {
  Monday: timeDefault,
  Tuesday: timeDefault,
  Wednesday: timeDefault,
  Thursday: timeDefault,
  Friday: timeDefault,
};

const boolStateDefault = {
  waitlist: true,
  closed: true,
  online: true,
  time_unspecified: true,
  timePrefState: false,
};

function Scheduler(props) {
  const {
    shrink,
    logged,
    switchLogged,
    loginPopup,
    signupPopup,
    handleLoginPopup,
    handleSignupPopup,
    handleLogRequired,
  } = props;

  /* schedule Dropdown */
  const [scheduleOptions, setScheduleOptions] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [selectedScheduleID, setSelectedScheduleID] = useState("");
  /* filter Dropdown */
  const [attributes, setAttributes] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState("");

  const [coursePreference, setCoursePreference] = useState(boolStateDefault);

  const [selectedCourses, setSelectedCourses] = useState(
    []
  ); /*  The courses selected to generate schedule  */

  const [classes, setClasses] = useState({});

  const [degreeReqTab, setDegreeReqTab] = useState(1);
  const [searchCourseResult, setSearchCourseResult] = useState([]); // the list of courses returned by GET request
  const [courseSearchValue, setCourseSearchValue] = useState(""); // the course search value that will be given to GET request ^^
  const [loadMessage, setLoadMessage] = useState(true);
  const [timePrefState, setTimePrefState] = useState(false); // state of time pref overlay
  const [timePref, setTimePref] = useState(timePrefDefault); // time pref json that will be passed into post req

  const [popup, setPopup] = useState({
    editScheduleName: false,
    removeSchedule: false,
    addSchedule: false,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState();
  const [alertSeverity, setAlertSeverity] = useState();

  /*  Control for schedule plan dropdown change  */
  const handleScheduleChange = (e) => {
    setSelectedSchedule(e.target.value);
    const ind = scheduleOptions.findIndex(
      (sched) => sched.sched_name === e.target.value.substr(3)
    );
    setSelectedScheduleID(scheduleOptions[ind].sched_id);
    setSelectedCourses(scheduleOptions[ind].courses)
  };

  /*  Control for search filter dropdown change  */
  const handleFilterChange = (e) => {
    setSelectedAttribute(e.target.value);
  };

  const handlePopup = (field, bit) => {
    setPopup((prev) => ({
      ...prev,
      [field]: bit,
    }));
  };

  const handleAddTimePref = (dayName, timeValue) => {
    console.log("start time: ", timeValue);
    const latest = timeValue.split(":");
    let latestTime;
    /*  Computes the latest time value from start time */
    if (latest[1] === "00") {
      latestTime = `${latest[0]}:30`;
    } else if (parseInt(latest[0], 10) < 9) {
      latestTime = `0${(parseInt(latest[0], 10) + 1).toString()}:00`;
    } else {
      latestTime = `${(parseInt(latest[0], 10) + 1).toString()}:00`;
    }
    setTimePref((prev) => ({
      ...prev,
      [dayName]: [
        ...prev[dayName].map((obj) => obj),
        {
          time_earliest: timeValue,
          time_latest: latestTime,
        },
      ],
    }));
    console.log(timePref, dayName);
  };

  const handleCoursePrefChange = (field) => {
    console.log("coursePref waitlist", coursePreference[field]);
    setCoursePreference((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleRemoveTimePref = (dayName, timeValue) => {
    setTimePref((prev) => ({
      ...prev,
      [dayName]: prev[dayName].filter((obj) => obj.time_earliest !== timeValue),
    }));
  };

  const handleAddAllDayTimePref = (dayName) => {
    setTimePref((prev) => ({
      ...prev,
      [dayName]: timeDefault,
    }));
  };

  const handleRemoveAllDayTimePref = (dayName) => {
    setTimePref((prev) => ({
      ...prev,
      [dayName]: {},
    }));
  };

  const handleSearchChange = (e) => {
    setCourseSearchValue(e.target.value);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  /*
   *  checkCourseAdded()
   *  purpose: checks if a course is already in the selected course list
   */
  const checkCourseAdded = (courseID) => {
    for (let course of selectedCourses) {
      if (course.term_course_id === courseID) {
        console.log("false: course:", course, " courseID:", courseID);
        return false;
      }
    }
    return true;
  };

  /*
   *  handleDoubleClickCourseList()
   *  purpose: for courseSearchBar, adds course to selectedCourseList
   */
  const handleDoubleClickCourseList = (courseDetail) => {
    console.log("course to be added: ", courseDetail);
    if (checkCourseAdded(courseDetail.term_course_id)) {
      setSelectedCourses((prev) => [...prev, courseDetail]);
      console.log("course added: ", selectedCourses);
    } else {
      setAlertMessage("Course was already added!");
      setAlertSeverity("error");
      setShowAlert(true);
    }
  };

  /*
   *  handleDoubleClickSelected()
   *  purpose: for courseSearchBar, removes course from selectedCourseList
   */
  const handleDoubleClickSelected = (courseDetail) => {
    setSelectedCourses((prev) =>
      prev.filter(
        (course) => course.term_course_id !== courseDetail.term_course_id
      )
    );
  };

  const fetchSavedSchedules = async () => {
    await fetch("https://jarney.club/api/schedules")
      .then((response) => response.json())
      .then((result) => {
        console.log("result from fetchSavedSchedule", result);
        if (result.schedules.length === 0) {
          fetchCreateSchedule("Schedule #1");
        } else {
          setScheduleOptions(result.schedules);
          setSelectedSchedule(result.schedules[0].sched_name);
          setSelectedScheduleID(result.schedules[0].sched_id);
          setSelectedCourses(result.schedules[0].courses);
        }
      })
      .catch((error) => console.log("error from fetchSavedSchedules", error));
  };

  const fetchAttributes = async () => {
    await fetch("https://jarney.club/api/courses/attributes")
      .then((response) => response.json())
      .then(
        (result) => {
          setAttributes(result.attributes);
        },
        (error) => {
          console.log("error from Scheduler attribute ", error);
        }
      );
  };

  const fetchGenerateSchedule = async () => {
    const requestOption = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sched_id: selectedScheduleID,
        term_course_ids: selectedCourses.map((course) => course.term_course_id),
        filter: {
          misc: {
            ignoreTU: coursePreference.time_unspecified,
            ignoreM: coursePreference.online,
            ignoreClosed: coursePreference.closed,
            ignoreWL: coursePreference.waitlist,
          },
          time: timePref,
        },
      }),
    };
    await fetch("https://jarney.club/api/schedule", requestOption)
      .then((response) => response.json())
      .then((result) => {
        console.log("generate schedule result: ", result);
        setClasses(result.data.classes);
      })
      .catch((error) => {
        console.log("generate schedule error: ", error);
        setAlertMessage(error);
        setAlertSeverity("error");
        setShowAlert(true);
      });
  };

  const fetchCreateSchedule = async (newName) => {
    const requestOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sched_name: newName }),
    };
    await fetch("https://jarney.club/api/schedule", requestOption)
      .then((response) => response.json())
      .then((result) => {
        console.log("create schedule result: ", result);
        // refresh
        fetchSavedSchedules();
        setAlertMessage("Create success!");
        setAlertSeverity("success");
        setShowAlert(true);
      })
      .catch((error) => console.log("generate schedule error: ", error));
  };

  useEffect(() => {
    fetchAttributes();
    fetchSavedSchedules();
    handleLogRequired(true);
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoadMessage(true);
      await fetch(
        "https://jarney.club/api/courses/term?cnum="
          .concat(courseSearchValue)
          .concat("&attr=")
          .concat(selectedAttribute)
      )
        .then((response) => response.json())
        .then((result) => {
          setSearchCourseResult([]);
          setSearchCourseResult(result.courses);
          setLoadMessage(false);
          console.log("show results: ", result);
        })
        .catch((error) => {
          setSearchCourseResult([]);
          console.log("error from Scheduler course search", error);
        });
    }
    fetchData();
  }, [courseSearchValue, selectedAttribute]);

  return (
    <div>
      <div className={sStyle.horizontalWrapper}>
        <div className={sStyle.leftColumnWrapper}>
          {/* CourseContainer 
                        Contains: 
                        1. searhCourse
                        2. courseList
                        3. preferenceContainer 
                    */}
          <div className={sStyle.courseContainer}>
            <div className={sStyle.searchCourseContainer}>
              <TextField
                // label="Search Course"
                placeholder="Search Course"
                onChange={handleSearchChange}
                value={courseSearchValue}
                type="text"
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                className={sStyle.inputSearch}
              />
              <div className={sStyle.filterContainer}>
                <Dropdown
                  classes={sStyle.dropdown}
                  options={attributes}
                  selectedOption={selectedAttribute}
                  onOptionChange={handleFilterChange}
                  labelId="filter"
                  labelName="Filter"
                />
              </div>
            </div>

            <div className={sStyle.courseListContainer}>
              {loadMessage && courseSearchValue !== "" && <CircularProgress />}
              {!loadMessage &&
                searchCourseResult?.map((course) => (
                  <CourseSearchBar
                    courseDetail={course}
                    key={course.course_num.concat(course.course_title)}
                    draggable={false}
                    onDoubleClick={handleDoubleClickCourseList}
                    origin={"schedulerCourseList"}
                    customStyle={{
                      border: "none",
                      justifyContent: "space-between",
                    }}
                  />
                ))}
            </div>

            <div className={sStyle.preferenceContainer}>
              <FormControl className={sStyle.leftCheckboxContainer}>
                <FormLabel>Generate Schedule With:</FormLabel>
                <FormGroup row={true}>
                  <FormControlLabel
                    control={
                      <PurpleSwitch
                        checked={coursePreference.waitlist}
                        name="waitlist"
                        onChange={() => handleCoursePrefChange("waitlist")}
                      />
                    }
                    label="Waitlist"
                  />
                  <FormControlLabel
                    control={
                      <PurpleSwitch
                        checked={coursePreference.closed}
                        name="closed"
                        onChange={() => handleCoursePrefChange("closed")}
                      />
                    }
                    label="Closed"
                  />
                  <FormControlLabel
                    control={
                      <PurpleSwitch
                        checked={coursePreference.online}
                        name="online"
                        onChange={() => handleCoursePrefChange("online")}
                      />
                    }
                    label="Online"
                  />
                  <FormControlLabel
                    control={
                      <PurpleSwitch
                        checked={coursePreference.time_unspecified}
                        name="time_unspecified"
                        onChange={() =>
                          handleCoursePrefChange("time_unspecified")
                        }
                      />
                    }
                    label="Time Unspecified"
                  />
                </FormGroup>
                <Button
                  className={sStyle.timePrefButton}
                  onClick={() => setTimePrefState(true)}
                  startIcon={<QueryBuilderIcon />}
                >
                  Edit time preference
                </Button>
              </FormControl>
            </div>
          </div>
          <div className={sStyle.rightButtonContainer}>
            <Button
              className={sStyle.renderButton}
              onClick={fetchGenerateSchedule}
            >
              Render schedule
            </Button>
          </div>
          <div className={sStyle.tabsContainer}>
            <div className={sStyle.tabBarsContainer}>
              <div
                role="button"
                tabIndex={0}
                className={
                  degreeReqTab === 1 ? sStyle.tabBarHighlight : sStyle.tabBar
                }
                onClick={() => {
                  setDegreeReqTab(1);
                }}
              >
                <div>
                  Selected <br /> Courses
                </div>
              </div>
              <div
                role="button"
                tabIndex={0}
                className={
                  degreeReqTab === 2 ? sStyle.tabBarHighlight : sStyle.tabBar
                }
                onClick={() => {
                  setDegreeReqTab(2);
                }}
              >
                <div>
                  Degree <br /> Requirements
                </div>
              </div>
              <div
                role="button"
                tabIndex={0}
                className={
                  degreeReqTab === 3 ? sStyle.tabBarHighlight : sStyle.tabBar
                }
                onClick={() => {
                  setDegreeReqTab(3);
                }}
              >
                <div>Degree Plan</div>
              </div>
            </div>

            <div className={sStyle.tabDetailContainer}>
              {degreeReqTab === 1 &&
                selectedCourses?.map((course) => (
                  <CourseSearchBar
                    courseDetail={course}
                    key={course.course_num.concat(course.course_title)}
                    draggable={false}
                    onDoubleClick={handleDoubleClickSelected}
                    origin={"schedulerTab"}
                    customStyle={{
                      border: "none",
                      justifyContent: "space-between",
                    }}
                  />
                ))
              }
              {
                degreeReqTab === 2 && 
                  <DegreeReqExpress />
              }

            </div>
          </div>
        </div>

        <div className={sStyle.rightColumnWrapper}>
          <div className={sStyle.scheduleTitleContainer}>
            <Dropdown
              options={scheduleOptions}
              selectedOption={selectedSchedule}
              onOptionChange={handleScheduleChange}
              customStyle={{ fontSize: "20px" }}
              isObject={true}
              objectField={"sched_name"}
            />
            &nbsp;
            <IconButton
              className={sStyle.editPlanButton}
              onClick={() => handlePopup("editScheduleName", true)}
            >
              <ModeEditIcon fontSize="medium" />
            </IconButton>
            &nbsp;
            <IconButton
              className={sStyle.editPlanButton}
              onClick={() => handlePopup("addSchedule", true)}
            >
              <AddBoxIcon fontSize="medium" />
            </IconButton>
            &nbsp;
            <IconButton
              className={sStyle.editPlanButton}
              onClick={() => handlePopup("removeSchedule", true)}
            >
              <IndeterminateCheckBoxIcon fontSize="medium" />
            </IconButton>
            <div />
          </div>

          <div className={sStyle.calendarContainer}>
            <Calendar
              timePrefState={timePrefState}
              shrink={shrink}
              classes={classes}
            />
          </div>
        </div>
      </div>
      {/* popups */}
      {popup.addSchedule && (
        <Popup onClose={() => handlePopup("addSchedule", false)}>
          <AddSchedule
            onClose={() => handlePopup("addSchedule", false)}
            onCreateSchedule={fetchCreateSchedule}
            scheduleOptions={scheduleOptions}
          />
        </Popup>
      )}
      {popup.removeSchedule && (
        <Popup onClose={() => handlePopup("removeSchedule", false)}>
          <RemoveSchedule
            onClose={() => handlePopup("removeSchedule", false)}
            scheduleID={selectedScheduleID}
            onShowAlert={() => setShowAlert(true)}
            setAlertMessage={setAlertMessage}
            setAlertSeverity={setAlertSeverity}
          />
        </Popup>
      )}
      {popup.editScheduleName && (
        <Popup onClose={() => handlePopup("editScheduleName", false)}>
          <EditScheduleName
            onClose={() => handlePopup("editScheduleName", false)}
            onShowAlert={() => setShowAlert(true)}
            setAlertMessage={setAlertMessage}
            setAlertSeverity={setAlertSeverity}
          />
        </Popup>
      )}
      {timePrefState && (
        <TimePrefSelector
          onAddTimePref={handleAddTimePref}
          onRemoveTimePref={handleRemoveTimePref}
          onRemoveEntireDay={handleRemoveAllDayTimePref}
          onAddEntireDay={handleAddAllDayTimePref}
          timePrefState={timePrefState}
          timePref={timePref}
          onClose={() => setTimePrefState(false)}
          shrink={shrink}
        />
      )}
      {showAlert && (
        <SnackBarAlert
          severity={alertSeverity}
          onCloseAlert={handleCloseAlert}
          showAlert={showAlert}
          message={alertMessage}
        />
      )}
      {!logged && (
        <Popup onClose={handleLoginPopup}>
          <JarUserLogin
            forcedPopup={true}
            switchLogged={switchLogged}
            loginState={loginPopup}
            signupState={signupPopup}
            onClose={() => {
              handleLoginPopup(false, false);
              handleSignupPopup(false, false);
            }}
            onSwitch={() => {
              handleLoginPopup(true);
              handleSignupPopup(true);
            }}
          ></JarUserLogin>
        </Popup>
      )}
    </div>
  );
}

export default Scheduler;
