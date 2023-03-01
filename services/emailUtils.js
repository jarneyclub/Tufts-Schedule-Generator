/*
* Name: emailUtils.js
* Email utility functions
*/

const nodemailer = require('nodemailer');
/**
 * Send email. This function will throw formatted errors, without doing
 * anything beyond that with errors. Handling must be done outside. 
 * @param {string} recipient
 * @param {string} subject
 * @param {string} msg_plaintext
 */
 exports.sendEmail = async (recipient, subject, msgPlaintext) => {
    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: process.env.AUTOMATED_EMAIL_ADDR,
                pass: process.env.AUTOMATED_EMAIL_PASS
            }
        });
        transporter.verify(function (error, success) {
            if (error) {
                console.log("(sendEmail) transporter verification error: ", error);
                throw { id: "000", status: "500", title: "Email Error", detail: "Something went wrong", databaseDetail: error };
            }
        });
        // send email
        transporter.sendMail({
                from: '"JARney for you" <jarneyforyou@gmail.com>', // sender address
                to: recipient, // list of receivers
                subject: subject, // Subject line
                text: msgPlaintext, // plain text body
                })
        .catch( (e) => {
            // format error
            console.log("(sendEmail) sendMail error: ", e);
            throw {
                id: "407",
                status: "500",
                title: "Email Error",
                detail: e.message
            };
        });
    }
    catch (e) {
        console.error("(emailUtils) e: ", e);
        errorHandler(e);
    }
}

/**
 * Send email with SendGrid API. This function will throw formatted errors, 
 * without doing anything beyond that with errors. Handling must be done outside. 
 * @param {string} recipient
 * @param {string} subject
 * @param {string} msg_plaintext
 */
exports.sendEmailSendGrid= async (recipient, subject, msgPlaintext) => {
    try {
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: recipient,
            from: 'jarneyclub@gmail.com',
            subject: subject,
            text: msgPlaintext
        }
        await sgMail.send(msg);
    } catch (err) {
        errorHandler(err);
    }
}

const errorHandler = (e) => {
    console.log("(emailUtils errorHandler)", e);
    if (e.message !== undefined) {
        // TODO: CATCH MORE ERRORS
        throw { id: "000", status: "500", title: "Email Error", detail: e.message };
    }
    else {
        if (e.detail !== undefined && e.title !== undefined) {
            /* this is internally formatted error */
            throw { id: e.id, status: e.status, title: e.title, detail: e.detail };
        }
    }
}