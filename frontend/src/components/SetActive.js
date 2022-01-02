import { buttonBaseClasses } from "@mui/material";
import React, { useState } from "react";
import './style/HelpPageActiveClass.css';


function SetActive(props) {
    const [setActive, setActiveState] = useState("");

    function toggleAccordion() {
        setActiveState(setActive === "" ? "active" : "");
      }

      return (
          <button className = {'accordion ${setActive}'} onClick={toggleAccordion}/>
      );      


}

export default SetActive;