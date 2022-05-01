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
import {useState, useMemo, useCallback, useEffect} from 'react';    //Added for drag-drop re-implementation
import { dividerClasses, tableFooterClasses } from '@mui/material'; //Added for drag-drop re-implementation 

function CourseSearchBar(props) {
  const {
    courseDetail,
    onTransferCourse,
    origin,
    handleCardOrigin, //not used in DegreePlan
    draggable,
    onDoubleClick, //not used in DegreePlan
    customStyle, //not used in DegreePlan
    onClick,
    mouseState,                      //Added for drag-drop re-implementation 
    setMouseState,                   //Added for drag-drop re-implementation 
    onDrag,                          //Added for drag-drop re-implementation 
  } = props;
  const { course_num, course_title, units_esti } = courseDetail;

  //COMMENTED OUT FOR RE-IMPLEMENTATION OF DRAG-DROP:
  //need clarification
  // const handleDragStart = (e, touch) => {
  //   e.preventDefault();
  //   onTransferCourse && onTransferCourse(courseDetail, touch);
  //   if (origin !== "courseList") {
  //     handleCardOrigin(origin);
  //   }
  // };

  //START OF ADDITIONS TO RE-IMPLEMENT DRAG AND DROP:
  const handleMouseDown = useCallback(({clientX, clientY}) => {
    setMouseState(mouseState => ({
        ...mouseState,
        isDragging: true,
        origin: {x: clientX, y: clientY}
    }))
  }, []);

  const handleMouseMove = useCallback(({clientX, clientY}) => {
    const translationn = {x: clientX - mouseState.origin.x, y: clientY - mouseState.origin.y};

    setMouseState(mouseState => ({
        ...mouseState,
        translation
    }))

    onDrag({translation});

  }, [mouseState.origin, onDrag]);

  useEffect(() => {
    if (mouseState.isDragging) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mouseMove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      setMouseState(mouseState => ({...mouseState, translation: POSITION }))
    }
  }, [mouseState.isDragging, handleMouseMove, handleMouseUp]);

  const styles = useMemo(() => ({
      cursor: isDragging ? '-webkit-grabbing' : 'webkit-grab', 
      transform: `translate(${mouseState.translation.x}px, ${mouseState.translation.y}px)`,
      transition: mouseState.isDragging ? 'none' : 'transform 500 ms',
      zIndex: tableFooterClasses.isDragging ? 2 : 1, 
      position: mouseState.isDragging ? 'absolute' : 'relative'
  }), [mouseState.isDragging, mouseState.translation]);

  //END OF ADDITIONS

  //need clarification
  const handleDoubleClick = () => {
    if (origin === "schedulerCourseList" || origin === "schedulerTab") {
      onDoubleClick(courseDetail);
    } else if (origin !== "courseList") {
      onDoubleClick(courseDetail);
    }
  };

  const handleOnClick = () => {
    onClick(courseDetail);
  };

  return (
    <div
      className={cStyle.barContainer}
      draggable={draggable}
      // onTouchStart={(e) => handleDragStart(e, true)}
      // onDragStart={(e) => handleDragStart(e, false)}
      //onMouseDown={(e) => handleDragStart(e, false)}       //Commented out for drag-drop re-imp
      onMousedown={handleMouseDown}
      id={course_num?.concat(course_title)}
      style={customStyle}
    >
      {/* what are these three choices? */}
      {(origin === "schedulerCourseList" ||
        origin === "schedulerTab" ||
        origin !== "courseList") && <div>&nbsp;</div>}
      <div
        style={{ wordBreak: "break-word" }}
        onDoubleClick={handleDoubleClick}
        onClick={handleOnClick}
      >
        【{course_num}】{course_title}
      </div>
      {origin === "schedulerCourseList" && (
        <div className={cStyle.actionButton}>
          <IconButton onClick={handleDoubleClick}>
            <AddIcon style={{ fill: "#ffffff" }} />
          </IconButton>
        </div>
      )}
      {(origin === "schedulerTab" ||
        !(
          origin === "courseList" ||
          origin === "schedulerCourseList" ||
          origin === "degreePlanExpress"
        )) && (
        <div className={cStyle.actionButton}>
          <IconButton onClick={handleDoubleClick}>
            <RemoveIcon style={{ fill: "#ffffff" }} />
          </IconButton>
        </div>
      )}
      {origin === "degreePlanExpress" && <div>&nbsp;</div>}
    </div>
  );
}

export default CourseSearchBar;
