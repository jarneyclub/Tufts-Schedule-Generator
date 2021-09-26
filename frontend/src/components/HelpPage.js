/* * * *  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * HelpPage.js
 *
 * This is a page that provides answers to frequently asked questions, and
 * has a feedback form.
 */

import feedbackJumbo from "./res/feedback_animated.mp4";
import hStyle from "./style/HelpPage.module.css";

function HelpPage () {
    return (
        <div className={hStyle.horizontalContainer}>
            <div className={hStyle.formContainer}>
                <form id="contactForm" className={hStyle.contactForm}>
                    <input type="text" name="Name" placeholder="Name"required />
                    <input type="email" name="email" placeholder="Email" required/>
                    <textarea name="msg" placeholder="Message" required></textarea>
                    <input type="button" class="submit" name="submit" value="Submit"/>
                </form>
            </div>
        </div>
    );
}

export default HelpPage;