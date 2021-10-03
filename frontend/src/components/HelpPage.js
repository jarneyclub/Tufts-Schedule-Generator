/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * HelpPage.js
 *
 * This is a page that provides answers to frequently asked questions, and
 * has a feedback form.
 */

import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@material-ui/core";
import  ExpandMoreIcon  from "@material-ui/icons/ExpandMore";

import hStyle from "./style/HelpPage.module.css";
import feedbackJumbo from "./res/feedback_animated.mp4";

function HelpPage () {
    return (
        <div className={hStyle.verticalContainer}>
            <div className={hStyle.horizontalContainer}>
                <h1>Frequently Asked Questions</h1>
                <Accordion>
                    <AccordionSummary
                        expandIcon = {<ExpandMoreIcon />}
                    >
                        <Typography>Accordion 1</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>test</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon = {<ExpandMoreIcon />}
                    >
                        <Typography>Accordion 2</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>test</Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon= {<ExpandMoreIcon />}
                    >
                        <Typography>Accordion 3</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>test</Typography>
                    </AccordionDetails>
                </Accordion>
                <p></p>
            </div>
            <div className={hStyle.horizontalContainer}>
                <div className={hStyle.formContainer}>
                    <form id="contactForm" className={hStyle.contactForm}>
                        <input type="text" name="Name" placeholder="Name"required />
                        <input type="email" name="email" placeholder="Email" required/>
                        <textarea name="msg" placeholder="Message" required></textarea>
                        <input type="button" class={hStyle.contactForm.submit} name="submit" value="Submit"/>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default HelpPage;