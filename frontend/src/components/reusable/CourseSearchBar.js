/* eslint-disable camelcase */
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
import cStyle from "./reusableStyles/CourseSearchBar.module.css";

function CourseSearchBar(props) {
  const { courseDetail, onDragStart } = props;
  const { course_num, course_title, units_esti } = courseDetail;

  // const handleDragStart = (e) => {
  //   e.dataTransfer.setData("id", e.target.id)
  //   console.log(e);
  // }

  return (
    <div
      className={cStyle.barContainer}
      draggable
      onDragStart={onDragStart}
      id={course_num.concat(course_title)}
    >
      【{course_num}】<br />
      {course_title}
    </div>
  );
}

export default CourseSearchBar;
