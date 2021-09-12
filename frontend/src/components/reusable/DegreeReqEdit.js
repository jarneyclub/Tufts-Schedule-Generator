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
import { useState } from "react";
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

const schoolOptions = [" A&S", " ENG"];
const degreeOptions = ["B.S.", "B.A."];

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                           *
 *                     EXPORTED MAIN FUNCTIONAL COMPONENT                    *
 *                                                                           *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function DegreeReqEdit(props) {
  const { onClose, fetchCreate } = props;
  const [detail, setDetail] = useState(drDefault);

  const handleClose = () => {
    onClose();
  };

  const handleAdd = () => {
    /* do something API??  */
    fetchCreate(detail);
    // onClose();
  };

  const handleGeneralChange = (e) => {
    console.log("e:", e);
    setDetail((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
        ...prev.parts,
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

  // const fetchCreate = async () => {

  //   const requestOption = {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json", "accept": "application/json" },
  //     body: JSON.stringify(detail),
  //   };

  //   console.log("request option: ", requestOption)

  //   await fetch("https://jarney.club/api/degreereqs/private", requestOption)
  //     .then((response) => {
  //       console.log("response: ", response);
  //       return response.json();
  //     })
  //     .then((result) =>
  //       console.log("result from fetchCreate: ", result))
  //     .catch((error) => {
  //       console.log("fetchCreate error: ", error);
  //     });
  // };

  // const fetchCreate = async (values) => {
  //   // setLoadMessage(true);

  //   const requestOption = {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(detail),
  //   };
  //   console.log("requestOption clicked ", requestOption);

  //   await fetch("https://jarney.club/api/degreereqs/private", requestOption)
  //     .then((response) => {
  //       if (response.ok) {
  //         return response.json();
  //       }
  //       throw new Error("Failed to fetch.");
  //     })
  //     .then((result) => {
  //       console.log("result from post: ", result);
  //       // setLoadMessage(false);
  //       onClose();
  //     })
  //     .catch((error) => {
  //       // setLoadMessage(false);
  //       // console.log(error.data);
  //       // handleAlert("error", "Error: Failed to Login");
  //       // console.log("error login")

  //       // add an error message popup of some sort
  //       console.log("error from post degreereq: ", error);
  //     });
  // };

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
          === {detail.program_name} ===&nbsp;&nbsp;
        </div>
        <span />
      </div>
      {/*   ================== Body ================== */}
      <div className={dStyle.formContainer}>
        <div className={dStyle.inputContainer}>
          <TextField
            size="medium"
            onChange={handleGeneralChange}
            className={pStyle.inputAreaName}
            label="Name"
            name="program_name"
          />

          <Dropdown
            options={schoolOptions}
            selectedOption={detail.school}
            onOptionChange={handleGeneralChange}
            name="school"
            labelId="school_dropdown"
            labelName="School"
          />

          <TextField
            size="medium"
            onChange={handleGeneralChange}
            className={pStyle.inputAreaName}
            label="Degree"
            name="degree"
          />

          {/* ------------ Parts ------------ */}
          <div className={dStyle.partsContainer}>
            {detail.parts?.map((part) => (
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
