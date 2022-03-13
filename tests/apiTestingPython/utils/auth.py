import requests
import json

def loginManual (api_url, session):
    headers = { "Content-type": "application/json" }
    res = session.post(api_url + "/auth/login", 
                   json = json.loads('{ "userid" : "", "password": ""}'), 
                   headers = headers, allow_redirects = True)
    print("----loginManual response (START)-----")
    print(res.text)
    print(json.loads(res.text))
    print("----loginManual response (END)-----")
    return session

def logout (api_url, session):
    headers = { "Content-type": "application/json" }
    res = session.post(api_url + "/auth/logout", 
                   json = json.loads('{ }'), 
                   headers = headers, allow_redirects = True)
    print("----logout response (START)-----")
    print(res.text)
    # print(json.loads(res.text))
    print("----logout response (END)-----")
    return session

def loginWithCookie (api_url, session):
    headers = { 
        "Content-type": "application/json",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language" : "en-US,en;q=0.9"
    }
    res = session.post(api_url + "/auth/login_cookie", 
                   json = json.loads("{}"), 
                   headers = headers, allow_redirects = True)
    print("----loginWithCookie response (START)-----")
    print(res.text)
    print(json.loads(res.text))
    print("----loginWithCookie response (END)-----")
    return session