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
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from "@material-ui/icons/AddBox";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import CancelIcon from "@material-ui/icons/Cancel";
import dp1Style from "./style/DegreePlan1.module.css";
import pStyle from "./reusable/reusableStyles/Popup.module.css";
import Popup from "./reusable/Popup";
import SnackBarAlert from "./reusable/SnackBarAlert";
import Dropdown from "./reusable/Dropdown";
import DegreeReqEdit from "./reusable/DegreeReqEdit";
import dStyle from "./reusable/reusableStyles/Dropdown.module.css";
import DegreeReqDisplay from "./reusable/DegreeReqDisplay";
import JarUserLogin from "./reusable/JarUserLogin";
import { RemovePrivReq } from "./reusable/DegreePlan1Popup";

/* scripts */
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
    handleLogRequired,
  } = props;

  const [degreeReqOptions, setDegreeReqOptions] = useState(
    []
  ); /*  ALL the private degree reqs to current user  */
  const [publicReqOptions, setPublicReqOptions] = useState([]);

  const [selectedDegreeReqIdx, setSelectedDegreeReqIdx] = useState(0);
  const [selectedDegreeReq, setDegreeReq] = useState(""); /*  Holds the current private Degree Requirement Displayed */
  const [showLastPrivateReq, setShowLastPrivateReq] = useState(false);
  const [selectedDegreeReqDetail, setDegreeReqDetail] = useState();

  const [publicDegreeReqDetail, setPublicDegreeReqDetail] = useState({});
  const [showPublicDegreeReq, setShowPublicDegreeReq] = useState(false);
  const [addedPublicDegree]

  const [editDRPopup, setEditDRPopup] =
    useState(false); /*  Degree Requirement Edit Popup */

  const [listSearchValue, setListSearchValue] = useState("");
  const [newMMPopup, setNewMMPopup] =
    useState(false); /* Add new Major / Minor Popup */
  const [popup, setPopup] = useState({
    removePrivateReq: false,
    addReq: false,
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState();
  const [alertSeverity, setAlertSeverity] = useState();

  const handlePopup = (field, bit) => {
    setPopup((prev) => ({
      ...prev,
      [field]: bit,
    }));
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleDegreeReqChange = (e) => {
    setDegreeReq(e.target.value);
    setSelectedDegreeReqIdx(e.target.selectedIndex);

  };

  const handleSearchChange = (e) => {
    setListSearchValue(e.target.value);
  };

  const handlePublicDegreeDisplay = (detail) => {
    setPublicDegreeReqDetail(detail);
    setShowPublicDegreeReq(true);
  };

  const fetchPublicReqs = async () => {
    await fetch(
      "https://jarney.club/api/degreereqs/public?pname=".concat(listSearchValue)
    )
      .then((response) => {
        console.log("get request response:", response);
        return response.json();
      })
      .then((result) => {
        setPublicReqOptions([]);
        console.log("get public req result: ", result);
        setPublicReqOptions(result.reqs);
      })
      .catch((error) => {
        console.log("error from Degreeplan fetchPublicReqs ", error);
      });
  };

  const fetchPublicToPrivate = async () => {
    const requestOption = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    await fetch(
      "https://jarney.club/api/degreereq/public/copy/".concat(
        publicDegreeReqDetail.pub_dr_id
      ),
      requestOption
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("result from fetchPublicToPrivate", result);
        setShowPublicDegreeReq(false);
        fetchPrivateReqs(true);
        setSelectedDegreeReqIdx()
      })
      .catch((error) => console.log("error from fetchPublicToPrivate", error));
  };

  const fetchPrivateReqs = async (showLast) => {
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
      method: "PUT",
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

  useEffect(() => {
    handleLogRequired(true);
    fetchPrivateReqs();
    fetchPublicReqs();
  }, []);

  useEffect(() => {
    fetchPrivateReqs();
    fetchPublicReqs();
  }, [logged])

  useEffect(() => {
    setDegreeReqDetail(degreeReqOptions[selectedDegreeReqIdx]);
    console.log("degreeReqOptions: ", degreeReqOptions);
    console.log("selected Degree Req Detail: ", selectedDegreeReqDetail);
  }, [selectedDegreeReqIdx]);

  useEffect(() => {
    console.log("degreeReqOptions: ", degreeReqOptions);
    console.log("degreeReqOptions len: ", degreeReqOptions.length);
    if (showLastPrivateReq) {
      setSelectedDegreeReqIdx(degreeReqOptions.length - 1)
    }
    
    // setDegreeReq(degreeReqOptions[0]?.program_name);
  }, [degreeReqOptions]);

  useEffect(() => {
    fetchPublicReqs();
    setShowPublicDegreeReq(false);
  }, [listSearchValue]);

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
        <div className={dp1Style.myListWrapper}>
          <h5 style={{textAlign:"center"}}>Public degree requirements</h5>
          <TextField
            // label="Search Course"
            placeholder="Look for other programs..."
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
        </div>
        <div className={dp1Style.existListWrapper}>
          
            <div className={dp1Style.searchListContainer}>
              {publicReqOptions?.map((option) => (
                <Button
                  className={dp1Style.publicReqButton}
                  onClick={() => handlePublicDegreeDisplay(option)}
                >
                  {option.program_name}
                </Button>
              ))}
            </div>
            {
              showPublicDegreeReq && 
              <div className={dp1Style.DegreeReqListWrapper}>
                <div className={dp1Style.degreeReqListExpandable}>
                  <DegreeReqDisplay reqDetail={publicDegreeReqDetail}/>
                  
                </div>
              </div>
              
            }
            {
              showPublicDegreeReq && 
              <Button
                  className={dp1Style.saveButton}
                  onClick={() => fetchPublicToPrivate()}
                >
                  Add to my list
                </Button>
            }



        </div>
          
            
      </div>

      {/* * * * * * Includes the Degree Requirement Table * * * * * */}
      <div className={dp1Style.DegreeReqWrapper}>
        <div className={dp1Style.myListWrapper}>
          <h5>My degree requirements</h5>

          {/* options will be an array returned by API
                            options - degree req of current user */}
          <div
            className={dp1Style.dropdownListWrapper}
            style={{ width: "90%" }}
          >
            <Dropdown
              options={degreeReqOptions}
              isObject={true}
              objectField={"program_name"}
              selectedOption={degreeReqOptions[selectedDegreeReqIdx]}
              selectedIdx={selectedDegreeReqIdx}
              onOptionChange={handleDegreeReqChange}
            />
            &nbsp;
            <IconButton
              className={dp1Style.editPlanButton}
              onClick={() => {
                setNewMMPopup(true);
                setEditDRPopup(true);
              }}
            >
              <AddBoxIcon fontSize="medium" />
            </IconButton>
            &nbsp;
            <IconButton
              className={dp1Style.editPlanButton}
              onClick={() => handlePopup("removePrivateReq", true)}
            >
              <IndeterminateCheckBoxIcon fontSize="medium" />
            </IconButton>
          </div>
        </div>
        <div className={dp1Style.DegreeReqListWrapper}>
         
          {/* info returned from API call
                            display the info of the selected degree plan */}
          <div className={dp1Style.degreeReqListExpandable}>
            <DegreeReqDisplay
              reqDetail={degreeReqOptions[selectedDegreeReqIdx]}
            />
          </div>

          {/* button that displays an overlay to edit current
                            displayed degree requirement */}
        
            <Button
              className={dp1Style.editButton}
              onClick={() => {
                setNewMMPopup(false);
                setEditDRPopup(true);
              }}
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
          
          {editDRPopup && (
            <Popup onClose={() => setEditDRPopup(false)}>
              <DegreeReqEdit
                onClose={() => setEditDRPopup(false)}
                isCreateMM={newMMPopup}
                fetchCreate={fetchCreatePrivateReqs}
                fetchSave={fetchSavePrivateReqs}
                reqDetail={degreeReqOptions[selectedDegreeReqIdx]}
              />
            </Popup>
          )}
        </div>

       
      </div>
      {
        popup.removePrivateReq && 
        <Popup onClose={()=>handlePopup("removePrivateReq", false)}>
          <RemovePrivReq 
          onClose={()=>handlePopup("removePrivateReq", false)}
          privateReqName={degreeReqOptions[selectedDegreeReqIdx].program_name}
          privateReqID={degreeReqOptions[selectedDegreeReqIdx].priv_dr_id}
          refreshPrivateReq={fetchPrivateReqs}
          onShowAlert={() => setShowAlert(true)}
          setAlertMessage={setAlertMessage}
          setAlertSeverity={setAlertSeverity}
        
          />
        </Popup>
        
      }
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

export default DegreePlan1;
