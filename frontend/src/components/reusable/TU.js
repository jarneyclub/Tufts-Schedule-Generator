/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Event.js
 * The classes. Display relevant information.
 *
 */

import { useEffect, useState } from "react";
import sStyle from "../style/Scheduler.module.css";

function TU(course) {
  const {courseDetails} = course;

  const { details, name, location, time_start, time_end } = courseDetails;
  const detail = details.split(",");

  return (
    <div className={sStyle.tuButton}>
      <div>{detail[0]}</div>
      <div>{detail[1]}</div>
    </div>
  );
}

export default TU;

