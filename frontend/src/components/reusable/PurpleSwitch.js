/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * PurpleSwitch.js
 *
 *
 */
import { Switch } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const PurpleSwitch = withStyles({
  switchBase: {
    color: "#7048d5",
    "&$checked": {
      color: "#7048d5",
    },
    "&$checked + $track": {
      backgroundColor: "#7048d5",
    },
  },
  checked: {},
  track: {},
})(Switch);

export default PurpleSwitch;
