import React, { useState, useEffect } from "react";
import { useFormik, Formik, Form } from "formik";
import { Button } from "@material-ui/core";
import * as Yup from "yup";
import MyInputField from "./MyInputField";

import fStyle from "./reusableStyles/Form.module.css";

interface ResetProps {
  onSubmit: (values: any) => Promise<void>;
}

const validationSchema = Yup.object({
  userid: Yup.string()
    .min(3, "Email not long enough")
    .email("Invalid Email Address")
    .required("Required"),
});

const PasswordResetForm: React.FC<ResetProps> = (props) => {
  const { onSubmit } = props;

  return (
    <div className={fStyle.formContainer}>
      <p>
        Please enter your email address. If we find an account associated with
        that email, we will send you a link to reset your passowrd!
      </p>
      <Formik
        initialValues={{
          userid: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        <Form className={fStyle.formContainer}>
          <MyInputField
            placeholder="Email Address"
            name="userid"
            type="email"
          />

          <Button type="submit" className={fStyle.button}>
            Send me an email
          </Button>
        </Form>
      </Formik>
    </div>
  );
};

export default PasswordResetForm;
