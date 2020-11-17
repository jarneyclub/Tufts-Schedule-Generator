# Automated Schedule Maker for Tufts University
Disclaimer: Personal project. Not endorsed by or affiliated with Tufts University. 
Work in progress
## JSONRPC based REST API that communicates course information and schedule recommendations

Base address: https://tufts-schedule.herokuapp.com/api

> Get a single course's information

endpoint: /course/

query: ?course=COURSEID

e.g.https://tufts-schedule.herokuapp.com/api/course/?course=COMP-0011

> Get multiple courses' information

endpoint: /courses/

query: ?courses=COURSEID&courses=COURSEID

e.g. https://tufts-schedule.herokuapp.com/api/courses/?courses=COMP-0015&courses=COMP-0011
