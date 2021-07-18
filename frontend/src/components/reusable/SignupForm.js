/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-unused-vars */
/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * JarUserLogin.js
 * This
 * Inherited Props:
 *      o
 *
 */

import { useState, useEffect } from "react";
import { useField, Formik, Form } from "formik";
import * as Yup from "yup";
import { TextField, Button } from "@material-ui/core";
import MyInputField from "./MyInputField";
import fStyle from "./reusableStyles/Form.module.css";

const validationSchema = Yup.object({
  first_name: Yup.string()
    .max(15, "Must be 15 characters or less")
    .required("Required"),
  last_name: Yup.string()
    .max(15, "Must be 15 characters or less")
    .required("Required"),
  userid: Yup.string()
    .min(3, "Email not long enough")
    .email("Invalid Email Address")
    .required("Required"),
  password: Yup.string().min(6, "Too Weak. 6 or longer").required("Required"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Password not matched")
    .required("Required"),
});

function SignupForm(props) {
  const { onSubmit } = props;
  return (
    <Formik
      initialValues={{
        first_name: "",
        last_name: "",
        userid: "",
        password: "",
        password_confirmation: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        // setTimeout(() => {
        //   alert(JSON.stringify(values, null, 2));
        //   setSubmitting(false);
        // }, 400);
        console.log("values: ", values);
        onSubmit(values);
      }}
    >
      <Form className={fStyle.formContainer}>
        <MyInputField placeholder="First name" name="first_name" />
        <MyInputField placeholder="Last Name" name="last_name" />

        <MyInputField placeholder="Email Address" name="userid" type="email" />
        <MyInputField placeholder="Password" name="password" type="password" />
        <MyInputField
          placeholder="Confirm Password"
          name="password_confirmation"
          type="password"
        />

        <Button className={fStyle.button}>register</Button>
      </Form>
    </Formik>
  );
}

export default SignupForm;
