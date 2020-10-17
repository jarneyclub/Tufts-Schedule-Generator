# Automated Schedule Maker for Tufts University
Disclaimer: Personal project. Not endorsed by or affiliated with Tufts University. 

> Frontend:

a) React JS
- Render automatic shuffling of courses in a week schedule

> Backend:

a) Node JS
- Express (API to get course info from database)

b) Python
- Web scrape course catalog

1) Go to ./server/routes/fs
```Unix
source scrape/bin/activate
```
2) Go to ./scrape
3) python2.7
```python
import webscraperlib
catalogscraper = webscraperlib.webscraper(wait = 40 ) # estimated time in seconds needed for DOM content to fully load
master_list = catalogscraper.scrape_web()
catalogscraper.write_json(master_list)
```
