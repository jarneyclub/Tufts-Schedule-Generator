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
        <div>** Time slot highlighted in green indicates preferred time **</div>
      </div>
      <br />
      <Button className={sStyle.saveTimePrefButton} onClick={onClose}>
        Save Time Preference
      </Button>
      <br />
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
        />
      </div>
    </div>
  );
}

export default TimePrefSelector;
