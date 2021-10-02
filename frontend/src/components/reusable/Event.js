/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Calendar.js
 *
 *
 */

import { useEffect, useState } from "react";
import eStyle from "./reusableStyles/Event.module.css";


function Event(props) {
  const {eventDetails} = props;

  const {details, name, location, time_start, time_end} = eventDetails;
  const [customStyle, setCustomStyle] = useState({});

  console.log("eventDetails: ", eventDetails);
  const calculateHeight = () => {
    const start = time_start.split(":");
    const end = time_end.split(":");

    const startMin = parseInt(start[0]) * 60 + parseInt(start[1]);
    const endMin = parseInt(end[0]) * 60 + parseInt(end[1]);

    console.log("height: ", (endMin - startMin) / 60 * 80);
    return (endMin - startMin) / 60 * 80;

  }

  const calculateTranslate = () => {
    let res = -1040;
    const start = time_start.split(":");
    res = res + (start[0] * 60 + start[1]) * 80 / 60; 
    
    console.log("translateY: ", res);

    return res;
  }


  useEffect(() => {
    const transY = calculateTranslate();
    const eventHeight = calculateHeight;
    setCustomStyle({
      transform: ("translateY("+transY+"px)"),
      height: (""+eventHeight+"px"),
    });
  }, [])

  return (
    <div className={eStyle.eventContainer} style={customStyle}>
     {details}
    </div>
  );
}

export default Event;
