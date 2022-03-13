import requests
import json
def makeEmptySchedule (api_url, session):
    headers = { "Content-type": "application/json" }
    jsonBody =     {
        "sched_name": "test scheduleee"
    }
    res = session.post(api_url + "/schedule",
        json = json.loads(json.dumps(jsonBody)),
        headers = headers, allow_redirects = True)
    print("----makeEmptySchedule response (START)-----")
    resParsed = json.loads(res.text)
    # print(json.dumps(resParsed, indent=4, sort_keys=True))
    print("----makeEmptySchedule response (END)-----")
    return session, resParsed["data"]["sched_id"]

def getSchedules (api_url, session):
    headers = { "Content-type": "application/json" }
    res = session.get(api_url + "/schedules",
        headers = headers, allow_redirects = True)
    print("----getSchedules response (START)-----")
    resParsed = json.loads(res.text)
    print(json.dumps(resParsed, indent=4, sort_keys=True))
    sched_ids = []
    for i in range (0, len(resParsed["schedules"])):
        sched_ids.append(resParsed["schedules"][i]["sched_id"])
    print("----getSchedules response (END)-----")
    return session, sched_ids

def changeScheduleName (api_url, session, sched_id, new_name):
    headers = { "Content-type": "application/json" }
    jsonBody = {
        "sched_id": sched_id,
        "new_name": new_name 
    }
    res = session.patch(api_url + "/schedule/name",
        json = json.loads(json.dumps(jsonBody)),
        headers = headers, allow_redirects = True)
    print("----changeScheduleName response (START)-----")
    resParsed = json.loads(res.text)
    print(json.dumps(resParsed, indent=4, sort_keys=True))
    print("----changeScheduleName response (END)-----")
    return session

def updateSchedule (api_url, session, sched_id, courseIds):
    print("courseIds: ", courseIds)
    headers = { "Content-type": "application/json" }
    allDayTimePref = [
                {
                    "time_earliest": "08:00",
                    "time_latest": "08:30",
                },
                {
                    "time_earliest": "08:30",
                    "time_latest": "09:00",
                },
                {
                    "time_earliest": "09:00",
                    "time_latest": "09:30",
                },
                {
                    "time_earliest": "09:30",
                    "time_latest": "10:00",
                },
                {
                    "time_earliest": "10:00",
                    "time_latest": "10:30",
                },
                {
                    "time_earliest": "10:30",
                    "time_latest": "11:00",
                },
                {
                    "time_earliest": "11:00",
                    "time_latest": "11:30",
                },
                {
                    "time_earliest": "11:30",
                    "time_latest": "12:00",
                },
                {
                    "time_earliest": "12:00",
                    "time_latest": "12:30",
                },
                {
                    "time_earliest": "12:30",
                    "time_latest": "13:00",
                },
                {
                    "time_earliest": "13:00",
                    "time_latest": "13:30",
                },
                {
                    "time_earliest": "13:30",
                    "time_latest": "14:00",
                },
                {
                    "time_earliest": "14:00",
                    "time_latest": "14:30",
                },
                {
                    "time_earliest": "14:30",
                    "time_latest": "15:00",
                },
                {
                    "time_earliest": "15:00",
                    "time_latest": "15:30",
                },
                {
                    "time_earliest": "15:30",
                    "time_latest": "16:00",
                },
                {
                    "time_earliest": "16:00",
                    "time_latest": "16:30",
                },
                {
                    "time_earliest": "16:30",
                    "time_latest": "17:00",
                },
                {
                    "time_earliest": "17:00",
                    "time_latest": "17:30",
                },
                {
                    "time_earliest": "17:30",
                    "time_latest": "18:00",
                },
                {
                    "time_earliest": "18:00",
                    "time_latest": "18:30",
                },
                {
                    "time_earliest": "18:30",
                    "time_latest": "19:00",
                },
                {
                    "time_earliest": "19:00",
                    "time_latest": "19:30",
                },
                {
                    "time_earliest": "19:30",
                    "time_latest": "20:00",
                },
                {
                    "time_earliest": "20:00",
                    "time_latest": "20:30",
                },
                {
                    "time_earliest": "20:30",
                    "time_latest": "21:00",
                }
            ]
    jsonBody =     {
        "sched_id": sched_id,
        "term_course_ids": courseIds,
        "filter": {
            "misc": {
            "ignoreTU": False,
            "ignoreM": False,
            "ignoreClosed": False,
            "ignoreWL": False
            },
            "time": {
            "Monday": allDayTimePref,
            "Tuesday": allDayTimePref,
            "Wednesday": allDayTimePref,
            "Thursday": allDayTimePref,
            "Friday": allDayTimePref
            }
        }
    }
    res = session.patch(api_url + "/schedule",
        json = json.loads(json.dumps(jsonBody)),
        headers = headers, allow_redirects = True)
    print("----updateSchedule response (START)-----")
    resParsed = json.loads(res.text)
    print(json.dumps(resParsed, indent=4, sort_keys=True))
    print("----updateSchedule response (END)-----")
    return session

def tryToUpdateInvalidSchedule (api_url, session, sched_id, courseIds):
    print("courseIds: ", courseIds)
    headers = { "Content-type": "application/json" }
    jsonBody =     {
        "sched_id": sched_id,
        "term_course_ids": courseIds,
        "filter": {
            "misc": {
            "ignoreTU": False,
            "ignoreM": False,
            "ignoreClosed": False,
            "ignoreWL": False
            },
            "time": {
            "Monday": [
                {
                    "time_earliest": "23:58",
                    "time_latest": "23:59"
                }
            ],
            "Tuesday": [
                {
                    "time_earliest": "23:58",
                    "time_latest": "23:59"
                }
            ],
            "Wednesday": [
                {
                    "time_earliest": "23:58",
                    "time_latest": "23:59"
                }
            ],
            "Thursday": [
                {
                    "time_earliest": "23:58",
                    "time_latest": "23:59"
                }
            ],
            "Friday": [
                {
                    "time_earliest": "23:58",
                    "time_latest": "23:59"
                }
            ]
            }
        }
    }
    res = session.patch(api_url + "/schedule",
        json = json.loads(json.dumps(jsonBody)),
        headers = headers, allow_redirects = True)
    print("----tryToUpdateInvalidSchedule response (START)-----")
    resParsed = json.loads(res.text)
    print(json.dumps(resParsed, indent=4, sort_keys=True))
    print("----tryToUpdateInvalidSchedule response (END)-----")
    return session
