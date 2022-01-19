/* eslint-disable no-unused-vars */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DegreePlan2.js
 *
 *
 */

import { useEffect, useState } from "react";
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Button,
  InputAdornment,
  TextField,
  IconButton,
  CircularProgress,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AddBoxIcon from '@material-ui/icons/AddBox';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CancelIcon from '@material-ui/icons/Cancel';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import dp2Style from './style/DegreePlan2.module.css';
import pStyle from './reusable/reusableStyles/Popup.module.css';
import Popup from './reusable/Popup';
import PlanCard from './reusable/PlanCard';
import Dropdown from './reusable/Dropdown';
import CourseSearchBar from './reusable/CourseSearchBar';
import SnackBarAlert from './reusable/SnackBarAlert';
import DegreeReqDisplay from './reusable/DegreeReqDisplay';
import JarUserLogin from './reusable/JarUserLogin';
import { CourseInfoExpress } from './reusable/TabSwitch';
import {
  AddSemester,
  RemoveSemester,
  EditPlanName,
  AddPlan,
  RemovePlan,
} from './reusable/DegreePlan2Popups';
import { DegreeReqExpress } from './reusable/TabSwitch';
import sStyle from './style/Scheduler.module.css';

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                                 CONSTANTS                                 *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const degreeReqDefault = {
  program_name: 'Requirement #1',
  school: ' ',
  degree: ' ',
  part_id_tracker: 1,
  parts: [
    {
      part_id: 0,
      part_name: ' ',
      part_desc: ' ',
      part_req_id_tracker: 1,
      part_reqs: [
        {
          part_req_id: 0,
          course_num: ' ',
          course_note: ' ',
          completed: false,
        },
      ],
    },
  ],
};

const courses = [
  {
    plan_term_id: 'string',
    term: 2215,
    courses: [
      {
        course_num: 'string',
        course_title: 'string',
        units_esti: 'string',
        gen_course_id: 'string',
      },
    ],
  },
];

const currentYear = new Date().getFullYear();

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                        DegreePlan2 Page Main Function                     *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function DegreePlan2(props) {
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
  const [loaded, setLoaded] = useState(false);

  const [semesterPlanOptions, setSemesterPlanOptions] = useState([]); // sets the array of options for semester plans
  const [courseSearchValue, setCourseSearchValue] = useState('');

  /*  Stores the card options. Should be updated by API in UseEffect  */
  const [cardOptions, setCardOptions] = useState([]);
  const [transferCourseDetail, setTransferCourseDetail] = useState({});
  const [cardOrigin, setCardOrigin] = useState('');
  /* Popups */
  const [popup, setPopup] = useState({
    addSemester: false,
    removeSemester: false,
    editPlanName: false,
    addPlan: false,
    removePlan: false,
    showCourseInfo: false,
  });
  const [searchCourseResult, setSearchCourseResult] = useState([]);
  const [selectedPlanName, setSelectedPlanName] = useState('');
  const [selectedPlanID, setSelectedPlanID] = useState('');
  const [selectedPlanIdx, setSelectedPlanIdx] = useState(0);

  const [degreeReqOptions, setDegreeReqOptions] = useState([]);
  const [selectedDegreeReq, setSelectedDegreeReq] = useState(0);

  const [loadMessage, setLoadMessage] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState();
  const [alertSeverity, setAlertSeverity] = useState();

  const [currentTerm, setCurrentTerm] = useState('Fall');

  const [unitsCount, setUnitsCount] = useState({
    total: 0,
    completed: 0,
    current: 0,
    future: 0,
  });
  const [courseInfo, setCourseInfo] = useState({});

  const handlePopup = (field, bit) => {
    setPopup((prev) => ({
      ...prev,
      [field]: bit,
    }));
  };

  const handleUnitsCount = (field, bit) => {
    setUnitsCount((prev) => ({
      ...prev,
      [field]: bit,
    }));
  };
  const handleSemesterPlanChange = (e) => {
    setSelectedPlanName(e.target.value);
    setSelectedPlanIdx(e.target.selectedIndex);
    setSelectedPlanID(handleSelectedPlanNameToID(e.target.value));

    setCardOptions(semesterPlanOptions[e.target.selectedIndex].terms);
  };

  const handleRemoveCards = (cardsToRemove) => {
    setCardOptions((prev) =>
      prev.filter((opt) => !cardsToRemove.includes(opt))
    );
  };

  const handleSearchChange = (e) => {
    setCourseSearchValue(e.target.value);
  };
  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  const handleTransferCourseDetail = (detail, touch) => {
    setTransferCourseDetail(detail);
    if (touch) {
      setAlertMessage(
        'You have selected '
          .concat(detail.course_title)
          .concat(
            '. If you are on a mobile device, tap on a plan card to add or move the course.'
          )
      );
      setAlertSeverity('info');
      setShowAlert(true);
    }
  };

  const handleSelectedPlanNameToID = () => {
    for (let i = 0; i < semesterPlanOptions.length; i++) {
      if (semesterPlanOptions[i].plan_name === selectedPlanName) {
        return semesterPlanOptions[i].plan_term_id;
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      await fetch(
        'https://jarney.club/api/courses/general?cnum='.concat(
          courseSearchValue
        )
      )
        .then((response) => response.json())
        .then(
          (result) => {
            setSearchCourseResult([]);
            setSearchCourseResult(result.courses);
            setLoadMessage(false);
          },
          (error) => {
            setSearchCourseResult([]);
          }
        );
    }
    fetchData();
  }, [courseSearchValue]);

  /*
   *  checkCourseExist()
   *  purpose: checks if the course is in given courseList
   *  paramenters: courseList, course
   */
  const checkCourseExist = (courseList, course) => {
    for (let c of courseList) {
      if (c.gen_course_id === course.gen_course_id) {
        setAlertMessage('Course has already been Added');
        setAlertSeverity('error');
        setShowAlert(true);
        return true;
      }
    }

    return false;
  };

  /*
   * dropItem()
   * purpose: adds course to planCard when course is dropped
   *
   */
  const dropItem = (planTerm, courseDetail) => {
    if (
      Object.entries(courseDetail).length === 0 &&
      courseDetail.constructor === Object
    ) {
      return true;
    }
    /*  Check if course has been added  */
    for (let card of cardOptions) {
      if (
        card.plan_term_id === planTerm &&
        checkCourseExist(card.courses, courseDetail)
      ) {
        return false;
      }
    }

    /*  Adds course to Card  */
    setCardOptions((prev) =>
      prev?.map((card) =>
        card.plan_term_id === planTerm
          ? {
              ...card,
              courses: [...card.courses, courseDetail],
            }
          : card
      )
    );
    setTransferCourseDetail({});
    return true;
  };

  /*
   * handleCardOrigin()
   * purpose: sets the origin of the courseSearchBar (from which planCard)
   */
  const handleCardOrigin = (origin) => {
    setCardOrigin(origin);
  };

  const handleShowCourseInfo = (info) => {
    setCourseInfo(info);
    handlePopup('showCourseInfo', true);
  };

  const handleSetSelectedPlanIdx = (idx) => {
    setSelectedPlanIdx(idx);
  };

  /*
   *  handleRemoveCourse()
   *  purpose: removes course from planCard
   *
   */
  const handleRemoveCourse = (planTerm, courseDetail) => {
    setCardOptions((prev) =>
      prev?.map((card) =>
        card.plan_term_id === planTerm
          ? {
              ...card,
              courses: card.courses.filter(
                (course) => course.gen_course_id !== courseDetail.gen_course_id
              ),
            }
          : card
      )
    );
  };

  /*
   *  createnNewPlan()
   *  purpose: creates a new plan option with given name
   *  effect:  makes a POST request
   *
   */
  const createNewPlan = async (planName) => {
    const requestOption = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_name: planName }),
    };
    await fetch('https://jarney.club/api/degreeplan', requestOption)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to create Plan.');
        }
      })
      .then((result) => {
        setSelectedPlanIdx(semesterPlanOptions.length);
        fetchPlans();
        setLoadMessage(false);
        setAlertMessage('Plan added!');
        setAlertSeverity('success');
        setShowAlert(true);
      })
      .catch((error) => {
        setLoadMessage(false);
        setAlertMessage(error);
        setAlertSeverity('error');
        setShowAlert(true);
      });
  };

  /*
   *  fetchPlans()
   *  purpose: fetch for existing degree plans
   *  effect:  makes a GET request. sets the state for semesterPlans if plans
   *           are returned. If an empty array returned, then calls
   *           createNewPlan to create a new default plan for new users.
   *
   */
  const fetchPlans = async () => {
    // setSelectedPlanIdx(0);
    await fetch('https://jarney.club/api/degreeplans')
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        setSemesterPlanOptions(result.plans);
        setCardOptions(result.plans[selectedPlanIdx].terms);
        setSelectedPlanName(result.plans[selectedPlanIdx].plan_name);
        setSelectedPlanID(result.plans[selectedPlanIdx].plan_id);
        setLoaded(true);
      })
      .catch((error) => {});
  };

  const fetchSaveTerm = async (planTermDetails) => {
    const requestOption = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(planTermDetails),
    };

    await fetch('https://jarney.club/api/degreeplan/term', requestOption)
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        /*  Creates a new plan for new users */
      })
      .catch((error) => {});
  };

  const fetchPrivateReqs = async () => {
    await fetch('https://jarney.club/api/degreereqs/private')
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        if (result.reqs.length === 0) {
        } else {
          setDegreeReqOptions(result.reqs);
        }
      })
      .catch((error) => {});
  };

  /*  Initial fetching for plans when page first loads */
  useEffect(() => {
    fetchPlans();
    fetchPrivateReqs();
    handleLogRequired(true);
  }, []);

  useEffect(() => {
    if (logged) {
      fetchPlans();
      fetchPrivateReqs();
      setLoaded(true);
    }
  }, [logged]);

  useEffect(() => {
    cardOptions?.map((card) => fetchSaveTerm(card));
    let totalCount = 0;
    let completedCount = 0;
    let currentCount = 0;

    // counts total units
    cardOptions?.forEach((card) => {
      const time = card?.term.split(' ');
      card?.courses.forEach((course) => {
        totalCount += course?.units_esti;
        if (parseInt(time[0]) < currentYear) {
          completedCount += course.units_esti;
        } else if (parseInt(time[0]) === currentYear) {
          if (
            ((time[1] === 'Spring' || time[1] === 'Summer') &&
              currentTerm === 'Fall') ||
            (time[1] === 'Spring' && currentTerm === 'Summer')
          )
            completedCount += course?.units_esti;
          else if (time[1] === currentTerm) currentCount += course?.units_esti;
        }
      });
    });

    handleUnitsCount('total', totalCount);
    handleUnitsCount('completed', completedCount);
    handleUnitsCount('current', currentCount);
    handleUnitsCount('future', totalCount - completedCount - currentCount);
  }, [cardOptions]);

  useEffect(() => {
    fetchPlans();
  }, [selectedPlanIdx]);
  return (
    <div style={{ marginTop: '80px' }}>
      <Helmet>
        <title>JARney | Degree Plan</title>
        <meta
          name="description"
          content="Need to plan out your Tufts degree? Fall, Spring, Summer, or Annual. We have the complete list of courses!"
        />
      </Helmet>
      {loaded && semesterPlanOptions && semesterPlanOptions?.length !== 0 ? (
        <div className={dp2Style.contentContainer}>
          {/* * * * * Contains * * * * * 
                    Progress Bar
                */}
          <div className={dp2Style.progressBarContainer}>
            <div className={dp2Style.progressBar}>
              <div
                className={dp2Style.progressBarCompleted}
                style={{
                  width:
                    unitsCount.total !== 0
                      ? (unitsCount.completed / unitsCount.total) * 100 + '%'
                      : '0%',
                }}
              ></div>
              <div
                className={dp2Style.progressBarCurrent}
                style={{
                  width:
                    unitsCount.total !== 0
                      ? (unitsCount.current / unitsCount.total) * 100 + '%'
                      : '0%',
                  borderBottomLeftRadius: unitsCount.completed === 0 && '15px',
                  borderTopLeftRadius: unitsCount.completed === 0 && '15px',
                  borderBottomRightRadius: unitsCount.future === 0 && '15px',
                  borderTopRightRadius: unitsCount.future === 0 && '15px',
                }}
              ></div>
              <div
                className={dp2Style.progressBarFuture}
                style={{
                  width:
                    unitsCount.total !== 0
                      ? (unitsCount.future / unitsCount.total) * 100 + '%'
                      : '0%',
                }}
              />
            </div>

            <div className={dp2Style.progressBarTitle}>
              {unitsCount.total !== 0
                ? parseInt(
                    ((unitsCount.current + unitsCount.completed) /
                      unitsCount.total) *
                      100
                  ) + '%'
                : '0%'}
            </div>
          </div>

          <div className={dp2Style.horizontalWrapper}>
            {/* * * * Contains: * * * * 
                        1. Semester Plan selected
                        2. Course search Container
                        3. Degree Req Container 
                    */}
            <div className={dp2Style.leftContainer}>
              {/* SEARCH CONTAINER for Courses */}
              <div className={dp2Style.planSelectorContainer}>
                <Dropdown
                  options={semesterPlanOptions}
                  isObject={true}
                  objectField={'plan_name'}
                  selectedOption={selectedPlanName}
                  selectedIdx={selectedPlanIdx}
                  onOptionChange={handleSemesterPlanChange}
                  customStyle={{ fontSize: '20px' }}
                />
                &nbsp;
                {semesterPlanOptions && semesterPlanOptions?.length !== 0 && (
                  <IconButton
                    className={dp2Style.editPlanButton}
                    onClick={() => handlePopup('editPlanName', true)}
                  >
                    <ModeEditIcon fontSize="medium" />
                  </IconButton>
                )}
                &nbsp;
                <IconButton
                  className={dp2Style.editPlanButton}
                  onClick={() => handlePopup('addPlan', true)}
                >
                  <AddBoxIcon fontSize="medium" />
                </IconButton>
                &nbsp;
                {semesterPlanOptions && semesterPlanOptions?.length !== 0 && (
                  <IconButton
                    className={dp2Style.editPlanButton}
                    onClick={() => handlePopup('removePlan', true)}
                  >
                    <IndeterminateCheckBoxIcon fontSize="medium" />
                  </IconButton>
                )}
              </div>
              <div className={dp2Style.existListWrapper}>
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
                  className={dp2Style.inputSearch}
                />

                <div className={dp2Style.searchListContainer}>
                  {loadMessage && courseSearchValue !== '' && (
                    <CircularProgress />
                  )}
                  {searchCourseResult?.map((course) => (
                    <CourseSearchBar
                      courseDetail={course}
                      key={course.gen_course_id}
                      onTransferCourse={handleTransferCourseDetail}
                      origin={'courseList'}
                      draggable={true}
                      onClick={handleShowCourseInfo}
                    />
                  ))}
                </div>
              </div>

              <div className={sStyle.infoContainer}>
                <div style={{ color: '#919da1' }}>Quick SHUs summary</div>
                <div className={sStyle.unitsContainer}>
                  <div className={sStyle.infoTitle}>Total:&nbsp;</div>
                  <div classname={sStyle.infoDetail}>{unitsCount.total}</div>
                </div>
                <div className={sStyle.unitsContainer}>
                  <div className={sStyle.infoTitle}>Completed:&nbsp;</div>
                  <div classname={sStyle.infoDetail}>
                    {unitsCount.completed}
                  </div>
                </div>
                <div className={sStyle.unitsContainer}>
                  <div className={sStyle.infoTitle}>In progress:&nbsp;</div>
                  <div classname={sStyle.infoDetail}>{unitsCount.current}</div>
                </div>
                <div className={sStyle.unitsContainer}>
                  <div className={sStyle.infoTitle}>Remaining:&nbsp;</div>
                  <div classname={sStyle.infoDetail}>{unitsCount.future}</div>
                </div>
              </div>

              {popup.showCourseInfo && (
                <CourseInfoExpress
                  courseInfo={courseInfo}
                  onClose={() => handlePopup('showCourseInfo', false)}
                />
              )}

              {/* Degree Requirment Container */}
              <DegreeReqExpress />
            </div>

            {/* * * * Contains: * * * *
                        Degree Plan Grids 
                    */}
            <div className={dp2Style.rightContainer}>
              {/* TITLE Container */}
              <div className={dp2Style.semesterPlanTitleContainer}>
                <div />
                <div className={dp2Style.semesterPlanTitle}>
                  {semesterPlanOptions && semesterPlanOptions?.length !== 0
                    ? semesterPlanOptions[selectedPlanIdx]?.plan_name
                    : "You don't have a degree plan. Make one!"}
                </div>
                {semesterPlanOptions && semesterPlanOptions?.length !== 0 ? (
                  <div className={dp2Style.editSemesterButtonContainer}>
                    <IconButton
                      className={dp2Style.editSemesterButton}
                      onClick={() => handlePopup('addSemester', true)}
                    >
                      <AddBoxIcon fontSize="medium" />
                    </IconButton>
                    &nbsp;
                    <IconButton
                      className={dp2Style.editSemesterButton}
                      onClick={() => handlePopup('removeSemester', true)}
                    >
                      <IndeterminateCheckBoxIcon fontSize="medium" />
                    </IconButton>
                  </div>
                ) : (
                  <div />
                )}
              </div>

              {/* PlanCards Container */}
              <div className={dp2Style.planCardsContainer}>
                {cardOptions &&
                  cardOptions?.map((card) => (
                    <PlanCard
                      cardDetail={card}
                      key={card.plan_term_id}
                      dropItem={dropItem}
                      transferCourseDetail={transferCourseDetail}
                      onTransferCourse={handleTransferCourseDetail}
                      onRemoveCourse={handleRemoveCourse}
                      handleCardOrigin={handleCardOrigin}
                      cardOrigin={cardOrigin}
                      onClick={handleShowCourseInfo}
                      origin={'dp2'}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        loaded && (
          <div className={dp2Style.noSchedulewrapper}>
            <div>Create your plan now!</div>
            <IconButton
              className={dp2Style.editPlanButton}
              onClick={() => handlePopup('addPlan', true)}
            >
              <AddBoxIcon fontSize="large" />
            </IconButton>
          </div>
        )
      )}

      {/* popups */}
      {popup.addSemester && (
        <Popup onClose={() => handlePopup('addSemester', false)}>
          <AddSemester
            onClose={() => handlePopup('addSemester', false)}
            planName={semesterPlanOptions[selectedPlanIdx]?.plan_name}
            planID={semesterPlanOptions[selectedPlanIdx]?.plan_id}
            refreshPlans={fetchPlans}
            onShowAlert={() => setShowAlert(true)}
            setAlertMessage={setAlertMessage}
            setAlertSeverity={setAlertSeverity}
          />
        </Popup>
      )}
      {popup.removeSemester && (
        <Popup onClose={() => handlePopup('removeSemester', false)}>
          <RemoveSemester
            onClose={() => handlePopup('removeSemester', false)}
            cardOptions={cardOptions}
            handleRemoveCards={handleRemoveCards}
            planName={semesterPlanOptions[selectedPlanIdx]?.plan_name}
            planID={semesterPlanOptions[selectedPlanIdx]?.plan_id}
            refreshPlans={fetchPlans}
            onShowAlert={() => setShowAlert(true)}
            setAlertMessage={setAlertMessage}
            setAlertSeverity={setAlertSeverity}
          />
        </Popup>
      )}
      {popup.editPlanName && (
        <Popup onClose={() => handlePopup('editPlanName', false)}>
          <EditPlanName
            onClose={() => handlePopup('editPlanName', false)}
            planName={semesterPlanOptions[selectedPlanIdx]?.plan_name}
            planID={semesterPlanOptions[selectedPlanIdx]?.plan_id}
            refreshPlans={fetchPlans}
            onShowAlert={() => setShowAlert(true)}
            setAlertMessage={setAlertMessage}
            setAlertSeverity={setAlertSeverity}
          />
        </Popup>
      )}
      {popup.addPlan && (
        <Popup onClose={() => handlePopup('addPlan', false)}>
          <AddPlan
            onClose={() => handlePopup('addPlan', false)}
            refreshPlans={fetchPlans}
            createNewPlan={createNewPlan}
            onShowAlert={() => setShowAlert(true)}
            setAlertMessage={setAlertMessage}
            setAlertSeverity={setAlertSeverity}
          />
        </Popup>
      )}
      {popup.removePlan && (
        <Popup onClose={() => handlePopup('removePlan', false)}>
          <RemovePlan
            onClose={() => handlePopup('removePlan', false)}
            planName={semesterPlanOptions[selectedPlanIdx]?.plan_name}
            planID={semesterPlanOptions[selectedPlanIdx]?.plan_id}
            refreshPlans={fetchPlans}
            onShowAlert={() => setShowAlert(true)}
            setAlertMessage={setAlertMessage}
            setAlertSeverity={setAlertSeverity}
            onSetIdxLast={() =>
              handleSetSelectedPlanIdx(semesterPlanOptions?.length - 2)
            }
          />
        </Popup>
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

export default DegreePlan2;
