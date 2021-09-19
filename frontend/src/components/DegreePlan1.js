/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DegreePlan1.js
 *
 *
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DateRangeIcon from "@material-ui/icons/DateRange";
import {
  Button,
  IconButton,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import CancelIcon from "@material-ui/icons/Cancel";
import dp1Style from "./style/DegreePlan1.module.css";
import pStyle from "./reusable/reusableStyles/Popup.module.css";
import Popup from "./reusable/Popup";
import Dropdown from "./reusable/Dropdown";
import DegreeReqEdit from "./reusable/DegreeReqEdit";
import dStyle from "./reusable/reusableStyles/Dropdown.module.css";
import DegreeReqDisplay from "./reusable/DegreeReqDisplay";
import JarUserLogin from "./reusable/JarUserLogin";

/* scripts */

/*  =============== NON REUSABLE FUNCTIONAL COMPONENT =============== */
function AddMajorMinor(props) {
  const { onClose } = props;
  const [name, setName] = useState("");
  /*  If Major State === false, then Minor selected */
  const [majorState, setMajorState] = useState(true);

  const handleNameChange = (e) => {
    setName(e.target.value);
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
        <div className={pStyle.headerBody}>ADD NEW:</div>
        <div />
      </div>
      <div className={pStyle.formContainer}>
        <div className={pStyle.inputContainer}>
          <TextField
            // label="Search Course"
            placeholder={majorState ? "Major Name" : "Minor Name"}
            onChange={handleNameChange}
            value={name}
            type="text"
            variant="outlined"
            size="medium"
            fullWidth
            className={pStyle.inputAreaName}
          />
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

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                  EXPORTED MAIN FUNCTIONAL COMPONENT                       *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function DegreePlan1(props) {
  const {
    shrink,
    logged,
    switchLogged,
    loginPopup,
    signupPopup,
    handleLoginPopup,
    handleSignupPopup,
  } = props;

  const [degreeReqOptions, setDegreeReqOptions] = useState(
    []
  ); /*  ALL the private degree reqs to current user  */
  const [selectedDegreeReq, setDegreeReq] =
    useState(
      "PLACEHOLDER"
    ); /*  Holds the current private Degree Requirement Displayed */
  const [selectedDegreeReqDetail, setDegreeReqDetail] = useState();

  const [editDRPopup, setEditDRPopup] =
    useState(false); /*  Degree Requirement Edit Popup */

  const [listSearchValue, setListSearchValue] = useState("");
  const [newMMPopup, setNewMMPopup] =
    useState(false); /* Add new Major / Minor Popup */

  const handleDegreeReqChange = (e) => {
    setDegreeReq(e.target.value);
  };

  const handleSearchChange = (e) => {
    setListSearchValue(e.target.value);
  };

  const fetchPrivateReqs = async () => {
    await fetch("https://jarney.club/api/degreereqs/private")
      .then((response) => {
        console.log("get request response:", response);
        return response.json();
      })
      .then((result) => {
        console.log("get request result of semester plan: ", result);

        if (result.reqs.length === 0) {
          console.log("no private reqs");
          fetchCreatePrivateReqs(degreeReqDefault);
        } else {
          setDegreeReqOptions(result.reqs);
        }
      })
      .catch((error) => {
        console.log("error from Degreeplan fetchPrivateReqs ", error);
      });
  };

  const fetchCreatePrivateReqs = async (values) => {
    const requestOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    };
    console.log("requestOption for fetchCreatePrivateReqs", requestOption);
    await fetch("https://jarney.club/api/degreereq/private", requestOption)
      .then((response) => response.json())
      .then((result) => {
        console.log("result from fetchCreatePrivateReqs", result);
        setEditDRPopup(false);
        fetchPrivateReqs();
      })
      .catch((error) =>
        console.log("error from fetchCreatePrivateReqs", error)
      );
  };

  const fetchSavePrivateReqs = async (values) => {
    const requestOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({reqs: values}),
    };
    console.log("requestOption for fetchCreatePrivateReqs", requestOption);
    await fetch("https://jarney.club/api/degreereq/private/save", requestOption)
      .then((response) => response.json())
      .then((result) => {
        console.log("result from fetchCreatePrivateReqs", result);
        setEditDRPopup(false);
        fetchPrivateReqs();
      })
      .catch((error) =>
        console.log("error from fetchCreatePrivateReqs", error)
      );
  };

  useEffect(() => {
    fetchPrivateReqs();
  }, []);


  useEffect(() => {
    setDegreeReqDetail(degreeReqOptions.filter(
      (req) => req.program_name === selectedDegreeReq.substr(3)
    )[0])
    console.log("degreeReqOptions: ", degreeReqOptions);
    console.log("selected Degree Req: ", selectedDegreeReq)
    console.log("selected Degree Req Detail: ", selectedDegreeReqDetail)
  }, [selectedDegreeReq])

  useEffect(() => {
    console.log("degreeReqOptions: ", degreeReqOptions);
    console.log("degreeReqOptions len: ", degreeReqOptions.length);
    setDegreeReq(degreeReqOptions[0]?.program_name);
  }, [degreeReqOptions]); 

  return (
    // {/* * * * * * * The Big Ass Horizontal Display * * * * * * * */}
    // {/* Encapsulates both 1) the search side, and 2) the degree req
    //           side.
    //           This flexbox has flex-direction: row */}
    <div className={dp1Style.horizontalWrapper}>
      {/* * * * * * * Includes Degree Req Selector * * * * * * */}
      {/* Includes 1) Existing degree req search list, 2) My List.
                    This flexbox has flex-direction: column */}
      <div className={dp1Style.DegreeSearchWrapper}>
        {/* SEARCH CONTAINER for an Existing Degree Requirement */}
        <div className={dp1Style.existListWrapper}>
          <h5>Public Degree Requirements</h5>
          <TextField
            // label="Search Course"
            placeholder="Search Degree"
            onChange={handleSearchChange}
            value={listSearchValue}
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
            className={dp1Style.inputSearch}
          />
          <Button type="submit" className={dp1Style.searchButton}>
            search
          </Button>

          <div className={dp1Style.searchListContainer}>
            Course List placeholder1
          </div>
        </div>

        <div className={dp1Style.myListWrapper}>
          <h5>My Degree Requirements</h5>

          {/* options will be an array returned by API
                            options - degree req of current user */}
          <div style={{ width: "90%" }}>
            <Dropdown
              options={degreeReqOptions}
              isObject={true}
              objectField={"program_name"}
              selectedOption={selectedDegreeReq}
              onOptionChange={handleDegreeReqChange}
            />
          </div>

          <Button
            className={dp1Style.newMajorMinorButton}
            onClick={() => {
              setNewMMPopup(true);
              setEditDRPopup(true);
            }}
          >
            --- create a new major/ minor ---
          </Button>
        </div>
      </div>

      {/* * * * * * Includes the Degree Requirement Table * * * * * */}
      <div className={dp1Style.DegreeReqWrapper}>
        <div className={dp1Style.DegreeReqListWrapper}>
          {/* displays the name of the current selected degree
                            requirement */}
          <div className={dp1Style.DegreeReqListTitle}>{selectedDegreeReq}</div>

          {/* info returned from API call
                            display the info of the selected degree plan */}
          <div className={dp1Style.degreeReqListExpandable}>
            <DegreeReqDisplay reqDetail={selectedDegreeReqDetail} />
          </div>

          {/* button that displays an overlay to edit current
                            displayed degree requirement */}
          <Button
            className={dp1Style.editButton}
            onClick={() => {
              setNewMMPopup(false);
              setEditDRPopup(true);
            }}
          >
            edit
          </Button>
          {editDRPopup && (
            <Popup onClose={() => setEditDRPopup(false)}>
              <DegreeReqEdit
                onClose={() => setEditDRPopup(false)}
                isCreateMM={newMMPopup}
                fetchCreate={fetchCreatePrivateReqs}
                fetchSave={fetchSavePrivateReqs}
                reqDetail={selectedDegreeReqDetail}
              />
            </Popup>
          )}
        </div>

        <div className={dp1Style.nextPageButton}>
          <Link to="/DegreePlan2">
            <IconButton className={dp1Style.nextPageButton}>
              <DateRangeIcon fontSize="medium" aria-label="Next Page" />
            </IconButton>
          </Link>
        </div>
      </div>
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

export default DegreePlan1;
