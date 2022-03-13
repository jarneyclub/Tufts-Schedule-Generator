import requests
import json

def saveCustomerResponse (api_url, session):
    headers = { "Content-type": "application/json" }
    body = {
        "name": "Jeremy",
        "email": "jangho.j@gmail.com",
        "message": "hi"
    }
    res = session.post(api_url + "/responses",
                    json = json.loads(json.dumps(body)),
                    headers = headers, allow_redirects = True)
    print("----saveCustomerResponse response (START)-----")
    print(res.text)
    print("----saveCustomerResponse response (END)-----")
    return session