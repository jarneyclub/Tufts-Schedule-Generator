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


  const calculateHeight = () => {
    const start = time_start.split(":");
    const end = time_end.split(":");

    const startMin = parseInt(start[0]) * 60 + parseInt(start[1]);
    const endMin = parseInt(end[0]) * 60 + parseInt(end[1]);

    return (endMin - startMin) / 60 * 80;

  }

  const calculateTranslate = () => {

  }


  useEffect(() => {
    const transY = calculateTranslate();
    const eventHeight = -1040;
    setCustomStyle({
      transform: ("translateY("+transY+"px)"),
      height: (""+eventHeight+"px"),
    })
  }, [])

  return (
    <div className={eStyle.eventContainer}>
     {details}
    </div>
  );
}

export default Event;
