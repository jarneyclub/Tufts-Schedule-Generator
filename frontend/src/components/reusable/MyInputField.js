/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-unused-vars */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * MyInputField.js
 * Input field that uses MaterialUI Lib
 *
 */

import { useField } from "formik";

import { TextField } from "@material-ui/core";

const styles = {
  fontFamily: "Eina03-SemiBold",
  helperText: "#5a32bf",
};

const MyInputField = ({ value, handleChange, placeholder, type, ...props }) => {
  const [field, meta] = useField(props);
  const errorText = meta.touched && meta.error ? meta.error : "";

  return (
    <TextField
      value={value}
      onChange={handleChange}
      label={placeholder}
      placeholder={placeholder}
      type={type}
      {...field}
      helperText={errorText}
      error={!!errorText}
      style={styles}
    />
  );
};

export default MyInputField;
