/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * EventScreenshot.js
 *
 *
 */

import { useEffect, useState } from "react";
import eStyle from "./reusableStyles/EventScreenshot.module.css";

const columnTitles = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "TimeUnspecified"]


function Class(props) {
  const { classDetail } = props;
  const { name, details, location, instructors, time_start, time_end} = classDetail;


  return (
    <div className={eStyle.classContainer}>
      <div>{time_start}~{time_end}</div>
      <div>{details}</div>
      <div>{name}</div>
      <div>{location}</div>
    </div>
  )


}


function EventScreenshot(props) {
  const { classDetails, onClose } = props;


 
  console.log("eventScreenshot:", classDetails);
  


  return (
    <div className={eStyle.rowContainer}>
      {
        columnTitles.map((title) => (
          <div className={eStyle.eventsContainer}>
            <div>{title}</div>
            {
              classDetails[title]?.map((details) => (
                <Class classDetail={details}/>
              ))
            }
          </div>
        ))
      }
    </div>
  );
}

export default EventScreenshot;
