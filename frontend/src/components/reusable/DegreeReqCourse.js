/* eslint-disable no-unused-vars */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *  DegreeReqCourse.js
 *  This component is used in DegreeReqPart, whcih displays input sections of a course
 *  This component includes:
 *      - course name textfield
 *      - course name description (note) textfield
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
import RemoveIcon from "@material-ui/icons/Remove";
import dStyle from "./reusableStyles/DegreeReq.module.css";

function DegreeReqCourse(props) {
  const { onCourseChange, courseDetail, onRemoveCourse } = props;

  const handleCourseChange = (e) => {
    onCourseChange(e.target.value, e.target.name, courseDetail.part_req_id);
  };

  const handleRemoveCourse = () => {
    onRemoveCourse(courseDetail.part_req_id);
  };

  return (
    <div className={dStyle.courseContainer}>
      <TextField
        placeholder="Course ID"
        fullWidth
        autoFocus
        name="course_num"
        value={courseDetail.course_num}
        onChange={handleCourseChange}
      />
      <TextField
        placeholder="CourseNote"
        fullWidth
        autoFocus
        multiline
        name="course_note"
        value={courseDetail.course_note}
        onChange={handleCourseChange}
      />
      <IconButton onClick={handleRemoveCourse}>
        <RemoveIcon fontSize="small" />
      </IconButton>
    </div>
  );
}

export default DegreeReqCourse;
