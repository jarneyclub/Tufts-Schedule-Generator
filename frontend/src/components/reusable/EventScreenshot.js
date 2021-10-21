/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * EventScreenshot.js
 *
 *
 */

import { useEffect, useState } from "react";
import eStyle from "./reusableStyles/Event.module.css";

const columnTitles = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Time Unspecified"]


function Class(props) {

}


function EventScreenshot(props) {
  const { classDetails } = props;


  const [customStyle, setCustomStyle] = useState({});
  console.log("eventScreenshot:", classDetails);
  


  return (
    <div
      className={eStyle.eventContainer}
    >
      check
    </div>
  );
}

export default EventScreenshot;
