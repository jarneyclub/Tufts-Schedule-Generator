import requests
import json

def getCoursesGeneral (api_url, session, cnum):
    headers = { "Content-type": "application/json" }
    res = session.get(api_url + "/courses/general?cnum=" + cnum,
                        headers = headers, allow_redirects = True)
    print("----getCoursesGeneral response (START)-----")
    print(res.text)
    resParsed = json.loads(res.text)
    print(resParsed)
    print("----getCoursesGeneral response (END)-----")
    return session

def getCoursesTerm (api_url, session, cnum, attr):
    headers = { "Content-type": "application/json" }
    res = session.get(api_url + "/courses/term?cnum=" + cnum + "&attr=" + attr,
                        headers = headers, allow_redirects = True)
    print("----getCoursesTerm response (START)-----")
    print(res.text)
    resParsed = json.loads(res.text)
    print(resParsed)
    arrTermCourseId = []
    for i in range (0, len(resParsed["courses"])):
        currCourse = resParsed["courses"][i]
        arrTermCourseId.append(currCourse["term_course_id"])
    print("----getCoursesTerm response (END)-----")
    return session, arrTermCourseId
def getProgramNames (api_url, session):
    headers = { "Content-type": "application/json" }
    res = session.get(api_url + "/courses/programs",
                        headers = headers, allow_redirects = True)
    print("----getProgramNames response (START)-----")
    print(res.text)
    resParsed = json.loads(res.text)
    print(resParsed)
    print("----getProgramNames response (END)-----")
    return session