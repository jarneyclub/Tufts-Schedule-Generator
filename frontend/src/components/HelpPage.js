/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * HelpPage.js
 *
 * This is a page that provides answers to frequently asked questions, and
 * has a feedback form.
 */

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import {withStyles} from '@material-ui/core/styles';
import  ExpandMoreIcon  from "@material-ui/icons/ExpandMore";

import hStyle from "./style/HelpPage.module.css";
import feedbackJumbo from "./res/feedback.png";

const Accordion = withStyles({
    root:{
        backgroundColor: (0,0,0,0.5),
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root:{
        backgroundColor: (0,0,0,0.125),
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles({
    root:{
        
    },
    expanded: {},
})(MuiAccordionDetails);


function HelpPage () {
    return (
        <div className={hStyle.bodyContainer}>
            <div className={hStyle.horizontalContainer}>
                <h1>Frequently Asked Questions</h1>
                <Accordion>
                    <AccordionSummary
                        expandIcon = {<ExpandMoreIcon />}
                    >
                        How do I make my own degree?
                    </AccordionSummary>
                    <AccordionDetails>
                        test
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon = {<ExpandMoreIcon />}
                    >
                        Accordion 2
                    </AccordionSummary>
                    <AccordionDetails>
                        test
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon= {<ExpandMoreIcon />}
                    >
                        Accordion 3
                    </AccordionSummary>
                    <AccordionDetails>
                        test
                    </AccordionDetails>
                </Accordion>
                <p></p>
            </div>
            <div className={hStyle.horizontalContainer}>
                <h1>Contact us!</h1>
                <div className={hStyle.formContainer}>
                    <form id="contactForm" className={hStyle.contactForm}>
                        <input type="text" name="Name" placeholder="Name"required />
                        <input type="email" name="email" placeholder="Email" required/>
                        <textarea name="msg" placeholder="Message" required></textarea>
                        <input type="button" class={hStyle.contactForm.submit} name="submit" value="Submit"/>
                    </form>
                </div>
                <div className={hStyle.imgContainer}>
                    <img src={feedbackJumbo} alt="feedbackJumbo"/>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default HelpPage;
