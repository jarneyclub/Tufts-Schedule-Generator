/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * HelpPage.js
 *
 * This is a page that provides answers to frequently asked questions, and
 * has a feedback form.
 */

import { useState } from 'react';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import { withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SendIcon from '@mui/icons-material/Send';
import { Button, TextField, Input } from '@material-ui/core';
import SnackBarAlert from './reusable/SnackBarAlert';
import hStyle from './style/HelpPage.module.css';
import feedbackJumbo from './res/feedback.png';
import { style } from '@mui/system';
import './style/HelpPageActiveClass.css';

const Accordion = withStyles({
  root: {
    backgroundColor: (0, 0, 0, 0.5),
    '&:hover': {
      backgroundColor: '#D9D9D9',
    },
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
  name: '',
  email: '',
  message: '',
};

function HelpPage() {
  const [contactForm, setContactForm] = useState(contactFormDefault);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
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
  };

  const fetchSendResponses = async () => {
    const requestOption = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactForm),
    };

    await fetch('https://jarney.club/api/responses', requestOption)
      .then((response) => response.json())
      .then((result) => {
        setAlertMessage('Thank you for your feedback!');
        setAlertSeverity('success');
        setShowAlert(true);
        setContactForm(contactFormDefault);
      })
      .catch((error) => {});
  };

  return (
    <div className={hStyle.bodyContainer}>
      <div className={hStyle.horizontalContainer}>
        <div className={hStyle.contactTitle}>Frequently Asked Questions</div>
        <br />
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Q: What's the difference between degree requirements and degree
            plans?
          </AccordionSummary>

          <AccordionDetails>
            A: Degree requirements are the courses/requirements you must take to
            fulfill a specific degree. Degree plans are a space for you to
            organize which classes you're going to take and when you're going to
            take them. In degree plans, you can also keep track of your progress
            towards completing your degree requirements.
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Q: What's the difference between 'Public degree requirements' and
            'My degree requirements'?
          </AccordionSummary>

          <AccordionDetails>
            A: 'Public degree requirements' are accessible to everyone and
            cannot be edited directly. 'My degree requirements' are your
            personal set of degree requirements and can be edited according to
            your academic journey.
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Q: What happens if a class is not available during my time
            preferences, but I try to render a schedule anyway?
          </AccordionSummary>

          <AccordionDetails>
            A: We'll tell you! Unfortunately, we can't change class times, but
            we can tell you when there are conflicts between your time
            preferences and class times.
          </AccordionDetails>
        </Accordion>
        <p></p>
      </div>
      <br />
      <br />
      <div className={hStyle.horizontalContainer}>
        <div className={hStyle.titleContainer}>
          <div className={hStyle.contactTitle}>Contact us!</div>
          <img
            src={feedbackJumbo}
            alt="feedbackJumbo"
            className={hStyle.imgContainer}
          />
          <br />
        </div>
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
              onChange={(value) => handleContactForm('name', value)}
            />

            <TextField
              type="email"
              name="email"
              label="Email"
              required
              fullWidth
              variant="filled"
              value={contactForm.email}
              onChange={(value) => handleContactForm('email', value)}
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
              onChange={(value) => handleContactForm('message', value)}
            />
            <Button
              type="submit"
              className={hStyle.button}
              startIcon={<SendIcon />}
              onClick={fetchSendResponses}
            >
              Share with us
            </Button>
            <br />
          </div>
          <br />
          {/* <img
            src={feedbackJumbo}
            alt="feedbackJumbo"
            className={hStyle.imgContainer}
          /> */}
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
