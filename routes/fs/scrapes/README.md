Python2.7
# Web scrape course catalog

1) (When using virtual environment) Go to ./server/routes/fs
```Unix
source scrape/bin/activate
```
2) Go to ./scrape
3) python2.7
```python
import webscraperlib
catalogscraper = webscraperlib.webscraper(wait = 40 ) # estimated time in seconds needed for DOM content to fully load
master_list = catalogscraper.scrape_web()
catalogscraper.write_json(master_list) # write data.txt with course catalog in JSON format
```

# NOTES
> Ignored edge cases
1. Sometimes: there are multiple "courses" associated to a course ID.
e.g. EN-0001 (has multiple "courses" but they are distinguished by section id)
2. Sometimes: there are mutliple "settings" for a course
e.g. same time but choices in which room to take it