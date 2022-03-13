import utils.auth as test_auth
import utils.degreereq as test_degreereq
import utils.degreeplan as test_degreeplan
import utils.courses as test_courses
import utils.schedule as test_schedule
import utils.responses as test_responses
import requests
import json
import logging
from random import randint
from time import sleep

if __name__ == '__main__':
    # api_url = "https://jarney.club/api"
    api_url = "http://localhost:3000/api"
    # Logging in
    # headers['Accept']           = 'text/html'
    # headers['Accept-Language']  = 'en-us'
    # headers['Accept-Encoding']  = 'gzip, deflate, br'
    session = requests.Session()
    session = test_auth.loginManual(api_url, session)
    session = test_auth.loginWithCookie(api_url, session)
    # session = test_degreereq.createDegreeReqPrivate(api_url, session)
    # session, new_plan_id = test_degreeplan.createDegreePlan(api_url, session, "A new Plan")
    # session, plan_ids = test_degreeplan.getDegreePlans(api_url, session)
    # session, plan_info = test_degreeplan.getDegreePlanSingle(api_url, session, plan_ids[0])
    # session = test_degreeplan.deleteDegreePlan(api_url, session, plan_ids[0])
    # session, deleted_plan_info = test_degreeplan.getDegreePlanSingle(api_url, session, plan_ids[0])
    # session, plan_info = test_degreeplan.getDegreePlanSingle(api_url, session, plan_ids[1])
    # plan_term_ids = []
    # for i in range (0, len(plan_info['plan']['terms'])):
    #     plan_term_ids.append(plan_info['plan']['terms'][i]['plan_term_id'])
    # session, plan_info = test_degreeplan.deleteDegreePlanTerms(api_url, session, plan_ids[0], plan_term_ids)
    # session, pdrids = test_degreereq.getPrivateDegreeReqs(api_url, session)
    # session, pubdrids = test_degreereq.getPublicDegreeReqs(api_url, session, "AFRIC")
    # session = test_degreereq.copyPrivateDegreeReqToPublic(api_url, session, pdrids[0])
    # session, csGeneral = test_courses.getCoursesGeneral(api_url, session, "CS")
    # session = test_responses.saveCustomerResponse(api_url, session)
    session, arrCS15Ids = test_courses.getCoursesTerm(api_url, session, "data st", "")
    # session, arrMA34Ids = test_courses.getCoursesTerm(api_url, session, "MATH-0034", "")
    arrScheduleCourseIds = [arrCS15Ids[1]]
    session, sched_ids = test_schedule.getSchedules(api_url, session) # Tested (works)
    # session, new_sched_id = test_schedule.makeEmptySchedule(api_url, session)
    # session = test_schedule.changeScheduleName(api_url, session, sched_ids[0], "New Schedule Name")
    session = test_schedule.updateSchedule(api_url, session, sched_ids[0], arrScheduleCourseIds)
    # session = test_schedule.tryToUpdateInvalidSchedule(api_url, session, sched_ids[0], arrScheduleCourseIds)
    # session = test_courses.getProgramNames(api_url, session)
    # session = test_auth.logout(api_url, session)
    # session = test_auth.loginWithCookie(api_url, session)