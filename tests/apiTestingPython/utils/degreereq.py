import requests
import json
def getPrivateDegreeReqs (api_url, session):
    headers = { "Content-type": "application/json" }
    res = session.get(api_url + "/degreereqs/private",
                    headers = headers, allow_redirects = True)
    print("----getPrivateDegreeReqs response (START)-----")
    print(res.text)
    resJson = json.loads(res.text)
    print(resJson)
    degreeReqIds = [] # store private degree req ids
    for i in range (0, len(resJson["reqs"])):
        currReq = resJson["reqs"][i]
        degreeReqIds.append(currReq["priv_dr_id"])
    print("----getPrivateDegreeReqs response (END)-----")

    return session, degreeReqIds

def createDegreeReqPrivate (api_url, session):
    headers = { "Content-type": "application/json" }
    DRPrivateBody = {
            "program_name": "",
            "school": "school of bussin",
            "degree": "can i get a hoya",
            "part_id_tracker": 1,
            "parts": [
                {
                    "part_id": 0,
                    "part_name": "important part",
                    "part_desc": "you need to do this",
                    "part_req_id_tracker": 1,
                    "part_reqs": [
                        {
                            "part_req_id": 0,
                            "course_num": "CS-0011",
                            "course_note": "Intro to Comp Sci"
                        }
                    ]
                }
            ]
        }
    res = session.post(api_url + "/degreereq/private",
                    json = json.loads(json.dumps(DRPrivateBody)),
                    headers = headers, allow_redirects = True)
    print("----createDegreeReqPrivate response (START)-----")
    print(res.text)
    print(json.loads(res.text))
    print("----createDegreeReqPrivate response (END)-----")
    return session

def createDegreeReqPrivate (api_url, session):
    headers = { "Content-type": "application/json" }
    DRPrivateBody = {
            "program_name": "",
            "school": "school of bussin",
            "degree": "can i get a hoya",
            "part_id_tracker": 1,
            "parts": [
                {
                    "part_id": 0,
                    "part_name": "important part",
                    "part_desc": "you need to do this",
                    "part_req_id_tracker": 1,
                    "part_reqs": [
                        {
                            "part_req_id": 0,
                            "course_num": "CS-0011",
                            "course_note": "Intro to Comp Sci"
                        }
                    ]
                }
            ]
        }
    res = session.put(api_url + "/degreereq/private/save",
                    json = json.loads(json.dumps(DRPrivateBody)),
                    headers = headers, allow_redirects = True)
    print("----createDegreeReqPrivate response (START)-----")
    print(res.text)
    print(json.loads(res.text))
    print("----createDegreeReqPrivate response (END)-----")
    return session

def copyPrivateDegreeReqToPublic (api_url, session, priv_dr_id):
    headers = { "Content-type": "application/json" }
    res = session.post(api_url + "/degreereq/private/copy/" + priv_dr_id,
                headers = headers, allow_redirects = True)
    print("----copyPrivateDegreeReqToPublic response (START)-----")
    print(res.text)
    print(json.loads(res.text))
    print("----copyPrivateDegreeReqToPublic response (END)-----")
    return session

def getPublicDegreeReqs (api_url, session, name):
    headers = { "Content-type": "application/json" }
    res = session.get(api_url + "/degreereqs/public/?pname=" + name,
                    headers = headers, allow_redirects = True)
    print("----getPublicDegreeReqs response (START)-----")
    print(res.text)
    resJson = json.loads(res.text)
    print(resJson)
    degreeReqIds = [] # store Public degree req ids
    for i in range (0, len(resJson["reqs"])):
        currReq = resJson["reqs"][i]
        degreeReqIds.append(currReq["pub_dr_id"])
    print("----getPublicDegreeReqs response (END)-----")

    return session, degreeReqIds