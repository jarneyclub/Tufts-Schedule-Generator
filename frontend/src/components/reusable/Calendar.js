/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Calendar.js
 *
 *
 */

import cStyle from "./reusableStyles/Calendar.module.css";

import CalendarDay from "./CalendarDay";
import { useState } from "react";
import { IconButton } from "@material-ui/core";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
/* scripts */
const time = [
  "8AM",
  "9AM",
  "10AM",
  "11AM",
  "12PM",
  "1PM",
  "2PM",
  "3PM",
  "4PM",
  "5PM",
  "6PM",
  "7PM",
  "8PM",
  "9PM",
];

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const pref_weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

function Calendar(props) {
  const {
    timePrefState,
    timePref,
    handleAddTimePref,
    handleRemoveTimePref,
    handleAddEntireDay,
    handleRemoveEntireDay,
    shrink,
    classes,
    onEventClick,
    origin,
    TimeUnstated,
  } = props;
  const [daySelection, setDaySelection] = useState(0);

  /*
   *  onDayChange()
   *  purpose: controls the display of day schedule on single day view
   */
  const onDayChange = (direction) => {
    if (daySelection === 4 && direction === 1) {
      setDaySelection(0);
    } else if (daySelection === 0 && direction === -1) {
      setDaySelection(4);
    } else {
      setDaySelection((prev) => prev + direction);
    }
  };


  return (
    <div className={cStyle.container}>
      {/*   This is the control of days for Single Day View  */}
      {shrink &&
        (origin === "pref" ? (
          <div className={cStyle.dayControlContainer}>
            <IconButton
              onClick={() => {
                onDayChange(-1);
              }}
            >
              <ArrowLeftIcon fontSize="large" />
            </IconButton>
            <div>{pref_weekdays[daySelection].substr(0, 3).toUpperCase()}</div>
            <IconButton
              onClick={() => {
                onDayChange(1);
              }}
            >
              <ArrowRightIcon fontSize="large" />
            </IconButton>
          </div>
        ) : (
          <div className={cStyle.dayControlContainer}>
            <IconButton
              onClick={() => {
                onDayChange(-1);
              }}
            >
              <ArrowLeftIcon fontSize="large" />
            </IconButton>
            <div>{weekdays[daySelection].substr(0, 3).toUpperCase()}</div>
            <IconButton
              onClick={() => {
                onDayChange(1);
              }}
            >
              <ArrowRightIcon fontSize="large" />
            </IconButton>
          </div>
        ))}

      <div
        className={
          !shrink ? cStyle.calendarContainer : cStyle.shrinkCalendarContainer
        }
      >
        {/* Time indicator */}
        {origin === "Pref" ? (
          <div
            className={
              !shrink
                ? cStyle.timePrefTimeSlotContainer
                : cStyle.shrinkTimePrefTimeSlotContainer
            }
          >
            <div className={cStyle.timeSlotTitle} />
            {time.map((timeSlot) => (
              <div className={cStyle.timeSlot} key={timeSlot}>
                {timeSlot}
              </div>
            ))}
          </div>
        ) : (
          <div
            className={
              !shrink
                ? cStyle.timeSlotContainer
                : cStyle.shrinkTimeSlotContainer
            }
          >
            <div className={cStyle.timeSlotTitle} />
            {time.map((timeSlot) => (
              <div className={cStyle.timeSlot} key={timeSlot}>
                {timeSlot}
              </div>
            ))}
          </div>
        )}


        {!shrink ? (
          origin === "Pref" ? (
            pref_weekdays.map((dayName) => (
              <CalendarDay
                dayName={dayName}
                key={dayName}
                timePrefState={timePrefState}
                timePrefDay={timePref && timePref[dayName]}
                addTimePref={handleAddTimePref}
                removeTimePref={handleRemoveTimePref}
                addEntireDay={handleAddEntireDay}
                removeEntireDay={handleRemoveEntireDay}
                singleDay={false}
                classesDay={classes && classes[dayName]}
                onEventClick={onEventClick}
              />
            ))
          ) : (
            weekdays.map((dayName) => (
              <CalendarDay
                dayName={dayName}
                key={dayName}
                timePrefState={timePrefState}
                timePrefDay={timePref && timePref[dayName]}
                addTimePref={handleAddTimePref}
                removeTimePref={handleRemoveTimePref}
                addEntireDay={handleAddEntireDay}
                removeEntireDay={handleRemoveEntireDay}
                singleDay={false}
                classesDay={classes && classes[dayName]}
                onEventClick={onEventClick}
              />
            ))
          )
        ) : (
          <CalendarDay
            dayName={weekdays[daySelection]}
            key={weekdays[daySelection]}
            timePrefState={timePrefState}
            timePrefDay={timePref && timePref[weekdays[daySelection]]}
            addTimePref={handleAddTimePref}
            removeTimePref={handleRemoveTimePref}
            addEntireDay={handleAddEntireDay}
            removeEntireDay={handleRemoveEntireDay}
            singleDay={true}
            classesDay={classes && classes[weekdays[daySelection]]}
            onEventClick={onEventClick}
            shrink={shrink}
          />
        )}
      </div>
    </div>
  );
}

export default Calendar;
