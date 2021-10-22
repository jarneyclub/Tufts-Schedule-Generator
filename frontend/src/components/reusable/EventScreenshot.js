/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * EventScreenshot.js
 *
 *
 */

import { Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import eStyle from "./reusableStyles/EventScreenshot.module.css";

const columnTitles = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "TimeUnspecified"]


function Class(props) {
  const { classDetail, tu } = props;
  const { name, details, location, instructors, time_start, time_end} = classDetail;
  const detail = details.split(',');
  const loc = location.split(',');

  return (
    <div className={eStyle.classContainer}>
      {
        !tu && <div>{time_start}&nbsp;~&nbsp;{time_end}</div>
      }
      <div>{detail[0]}</div>
      <div>{detail[1]}</div>
      <div>{name}</div>
      <div>{loc[0]}</div>
    </div>
  )


}


function EventScreenshot(props) {
  const { classDetails, onClose } = props;


 
  console.log("eventScreenshot:", classDetails);
  


  return (
    <div className={eStyle.screenshotContainer}>
      <Button onClick={onClose} className={eStyle.button}>Return to scheduler</Button>
      <br/>
      <br/>
      <div className={eStyle.rowContainer}>
        {
        columnTitles.map((title) => (
          <div className={eStyle.eventsContainer}>
            <div className={eStyle.titleContainer}>{title !== "TimeUnspecified" ? title : "Unspecified"}</div>
            {
              classDetails[title]?.map((details) => (
                <Class classDetail={details} tu={title === "TimeUnspecified"}/>
              ))
            }
          </div>
        ))
      }
      </div>
      
    </div>
  );
}

export default EventScreenshot;
