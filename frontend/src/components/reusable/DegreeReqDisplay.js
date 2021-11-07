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

  return (
    <div className={dStyle.displayContainer}>
      <div style={reqDetail ? { textAlign: "center", color: "#5A32BF" } :  { textAlign: "center", color: "#FC4E4E" }}>
        {
        reqDetail ? reqDetail?.program_name
        : 
        "You currently don't have any degree requirement added. ", <br/>, "Start your own with + above, or add one from the public degree requirements!"}
      </div>

     

      { reqDetail && reqDetail?.school && (
        <div>
          <div style={{ color: "#FC4E4E" }}>School:&nbsp;</div>
          <div>{reqDetail?.school}</div>
        </div>
      )}
      { reqDetail &&reqDetail?.degree && (
        <div>
          <div style={{ color: "#FC4E4E" }}>Degree:&nbsp;</div>
          <div>{reqDetail?.degree}</div>
        </div>
      )}

      <br />
      { reqDetail && reqDetail?.parts?.map((req) => (
        <div>
          <div style={{ color: "#FC4E4E", wordBreak: "break-word", whiteSpace: "pre-wrap"}}>
            {req?.part_name}
          </div>
          <div style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>{req?.part_desc}</div>
          {req?.part_reqs?.map((course) => (
            <div>
              {course?.course_num && (
                <div style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
                  &nbsp;▪&nbsp;{course?.course_num}
                </div>
              )}
              <div style={{ wordBreak: "break-word" , whiteSpace: "pre-wrap"}}>
                {course?.course_note}
              </div>
            </div>
          ))}
        </div>
      ))}



    </div>
  );
}

export default DegreeReqDisplay;
