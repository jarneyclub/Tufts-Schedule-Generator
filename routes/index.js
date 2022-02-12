const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
/* Controllers */
const courseScheduleController = require('../controllers/courses/courseScheduleController.js');
// const searchIndexController = require('../controllers/courses/searchIndexController.js');
// const docsController = require('../controllers/courses/docsController.js');
const courseController = require('../controllers/courseController.js');
const degreePlanController = require('../controllers/degreePlanController.js');
const degreeReqController = require('../controllers/degreeReqController.js');
const scheduleController = require('../controllers/scheduleController.js')
const responsesController = require('../controllers/responsesController.js')
// const listController = require('../controllers/courses/listController.js');
const userController = require('../controllers/auth/userController.js');
const authController = require('../controllers/auth/authController.js');

////////////////////////////////////////
//                                    //
//              Courses               //
//                                    //
////////////////////////////////////////

router.get('/courses/general', 
            authController.authenticateToken,
            courseController.getGeneralCourses);
router.get('/courses/term', 
            authController.authenticateToken,
            courseController.getTermCourses);
router.get('/courses/attributes', 
            authController.authenticateToken,
            courseController.getAttributes);
router.get('/courses/programs', 
            authController.authenticateToken,
            courseController.getPrograms);
////////////////////////////////////////
//                                    //
//            Degree Plan             //
//                                    //
////////////////////////////////////////

router.post('/degreeplan', 
            authController.authenticateToken,
            authController.signAccessTokenAndAttachCookie,
            degreePlanController.createDegreePlan);
router.get('/degreeplan', 
           authController.authenticateToken,
           authController.signAccessTokenAndAttachCookie,
           degreePlanController.getDegreePlan);
router.patch('/degreeplan/:plan_id/plan_name/:new_name', 
              authController.authenticateToken,
              authController.signAccessTokenAndAttachCookie,
              degreePlanController.updateDegreePlanName);
router.delete('/degreeplan/terms', 
              authController.authenticateToken,
              authController.signAccessTokenAndAttachCookie,
              degreePlanController.deleteDegreeTermMultiple);
router.delete('/degreeplan', 
              authController.authenticateToken,
              authController.signAccessTokenAndAttachCookie,
              degreePlanController.deleteDegreePlan);
router.get('/degreeplans', 
            authController.authenticateToken,
            authController.signAccessTokenAndAttachCookie,
            degreePlanController.getDegreePlans);
router.post('/degreeplan/term', 
            authController.authenticateToken,
            authController.signAccessTokenAndAttachCookie,
            degreePlanController.createTerm);
router.put('/degreeplan/term', 
            authController.authenticateToken,
            authController.signAccessTokenAndAttachCookie,
            degreePlanController.saveTerm);
router.post('/degreeplan/term/:plan_term_id', 
             authController.authenticateToken,
             authController.signAccessTokenAndAttachCookie,
             degreePlanController.deleteTerm);

////////////////////////////////////////
//                                    //
//            Degree Req              //
//                                    //
////////////////////////////////////////

router.post('/degreereq/public', 
            authController.authenticateToken, 
            authController.signAccessTokenAndAttachCookie,
            degreeReqController.createDegreeReqPublic);
router.get('/degreereqs/public', 
            authController.authenticateToken, 
            authController.signAccessTokenAndAttachCookie,
            degreeReqController.getDegreeReqsPublic);
router.delete('/degreereq/public/:pub_dr_id', 
               authController.authenticateToken, 
               authController.signAccessTokenAndAttachCookie,
               degreeReqController.deleteDegreeReqPublic);
router.post('/degreereq/public/copy/:pub_dr_id', 
             authController.authenticateToken, 
             authController.signAccessTokenAndAttachCookie,
             degreeReqController.copyDegreeReqPublicToPrivate);
router.post('/degreereq/private', 
             authController.authenticateToken, 
             authController.signAccessTokenAndAttachCookie,
             degreeReqController.createDegreeReqPrivate);
router.get('/degreereqs/private', 
            authController.authenticateToken, 
            authController.signAccessTokenAndAttachCookie,
            degreeReqController.getDegreeReqsPrivate);
router.get('/degreereq/private/:priv_dr_id', 
            authController.authenticateToken, 
            authController.signAccessTokenAndAttachCookie,
            degreeReqController.getDegreeReqPrivate);
router.delete('/degreereq/private/:priv_dr_id', 
               authController.authenticateToken, 
               authController.signAccessTokenAndAttachCookie,
               degreeReqController.deleteDegreeReqPrivate);
router.put('/degreereq/private', 
            authController.authenticateToken, 
            authController.signAccessTokenAndAttachCookie,
            degreeReqController.saveDegreeReqPrivate);
router.post('/degreereq/private/copy/:priv_dr_id', 
             authController.authenticateToken, 
             authController.signAccessTokenAndAttachCookie,
             degreeReqController.copyDegreeReqPrivateToPublic);

////////////////////////////////////////
//                                    //
//              Auth                  //
//                                    //
////////////////////////////////////////

router.post('/auth/register',
            body('userid').isEmail(),
            body('password').not().isEmpty(),
            body('password_confirmation').not().isEmpty(),
            userController.validateRegisterLocal,
            userController.registerLocal,
            userController.login);

// authenticate credentials with mongoose, sign access token, and send response with cookie
router.post('/auth/login', 
            authController.authenticateCredentialsWithPassport, 
            authController.signAccessTokenAndAttachCookie, 
            userController.sendLoginResponse);

router.post('/auth/logout', authController.setToExpireToken);

// authenticate token and extract credentials, sign access token, and send response with cookie
router.post('/auth/login_cookie', 
             authController.authenticateToken, 
             authController.signAccessTokenAndAttachCookie,
             userController.sendLoginResponse);

// router.post('/auth/password_reset_email',
//              authController.makePasswordResetEntry,
//              userController.sendEmailToUser);

// ////////////////////////////////////////
//                                    //
//             Schedule               //
//                                    //
////////////////////////////////////////

router.post('/schedule', 
            authController.authenticateToken, 
            authController.signAccessTokenAndAttachCookie, 
            scheduleController.makeEmptySchedule);
router.patch('/schedule', 
             authController.authenticateToken, 
             authController.signAccessTokenAndAttachCookie, 
             scheduleController.updateSchedule);
router.patch('/schedule/name', 
              authController.authenticateToken, 
              authController.signAccessTokenAndAttachCookie, 
              scheduleController.changeScheduleName);
router.get('/schedules', 
            authController.authenticateToken, 
            authController.signAccessTokenAndAttachCookie, 
            scheduleController.getSchedules);
router.delete('/schedule', 
               authController.authenticateToken, 
               authController.signAccessTokenAndAttachCookie, 
               scheduleController.deleteSchedule);

////////////////////////////////////////
//                                    //
//         Customer Responses         //
//                                    //
////////////////////////////////////////

router.post('/responses', 
            responsesController.saveCustomerResponse);


////////////////////////////////////////
//                                    //
//          Test endpoints            //
//                                    //
////////////////////////////////////////

/*
* called when someone makes GET req to https://jarney.club/api/jeremy
*/
router.get('/jeremy/:field', function (req, res) {
    res.json({
        'message': req.query.field
    });
}
);

module.exports = router;