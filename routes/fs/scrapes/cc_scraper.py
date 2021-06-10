import requests
import logging
from random import randint
import json
from time import sleep

class cc_scraper ():
    def __init__(self, year, season):
        term_to_int = {
            "FALL": "8",
            "fall": "8",
            "SPRING": "2",
            "spring": "2",
            "SUMMER": "5",
            "summer": "5",
            "annual": "4"
        }
        self.str_year = year[0:1] + year[2:4] + term_to_int[season]
        self.headers = {}
        self.cred_url = "https://sis.uit.tufts.edu/psp/paprd/?cmd=start"
        self.api_url = "https://siscs.uit.tufts.edu/psc/csprd/EMPLOYEE/HRMS/s/WEBLIB_CLS_SRCH.ISCRIPT1.FieldFormula.IScript_getSearchresultsAll3?callback=&term=" + self.str_year + "&career=ALL&subject=&crs_number=&attribute=&keyword=&instructor=&searchby=crs_number&_="
        self.attr_url = "https://siscs.uit.tufts.edu/psc/csprd/EMPLOYEE/HRMS/s/WEBLIB_CLS_SRCH.ISCRIPT1.FieldFormula.IScript_getAttributes?callback=&career=ALL&term=" + self.str_year + "&_=1622156074208"
    def get_cookies(self):
        headers = {
            'Host': 'siscs.uit.tufts.edu',
            'Upgrade-Insecure-Requests': '1'
        }
        self.headers = self.insert_user_agent(headers)
        session = requests.Session()
        session, res = self.cookie_session(session, self.cred_url, self.headers)
        return session
    
    def get_course_catalog(self, session):
        session, res = self.api_session(session, self.api_url, self.headers)
        return session, json.loads(res.text)
    
    def get_section_capacity(self, session, secnum):
        cap_url = "https://siscs.uit.tufts.edu/psc/csprd/EMPLOYEE/HRMS/s/WEBLIB_CLS_SRCH.ISCRIPT1.FieldFormula.IScript_getResultsDetails?callback=&term=" + self.str_year + "&class_num=" + secnum +"&_="
        session, res = self.api_session(session, cap_url, self.headers)
        return session, json.loads(res.text)
    
    def get_attributes(self, session):
        session, res = self.api_session(session, self.attr_url, self.headers)
        return session, json.loads(res.text)

    def insert_user_agent (self, headers):
        browsers = {
            "Chrome": ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36", "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36"],
            "Firefox": ["Mozilla/5.0 (Windows NT 5.1; rv:36.0) Gecko/20100101 Firefox/36.0", "Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:24.0) Gecko/20100101 Firefox/24.0", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:88.0) Gecko/20100101 Firefox/88.0"],
            "Safari": ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15"]
        }
        browser_options = ["Chrome", "Firefox", "Safari"]
        browser = browser_options[randint(0,2)]
        headers["User-Agent"] = browsers[browser][randint(0,len(browsers[browser]) - 1)]
        if browser == "Chrome":
            headers["sec-ch-ua"]        = '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"'
            headers["sec-ch-ua-mobile"] = '?0'
            headers['Sec-Fetch-Dest']   = 'document'
            headers['Sec-Fetch-Mode']   = 'navigate'
            headers['Sec-Fetch-Site']   = 'none'
            headers['Sec-Fetch-User']   = '?1'
            headers['Accept']           = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
            headers['Accept-Language']  = 'en-US,en;q=0.9'
            headers['Accept-Encoding']  = 'gzip, deflate, br'
        elif browser == "Firefox":
            # no Firefox specific headers were observed in testing with Firefox browser 
            headers['Accept']           = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            headers['Accept-Language']  = 'en-US,en;q=0.9'
            headers['Accept-Encoding']  = 'gzip, deflate, br'
        elif browser == "Safari":
            # no Safari specific headers were observed in testing with Safari browser 
            headers['Accept']           = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            headers['Accept-Language']  = 'en-us'
            headers['Accept-Encoding']  = 'gzip, deflate, br'
        return headers

    def insert_proxies (self):
        addr = "http://103.26.130.156:55443"
        return { "https": addr, "http": addr}
    
    def cookie_session(self, session, url, headers):
        # print("************ SENDING FIRST REQUEST *************")
        res = session.get(url, headers = headers, allow_redirects = True)
        # print("************* FIRST REQUEST SESSION COOKIES AFTER************")
        # for cookie in session.cookies:
        #     print('cookie name = ' + cookie.name)
        #     print('cookie value = ' + cookie.value)
        #     print('cookie domain = ' + cookie.domain)
        #     print("------------------------------------")
        # print("************* FIRST REQUEST RESPONSE INFORMATION **************")
        # for cookie in res.cookies:
        #     if cookie.name.find('sisweb') > -1:
        #         secondCookName = cookie.name
        #     print('cookie name = ' + cookie.name)
        #     print('cookie value = ' + cookie.value)
        #     print('cookie domain = ' + cookie.domain)
        #     print("------------------------------------")
        return session, res

    def api_session(self, session, url, headers):
        res = session.get(url, headers = headers, allow_redirects = True)
        # print("************* SECOND REQUEST SESSION COOKIES AFTER************")
        # for cookie in session.cookies:
        #     print('cookie name = ' + cookie.name)
        #     print('cookie value = ' + cookie.value)
        #     print('cookie domain = ' + cookie.domain)
        #     print("------------------------------------")
        # print("************* SECOND REQUEST RESPONSE INFORMATION **************")
        # for cookie in res.cookies:
        #     if cookie.name.find('sisweb') > -1:
        #         secondCookName = cookie.name
        #     print('cookie name = ' + cookie.name)
        #     print('cookie value = ' + cookie.value)
        #     print('cookie domain = ' + cookie.domain)
        #     print("------------------------------------")
        return session, res