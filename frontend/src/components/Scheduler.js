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
  Switch,
  FormControl,
  InputLabel,
  FormLabel,
  FormGroup,
  makeStyles,
} from "@material-ui/core";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import SearchIcon from "@material-ui/icons/Search";
import { useLovelySwitchStyles } from "@mui-treasury/styles/switch/lovely";
import sStyle from "./style/Scheduler.module.css";
import Dropdown from "./reusable/Dropdown";
import dStyle from "./reusable/reusableStyles/Dropdown.module.css";
import Calendar from "./reusable/Calendar";
import CourseSearchBar from "./reusable/CourseSearchBar";
const timePrefDefault = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
};

function Scheduler(props) {
  const { shrink } = props;
  /* schedule Dropdown */
  const [scheduleOptions, setScheduleOptions] = useState([1, 2, 3, 4, 5]);
  const [selectedSchedule, setSelectedSchedule] = useState(scheduleOptions[0]);

  /* filter Dropdown */
  const [filterOptions, setFilterOption] = useState([
    "",
    "SOE Computing",
    "SOE Engineering",
    "SOE HASS",
    "SOE HASS-Arts",
    "SOE HASS-Humanities",
  ]);
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);

  const [waitlist, setWaitlist] = useState(true);
  const [closed, setClosed] = useState(true);

  const [scheduleTitle, setScheduleTitle] = useState("Schedule#1  Placeholder");
  const [degreeReqTab, setDegreeReqTab] = useState(1);
  const [searchCourseResult, setSearchCourseResult] = useState([]); // the list of courses returned by GET request
  const [courseSearchValue, setCourseSearchValue] = useState(""); // the course search value that will be given to GET request ^^
  const [loadMessage, setLoadMessage] = useState(true);
  const [timePrefState, setTimePrefState] = useState(false); // state of time pref overlay
  const [timePref, setTimePref] = useState(timePrefDefault); // time pref json that will be passed into post req

  /*  Control for schedule plan dropdown change  */
  const handleScheduleChange = (e) => {
    setSelectedSchedule(e.target.value);
  };

  /*  Control for search filter dropdown change  */
  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
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
  const switchStyle = useLovelySwitchStyles();
  // const useStyles = makeStyles({
  //     select: {
  //       "&&": {
  //         paddingRight: 0,
  //       },
  //     },
  // })
  // const classes = useStyles();

  useEffect(() => {
    async function fetchData() {
      setLoadMessage(true);
      await fetch(
        "https://jarney.club/api/courses/general?cnum="
          .concat(courseSearchValue)
          .concat("&attr=")
          .concat(selectedFilter)
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
  }, [courseSearchValue, selectedFilter]);

  return (
    <div>
      <div className={sStyle.horizontalWrapper}>
        <div className={sStyle.leftColumnWrapper}>
          {/* Semester Plan Selector */}
          {/* <div className={sStyle.scheduleSelectorContainer}>
            <Dropdown
              options={scheduleOptions}
              selectedOption={selectedSchedule}
              onOptionChange={handleScheduleChange}
              labelId="schedule_plan"
              labelName="Schedule Plan"
            />
          </div> */}

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
                  options={filterOptions}
                  selectedOption={selectedFilter}
                  onOptionChange={handleFilterChange}
                  labelId="filter"
                  labelName="Filter"
                />
              </div>
            </div>

            <div className={sStyle.courseListContainer}>
              {loadMessage && <div>Loading...</div>}
              {searchCourseResult?.map((course) => (
                <CourseSearchBar
                  courseDetail={course}
                  key={course.course_num.concat(course.course_title)}
                />
              ))}
            </div>

            <div className={sStyle.preferenceContainer}>
              <FormControl className={sStyle.leftCheckboxContainer}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        classes={switchStyle}
                        checked={waitlist}
                        name="waitlist"
                        onChange={() => setWaitlist((prev) => !prev)}
                      />
                    }
                    label="Include Waitlist"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        classes={switchStyle}
                        checked={closed}
                        name="closed"
                        onChange={() => setClosed((prev) => !prev)}
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
                  SELECTED <br /> COURSES
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
                  DEGREE <br /> REQUIREMENTS
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
                <div>DEGREE PLAN</div>
              </div>
            </div>

            <div className={sStyle.tabDetailContainer} />
          </div>
        </div>

        <div className={sStyle.rightColumnWrapper}>
          <div className={sStyle.scheduleTitleContainer}>
            <Dropdown
              options={scheduleOptions}
              selectedOption={selectedSchedule}
              onOptionChange={handleScheduleChange}
              customStyle={{}}
            />

            <br />
          </div>

          <div className={sStyle.calendarContainer}>
            <Calendar timePrefState={timePrefState} />
          </div>
        </div>
      </div>

      {timePrefState && (
        <div className={sStyle.timePrefOverlay}>
          <div className={sStyle.overlayTitleContainer}>
            <div className={sStyle.overlayTitle}>
              Drag or Click to Select Your Preferred Time Frame
            </div>
            <div>
              **Time Frame Set for the Entire Day if No Selection Made For the
              Day**
            </div>
          </div>
          <br />
          <Button
            className={sStyle.timePrefButton}
            onClick={() => setTimePrefState((prev) => !prev)}
          >
            Save Time Preference
          </Button>
          <br />
          {/* This is the OVERLAY CALENDAR */}
          <div className={sStyle.overlayCalendarContainer}>
            <Calendar
              timePrefState={timePrefState}
              timePref={timePref}
              handleAddTimePref={handleAddTimePref}
              handleRemoveTimePref={handleRemoveTimePref}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Scheduler;
