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
  FormControl,
  InputLabel,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import AddBoxIcon from "@material-ui/icons/AddBox";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import CancelIcon from "@material-ui/icons/Cancel";
import dp2Style from "./style/DegreePlan2.module.css";
import pStyle from "./reusable/reusableStyles/Popup.module.css";
import Popup from "./reusable/Popup";
import PlanCard from "./reusable/PlanCard";
import Dropdown from "./reusable/Dropdown";
import CourseSearchBar from "./reusable/CourseSearchBar";

/*  ==================== Add PlanCard Popup ==================== */
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

/*  ==================== Remove PlanCard Popup ==================== */
function RemoveSemester(props) {
  const { onClose, cardOptions, handleRemoveCards } = props;

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
              value={card}
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
/*  ========================================================================  */
/*  ==================== DegreePlan2 Page Main Function ====================  */
function DegreePlan2(props) {
  const { shrink } = props;
  const [degreeReqTitle, setDegreeReqTitle] = useState("PLACEHOLDER"); // sets the title of degree requirement
  const [semesterPlanOptions, setSemesterPlanOptions] = useState([
    "Plan #1",
    2,
    3,
    4,
  ]); // sets the array of options for semester plans
  const [semesterPlanTitle, setSemesterPlanTitle] = useState(
    "4 Year Plan Placeholder"
  ); // sets the title of the degree plan
  const [courseSearchValue, setCourseSearchValue] = useState("");

  /*  Stores the card options. Should be updated by API in UseEffect  */
  const [cardOptions, setCardOptions] = useState([
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
  ]);

  /* Popups */
  const [addSemesterPopup, setAddSemesterPopup] = useState(false);
  const [removeSemesterPopup, setRemoveSemesterPopup] = useState(false);
  const [searchCourseResult, setSearchCourseResult] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(
    semesterPlanOptions[0]
  );

  const [loadMessage, setLoadMessage] = useState(true);

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
  };

  const handleRemoveCards = (cardsToRemove) => {
    setCardOptions((prev) =>
      prev.filter((opt) => !cardsToRemove.includes(opt))
    );
  };

  const handleSearchChange = (e) => {
    setCourseSearchValue(e.target.value);
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

    // let unmounted = false;

    // return () => {
    //   unmounted = true;
    // };
  }, [courseSearchValue]);

  const handleDragStart = (e) => {
    e.dataTransfer.setData("id", e.target.id);
    console.log(e);
  };

  const dropItem = (courseDetail) => {
    console.log("dropItem ", courseDetail);
  };

  return (
    <div>
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
              {/* <Button className={dp2Style.searchButton}>search</Button> */}

              <div className={dp2Style.searchListContainer}>
                {loadMessage && <div>Loading...</div>}
                {searchCourseResult?.map((course) => (
                  <CourseSearchBar
                    courseDetail={course}
                    key={course.course_num.concat(course.course_title)}
                    onDragStart={handleDragStart}
                  />
                ))}
              </div>
            </div>

            {/* Degree Requirment Container */}
            <div className={dp2Style.degreeReqContainer}>
              <div className={dp2Style.degreeReqTitleContainer}>
                <div className={dp2Style.degreeReqNextButton}>◄</div>
                <div>{degreeReqTitle}</div>
                <div className={dp2Style.degreeReqNextButton}>►</div>
              </div>
              <div className={dp2Style.degreeReqDetailContainer} />
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
                <Dropdown
                  options={semesterPlanOptions}
                  selectedOption={selectedSemester}
                  onOptionChange={handleSemesterChange}
                  customStyle={{ fontSize: "20px", color: "#ffffff" }}
                />
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
                <PlanCard cardDetail={card} key={card} dropItem={dropItem} />
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
    </div>
  );
}

export default DegreePlan2;
