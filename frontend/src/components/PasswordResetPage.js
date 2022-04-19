import React, { useEffect, useState } from 'react';
import * as Yup from "yup";
import { useFormik, Formik, Form } from "formik";
import MyInputField from './reusable/MyInputField';
import fStyle from "./reusable/reusableStyles/Form.module.css";
import { Button, CircularProgress } from "@material-ui/core";
import { useParams, Link } from "react-router-dom";
import SnackBarAlert from './reusable/SnackBarAlert';
import { useHistory } from "react-router-dom";

import pStyle from './style/PasswordResetPage.module.css';

const validationSchema = Yup.object({
  token: Yup.string(),
  password: Yup.string().min(6, "Too Weak. 6 or longer").required("Required"),
  password_confirmation: Yup.string()
  .oneOf([Yup.ref('password'), null], 'Passwords must match')
});

function PasswordResetLink () {
  const { hash } = useParams();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState();
  const [alertSeverity, setAlertSeverity] = useState();
  const [loadMessage, setLoadMessage] = useState(false);

  const history = useHistory();
  const handleAlert = (severity: Boolean, message: String) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);
  };

  const handleSubmitNewPassword = async (values) => {
    const requestOption = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    };
    await fetch(`https://qa.jarney.club/api/auth/do_password_reset/${hash}`, requestOption)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Failed to Reset.');
        })
        .then((result) => {
          setLoadMessage(false);
          history.push("/home");

        })
        .catch((error) => {
          setLoadMessage(false);
          handleAlert('error', 'Error: Failed to Reset password');
        });
  }

  return(
    <div className={pStyle.contentContainer}>
      
      
      {loadMessage ? <CircularProgress />
      :
      <Formik
      initialValues={{
        token: "",
        password: "",
        password_confirmation: ""
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        handleSubmitNewPassword(values);
      }}
      >
        <Form className={fStyle.formContainer} >
          <MyInputField placeholder="New Password" name="password" type="password" />
          <MyInputField placeholder="Confirm Password" name="password_confirmation" type="password" />

          <Button type="submit" className={fStyle.button}>
            Confirm Reset
          </Button>
        </Form>
      </Formik>}
    </div>

    
  )
}

export default PasswordResetLink