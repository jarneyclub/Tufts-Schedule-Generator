/* eslint-disable no-unused-vars */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DegreeReqEdit.js
 *  This component is the popup child for editing degree requirement
 *  This component includes:
 *      - Degree Requirement name
 *      - School of the current Degree requirement
 *      - Degree of the current Degree requirement
 *      - All the Parts to this current Degree Requirement (DegreeReqPart)
 *
 */
import { useEffect, useState } from "react";
import {
  Button,
  IconButton,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import AddIcon from "@material-ui/icons/Add";
import pStyle from "./reusableStyles/Popup.module.css";
import Dropdown from "./Dropdown";
import DegreeReqPart from "./DegreeReqPart";
import dStyle from "./reusableStyles/DegreeReq.module.css";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                                 CONSTANTS                                 *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const drDefault = {
  program_name: "",
  school: "",
  degree: "",
  part_id_tracker: 1,
  parts: [
    {
      part_id: 0,
      part_name: "",
      part_desc: "",
      part_req_id_tracker: 1,
      part_reqs: [
        {
          part_req_id: 0,
          course_num: "",
          course_note: "",
        },
      ],
    },
  ],
};

const schoolDefaults = [" A&S", " ENG"];

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                     EXPORTED MAIN FUNCTIONAL COMPONENT                    *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function DegreeReqEdit(props) {
  const { onClose, fetchCreate, fetchSave, isCreateMM, reqDetail } = props;
  const [detail, setDetail] = useState(isCreateMM ? drDefault : reqDetail);
  const [schoolOptions, setSchoolOptions] = useState(schoolDefaults);
  const [selectedSchoolIdx, setSelectedSchoolIdx] = useState(0);

  console.log("DegreeReqEdit, isCreateMM: ", isCreateMM);
  console.log("DegreeReqEdit reqDetail: ", reqDetail);
  const handleClose = () => {
    onClose();
  };

  const handleAdd = () => {
    /* do something API??  */
    isCreateMM ? fetchCreate(detail) : fetchSave(detail);
    // onClose();
  };

  const handleGeneralChange = (e) => {
    console.log("e:", e);
    if (e.target.name === "school") {
      setSelectedSchoolIdx(e.target.selectedIndex);
      setDetail((prev) => ({
        ...prev,
        [e.target.name]: schoolOptions[e.target.value],
      }));
    } else {
      setDetail((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  /*  Controlled input for note  */
  const handlePartChange = (val, valType, partID) => {
    setDetail((prev) => ({
      ...prev,
      parts: prev.parts.map((part) =>
        part.part_id === partID
          ? {
              ...part,
              [valType]: val,
            }
          : part
      ),
    }));
  };

  const handleAddPart = () => {
    setDetail((prev) => ({
      ...prev,
      parts: [
        ...prev?.parts,
        {
          ...drDefault.parts[0],
          part_id: prev.part_id_tracker,
        },
      ],
      part_id_tracker: prev.part_id_tracker + 1,
    }));
  };

  const handleRemovepart = (partID) => {
    setDetail((prev) => ({
      ...prev,
      parts: prev.parts.filter((part) => part.part_id !== partID),
    }));
  };

  const handleCourseChange = (val, valType, courseID, partID) => {
    setDetail((prev) => ({
      ...prev,
      parts: prev.parts.map((part) =>
        part.part_id === partID
          ? {
              ...part,
              part_reqs: part.part_reqs.map((course) =>
                course.part_req_id === courseID
                  ? {
                      ...course,
                      [valType]: val,
                    }
                  : course
              ),
            }
          : part
      ),
    }));
  };

  const handleAddCourse = (partID) => {
    setDetail((prev) => ({
      ...prev,
      parts: prev.parts.map((part) =>
        part.part_id === partID
          ? {
              ...part,
              part_reqs: [
                ...part.part_reqs,
                {
                  ...drDefault.parts[0].part_reqs[0],
                  part_req_id: part.part_req_id_tracker,
                },
              ],
              part_req_id_tracker: part.part_req_id_tracker + 1,
            }
          : part
      ),
    }));
  };

  const handleRemoveCourse = (courseID, partID) => {
    console.log("partID courseID: ", partID, courseID);
    setDetail((prev) => ({
      ...prev,
      parts: prev.parts.map((part) =>
        part.part_id === partID
          ? {
              ...part,
              part_reqs: part.part_reqs.filter(
                (course) => course.part_req_id !== courseID
              ),
            }
          : part
      ),
    }));
  };

  const fetchSchoolOptions = async () => {
    await fetch("https://jarney.club/api/courses/programs")
      .then((response) => response.json())
      .then((result) => {
        console.log("result from schoolOptions", result);
        setSchoolOptions(result.names);
      })
      .catch((error) => console.log("error from schoolOptions", error));
  };

  useEffect(() => {
    fetchSchoolOptions();
  }, []);
  return (
    <div className={dStyle.drContainer}>
      <div className={dStyle.headerContainer}>
        <IconButton
          type="button"
          onClick={handleClose}
          className={pStyle.closeButton}
        >
          <CancelIcon />
        </IconButton>
        <div className={pStyle.headerBody}>
          {detail?.program_name} &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
        <span />
      </div>
      {/*   ================== Body ================== */}
      <div className={dStyle.formContainer}>
        <div className={dStyle.inputContainer}>
          <TextField
            size="medium"
            value={detail?.program_name}
            onChange={handleGeneralChange}
            className={pStyle.inputAreaName}
            label="Name"
            name="program_name"
          />

          <Dropdown
            options={schoolOptions}
            selectedOption={detail?.school}
            onOptionChange={handleGeneralChange}
            selectedIdx={selectedSchoolIdx}
            name="school"
            labelId="school_dropdown"
            labelName="School"
          />

          <TextField
            size="medium"
            value={detail?.degree}
            onChange={handleGeneralChange}
            className={pStyle.inputAreaName}
            label="Degree"
            name="degree"
          />

          {/* ------------ Parts ------------ */}
          <div className={dStyle.partsContainer}>
            {detail?.parts?.map((part) => (
              <DegreeReqPart
                key={part.partID}
                partDetail={part}
                onPartChange={handlePartChange}
                onRemovePart={handleRemovepart}
                onCourseChange={handleCourseChange}
                onAddCourse={handleAddCourse}
                onRemoveCourse={handleRemoveCourse}
              />
            ))}
          </div>
          <Button startIcon={<AddIcon />} onClick={handleAddPart}>
            Add a Part
          </Button>
        </div>

        <Button className={pStyle.submitButton} onClick={handleAdd}>
          save
        </Button>
      </div>
    </div>
  );
}

export default DegreeReqEdit;
