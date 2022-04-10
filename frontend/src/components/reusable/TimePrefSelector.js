/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * TimePrefSelector.js
 *
 *
 */

import sStyle from "../style/Scheduler.module.css";
import Calendar from "./Calendar";
import { Button } from "@material-ui/core";

function TimePrefSelector(props) {
  const {
    timePref,
    onAddTimePref,
    onRemoveTimePref,
    onAddEntireDay,
    onRemoveEntireDay,
    timePrefState,
    onClose,
    shrink,
  } = props;

  return (
    <div className={sStyle.timePrefOverlay}>
      <div className={sStyle.overlayTitleContainer}>
        <div className={sStyle.overlayTitle}>
          Drag or Click to Select Your Preferred Time Frame
        </div>
        <div>** Time slot highlighted indicates preferred time **</div>
        <Button className={sStyle.saveTimePrefButton} onClick={onClose}>
          Save Time Preference
        </Button>
      </div>
      {/* This is the OVERLAY CALENDAR */}
      <div className={sStyle.overlayCalendarContainer}>
        <Calendar
          timePrefState={timePrefState}
          timePref={timePref}
          handleAddTimePref={onAddTimePref}
          handleRemoveTimePref={onRemoveTimePref}
          handleAddEntireDay={onAddEntireDay}
          handleRemoveEntireDay={onRemoveEntireDay}
          shrink={shrink}
          origin="Pref"
        />
      </div>
      <br />
      <br />
    </div>
  );
}

export default TimePrefSelector;
