from pymongo import MongoClient

dburl = "mongodb+srv://jeremy:fdqTM7kYkotbeMDT@cluster0.2mmvf.mongodb.net/courses?retryWrites=true&w=majority"

client = MongoClient(dburl)
db = client.courses
print(db.courses)
