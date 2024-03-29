/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-unused-vars */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Scheduler.js
 *
 *
 */

import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
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
} from '@material-ui/core';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import LinkedCameraIcon from '@mui/icons-material/LinkedCamera';
import PurpleSwitch from './reusable/PurpleSwitch';
import sStyle from './style/Scheduler.module.css';
import Dropdown from './reusable/Dropdown';
import { ClickAwayListener } from '@mui/material';
import Calendar from './reusable/Calendar';
import CourseSearchBar from './reusable/CourseSearchBar';
import TimePrefSelector from './reusable/TimePrefSelector';
import SnackBarAlert from './reusable/SnackBarAlert';
import JarUserLogin from './reusable/JarUserLogin';
import Event from './reusable/Event';
import EventScreenshot from './reusable/EventScreenshot';
import Popup from './reusable/Popup';
import {
  AddSchedule,
  RemoveSchedule,
  EditScheduleName,
} from './reusable/SchedulerPopup';
import {
  DegreeReqExpress,
  DegreePlanExpress,
  CourseInfoExpress,
} from './reusable/TabSwitch';

const timeDefault = [
  {
    time_earliest: '08:00',
    time_latest: '08:30',
  },
  {
    time_earliest: '08:30',
    time_latest: '09:00',
  },
  {
    time_earliest: '09:00',
    time_latest: '09:30',
  },
  {
    time_earliest: '09:30',
    time_latest: '10:00',
  },
  {
    time_earliest: '10:00',
    time_latest: '10:30',
  },
  {
    time_earliest: '10:30',
    time_latest: '11:00',
  },
  {
    time_earliest: '11:00',
    time_latest: '11:30',
  },
  {
    time_earliest: '11:30',
    time_latest: '12:00',
  },
  {
    time_earliest: '12:00',
    time_latest: '12:30',
  },
  {
    time_earliest: '12:30',
    time_latest: '13:00',
  },
  {
    time_earliest: '13:00',
    time_latest: '13:30',
  },
  {
    time_earliest: '13:30',
    time_latest: '14:00',
  },
  {
    time_earliest: '14:00',
    time_latest: '14:30',
  },
  {
    time_earliest: '14:30',
    time_latest: '15:00',
  },
  {
    time_earliest: '15:00',
    time_latest: '15:30',
  },
  {
    time_earliest: '15:30',
    time_latest: '16:00',
  },
  {
    time_earliest: '16:00',
    time_latest: '16:30',
  },
  {
    time_earliest: '16:30',
    time_latest: '17:00',
  },
  {
    time_earliest: '17:00',
    time_latest: '17:30',
  },
  {
    time_earliest: '17:30',
    time_latest: '18:00',
  },
  {
    time_earliest: '18:00',
    time_latest: '18:30',
  },
  {
    time_earliest: '18:30',
    time_latest: '19:00',
  },
  {
    time_earliest: '19:00',
    time_latest: '19:30',
  },
  {
    time_earliest: '19:30',
    time_latest: '20:00',
  },
  {
    time_earliest: '20:00',
    time_latest: '20:30',
  },
  {
    time_earliest: '20:30',
    time_latest: '21:00',
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

const popupDefault = {
  editScheduleName: false,
  removeSchedule: false,
  addSchedule: false,
  showCourseInfo: false,
  eventScreenshot: false,
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
  const [scheduleExist, setScheduleExist] = useState(false);
  const [scheduleOptions, setScheduleOptions] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [selectedScheduleID, setSelectedScheduleID] = useState('');
  const [selectedScheduleIdx, setSelectedScheduleIdx] = useState(0);
  /* filter Dropdown */
  const [attributes, setAttributes] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [selectedAttributeIdx, setSelectedAttributeIdx] = useState(0);
  const [coursePreference, setCoursePreference] = useState(boolStateDefault);

  /*  The courses selected to generate schedule  */
  const [selectedCourses, setSelectedCourses] = useState([]);

  const [classes, setClasses] = useState({});

  const [degreeReqTab, setDegreeReqTab] = useState(1);
  const [searchCourseResult, setSearchCourseResult] = useState([]); // the list of courses returned by GET request
  const [courseSearchValue, setCourseSearchValue] = useState(''); // the course search value that will be given to GET request ^^
  const [loadMessage, setLoadMessage] = useState(true);
  const [timePrefState, setTimePrefState] = useState(false); // state of time pref overlay
  const [timePref, setTimePref] = useState(timePrefDefault); // time pref json that will be passed into post req

  const [popup, setPopup] = useState(popupDefault);

  const [courseInfo, setCourseInfo] = useState({});
  const [unitsCount, setUnitsCount] = useState(0);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState();
  const [alertSeverity, setAlertSeverity] = useState();
  const [dropdownDegreePlan, setDropdownDegreePlan] = useState(false);
  const [dropdownDegreeReq, setDropdownDegreeReq] = useState(false);
  const [reqBtnClicked, setReqBtnClicked] = useState(false);
  const [planBtnClicked, setPlanBtnClicked] = useState(false);


  /*  Control for schedule plan dropdown change  */
  const handleScheduleChange = (e) => {
    setSelectedSchedule(scheduleOptions[e.target.selectedIndex].sched_name);

    setSelectedScheduleIdx(e.target.selectedIndex);
    setSelectedScheduleID(scheduleOptions[e.target.selectedIndex].sched_id);
    setSelectedCourses(scheduleOptions[e.target.selectedIndex].courses);
    setClasses(scheduleOptions[e.target.selectedIndex]?.classes);
  };

  /* Control the dropdown for Degree Plan and Degree Requirement */
  const handleDegreeInfo = (field) => {
    if (field === "DegreePlan") {
      setDropdownDegreePlan(!dropdownDegreePlan);
      setPlanBtnClicked(!planBtnClicked);
      setReqBtnClicked(false);

      if (dropdownDegreeReq === true) {
        setDropdownDegreeReq(!dropdownDegreeReq);
      }
    }

    if (field === "DegreeReq") {
      setDropdownDegreeReq(!dropdownDegreeReq);
      setReqBtnClicked(!reqBtnClicked);
      setPlanBtnClicked(false);

      if (dropdownDegreePlan === true) {
        setDropdownDegreePlan(!dropdownDegreePlan);
      }
    }
  };

  const handleCloseDegreeInfo = () => {
    setReqBtnClicked(false);
    setPlanBtnClicked(false);

    if (dropdownDegreeReq === true) {
      setDropdownDegreeReq(!dropdownDegreeReq);
    }

    if (dropdownDegreePlan === true) {
      setDropdownDegreePlan(!dropdownDegreePlan);
    }
  };

  /*  Control for search filter dropdown change  */
  const handleFilterChange = (e) => {
    setSelectedAttributeIdx(e.target.selectedIndex);
    setSelectedAttribute(attributes[e.target.selectedIndex]);
  };

  const handlePopup = (field, bit) => {
    setPopup((prev) => ({
      ...prev,
      [field]: bit,
    }));
  };

  const handleAddTimePref = (dayName, timeValue) => {
    const latest = timeValue.split(':');
    let latestTime;
    /*  Computes the latest time value from start time */
    if (latest[1] === '00') {
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
  };

  const handleCoursePrefChange = (field) => {
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

  const handleRemoveTimePrefAllDay = (dayName) => {
    setTimePref((prev) => ({
      ...prev,
      [dayName]: [],
    }));
  };

  const handleAddAllDayTimePref = (dayName) => {
    setTimePref((prev) => ({
      ...prev,
      [dayName]: timeDefault,
    }));
  };

  const handleShowCourseInfo = (info) => {
    setCourseInfo(info);
    handlePopup('showCourseInfo', true);
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
    if (checkCourseAdded(courseDetail.term_course_id)) {
      setSelectedCourses((prev) => [...prev, courseDetail]);
    } else {
      setAlertMessage('Course was already added!');
      setAlertSeverity('error');
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
    setSelectedScheduleIdx(0);
    await fetch('https://jarney.club/api/schedules')
      .then((response) => response.json())
      .then((result) => {
        
        if (result.schedules.length !== 0) {
          setScheduleExist(true);
          setScheduleOptions(result.schedules);
          setSelectedSchedule(result.schedules[selectedScheduleIdx].sched_name);
          setSelectedScheduleID(result.schedules[selectedScheduleIdx].sched_id);
          setSelectedCourses(result.schedules[selectedScheduleIdx]?.courses);
          setClasses(result.schedules[selectedScheduleIdx]?.classes);

          setTimePref(result.schedules[selectedScheduleIdx]?.filter?.time);
          setCoursePreference((prev) => ({
            ...prev,
            waitlist:
              !result.schedules[selectedScheduleIdx]?.filter?.misc?.ignoreWL,
            closed:
              !result.schedules[selectedScheduleIdx]?.filter?.misc?.ignoreClosed,
            online: !result.schedules[selectedScheduleIdx]?.filter?.misc?.ignoreM,
            time_unspecified:
              !result.schedules[selectedScheduleIdx]?.filter?.misc?.ignoreTU,
          }));
        }
        else {
          setScheduleExist(false);
        }
        
      })
      .catch((error) => {});
  };

  const fetchAttributes = async () => {
    await fetch('https://jarney.club/api/courses/attributes')
      .then((response) => response.json())
      .then(
        (result) => {
          setAttributes(result.attributes);
        },
        (error) => {}
      );
  };

  const fetchGenerateSchedule = async () => {
    const requestOption = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sched_id: selectedScheduleID,
        term_course_ids: selectedCourses.map((course) => course.term_course_id),
        filter: {
          misc: {
            ignoreTU: !coursePreference.time_unspecified,
            ignoreM: !coursePreference.online,
            ignoreClosed: !coursePreference.closed,
            ignoreWL: !coursePreference.waitlist,
          },
          time: timePref,
        },
      }),
    };

    const checkCourses = selectedCourses.length > 0;
    if (!checkCourses) {
      setAlertMessage('You need at least 1 course to render schedule.');
      setAlertSeverity('warning');
      setShowAlert(true);
    }
    checkCourses &&
      (await fetch('https://jarney.club/api/schedule', requestOption)
        .then((response) => response.json())
        .then((result) => {
          if (!result.error) {
            setClasses(result.data.classes);
            setAlertMessage('Render success!');
            setAlertSeverity('success');
            setShowAlert(true);
          } else {
            setAlertMessage(result.error);
            setAlertSeverity('warning');
            setShowAlert(true);
          }
        })
        .catch((error) => {}));
  };

  const fetchCreateSchedule = async (newName) => {
    const requestOption = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sched_name: newName }),
    };
    await fetch('https://jarney.club/api/schedule', requestOption)
      .then((response) => response.json())
      .then((result) => {
        // refresh
        if (!result.error) {
          fetchSavedSchedules();
          setAlertMessage('Create success!');
          setAlertSeverity('success');
          setShowAlert(true);
          handlePopup('addSchedule', false);
        } else {
          setAlertMessage(result.error);
          setAlertSeverity('warning');
          setShowAlert(true);
        }
      })
      .catch((error) => {});
  };

  const fetchData = async () => {
    setLoadMessage(true);
    await fetch(
      'https://jarney.club/api/courses/term?cnum='
        .concat(courseSearchValue)
        .concat('&attr=')
        .concat(selectedAttribute)
    )
      .then((response) => response.json())
      .then((result) => {
        setSearchCourseResult([]);
        setSearchCourseResult(result.courses);
        setLoadMessage(false);
      })
      .catch((error) => {
        setSearchCourseResult([]);
      });
  };

  useEffect(() => {
    handleLogRequired(true);
  }, []);

  useEffect(() => {
    if (logged) {
      fetchAttributes();
      fetchSavedSchedules();
    }
  }, [logged]);

  useEffect(() => {
    fetchData();
    handlePopup('showCourseInfo', false);
  }, [courseSearchValue, selectedAttribute]);

  useEffect(() => {
    let tempCount = 0;
    selectedCourses.forEach((course) => {
      tempCount += course?.units_esti;
    });
    setUnitsCount(tempCount);
    handlePopup('showCourseInfo', false);
  }, [selectedCourses]);

  return (
    <div>
      <Helmet>
        <title>JARney | Schedule</title>
        <meta
          name="description"
          content="Tufts SIS no more! Your semester schedule is one click away!"
        />
      </Helmet>
      {/*scheduleOptions && scheduleOptions?.length !== 0*/}
      {scheduleExist === true ? (
        <div className={sStyle.horizontalWrapper}>
          {dropdownDegreeReq || dropdownDegreePlan ? (
            <div
              className={sStyle.backdrop}
              onClick={handleCloseDegreeInfo}
            ></div>
          ) : (
            ""
          )}

          <div className={sStyle.leftColumnWrapper}>
            {/* CourseContainer 
                        Contains: 
                        1. searhCourse
                        2. courseList
                        3. preferenceContainer 
                    */}
            <div className={sStyle.courseContainer}>
              {/*time preference */}
              <div className={sStyle.preferenceContainer}>
                <FormControl className={sStyle.leftCheckboxContainer}>
                  <FormLabel style={{ margin: "0px" }}>
                    Generate Schedule With:
                  </FormLabel>
                  <FormGroup row={true}>
                    <FormControlLabel
                      style={{ margin: "0px" }}
                      control={
                        <PurpleSwitch
                          checked={coursePreference.waitlist}
                          name="waitlist"
                          onChange={() => handleCoursePrefChange('waitlist')}
                        />
                      }
                      label="Waitlist"
                    />
                    <FormControlLabel
                      style={{ margin: "0px" }}
                      control={
                        <PurpleSwitch
                          checked={coursePreference.closed}
                          name="closed"
                          onChange={() => handleCoursePrefChange('closed')}
                        />
                      }
                      label="Closed"
                    />
                    <FormControlLabel
                      style={{ margin: "0px" }}
                      control={
                        <PurpleSwitch
                          checked={coursePreference.online}
                          name="online"
                          onChange={() => handleCoursePrefChange('online')}
                        />
                      }
                      label="Online"
                    />
                    <FormControlLabel
                      style={{ margin: "0px" }}
                      control={
                        <PurpleSwitch
                          checked={coursePreference.time_unspecified}
                          name="time_unspecified"
                          onChange={() =>
                            handleCoursePrefChange('time_unspecified')
                          }
                        />
                      }
                      label="Time Unstated"
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
              {/*time preference */}

              {/*search bar and filter*/}
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
                    selectedIdx={selectedAttributeIdx}
                    onOptionChange={handleFilterChange}
                    labelId="filter"
                    labelName="Filter"
                  />
                </div>
              </div>

              <div className={sStyle.courseListContainer}>
                {loadMessage && courseSearchValue !== '' && (
                  <CircularProgress />
                )}
                {!loadMessage &&
                  searchCourseResult?.map((course) => (
                    <CourseSearchBar
                      courseDetail={course}
                      key={course.course_num.concat(course.course_title)}
                      draggable={false}
                      onDoubleClick={handleDoubleClickCourseList}
                      origin={'schedulerCourseList'}
                      customStyle={{
                        border: 'none',
                        justifyContent: 'space-between',
                      }}
                      onClick={handleShowCourseInfo}
                    />
                  ))}
              </div>
              {/*search bar and filter*/}
            </div>
            <div className={sStyle.rightButtonContainer}>
              <Button
                className={sStyle.renderButton}
                onClick={fetchGenerateSchedule}
              >
                Render schedule
              </Button>
            </div>
            <div className={sStyle.infoContainer}>
              <div style={{ color: 'rgba(0, 0, 0, 0.54)' }}>Quick summary</div>
              <div className={sStyle.unitsContainer}>
                <div className={sStyle.infoTitle}>SHUs scheduled:&nbsp;</div>
                <div classname={sStyle.infoDetail}>{unitsCount}</div>
              </div>
            </div>
            {popup.showCourseInfo && (
              <CourseInfoExpress
                courseInfo={courseInfo}
                onClose={() => handlePopup('showCourseInfo', false)}
              />
            )}

            <div className={sStyle.tabsContainer}>
              <div className={sStyle.tabBarsContainer}>
                <div
                  className={
                    !planBtnClicked ? sStyle.degreeBtn : sStyle.degreeBtnClicked
                  }
                  onClick={() => handleDegreeInfo("DegreePlan")}

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
                  className={
                    !reqBtnClicked ? sStyle.degreeBtn : sStyle.degreeBtnClicked
                  }
                  onClick={() => handleDegreeInfo("DegreeReq")}

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
                      onClick={handleShowCourseInfo}
                      origin={'schedulerTab'}
                      customStyle={{
                        border: 'none',
                        justifyContent: 'space-between',
                      }}
                    />
                  ))}
                {degreeReqTab === 2 && <DegreeReqExpress />}
                {degreeReqTab === 3 && <DegreePlanExpress />}
              </div>
            </div>
          </div>

          <div className={sStyle.rightColumnWrapper}>
            <div className={sStyle.scheduleTitleContainer}>
              <Dropdown
                options={scheduleOptions}
                selectedOption={selectedSchedule}
                selectedIdx={selectedScheduleIdx}
                onOptionChange={handleScheduleChange}
                customStyle={{ fontSize: '20px' }}
                isObject={true}
                objectField={'sched_name'}
              />
              &nbsp;
              <IconButton
                className={sStyle.editPlanButton}
                onClick={() => handlePopup('editScheduleName', true)}
              >
                <ModeEditIcon fontSize="medium" />
              </IconButton>
              &nbsp;
              <IconButton
                className={sStyle.editPlanButton}
                onClick={() => handlePopup('addSchedule', true)}
              >
                <AddBoxIcon fontSize="medium" />
              </IconButton>
              &nbsp;
              <IconButton
                className={sStyle.editPlanButton}
                onClick={() => handlePopup('removeSchedule', true)}
              >
                <IndeterminateCheckBoxIcon fontSize="medium" />
              </IconButton>
              &nbsp;
              <IconButton
                className={sStyle.editPlanButton}
                onClick={() => handlePopup('eventScreenshot', true)}
              >
                <LinkedCameraIcon fontSize="medium" />
              </IconButton>
              <div />
            </div>

            <div className={sStyle.calendarContainer}>
              <Calendar
                timePrefState={timePrefState}
                shrink={shrink}
                classes={classes}
                onEventClick={handleShowCourseInfo}
                TimeUnstated={classes?.TimeUnspecified}
              />
            </div>

            {classes.hasOwnProperty('TimeUnspecified') &&
              classes.TimeUnspecified.length !== 0 && (
                <div className={sStyle.infoContainer}>
                  <div style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                    Time Unspecified
                  </div>
                  <div className={sStyle.tuContainer}>
                    {classes?.TimeUnspecified?.map((course) => (
                      <Button
                        className={sStyle.tuButton}
                        onClick={() => handleShowCourseInfo(course)}
                      >
                        {course.details}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      ) : (
        <div className={sStyle.noSchedulewrapper}>
          <div>Shopping cart is removed!</div>
          {/* <div>Create your schedule now!</div>
          <IconButton
            className={sStyle.editPlanButton}
            onClick={() => handlePopup('addSchedule', true)}
          >
            <AddShoppingCartIcon fontSize="80vw" />
          </IconButton> */}
        </div>
      )}

      {/* popups */}
      {popup.addSchedule && (
        <Popup onClose={() => handlePopup('addSchedule', false)}>
          <AddSchedule
            onClose={() => handlePopup('addSchedule', false)}
            onCreateSchedule={fetchCreateSchedule}
            scheduleOptions={scheduleOptions}
          />
        </Popup>
      )}
      {popup.removeSchedule && (
        <Popup onClose={() => handlePopup('removeSchedule', false)}>
          <RemoveSchedule
            onClose={() => handlePopup('removeSchedule', false)}
            refreshSchedules={fetchSavedSchedules}
            scheduleID={scheduleOptions[selectedScheduleIdx]?.sched_id}
            scheduleName={scheduleOptions[selectedScheduleIdx]?.sched_name}
            onShowAlert={() => setShowAlert(true)}
            setAlertMessage={setAlertMessage}
            setAlertSeverity={setAlertSeverity}
          />
        </Popup>
      )}
      {popup.editScheduleName && (
        <Popup onClose={() => handlePopup('editScheduleName', false)}>
          <EditScheduleName
            onClose={() => handlePopup('editScheduleName', false)}
            onShowAlert={() => setShowAlert(true)}
            refreshSchedules={fetchSavedSchedules}
            setAlertMessage={setAlertMessage}
            setAlertSeverity={setAlertSeverity}
            scheduleID={scheduleOptions[selectedScheduleIdx].sched_id}
            scheduleName={scheduleOptions[selectedScheduleIdx].sched_name}
          />
        </Popup>
      )}
      {popup.eventScreenshot && (
        <Popup onClose={() => handlePopup('eventScreenshot', false)}>
          <EventScreenshot
            onClose={() => handlePopup('eventScreenshot', false)}
            onShowAlert={() => setShowAlert(true)}
            setAlertMessage={setAlertMessage}
            setAlertSeverity={setAlertSeverity}
            scheduleID={scheduleOptions[selectedScheduleIdx].sched_id}
            scheduleName={scheduleOptions[selectedScheduleIdx].sched_name}
            classDetails={classes}
          />
        </Popup>
      )}
      {timePrefState && (
        <TimePrefSelector
          onAddTimePref={handleAddTimePref}
          onRemoveTimePref={handleRemoveTimePref}
          onRemoveEntireDay={handleRemoveTimePrefAllDay}
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
