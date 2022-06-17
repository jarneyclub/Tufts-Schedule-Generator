/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * CalendarDay.js
 * Responsible to generate the columns making up the calendar and put the
 * corresponding classes onto the columns
 */

import { useEffect, useState } from "react";
import cStyle from "./reusableStyles/CalendarDay.module.css";
import sStyle from "../style/Scheduler.module.css";
import Event from "./Event.js";
import { Button, IconButton } from "@material-ui/core";

import PurpleSwitch from "../reusable/PurpleSwitch";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
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

function Call() {
  console.log("Triggered");
};

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
    onEventClick,
    shrink,
  } = props;
  const [dragState, setDragState] = useState(false);
  const [entireDayOn, setEntireDayOn] = useState();
  // eslint-disable-next-line no-unused-vars

  /*  To check if a time slot is highlighted during time pref selection  */
  const onHighlight = (e) => {
    /*  Add highlight, add time pref to array  */
    if (e.target.style.backgroundColor.localeCompare("") === 0) {
      e.target.style.backgroundColor = "#A1C97D";
      addTimePref(dayName, e.target.id);
    } else {
      /*  Remove highlight, remove time pref from array  */
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

  const handleAllDaySwitch = () => {
    if (timePrefDay.length > 0) {
      removeEntireDay(dayName);
    } else if (timePrefDay.length === 0) {
      overlayTime.forEach((timeName) => {
        addTimePref(dayName, timeName);
      });
    }
  };
  const handleAddAll = () => {
    if (timePrefDay.length !== 26) {
      overlayTime.forEach((timeName) => {
        addTimePref(dayName, timeName);
      });
    }
  };

  const handleShowDayTitle = () => {
    if (dayName === "Time Unstated") {
      return "Time Unstated";
    } else {
      return dayName.substr(0, 3).toUpperCase();
    }
  };

  const handleRemoveAll = () => {
    if (timePrefDay.length > 0) {
      removeEntireDay(dayName);
    }
  };

  useEffect(() => {
    timePrefDay && setEntireDayOn(timePrefDay?.length === 26);
  }, []);

  // console.log("Err timeunspec:", classesDay.TimeUnspecified);

  return (
    <div className={cStyle.dayContainer}>
      {!shrink && (
        <div className={cStyle.timeSlotTitle}>
          {!singleDay && handleShowDayTitle()}
        </div>
      )}
      {/* Generate the time slots or just one column if it is for time unstated */}
      {dayName === "Time Unstated" ? (
        <div className={cStyle.unStatedTimeColumn} />
      ) : (
        <>
          {timePrefState && (
            <div className={cStyle.buttonContainer}>
              <IconButton
                className={cStyle.removeAllButton}
                onClick={handleRemoveAll}
              >
                <CheckBoxOutlineBlankIcon />
              </IconButton>
              <IconButton
                className={cStyle.addAllButton}
                onClick={handleAddAll}
              >
                <CheckBoxIcon />
              </IconButton>
            </div>
          )}
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
        </>
      )}

      {/* Put the classes on depending on the day */}
      {dayName === "Time Unstated"
        ? classesDay?.TimeUnspecified?.map((course) => {
            return <Button style={{ zIndex: 10000000 }}>Hi</Button>;
          })
        : classesDay?.map((event) => {
            return (
              <Event
                shrink={shrink}
                eventDetails={event}
                onEventClick={onEventClick}
              ></Event>
            );
          })}
    </div>
  );
}

export default CalendarDay;
