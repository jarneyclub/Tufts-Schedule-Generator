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
import ModeEditIcon from "@mui/icons-material/ModeEdit";
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
import {
  AddSemester,
  RemoveSemester,
  EditPlanName,
  AddPlan,
  RemovePlan,
} from "./reusable/DegreePlan2Popups";

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
  
  const [courseSearchValue, setCourseSearchValue] = useState("");

  /*  Stores the card options. Should be updated by API in UseEffect  */
  const [cardOptions, setCardOptions] = useState(planCardsPlaceholder);
  const [transferCourseDetail, setTransferCourseDetail] = useState({});
  const [cardOrigin, setCardOrigin] = useState("");
  /* Popups */
  const [popup, setPopup] = useState({
    addSemester: false,
    removeSemester: false,
    editPlanName: false,
    addPlan: false,
    removePlan: false,
  });
  const [searchCourseResult, setSearchCourseResult] = useState([]);
  const [selectedPlanName, setSelectedPlanName] = useState("");
  const [selectedPlanID, setSelectedPlanID] = useState("");

  const [loadMessage, setLoadMessage] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState();
  const [alertSeverity, setAlertSeverity] = useState();

  const handlePopup = (field, bit) => {
    setPopup((prev) => ({
      ...prev,
      [field]: bit,
    }));
  };

  const handleSemesterPlanChange = (e) => {
    setSelectedPlanName(e.target.value);
    console.log("semesterPlanChange e:", e);
    setSelectedPlanID(handleSelectedPlanNameToID(e.target.value));
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
    setTransferCourseDetail(detail);
  };

  const handleSelectedPlanNameToID = () => {
    for (let i = 0; i < semesterPlanOptions.length; i++) {
      console.log("selectedPlanName:", selectedPlanName);
      console.log(
        "semesterPlanOptions.planName:",
        semesterPlanOptions[i].plan_name
      );
      console.log(
        "true false? ",
        semesterPlanOptions[i].plan_name === selectedPlanName
      );
      if (semesterPlanOptions[i].plan_name === selectedPlanName) {
        console.log("should return here ");
        return semesterPlanOptions[i].plan_term_id;
      }
    }
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

  const deletePlan = async (planID) => {
    await fetch("https://jarney.club/api/degreeplan/".concat(planID))
      .then((response) => response.json())
      .then((result) => {
        fetchPlans();
        console.log("result from deletePlan: ", result);
      })
      .catch((error) => {
        console.log("delete plan error: ", error);
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
          setSelectedPlanName(result.plans[0].plan_name);
          setSelectedPlanID(result.plans[0].plan_id);
        }
      })
      .catch((error) => {
        console.log("error from Degreeplan semesterPlanOptions ", error);
      });
  };

  const fetchSaveTerm = async (planTermDetails) => {
    const requestOption = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(planTermDetails),
    };

    await fetch("https://jarney.club/api/degreeplan/term", requestOption)
      .then((response) => {
        console.log("response:", response);
        return response.json();
      })
      .then((result) => {
        console.log("result of save term: ", result);
        /*  Creates a new plan for new users */
        
      })
      .catch((error) => {
        console.log("error from Degreeplan saveTerm ", error);
      });
  };
  /*  Initial fetching for plans when page first loads */
  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    console.log("cardOptions: ", cardOptions);
    for (let card of cardOptions) {
      fetchSaveTerm(card);
    }
  }, [cardOptions]);

  useEffect(() => {
    setCardOptions(semesterPlanOptions.map((plan) => (plan.plan_name === selectedPlanName && plan.term)));

  }, [selectedPlanName])

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
                selectedOption={selectedPlanName}
                onOptionChange={handleSemesterPlanChange}
                customStyle={{ fontSize: "20px" }}
              />
              &nbsp;
              <IconButton
                className={dp2Style.editPlanButton}
                onClick={() => handlePopup("editPlanName", true)}
              >
                <ModeEditIcon fontSize="medium" />
              </IconButton>
              &nbsp;
              <IconButton
                className={dp2Style.editPlanButton}
                onClick={() => handlePopup("addPlan", true)}
              >
                <AddBoxIcon fontSize="medium" />
              </IconButton>
              &nbsp;
              <IconButton
                className={dp2Style.editPlanButton}
                onClick={() => handlePopup("removePlan", true)}
              >
                <IndeterminateCheckBoxIcon fontSize="medium" />
              </IconButton>
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
                {selectedPlanName}
              </div>
              <div className={dp2Style.editSemesterButtonContainer}>
                <IconButton
                  className={dp2Style.editSemesterButton}
                  onClick={() => handlePopup("addSemester", true)}
                >
                  <AddBoxIcon fontSize="medium" />
                </IconButton>
                &nbsp;
                <IconButton
                  className={dp2Style.editSemesterButton}
                  onClick={() => handlePopup("removeSemester", true)}
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
      {popup.addSemester && (
        <Popup onClose={() => handlePopup("addSemester", false)}>
          <AddSemester
            onClose={() => handlePopup("addSemester", false)}
            planName={selectedPlanName}
            planID={selectedPlanID}
            refreshPlans={fetchPlans}
          />
        </Popup>
      )}
      {popup.removeSemester && (
        <Popup onClose={() => handlePopup("removeSemester", false)}>
          <RemoveSemester
            onClose={() => handlePopup("removeSemester", false)}
            cardOptions={cardOptions}
            handleRemoveCards={handleRemoveCards}
            planName={selectedPlanName}
            planID={selectedPlanID}
            refreshPlans={fetchPlans}
          />
        </Popup>
      )}
      {popup.editPlanName && (
        <Popup onClose={() => handlePopup("editPlanName", false)}>
          <EditPlanName
            onClose={() => handlePopup("editPlanName", false)}
            planName={selectedPlanName}
            planID={selectedPlanID}
            refreshPlans={fetchPlans}
          />
        </Popup>
      )}
      {popup.addPlan && (
        <Popup onClose={() => handlePopup("addPlan", false)}>
          <AddPlan
            onClose={() => handlePopup("addPlan", false)}
            refreshPlans={fetchPlans}
            createNewPlan={createNewPlan}
          />
        </Popup>
      )}
      {popup.removePlan && (
        <Popup onClose={() => handlePopup("removePlan", false)}>
          <RemovePlan
            onClose={() => handlePopup("removePlan", false)}
            planName={selectedPlanName}
            planID={selectedPlanID}
            refreshPlans={fetchPlans}
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
