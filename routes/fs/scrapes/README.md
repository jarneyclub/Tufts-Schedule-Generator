Python2.7
# Web scrape course catalog


1) (When using virtual environment) Go to ./server/routes/fs
```Unix
source scrapes/bin/activate
```
2) Go to ./scrapes
3) python
```python
import db_schedule
db_schedule = db_schedule.db_schedule(do_update = True)
db_schedule....


```
# NOTES
> Ignored edge cases
1. Sometimes: there are multiple "courses" associated to a course ID.
e.g. EN-0001 (has multiple "courses" but they are distinguished by section id)
2. Sometimes: there are mutliple "settings" for a course
e.g. same time but choices in which room to take it