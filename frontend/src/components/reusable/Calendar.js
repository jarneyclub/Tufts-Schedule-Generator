/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Calendar.js
 *
 *
 */

import cStyle from "./reusableStyles/Calendar.module.css";

import CalendarDay from "./CalendarDay";

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
];

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function Calendar(props) {
  const { timePrefState, timePref, handleAddTimePref, handleRemoveTimePref } =
    props;

  return (
    <div className={cStyle.calendarContainer}>
      {/* Time indicator */}
      <div className={cStyle.timeSlotContainer}>
        <div className={cStyle.timeSlotTitle} />
        {time.map((timeSlot) => (
          <div className={cStyle.timeSlot} key={timeSlot}>
            {timeSlot}
          </div>
        ))}
      </div>

      {weekdays.map((dayName) => (
        <CalendarDay
          dayName={dayName}
          key={dayName}
          timePrefState={timePrefState}
          timePrefDay={timePref && timePref[dayName]}
          addTimePref={handleAddTimePref}
          removeTimePref={handleRemoveTimePref}
        />
      ))}
    </div>
  );
}

export default Calendar;
