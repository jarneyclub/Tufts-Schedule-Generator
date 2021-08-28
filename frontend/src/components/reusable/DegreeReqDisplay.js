/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DegreeReqDisplay.js
 *  This component is to display a selected degree requirement
 *  A part includes:
 *    - part name
 *    - part Description (note)
 *    - courses (DegreeReqCourse component)
 * 
 *  reqDetails object includes : 
 *    {
      "priv_dr_id": "string",
      "program_name": "string",
      "school": "string",
      "degree": "string",
      "part_id_tracker": 0,
      "parts": [
        {
          "part_id": 0,
          "part_name": "string",
          "part_desc": "string",
          "part_req_id_tracker": "string",
          "part_reqs": [
            {
              "part_req_id": 0,
              "course_num": "string",
              "course_note": "string",
              "completed": true
            }
          ]
        }
      ]
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
import dStyle from "./reusableStyles/DegreeReqDisplay.module.css";

function DegreeReqDisplay(props) {
  const { reqDetail } = props;
  console.log("reqDetail from DegreeReqDisplay: ", reqDetail);

  return (
    <div className={dStyle.displayContainer}>
      <div>School:&nbsp;{reqDetail.school}</div>
      <div>Degree:&nbsp;{reqDetail.degree}</div>
      <br />
      {reqDetail.parts?.map((req) => (
        <div>
          <div>{req.part_name}</div>
          <div>{req.part_desc}</div>
          {req.part_reqs?.map((course) => (
            <div>
              <div>{course.course_num}</div>
              <div>{course.course_note}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default DegreeReqDisplay;
