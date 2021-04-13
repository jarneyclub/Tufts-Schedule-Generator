Python2.7
# Web scrape course catalog

1) (When using virtual environment) Go to ./server/routes/fs
```Unix
source scrape/bin/activate
```
2) Go to ./scrape
3) python
```python
import webscraperlib
catalogscraper = webscraperlib.webscraper(wait = 40 ) # estimated time in seconds needed for DOM content to fully load
master_list = catalogscraper.scrape_web()
catalogscraper.generate_documents(master_list) # upload to database 
catalogscraper.write_json(master_list) # write data.txt with course catalog in JSON format
# and then go to https://tufts-schedule-api.herokuapp.com/api/courses/db/search-table to update search index
```

# NOTES
> Ignored edge cases
1. Sometimes: there are multiple "courses" associated to a course ID.
e.g. EN-0001 (has multiple "courses" but they are distinguished by section id)
2. Sometimes: there are mutliple "settings" for a course
e.g. same time but choices in which room to take it