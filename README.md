# Semester Schedule Generator with Tufts University courses
Disclaimer: Personal project. Not endorsed by or affiliated with Tufts University. 
Work in progress!

Features: 
- A weekly schedule within a time interval given by user (WIP)
- Link with an open source RateMyProfessor API (Future)


## Frontend (React JS)
https://tufts-schedule.herokuapp.com

## Backend (node JS on Heroku)

### JSONRPC based web API

Base address: https://tufts-schedule.herokuapp.com/api

> Get a single course's information

endpoint: /course/

query: ?course=COURSEID

e.g.https://tufts-schedule.herokuapp.com/api/course/?course=COMP-0011

> Get multiple courses' information

endpoint: /courses/

query: ?courses=COURSEID&courses=COURSEID

e.g. https://tufts-schedule.herokuapp.com/api/courses/?courses=COMP-0015&courses=COMP-0011
