/* eslint-disable no-unused-vars */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Popup.js
 * This
 * Inherited Props:
 *      o
 *
 */

import { useState } from "react";
import { ClickAwayListener } from "@mui/material";
import pStyle from "./reusableStyles/Popup.module.css";

/* scripts */

function Popup(props) {
  const { children, onClose } = props;
  const [userName, setUserName] = useState("");

  const handleClickAway = () => {
    onClose();
    console.log("should close overlay");
  };

  return (
    <div className={pStyle.overlay}>
      <ClickAwayListener onClickAway={handleClickAway}>
        {children}
      </ClickAwayListener>
      <div />
    </div>
  );
}

export default Popup;
