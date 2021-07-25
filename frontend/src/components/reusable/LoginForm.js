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
        userid: "",
        password: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("values: ", values);
        onSubmit(values);
      }}
    >
      <Form className={fStyle.formContainer}>
        <MyInputField placeholder="Email Address" name="userid" type="email" />
        <MyInputField placeholder="Password" name="password" type="password" />

        <Button type="submit" className={fStyle.button}>
          login
        </Button>
      </Form>
    </Formik>
  );
}

export default LoginForm;
