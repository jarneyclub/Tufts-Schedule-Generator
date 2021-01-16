const express = require('express');
const router = express.Router();

/* Controllers */
const courseScheduleController = require('../controllers/courses/courseScheduleController.js');
const searchIndexController = require('../controllers/courses/searchIndexController.js');
const docsController = require('../controllers/courses/docsController.js');
const listController = require('../controllers/courses/listController.js');

/*
* Handle GET requests by MONGODB object id
* USAGE: BASEURL/api/courses/db-id/?id={MONGODB_ID}
* */
router.get('/courses/docs/db-id/:id', docsController.sendSingleDocumentByOID);

/*
* Handle GET requests by MONGODB object id
* USAGE: BASEURL/api/courses/db-ids/?id={MONGODB_ID}&?id={MONGODB_ID}
*/
router.get('/courses/docs/db-ids', docsController.sendMultipleDocumentsByOIDs);

router.get('/courses/docs/course-id/:id', docsController.sendDocumentsByCourseID);

router.get('/courses/docs/course-name/:name', docsController.sendDocumentsByCourseName);

router.get('/courses/list/course-name', listController.sendListCourseNames);

router.get('/courses/list/course-id', listController.sendListCourseIDs);

router.get('/courses/alg/search-table', searchIndexController.sendSearchIndex);

router.get('/courses/db/search-table', searchIndexController.postSearchIndexToDB);

router.post('/courses/schedule', courseScheduleController.generateCourseSchedule);

router.get('/courses/schedule/db-ids/test', courseScheduleController.sendTestOIDs);

module.exports = router;