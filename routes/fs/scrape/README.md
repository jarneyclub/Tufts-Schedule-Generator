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