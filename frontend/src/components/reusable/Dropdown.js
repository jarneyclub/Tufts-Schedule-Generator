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
  const { options, selectedOption, onOptionChange, name, labelName, labelId } =
    props;

  useEffect(() => {
    console.log("Dropdown.js useEffect called");
    console.log("options, selectedOption: ", options, " ", selectedOption);
  }, []);

  const handleChange = (e) => {
    onOptionChange(e);
  };

  return (
    // checks if mouse clicked outside of frame
    <FormControl fullWidth>
      <InputLabel htmlFor={labelId}>{labelName}</InputLabel>
      <Select
        value={selectedOption}
        native
        onChange={(e) => handleChange(e)}
        name={name}
        className={dStyle.DropdownContainer}
        labelId={labelId}
        variant="standard"
        style={{ padding: "0 0" }}
      >
        {options.map((opt) => (
          <option value={opt} key={opt}>
            {opt}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}

export default Dropdown;
