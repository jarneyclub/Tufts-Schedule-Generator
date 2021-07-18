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
import { useFormik, Formik, Form } from "formik";
import { Button } from "@material-ui/core";
import * as Yup from "yup";
import MyInputField from "./MyInputField";
import fStyle from "./reusableStyles/Form.module.css";

const validationSchema = Yup.object({
  userid: Yup.string()
    .min(3, "Email not long enough")
    .email("Invalid Email Address")
    .required("Required"),
  password: Yup.string().min(6, "Too Weak. 6 or longer").required("Required"),
});

function LoginForm(props) {
  const { onSubmit } = props;

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log("hey this clicked");
        console.log("values: ", values);
        onSubmit(values);
      }}
    >
      {(props) => {
        const {
          values: { email, password },
          errors,
          touched,
          handleSubmit,
          handleChange,
          isValid,
          setFieldTouched,
        } = props;
        return (
          <Form className={fStyle.formContainer} onSubmit={handleSubmit}>
            <MyInputField
              placeholder="Email Address"
              name="userid"
              type="email"
              value={email}
            />
            <MyInputField
              placeholder="Password"
              name="password"
              type="password"
              value={password}
            />

            <Button className={fStyle.button}>login</Button>
          </Form>
        );
      }}
    </Formik>
  );
}

export default LoginForm;
