/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * HelpPage.js
 *
 * This is a page that provides answers to frequently asked questions, and
 * has a feedback form.
 */

// import {
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Typography,
// } from "@material-ui/core";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { useState } from "react";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import { withStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SendIcon from "@mui/icons-material/Send";
import { Button, TextField, Input } from "@material-ui/core";
import SnackBarAlert from "./reusable/SnackBarAlert";
import hStyle from "./style/HelpPage.module.css";
import feedbackJumbo from "./res/feedback.png";

const Accordion = withStyles({
  root: {
    backgroundColor: (0, 0, 0, 0.5),
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: (0, 0, 0, 0.125),
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles({
  root: {},
  expanded: {},
})(MuiAccordionDetails);

const contactFormDefault = {
  name: "",
  email: "",
  message: "",
};

function HelpPage() {
  const [contactForm, setContactForm] = useState(contactFormDefault);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const handleSubmit = () => {
    fetchSendResponses();
  };

  const handleContactForm = (field, e) => {
    setContactForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  }

  const fetchSendResponses = async  () => {
    console.log("Response submitted")
    await fetch("https://jarney.club/api/responses", {
      method: "POST",
      body: contactForm
    })
      .then((response) => response.json())
      .then((result) => {
        setAlertMessage("Thank you for your feedback!")
        setAlertSeverity("success") ;
        setShowAlert(true);
      })
      .error((error) =>{

      })
  }

  return (
    <div className={hStyle.bodyContainer}>
      <div className={hStyle.horizontalContainer}>
        <h2>Frequently Asked Questions</h2>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            How do I make my own degree?
          </AccordionSummary>
          <AccordionDetails>test</AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Accordion 2
          </AccordionSummary>
          <AccordionDetails>test</AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Accordion 3
          </AccordionSummary>
          <AccordionDetails>test</AccordionDetails>
        </Accordion>
        <p></p>
      </div>
      <br />
      <br />
      <div className={hStyle.horizontalContainer}>
        <h2>Contact us!</h2>
        <div className={hStyle.titleRow}>
          <div id="contactForm" className={hStyle.contactForm}>
            <TextField
              type="text"
              name="Name"
              label="Name"
              required
              fullWidth
              variant="filled"
              value={contactForm.name}
              onChange={(value) => handleContactForm("name", value)}
            />

            <TextField
              type="email"
              name="email"
              label="Email"
              required
              fullWidth
              variant="filled"
              value={contactForm.email}
              onChange={(value) => handleContactForm("email", value)}
            />

            <br />
            <TextField
              type="msg"
              label="Message"
              required
              fullWidth
              variant="filled"
              multiline
              rows={4}
              value={contactForm.message}
              onChange={(value) => handleContactForm("message", value)}
            />
            <Button
              type="submit"
              className={hStyle.button}
              startIcon={<SendIcon />}
              onClick={fetchSendResponses}
            >
              Share with us
            </Button>
          </div>
          <br/>
          <img
            src={feedbackJumbo}
            alt="feedbackJumbo"
            className={hStyle.imgContainer}
          />
        </div>
      </div>
      {showAlert && (
        <SnackBarAlert
          severity={alertSeverity}
          onCloseAlert={handleCloseAlert}
          showAlert={showAlert}
          message={alertMessage}
        />
      )}
    </div>
  );
}

export default HelpPage;
