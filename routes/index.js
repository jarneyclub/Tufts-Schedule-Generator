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
// const listController = require('../controllers/courses/listController.js');
const userController = require('../controllers/auth/userController.js');
const authController = require('../controllers/auth/authController.js');

////////////////////////////////////////
//                                    //
//              Courses               //
//                                    //
////////////////////////////////////////

router.get('/courses/general', courseController.getGeneralCourses);
router.get('/courses/term', courseController.getTermCourses);
router.get('/courses/attributes', courseController.getAttributes);
router.get('/courses/programs', courseController.getPrograms);
////////////////////////////////////////
//                                    //
//            Degree Plan             //
//                                    //
////////////////////////////////////////

router.post('/degreeplan', authController.authenticateToken, degreePlanController.createDegreePlan);
router.get('/degreeplan', authController.authenticateToken, degreePlanController.getDegreePlan);
router.patch('/degreeplan/:plan_id/plan_name/:new_name', authController.authenticateToken, degreePlanController.updateDegreePlanName);
router.delete('/degreeplan/terms', authController.authenticateToken, degreePlanController.deleteDegreeTermMultiple);
router.delete('/degreeplan', authController.authenticateToken, degreePlanController.deleteDegreePlan);
router.get('/degreeplans', authController.authenticateToken, degreePlanController.getDegreePlans);
router.post('/degreeplan/term', authController.authenticateToken, degreePlanController.createTerm);
router.put('/degreeplan/term', authController.authenticateToken, degreePlanController.saveTerm);
router.post('/degreeplan/term/:plan_term_id', authController.authenticateToken, degreePlanController.deleteTerm);

////////////////////////////////////////
//                                    //
//            Degree Req              //
//                                    //
////////////////////////////////////////

router.post('/degreereq/public', authController.authenticateToken, degreeReqController.createDegreeReqPublic);
router.get('/degreereqs/public', authController.authenticateToken, degreeReqController.getDegreeReqsPublic);
router.delete('/degreereq/public/:pub_dr_id', authController.authenticateToken, degreeReqController.deleteDegreeReqPublic);
router.post('/degreereq/public/copy/:pub_dr_id', authController.authenticateToken, degreeReqController.copyDegreeReqPublicToPrivate);
router.post('/degreereq/private', authController.authenticateToken, degreeReqController.createDegreeReqPrivate);
router.get('/degreereqs/private', authController.authenticateToken, degreeReqController.getDegreeReqsPrivate);
router.get('/degreereq/private/:priv_dr_id', authController.authenticateToken, degreeReqController.getDegreeReqPrivate);
router.delete('/degreereq/private/:priv_dr_id', authController.authenticateToken, degreeReqController.deleteDegreeReqPrivate);
router.put('/degreereq/private', authController.authenticateToken, degreeReqController.saveDegreeReqPrivate);
router.post('/degreereq/private/copy/:priv_dr_id', authController.authenticateToken, degreeReqController.copyDegreeReqPrivateToPublic);

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

// authenticate token and extract credentials, sign access token, and send response with cookie
router.post('/auth/login_cookie', authController.authenticateToken, userController.sendLoginResponse);
////////////////////////////////////////
//                                    //
//             Schedule               //
//                                    //
////////////////////////////////////////

router.post('/schedule', authController.authenticateToken, scheduleController.makeEmptySchedule);
router.patch('/schedule', authController.authenticateToken, scheduleController.updateSchedule);
router.patch('/schedule/name', authController.authenticateToken, scheduleController.changeScheduleName);
router.get('/schedules', authController.authenticateToken, scheduleController.getSchedules);

module.exports = router;