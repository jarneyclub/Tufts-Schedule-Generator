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
    timePrefState,
    onTimePrefStateChange,
    shrink,
  } = props;

  return (
    <div className={sStyle.timePrefOverlay}>
      <div className={sStyle.overlayTitleContainer}>
        <div className={sStyle.overlayTitle}>
          Drag or Click to Select Your Preferred Time Frame
        </div>
        <div>
          **Time Frame Set for the Entire Day if No Selection Made For the Day**
        </div>
      </div>
      <br />
      <Button
        className={sStyle.saveTimePrefButton}
        onClick={() => onTimePrefStateChange((prev) => !prev)}
      >
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
          shrink={shrink}
        />
      </div>
    </div>
  );
}

export default TimePrefSelector;
