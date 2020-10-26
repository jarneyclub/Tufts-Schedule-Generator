# Automated Schedule Maker for Tufts University
Disclaimer: Personal project. Not endorsed by or affiliated with Tufts University. 

## JSONRPC based REST API that communicates course information and schedule recommendations

Domain: https://tuftsschedulerapi.herokuapp.com/

> Get a single course's information

BASE: https://tuftsschedulerapi.herokuapp.com/course/

QUERY: ?course=COURSEID

e.g. https://tuftsschedulerapi.herokuapp.com/course/course=COMP-0011

> Get multiple courses' information

BASE: https://tuftsschedulerapi.herokuapp.com/courses/

QUERY: ?courses=COURSEID&courses=COURSEID

e.g. https://tuftsschedulerapi.herokuapp.com/courses/?courses=COMP-0015&courses=COMP-0011
