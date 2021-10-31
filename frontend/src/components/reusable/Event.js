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
import EinaBold from "../../fonts/Eina03-SemiBold.ttf";
import EinaRegular from "../../fonts/Eina03-Regular.ttf";

function Event(props) {
  const { eventDetails, onEventClick } = props;

  const { details, name, location, time_start, time_end } = eventDetails;
  const detail = details.split(',');
  const loc  = location.split(',');

  console.log("eventDetails: ", eventDetails);
  const calculateHeight = () => {
    const start = time_start.split(":");
    const end = time_end.split(":");

    const startMin = parseInt(start[0]) * 60 + parseInt(start[1]);
    const endMin = parseInt(end[0]) * 60 + parseInt(end[1]);

    return ((endMin - startMin) / 60) * 80;
  };

  const calculateTranslate = () => {
    let res = -1040;
    const start = time_start.split(":");
    res =
      res + ((parseInt(start[0]) * 60 + parseInt(start[1]) - 480) * 80) / 60;


    return res;
  };
  const handleOnClick = () => {
    onEventClick(eventDetails);
  };
  

  const transY = calculateTranslate();
  const eventHeight = calculateHeight();


  return (
    <div
      className={eStyle.eventContainer}
      style={{transform: `translateY(${transY}px`, height:`${eventHeight}px`}}
      onClick={handleOnClick}
    >
      {
      time_start !== time_end &&
        <div >
          {time_start}&nbsp;~&nbsp;{time_end}
        </div>
      }
      
      <div>{detail[0]}</div>
      <div>{detail[1]}</div>
      <div>{name}</div>
      <div>{loc[0]}</div>
    </div>
  );
}

export default Event;
