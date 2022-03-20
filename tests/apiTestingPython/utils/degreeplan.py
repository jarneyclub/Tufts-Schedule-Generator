import requests
import json
def createDegreePlan (api_url, session, plan_name):
    headers = { "Content-type": "application/json" }
    body = {
        "plan_name": plan_name
    }
    res = session.post(api_url + "/degreeplan",
                json = json.loads(json.dumps(body)),
                headers = headers, allow_redirects = True)
    print("----createDegreePlan response (START)-----")
    parsed = json.loads(res.text)
    print(parsed)
    print("----createDegreePlan response (END)-----")
    return session, parsed['plan']['plan_id']

def getDegreePlans (api_url, session):
    headers = { "Content-type": "application/json" }
    res = session.get(api_url + "/degreeplans",
                headers = headers, allow_redirects = True)
    print("----getDegreePlans response (START)-----")
    parsed = json.loads(res.text)
    print(parsed)
    # get degree plan ids
    parsed_plan_ids = []
    for i in range (0, len(parsed["plans"])):
        curr_plan = parsed["plans"][i]
        parsed_plan_ids.append(curr_plan["plan_id"])
    print("----getDegreePlans response (END)-----")
    return session, parsed_plan_ids

def getDegreePlanSingle (api_url, session, plan_id):
    headers = { "Content-type": "application/json" }
    res = session.get(api_url + "/degreeplan?plan_id="+ plan_id,
                headers = headers, allow_redirects = True)
    print("----getDegreePlan response (START)-----")
    parsed = json.loads(res.text)
    print(json.dumps(parsed, indent=4, sort_keys=True))
    print("----getDegreePlan response (END)-----")
    return session, parsed


def deleteDegreePlanTerms (api_url, session, plan_id, plan_term_ids):
    headers = { "Content-type": "application/json" }
    body = {
        "plan_id": plan_id,
        "plan_term_ids": plan_term_ids
    }
    res = session.delete(api_url + "/degreeplan/terms",
                    json = json.loads(json.dumps(body)),
                    headers = headers, allow_redirects = True)
    print("----deleteDegreePlanTerms response (START)-----")
    parsed = json.loads(res.text)
    print(parsed)
    print("----deleteDegreePlanTerms response (END)-----")
    return session, parsed

def updateDegreePlanName (api_url, session, plan_id, new_name):
    headers = { "Content-type": "application/json" }
    res = session.patch(api_url + "/degreeplan/" + plan_id + "/plan_name/" + new_name,
                headers = headers, allow_redirects = True)
    print("----updateDegreePlanName response (START)-----")
    print(res.text)
    print("----updateDegreePlanName response (END)-----")
    return session

def deleteDegreePlan (api_url, session, plan_id):
    headers = { "Content-type": "application/json" }
    res = session.delete(api_url + "/degreeplan?plan_id=" + plan_id,
                headers = headers, allow_redirects = True)
    print("----deleteDegreePlan response (START)-----")
    parsed = json.loads(res.text)
    print(parsed)
    print("----deleteDegreePlan response (END)-----")
    return session
