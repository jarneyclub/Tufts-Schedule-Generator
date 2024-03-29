/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DegreeRequirement.js
 *
 *
 */

import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import DateRangeIcon from '@material-ui/icons/DateRange';
import {
  Button,
  IconButton,
  TextField,
  InputAdornment,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@mui/icons-material/Edit';
import AddBoxIcon from '@material-ui/icons/AddBox';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CancelIcon from '@material-ui/icons/Cancel';
import degreeReqStyle from './style/DegreeRequirement.module.css';
import pStyle from './reusable/reusableStyles/Popup.module.css';
import Popup from './reusable/Popup';
import SnackBarAlert from './reusable/SnackBarAlert';
import Dropdown from './reusable/Dropdown';
import DegreeReqEdit from './reusable/DegreeReqEdit';
import dStyle from './reusable/reusableStyles/Dropdown.module.css';
import DegreeReqDisplay from './reusable/DegreeReqDisplay';
import JarUserLogin from './reusable/JarUserLogin';
import { RemovePrivReq } from './reusable/DegreeRequirementPopup';

/* scripts */
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

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                  EXPORTED MAIN FUNCTIONAL COMPONENT                       *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
function DegreeRequirement(props) {
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
  const [degreeReqOptions, setDegreeReqOptions] = useState(
    []
  ); /*  ALL the private degree reqs to current user  */
  const [publicReqOptions, setPublicReqOptions] = useState([]);

  const [selectedDegreeReqIdx, setSelectedDegreeReqIdx] = useState(0);
  const [selectedDegreeReq, setDegreeReq] =
    useState(''); /*  Holds the current private Degree Requirement Displayed */
  const [showLastPrivateReq, setShowLastPrivateReq] = useState(false);
  const [selectedDegreeReqDetail, setDegreeReqDetail] = useState();

  const [publicDegreeReqDetail, setPublicDegreeReqDetail] = useState({});
  const [showPublicDegreeReq, setShowPublicDegreeReq] = useState(false);
  // const [addedPublicDegree]

  const [editDRPopup, setEditDRPopup] =
    useState(false); /*  Degree Requirement Edit Popup */

  const [listSearchValue, setListSearchValue] = useState('');
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
      'https://jarney.club/api/degreereqs/public?pname='.concat(
        listSearchValue
      )
    )
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        setPublicReqOptions([]);
        setPublicReqOptions(result.reqs);
      })
      .catch((error) => {});
  };

  const fetchPublicToPrivate = async () => {
    const requestOption = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };

    await fetch(
      'https://jarney.club/api/degreereq/public/copy/'.concat(
        //check if there are repeated terms
        publicDegreeReqDetail.pub_dr_id
      ),
      requestOption
    )
      .then((response) => response.json())
      .then((result) => {
        setShowPublicDegreeReq(false);
        fetchPrivateReqs(true);
        setSelectedDegreeReqIdx(0);
      })
      .catch((error) => {});
  };

  const fetchPrivateReqs = async (showLast) => {
    setSelectedDegreeReqIdx(0);
    await fetch('https://jarney.club/api/degreereqs/private')
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        setDegreeReqOptions(result.reqs);

        setLoaded(true);
      })
      .catch((error) => {});
  };

  const fetchCreatePrivateReqs = async (values) => {
    const requestOption = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    };
    await fetch('https://jarney.club/api/degreereq/private', requestOption)
      .then((response) => response.json())
      .then((result) => {
        setEditDRPopup(false);
        fetchPrivateReqs();
      })
      .catch((error) => {});
  };

  const fetchSavePrivateReqs = async (values) => {
    const requestOption = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    };
    await fetch('https://jarney.club/api/degreereq/private', requestOption)
      .then((response) => response.json())
      .then((result) => {
        setEditDRPopup(false);
        fetchPrivateReqs();
      })
      .catch((error) => {});
  };

  useEffect(() => {
    handleLogRequired(true);
  }, []);

  useEffect(() => {
    if (logged) {
      fetchPrivateReqs();
      fetchPublicReqs();
    }
  }, [logged]);

  useEffect(() => {
    setDegreeReqDetail(degreeReqOptions[selectedDegreeReqIdx]);
  }, [selectedDegreeReqIdx]);

  useEffect(() => {
    if (showLastPrivateReq) {
      setSelectedDegreeReqIdx(degreeReqOptions.length - 1);
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
    <div className={degreeReqStyle.horizontalWrapper}>
      <Helmet>
        <title>JARney | Degree Requirement</title>
        <meta
          name="description"
          content="Tufts majors and minors requirements, all in one page! Look for an existing degree requirement and add it to your list."
        />
      </Helmet>
      {/* * * * * * * Includes Degree Req Selector * * * * * * */}
      {/* Includes 1) Existing degree req search list, 2) My List.
                    This flexbox has flex-direction: column */}
      <div className={degreeReqStyle.DegreeSearchWrapper}>
        {/* SEARCH CONTAINER for an Existing Degree Requirement */}
        <div className={degreeReqStyle.myListWrapper}>
          <h5 style={{ textAlign: 'center' }}>Public degree requirements</h5>
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
            className={degreeReqStyle.inputSearch}
          />
        </div>
        <div className={degreeReqStyle.existListWrapper}>
          <div className={degreeReqStyle.searchListContainer}>
            {publicReqOptions?.map((option) => (
              <Button
                className={degreeReqStyle.publicReqButton}
                onClick={() => handlePublicDegreeDisplay(option)}
              >
                {option.program_name}
              </Button>
            ))}
          </div>
          {showPublicDegreeReq && (
            <div className={degreeReqStyle.DegreeReqListWrapper}>
              <div className={degreeReqStyle.degreeReqListExpandable}>
                <DegreeReqDisplay reqDetail={publicDegreeReqDetail} />
              </div>
            </div>
          )}
          {showPublicDegreeReq && (
            <Button
              className={degreeReqStyle.saveButton}
              onClick={() => fetchPublicToPrivate()}
            >
              Add to my list
            </Button>
          )}
        </div>
      </div>

      {/* * * * * * Includes the Degree Requirement Table * * * * * */}

      {degreeReqOptions && degreeReqOptions[selectedDegreeReqIdx] ? (
        <div className={degreeReqStyle.DegreeReqWrapper}>
          <div className={degreeReqStyle.myListWrapper}>
            <h5>My degree requirements</h5>

            {/* options will be an array returned by API
                            options - degree req of current user */}
            <div
              className={degreeReqStyle.dropdownListWrapper}
              style={{ width: '90%' }}
            >
              <Dropdown
                options={degreeReqOptions}
                isObject={true}
                objectField={'program_name'}
                selectedOption={
                  degreeReqOptions && degreeReqOptions[selectedDegreeReqIdx]
                }
                selectedIdx={selectedDegreeReqIdx}
                onOptionChange={handleDegreeReqChange}
              />
              &nbsp;
              <IconButton
                className={degreeReqStyle.editPlanButton}
                onClick={() => {
                  setNewMMPopup(true);
                  setEditDRPopup(true);
                }}
              >
                <AddBoxIcon fontSize="medium" />
              </IconButton>
              &nbsp;
              {degreeReqOptions && degreeReqOptions[selectedDegreeReqIdx] && (
                <IconButton
                  className={degreeReqStyle.editPlanButton}
                  onClick={() => handlePopup('removePrivateReq', true)}
                >
                  <IndeterminateCheckBoxIcon fontSize="medium" />
                </IconButton>
              )}
            </div>
          </div>
          <div className={degreeReqStyle.DegreeReqListWrapper}>
            {/* info returned from API call
                            display the info of the selected degree plan */}
            <div className={degreeReqStyle.degreeReqListExpandable}>
              <DegreeReqDisplay
                reqDetail={
                  degreeReqOptions && degreeReqOptions[selectedDegreeReqIdx]
                }
              />
            </div>

            {/* button that displays an overlay to edit current
                            displayed degree requirement */}
            {degreeReqOptions && degreeReqOptions[selectedDegreeReqIdx] && (
              <Button
                className={degreeReqStyle.editButton}
                onClick={() => {
                  setNewMMPopup(false);
                  setEditDRPopup(true);
                }}
                startIcon={<EditIcon />}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      ) : (
        loaded && (
          <div className={degreeReqStyle.noDegreeReqWrapper}>
            <h5>Add a requirement from Public degree requirements</h5>
            <h5>or create one now!</h5>
            <IconButton
              className={degreeReqStyle.editPlanButton}
              onClick={() => {
                setNewMMPopup(true);
                setEditDRPopup(true);
              }}
            >
              <AddOutlinedIcon fontSize="large" />
            </IconButton>
          </div>
        )
      )}

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

      {popup.removePrivateReq && (
        <Popup onClose={() => handlePopup('removePrivateReq', false)}>
          <RemovePrivReq
            onClose={() => handlePopup('removePrivateReq', false)}
            privateReqName={
              degreeReqOptions[selectedDegreeReqIdx]?.program_name
            }
            privateReqID={degreeReqOptions[selectedDegreeReqIdx]?.priv_dr_id}
            refreshPrivateReq={fetchPrivateReqs}
            onShowAlert={() => setShowAlert(true)}
            setAlertMessage={setAlertMessage}
            setAlertSeverity={setAlertSeverity}
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

export default DegreeRequirement;
