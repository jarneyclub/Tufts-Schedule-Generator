/* eslint-disable no-unused-vars */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Dropdown.js
 * This reusable component gives a dropdown bar/ option list
 * Inherited Props:
 *      options - an array of element to be shown in the list
 *
 */

import { useEffect } from "react";
import {
  Select,
  MenuItem,
  NativeSelect,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import dStyle from "./reusableStyles/Dropdown.module.css";
/* scripts */

function Dropdown(props) {
  const {
    options,
    selectedOption,
    selectedIdx,
    onOptionChange,
    name,
    labelName,
    labelId,
    customStyle,
    fullWidth,
    isObject,
    objectField,
  } = props;


  const handleChange = (e) => {
    console.log("e", e);
    onOptionChange(e);
  };


  return (
    // checks if mouse clicked outside of frame
    <FormControl className={dStyle.formContainer}>
      <InputLabel htmlFor={labelId}>{labelName}</InputLabel>
      <Select
        value={selectedIdx}
        native
        onChange={(e) => handleChange(e)}
        name={name}
        className={dStyle.DropdownContainer}
        labelId={labelId}
        variant="standard"
        style={customStyle}
      >
        {!isObject
          ? options?.map((opt, idx) => (
              <option value={idx} key={opt}>
                &nbsp;&nbsp;&nbsp;{opt}
              </option>
            ))
          : options?.map((opt, idx) => (
              <option value={idx} key={opt[objectField]}>
                &nbsp;&nbsp;&nbsp;{opt[objectField]}
              </option>
            ))}
      </Select>
    </FormControl>
  );
}

export default Dropdown;
