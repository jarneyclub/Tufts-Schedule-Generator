/* eslint-disable no-unused-vars */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DegreePlan2.js
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
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import CancelIcon from "@material-ui/icons/Cancel";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import dp2Style from "./style/DegreePlan2.module.css";
import pStyle from "./reusable/reusableStyles/Popup.module.css";
import Popup from "./reusable/Popup";
import PlanCard from "./reusable/PlanCard";
import Dropdown from "./reusable/Dropdown";
import CourseSearchBar from "./reusable/CourseSearchBar";
import SnackBarAlert from "./reusable/SnackBarAlert";
import DegreeReqDisplay from "./reusable/DegreeReqDisplay";
import JarUserLogin from "./reusable/JarUserLogin";
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                          Add PlanCard Popup                               *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function AddSemester(props) {
  const { onClose } = props;

  /* Year Dropdown */
  const [yearOptions, setYearOptions] = useState([
    2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026,
  ]); // will be replaced by API?!
  const [selectedYear, setSelectedYear] = useState(yearOptions[0]);

  /* Term Dropdown */
  const [termOptions, setTermOptions] = useState([
    "FALL",
    "SPRING",
    "SUMMER",
    "ANNUAL",
  ]); // possible semesters
  const [selectedTerm, setSelectedTerm] = useState(termOptions[0]);

  const handleTermChange = (e) => {
    setSelectedTerm(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleClose = () => {
    onClose();
  };

  const handleAdd = () => {
    /* do something API??  */

    /* Then Close */
    onClose();
  };


  const fetchAdd = async() => {
    fetch()
  }
  return (
    <div className={pStyle.loginContainer}>
      <div className={pStyle.headerContainer}>
        <IconButton
          type="button"
          onClick={handleClose}
          className={pStyle.closeButton}
        >
          <CancelIcon />
        </IconButton>
        <div className={pStyle.headerBody}>ADD CARD</div>
        <div />
      </div>
      <div className={pStyle.formContainer}>
        <div className={pStyle.dropdownContainer}>
          <Dropdown
            options={termOptions}
            selectedOption={selectedTerm}
            onOptionChange={handleTermChange}
          />
          <Dropdown
            options={yearOptions}
            selectedOption={selectedYear}
            onOptionChange={handleYearChange}
          />
        </div>

        <Button value="ADD" className={pStyle.submitButton} onClick={handleAdd}>
          ADD
        </Button>
      </div>
    </div>
  );
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                            Remove PlanCard Popup                          *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function RemoveSemester(props) {
  const { onClose, cardOptions, handleRemoveCards } = props;
  console.log("cardoptions from removeSemester: ", cardOptions);
  /*  Stores the cards to be deleted  */
  const [selectedCards, setSelectedCards] = useState([]);

  const handleCardChange = (e) => {
    const val = e.target.value;
    const pos = selectedCards.indexOf(val);
    if (pos === -1) {
      /* was not in selectedCards array, aka was not selected, now select */
      setSelectedCards((prev) => prev.concat(val));
      e.target.style.backgroundColor = "#5A32BF";
      e.target.style.color = "#ffffff";
    } else {
      /* found in selectedCards array, aka was selected, now unselect */
      setSelectedCards((prev) => prev.filter((card) => card !== val));
      e.target.style.backgroundColor = "#ffffff";
      e.target.style.color = "#5A32BF";
    }
  };

  const handleClose = () => {
    onClose();
  };

  const handleRemove = () => {
    /* do something API?? pass in the selectedCards arr */
    handleRemoveCards(selectedCards);
    console.log("selected Cards to remove: ", selectedCards);
    /* Then Close */
    onClose();
  };

  return (
    <div className={pStyle.loginContainer}>
      <div className={pStyle.headerContainer}>
        <IconButton onClick={handleClose} className={pStyle.closeButton}>
          <CancelIcon />
        </IconButton>
        <div className={pStyle.headerBody}>REMOVE CARDS</div>
        <div />
      </div>
      <div className={pStyle.formContainer}>
        <div className={pStyle.inputBarContainer}>
          {cardOptions.map((card) => (
            <input
              type="button"
              value={card.term}
              key={card}
              className={pStyle.inputBar}
              onClick={(e) => handleCardChange(e)}
            />
          ))}
        </div>

        <Button className={pStyle.submitButton} onClick={handleRemove}>
          REMOVE
        </Button>
      </div>
    </div>
  );
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                                 CONSTANTS                                 *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const degreeReqDefault = {
  program_name: "Requirement #1",
  school: " ",
  degree: " ",
  part_id_tracker: 1,
  parts: [
    {
      part_id: 0,
      part_name: " ",
      part_desc: " ",
      part_req_id_tracker: 1,
      part_reqs: [
        {
          part_req_id: 0,
          course_num: " ",
          course_note: " ",
          completed: false,
        },
      ],
    },
  ],
};

const courses = [
  {
    plan_term_id: "string",
    term: 2215,
    courses: [
      {
        course_num: "string",
        course_title: "string",
        units_esti: "string",
        gen_course_id: "string",
      },
    ],
  },
];

const planCardsPlaceholder = [
  {
    plan_term_id: "FALL 2021",
    term: 2215,
    courses: [],
  },
  {
    plan_term_id: "SPRING 2022",
    term: 2215,
    courses: [],
  },
  {
    plan_term_id: "FALL 2022",
    term: 2215,
    courses: [],
  },
  {
    plan_term_id: "SPRING 2023",
    term: 2215,
    courses: [],
  },
  {
    plan_term_id: "FALL 2023",
    term: 2215,
    courses: [],
  },
  {
    plan_term_id: "SPRING 2024",
    term: 2215,
    courses: [],
  },
  {
    plan_term_id: "FALL 2024",
    term: 2215,
    courses: [],
  },
  {
    plan_term_id: "SPRING 2025",
    term: 2215,
    courses: [],
  },
];

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
  } = props;
  const [degreeReqTitle, setDegreeReqTitle] = useState("PLACEHOLDER"); // sets the title of degree requirement
  const [semesterPlanOptions, setSemesterPlanOptions] = useState([]); // sets the array of options for semester plans
  const [semesterPlanTitle, setSemesterPlanTitle] = useState(
    "4 Year Plan Placeholder"
  ); // sets the title of the degree plan
  const [courseSearchValue, setCourseSearchValue] = useState("");

  /*  Stores the card options. Should be updated by API in UseEffect  */
  const [cardOptions, setCardOptions] = useState(planCardsPlaceholder);
  const [transferCourseDetail, setTransferCourseDetail] = useState({});
  const [cardOrigin, setCardOrigin] = useState("");
  /* Popups */
  const [addSemesterPopup, setAddSemesterPopup] = useState(false);
  const [removeSemesterPopup, setRemoveSemesterPopup] = useState(false);
  const [searchCourseResult, setSearchCourseResult] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");

  const [loadMessage, setLoadMessage] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState();
  const [alertSeverity, setAlertSeverity] = useState();

  const handleSemesterPlanChange = (e) => {
    setSelectedSemester(e.target.value);
    //setSemesterPlanTitle(e.target.value);
    console.log("semesterPlanChange e:", e);
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
  const handleTransferCourseDetail = (detail) => {
    console.log("drag start course: ", detail);
    setTransferCourseDetail(detail);
    console.log("transferCourseDetail: ", transferCourseDetail);
  };

  useEffect(() => {
    async function fetchData() {
      await fetch(
        "https://jarney.club/api/courses/general?cnum=".concat(
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
            console.log("error from DegreePlan2 course search", error);
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
        setAlertMessage("Course has already been Added");
        setAlertSeverity("error");
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
    console.log("drop course: ", courseDetail, " to: ", planTerm);
    /*  Check if course has been added  */
    for (let card of cardOptions) {
      if (
        card.plan_term_id === planTerm &&
        checkCourseExist(card.courses, courseDetail)
      ) {
        console.log("False");
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
    return true;
  };

  /*
   * handleCardOrigin()
   * purpose: sets the origin of the courseSearchBar (from which planCard)
   */
  const handleCardOrigin = (origin) => {
    setCardOrigin(origin);
  };

  /*
   *  handleRemoveCourse()
   *  purpose: removes course from planCard
   *
   */
  const handleRemoveCourse = (planTerm, courseDetail) => {
    console.log("Remove course: ", courseDetail, " from: ", planTerm);
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
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_name: planName }),
    };
    await fetch("https://jarney.club/api/degreeplan", requestOption)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to create Plan.");
        }
      })
      .then((result) => {
        console.log("data: ", result);
        fetchPlans();
        setLoadMessage(false);
      })
      .catch((error) => {
        setLoadMessage(false);
        // console.log(error.data);
        // handleAlert("error", "Error: Failed to Login");

        // add an error message popup of some sort
        console.log("error from login: ", error);
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
    await fetch("https://jarney.club/api/degreeplans")
      .then((response) => {
        console.log("response:", response);
        return response.json();
      })
      .then((result) => {
        console.log("result of semester plan: ", result);
        console.log("plans: ", result.plans);
        /*  Creates a new plan for new users */
        if (result.plans.length === 0) {
          createNewPlan("Plan #1");
        } else {
          console.log("prev semesterPlanOptions: ", semesterPlanOptions);
          setSemesterPlanOptions(result.plans);
          setCardOptions(result.plans[0].terms);
          setSelectedSemester(result.plans[0].plan_name);
        }
      })
      .catch((error) => {
        console.log("error from Degreeplan semesterPlanOptions ", error);
      });
  };

  /*  Initial fetching for plans when page first loads */
  useEffect(() => {
    fetchPlans();
    
  }, []);

  // useEffect(() => {
  //   // setSemesterPlanTitle(semesterPlanOptions[0])
  //   console.log("semesterPlanOptions: ", semesterPlanOptions);
  //   setSelectedSemester(semesterPlanOptions[0].plan_name)
  // },[semesterPlanOptions])

  useEffect(() => {
    console.log("cardOptions: ", cardOptions);
  }, [cardOptions]);

  return (
    <div style={{ marginTop: "80px" }}>
      <div className={dp2Style.contentContainer}>
        {/* * * * * Contains * * * * * 
                    Progress Bar
                */}
        <div className={dp2Style.progressBarContainer}>
          <div className={dp2Style.progressBarTitle}>PLAN PROGRESS </div>
          {!shrink ? (
            <div className={dp2Style.progressBar} />
          ) : (
            <div className={dp2Style.progressBarTitle}>&nbsp;☃&nbsp;</div>
          )}

          <div className={dp2Style.progressBarTitle}>100%</div>
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
                  objectField={"plan_name"}
                  selectedOption={selectedSemester}
                  onOptionChange={handleSemesterPlanChange}
                  customStyle={{ fontSize: "20px"}}
                />
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
                {loadMessage && courseSearchValue !== "" && (
                  <CircularProgress />
                )}
                {searchCourseResult?.map((course) => (
                  <CourseSearchBar
                    courseDetail={course}
                    key={course.gen_course_id}
                    onTransferCourse={handleTransferCourseDetail}
                    origin={"courseList"}
                    draggable={true}
                  />
                ))}
              </div>
            </div>

            {/* Degree Requirment Container */}
            <div className={dp2Style.degreeReqContainer}>
              <div className={dp2Style.degreeReqTitleContainer}>
                <IconButton>
                  <ArrowLeftIcon fontSize="large" />
                </IconButton>
                <div>{degreeReqTitle}</div>
                <IconButton color="action">
                  <ArrowRightIcon fontSize="large" />
                </IconButton>
              </div>
              <div className={dp2Style.degreeReqDetailContainer}>
                <DegreeReqDisplay reqDetail={degreeReqDefault} />
              </div>
            </div>
          </div>

          {/* * * * Contains: * * * *
                        Degree Plan Grids 
                    */}
          <div className={dp2Style.rightContainer}>
            {/* TITLE Container */}
            <div className={dp2Style.semesterPlanTitleContainer}>
              <div />
              <div className={dp2Style.semesterPlanTitle}>
                {selectedSemester}
              </div>
              <div className={dp2Style.editSemesterButtonContainer}>
                <IconButton
                  className={dp2Style.editSemesterButton}
                  onClick={() => setAddSemesterPopup(true)}
                >
                  <AddBoxIcon fontSize="medium" />
                </IconButton>
                &nbsp;
                <IconButton
                  className={dp2Style.editSemesterButton}
                  onClick={() => setRemoveSemesterPopup(true)}
                >
                  <IndeterminateCheckBoxIcon fontSize="medium" />
                </IconButton>
              </div>
            </div>

            {/* PlanCards Container */}
            <div className={dp2Style.planCardsContainer}>
              {cardOptions.map((card) => (
                <PlanCard
                  cardDetail={card}
                  key={card.plan_term_id}
                  dropItem={dropItem}
                  transferCourseDetail={transferCourseDetail}
                  onTransferCourse={handleTransferCourseDetail}
                  onRemoveCourse={handleRemoveCourse}
                  handleCardOrigin={handleCardOrigin}
                  cardOrigin={cardOrigin}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* popups */}
      {addSemesterPopup && (
        <Popup onClose={() => setAddSemesterPopup(false)}>
          <AddSemester onClose={() => setAddSemesterPopup(false)} />
        </Popup>
      )}
      {removeSemesterPopup && (
        <Popup onClose={() => setRemoveSemesterPopup(false)}>
          <RemoveSemester
            onClose={() => setRemoveSemesterPopup(false)}
            cardOptions={cardOptions}
            handleRemoveCards={handleRemoveCards}
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
