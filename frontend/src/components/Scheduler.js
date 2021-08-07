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
} from "@material-ui/core";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import SearchIcon from "@material-ui/icons/Search";
import { withStyles } from "@material-ui/core/styles";
import PurpleSwitch from "./reusable/PurpleSwitch";
import { useLovelySwitchStyles } from "@mui-treasury/styles/switch/lovely";
import sStyle from "./style/Scheduler.module.css";
import Dropdown from "./reusable/Dropdown";

import Calendar from "./reusable/Calendar";
import CourseSearchBar from "./reusable/CourseSearchBar";
import TimePrefSelector from "./reusable/TimePrefSelector";
import SnackBarAlert from "./reusable/SnackBarAlert";

const timePrefDefault = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
};

const boolStateDefault = {
  waitlist: true,
  closed: true,
  online: true,
  time_unspecified: true,
  timePrefState: false,
};

function Scheduler(props) {
  const { shrink } = props;
  /* schedule Dropdown */
  const [scheduleOptions, setScheduleOptions] = useState([1, 2, 3, 4, 5]);
  const [selectedSchedule, setSelectedSchedule] = useState(scheduleOptions[0]);

  /* filter Dropdown */
  const [attributes, setAttributes] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState("attributes[0]");

  const [coursePreference, setCoursePreference] = useState(boolStateDefault);

  const [selectedCourses, setSelectedCourses] = useState(
    []
  ); /*  The courses selected to generate schedule  */

  const [degreeReqTab, setDegreeReqTab] = useState(1);
  const [searchCourseResult, setSearchCourseResult] = useState([]); // the list of courses returned by GET request
  const [courseSearchValue, setCourseSearchValue] = useState(""); // the course search value that will be given to GET request ^^
  const [loadMessage, setLoadMessage] = useState(true);
  const [timePrefState, setTimePrefState] = useState(false); // state of time pref overlay
  const [timePref, setTimePref] = useState(timePrefDefault); // time pref json that will be passed into post req

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState();
  const [alertSeverity, setAlertSeverity] = useState();

  /*  Control for schedule plan dropdown change  */
  const handleScheduleChange = (e) => {
    setSelectedSchedule(e.target.value);
  };

  /*  Control for search filter dropdown change  */
  const handleFilterChange = (e) => {
    setSelectedAttribute(e.target.value);
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

  const handleSearchChange = (e) => {
    setCourseSearchValue(e.target.value);
  };

  /* toggle switch style */
  // const switchStyle = useLovelySwitchStyles();
  // const useStyles = makeStyles({
  //     select: {
  //       "&&": {
  //         paddingRight: 0,
  //       },
  //     },
  // })
  // const classes = useStyles();

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  /*
   *  checkCourseAdded()
   *  purpose: checks if a course is already in the selected course list
   */
  const checkCourseAdded = (courseID) => {
    for (let course of selectedCourses) {
      if (course.gen_course_id === courseID) {
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
    if (checkCourseAdded(courseDetail.gen_course_id)) {
      setSelectedCourses((prev) => [...prev, courseDetail]);
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
        (course) => course.gen_course_id !== courseDetail.gen_course_id
      )
    );
  };

  useEffect(() => {
    async function fetchAttributes() {
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
    }

    fetchAttributes();
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoadMessage(true);
      await fetch(
        "https://jarney.club/api/courses/general?cnum="
          .concat(courseSearchValue)
          .concat("&attr=")
          .concat(selectedAttribute)
      )
        .then((response) => response.json())
        .then(
          (result) => {
            setLoadMessage(false);
            setSearchCourseResult(result.courses);
          },
          (error) => {
            setSearchCourseResult([]);
            console.log("error from Scheduler course search", error);
          }
        );
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
                <FormGroup>
                  <FormControlLabel
                    control={
                      <PurpleSwitch
                        checked={coursePreference.waitlist}
                        name="waitlist"
                        onChange={() => handleCoursePrefChange("waitlist")}
                      />
                    }
                    label="Include Waitlist"
                  />
                  <FormControlLabel
                    control={
                      <PurpleSwitch
                        checked={coursePreference.closed}
                        name="closed"
                        onChange={() => handleCoursePrefChange("closed")}
                      />
                    }
                    label="Include Closed"
                  />
                </FormGroup>
                <Button
                  className={sStyle.timePrefButton}
                  onClick={() => setTimePrefState((prev) => !prev)}
                  startIcon={<QueryBuilderIcon />}
                >
                  Time Preference
                </Button>
              </FormControl>

              <div className={sStyle.rightButtonContainer}>
                <Button className={sStyle.renderButton}>Render Schedule</Button>
              </div>
            </div>
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
                ))}
            </div>
          </div>
        </div>

        <div className={sStyle.rightColumnWrapper}>
          <div className={sStyle.scheduleTitleContainer}>
            <div />
            <Dropdown
              options={scheduleOptions}
              selectedOption={selectedSchedule}
              onOptionChange={handleScheduleChange}
              customStyle={{ fontSize: "20px" }}
            />
            <div />
          </div>

          <div className={sStyle.calendarContainer}>
            <Calendar timePrefState={timePrefState} />
          </div>
        </div>
      </div>

      {timePrefState && (
        <TimePrefSelector
          onAddTimePref={handleAddTimePref}
          onRemoveTimePref={handleRemoveTimePref}
          timePrefState={timePrefState}
          timePref={timePref}
          onTimePrefStateChange={setTimePrefState}
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
    </div>
  );
}

export default Scheduler;
