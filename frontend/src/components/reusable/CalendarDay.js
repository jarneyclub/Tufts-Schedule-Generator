/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Calendar.js
 *
 *
 */

import { useEffect, useState } from "react";
import cStyle from "./reusableStyles/CalendarDay.module.css";
import Event from "./Event.js";
import PurpleSwitch from "../reusable/PurpleSwitch";
/* scripts */
const time = [
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
];
const overlayTime = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
];

function CalendarDay(props) {
  const {
    dayName,
    timePrefState,
    timePrefDay,
    addTimePref,
    removeTimePref,
    removeEntireDay,
    singleDay,
    classesDay,
  } = props;
  const [dragState, setDragState] = useState(false);
  const [entireDayOn, setEntireDayOn] = useState()
  // eslint-disable-next-line no-unused-vars
  timePrefState && setEntireDayOn(timePrefDay?.length === 26);

  console.log("TimePrefDay ", timePrefDay, " ", timePrefState);
  /*  To check if a time slot is highlighted during time pref selection  */
  const onHighlight = (e) => {
    /*  Add highlight, add time pref to array  */
    if (e.target.style.backgroundColor.localeCompare("") === 0) {
      e.target.style.backgroundColor = "#A1C97D";
      addTimePref(dayName, e.target.id);
    } else {
      /*  Remove highlight, remove time pref from array  */
      console.log("calendarfbk  highlighted");
      e.target.style.backgroundColor = "";
      removeTimePref(dayName, e.target.id);
    }
  };

  /*  returns the background styling for overlay calendar slots  */
  const backgroundColorCheck = (timeName) => {
    let res = { backgroundColor: "" };
    // eslint-disable-next-line no-unused-expressions
    timePrefDay &&
      timePrefDay.forEach((element) => {
        if (element.time_earliest === timeName) {
          res = { backgroundColor: "#A1C97D" };
        }
      });

    return res;
  };
  console.log("classes in ", dayName, classesDay);

  useEffect(() => {
    if (entireDayOn) {
      overlayTime.foreach((timeName) => {
        addTimePref(dayName, timeName);
      })
    }
    else{ 
      removeEntireDay(dayName);
    }
  }, [entireDayOn])
  return (
    <div className={cStyle.dayContainer}>
      {/* {
        !singleDay ? <div className={cStyle.timeSlotTitle}>{dayName}</div> : <div>&nbsp;</div>
      } */}
      <div className={cStyle.timeSlotTitle}>{!singleDay ? dayName : " "}</div>
      {
        timePrefState && 
        
          <PurpleSwitch
            checked={entireDayOn}
            name="waitlist"
            onChange={() => setEntireDayOn((prev) => !prev)}
          />
                    
      }
      <div className={cStyle.timeContainer}>
        {timePrefState
          ? /* Time Pref Selection View */
            overlayTime.map((timeName) => (
              <div
                role="button"
                tabIndex={0}
                className={cStyle.timeSlotOverlay}
                key={timeName}
                id={timeName}
                style={backgroundColorCheck(timeName)}
                onMouseDown={() => setDragState((prev) => !prev)}
                onMouseOver={(e) => dragState && onHighlight(e)}
                onMouseUp={() => setDragState((prev) => !prev)}
                onDragStart={() => setDragState((prev) => !prev)}
                onDragEnter={(e) => dragState && onHighlight(e)}
                onDragEnd={() => setDragState((prev) => !prev)}
                onTouchStart={() => setDragState((prev) => !prev)}
                onTouchMove={(e) => dragState && onHighlight(e)}
                onTouchEnd={() => setDragState((prev) => !prev)}
                onClick={onHighlight}
              />
            ))
          : /* Normal Calendar View */

            time.map((timeName) => (
              <div className={cStyle.timeSlot} key={timeName} />
            ))}
      </div>
      {/* <div className={cStyle.eventsContainer}>
          {classesDay?.map((event) => <div>{event.details}</div>)}
      </div> */}
      {classesDay?.map((event) => {
        return <Event eventDetails={event}></Event>;
      })}
    </div>
  );
}

export default CalendarDay;
