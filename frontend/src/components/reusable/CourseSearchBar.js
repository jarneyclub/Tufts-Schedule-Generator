/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * CourseSearchBar.js
 *  This component is part of the DegreeReqEdit Component
 *  A part includes:
 *    - part name
 *    - part Description (note)
 *    - courses (DegreeReqCourse component)
 * 
 *  course object includes : 
 *    {
          "course_num": "string",
          "course_title": "string",
          "units_esti": "string",
          "gen_course_id": "string"
        }
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
import AddIcon from "@material-ui/icons/Add";
import cStyle from "./reusableStyles/CourseSearchBar.module.css";

function CourseSearchBar(props) {
  const {
    courseDetail,
    onTransferCourse,
    origin,
    handleCardOrigin,
    draggable,
    onDoubleClick,
    customStyle,
  } = props;
  const { course_num, course_title, units_esti } = courseDetail;

  const handleDragStart = (e) => {
    onTransferCourse(courseDetail);
    if (origin !== "courseList") {
      handleCardOrigin(origin);
    }
  };

  const handleDoubleClick = () => {
    if (origin === "schedulerCourseList" || origin === "schedulerTab") {
      onDoubleClick(courseDetail);
    } else if (origin !== "coursList") {
      onDoubleClick();
    }
  };

  return (
    <div
      className={cStyle.barContainer}
      draggable={draggable}
      onDragStart={handleDragStart}
      id={course_num.concat(course_title)}
      onDoubleClick={handleDoubleClick}
      style={customStyle}
    >
      {(origin === "schedulerCourseList" ||
        origin === "schedulerTab" ||
        origin !== "courseList") && <div>&nbsp;</div>}
      <div>
        【{course_num}】<br />
        {course_title}
      </div>
      {origin === "schedulerCourseList" && (
        <div className={cStyle.actionButton}>
          <IconButton onClick={handleDoubleClick}>
            <AddIcon style={{ fill: "#ffffff" }} />
          </IconButton>
        </div>
      )}
      {(origin === "schedulerTab" ||
        !(origin === "courseList" || origin === "schedulerCourseList")) && (
        <div className={cStyle.actionButton}>
          <IconButton onClick={handleDoubleClick}>
            <RemoveIcon style={{ fill: "#ffffff" }} />
          </IconButton>
        </div>
      )}
    </div>
  );
}

export default CourseSearchBar;
