/* eslint-disable no-unused-vars */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DegreeReqPart.js
 *  This component is part of the DegreeReqEdit Component
 *  A part includes:
 *    - part name
 *    - part Description (note)
 *    - courses (DegreeReqCourse component)
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
import AddIcon from "@material-ui/icons/Add";
import BackspaceIcon from "@material-ui/icons/Backspace";
import dStyle from "./reusableStyles/DegreeReq.module.css";
import DegreeReqCourse from "./DegreeReqCourse";

function DegreeReqPart(props) {
  const {
    onPartChange,
    onRemovePart,
    partDetail,
    onCourseChange,
    onAddCourse,
    onRemoveCourse,
  } = props;

  const handlePartGeneralChange = (e) => {
    onPartChange(e.target.value, e.target.name, partDetail.part_id);
  };

  const handleCourseChange = (val, valType, courseID) => {
    onCourseChange(val, valType, courseID, partDetail.part_id);
  };

  const handleAddCourse = () => {
    onAddCourse(partDetail.part_id);
  };

  const handleRemoveCourse = (courseID) => {
    onRemoveCourse(courseID, partDetail.part_id);
  };

  const handleRemovePart = () => {
    onRemovePart(partDetail.part_id);
  };

  return (
    <div className={dStyle.partContainer}>
      <div className={dStyle.partNameContainer}>
        <TextField
          placeholder="Enter a Part Name... "
          fullWidth
          autoFocus
          name="part_name"
          value={partDetail.part_name}
          onChange={handlePartGeneralChange}
        />
        <IconButton onClick={handleRemovePart}>
          <BackspaceIcon />
        </IconButton>
      </div>

      {/*   Courses  */}
      <div className={dStyle.tabbedContainer}>
        <TextField
          name="part_desc"
          multiline
          onChange={handlePartGeneralChange}
          value={partDetail.part_desc}
          placeholder="Part Description"
          type="text"
          variant="standard"
          fullWidth
          autoFocus
        />
        {partDetail.part_reqs?.map((course) => (
          <DegreeReqCourse
            key={course.part_req_id}
            courseDetail={course}
            onCourseChange={handleCourseChange}
            onRemoveCourse={handleRemoveCourse}
          />
        ))}
        <Button startIcon={<AddIcon />} onClick={handleAddCourse}>
          Add a course
        </Button>
      </div>
    </div>
  );
}

export default DegreeReqPart;
