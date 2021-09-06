from pymongo import MongoClient
from pymongo import TEXT
from cc_scraper  import cc_scraper
from rmp_scraper import rmp_scraper
from random import randint
from time import sleep
import re
import math
import datetime
# order of seasons
# spring, annual, summer, fall
# 2     , 4     , 5     , 8
class db_schedule ():
    
    def __init__(self, year = "2021", season = "fall"):
        self.db = self.init_db()
        self.cc_scraper = cc_scraper(year, season)
        # self.rmp_scraper = rmp_scraper(1040)
        self.cc_session = self.cc_scraper.get_cookies()
        term_to_int = {
            "FALL": "8",
            "fall": "8",
            "SPRING": "2",
            "spring": "2",
            "SUMMER": "5",
            "summer": "5",
            "annual": "4"
        }
        self.curr_term = year[0:1] + year[2:4] + term_to_int[season]

    def update_courses_sections (self):
        print("Initializing courses and sections in database...")
        courses, sections = self.init_course_catalog()
        print("Finished...")
        sleep(randint(15,30))
        print("Beginning periodic section capacity updates...")
        for i in range(0, len(sections)):
            sec_id = sections[i]["section_id"]
            print("section_id: " + sec_id)
            self.update_capacity(sec_id)
            sleep(randint(1,2))
        

    def update_db(self):
        print("Getting course catalog from Tufts...")
        self.cc_session, course_cat = self.cc_scraper.get_course_catalog(self.cc_session)
        print("Getting attributes from Tufts...")
        self.cc_session, attributes_info = self.cc_scraper.get_attributes(self.cc_session)
        courses, sections = self.parse_cc(course_cat)
        print("Updating courses_general collection...")
        self.update_courses_general(courses)
        print("Updating courses collection...")
        self.update_courses_term(courses)
        print("Updating sections collection...")
        self.update_sections_term(sections)
        print("Updating attributes collection")
        attributes = self.parse_attributes(attributes_info)
        self.update_attributes(attributes)
    
    def update_attributes (self, attributes_info):
        self.db.attributes.insert_many(attributes_info)
    
    def update_courses_general (self, courses_info):
        for i in range (0, len(courses_info)):
            curr_course_info = courses_info[i]
            self.db.courses_general.update(
            {
                "course_num":  curr_course_info["course_num"],
                "course_title": curr_course_info["course_title"]
            }, 
            {
                "$set": { 
                    "course_num": curr_course_info["course_num"],
                    "course_title": curr_course_info["course_title"],
                    "units_esti": curr_course_info["units_esti"],
                    "last_term": int(self.curr_term)
                    }
            },
            upsert = True)
    
    def update_courses_term (self, courses_info):
        docs_to_insert = []
        for i in range (0, len(courses_info)):
            curr_course = courses_info[i]
            doc = {}
            doc["term_course_id"] = curr_course["course_id"]
            doc["course_num"] = curr_course["course_num"]
            doc["course_title"] = curr_course["course_title"]
            doc["units_esti"] = curr_course["units_esti"]
            doc["attributes"] = curr_course["attributes"]
            doc["closed"] = curr_course["closed"]
            doc["last_term"] = int(self.curr_term)
            docs_to_insert.append(doc)
        self.db.courses.drop()
        self.db["courses"].insert_many(docs_to_insert)
        self.db.courses.create_index([("term_course_id", TEXT), ("course_num", TEXT), ("course_title", TEXT)])
        self.db.courses.create_index([("attributes", 1)])
        self.db.courses.create_index([("closed", 1)])
    
    def update_sections_term (self, sections_info):
        docs_to_insert = []
        for i in range (0, len(sections_info)):
            curr_section = sections_info[i]
            doc = {}
            doc["term_section_id"] = curr_section["section_id"]
            doc["term_course_id"]  = curr_section["course_id"]
            doc["course_num"]      = curr_section["course_num"]
            doc["course_title"]    = curr_section["course_title"]
            doc["units"]           = curr_section["units"]
            doc["section_num"]     = curr_section["section_num"]
            doc["campus"]          = curr_section["campus"]
            doc["section_type"]    = curr_section["section_type"]
            doc["instr_mode"]      = curr_section["instr_mode"]
            doc["attributes"]      = curr_section["attributes"]
            doc["status"]          = curr_section["status"]
            doc["capacities"]      = curr_section["capacities"]
            doc["classes"]         = curr_section["classes"]
            doc["term"]            = self.curr_term
            docs_to_insert.append(doc)
        self.db.sections.drop()
        self.db["sections"].insert_many(docs_to_insert)
        self.db.sections.create_index([("term_course_id", TEXT), ("term_section_id", TEXT), ("status", TEXT)])
        self.db.sections.create_index([("attributes", 1)])

    def init_db(self):
        dburl = "mongodb+srv://backend:WBxtm0WV0lnUJIxA@cluster0.2mmvf.mongodb.net/courses?retryWrites=true&w=majority"
        client = MongoClient(dburl)
        db = client.schedule
        return db

    def update_capacity(self, secnum):
        self.cc_session, cap_info = self.cc_scraper.get_section_capacity(self.cc_session, secnum)
        document = self.parse_sec_cap(cap_info)
        for i in range (0, len(document)):
            cap = document[i]
            if cap["cap_type"] != "Enrollment" and cap["cap_type"] != "Wait List":
                print("## unidentified cap_type ##")
                print(cap["cap_type"])
                print(secnum)
        self.db.sections2208.update(
            {"section_id": secnum},
            {
                "$set": {
                    "capacities": document
                }
            })

    def init_professors(self):
        prof_list = self.rmp_scraper.getProfessorList()
        documents = self.parse_prof_list(prof_list)
        # remove all documents from collection
        self.db.professors.drop()
        # create collection and insert docs
        self.db["professors"].insert_many(documents)
    
    #### Helper Functions ####
    def get_previous_term(self, curr_term, num_terms_to_go_back):
        cycle = [2, 4, 5, 8]
        # cases 
        # new term = (curr_year - (nttgb / 4)) + cycle[curr_season_ind - (nttgb % 4)],
        #          if curr_season_ind - (nttgb % 4) >= 0
        # new term = (curr_year - (1 + {nttgb - (nttgb % 4)} / 4)) + cycle[4 + (curr_season_ind - (nttgb % 4))],
        #          if curr_season_ind - (nttgb % 4) < 0

        # test cases
        # 2212, 0 == 2212
        # 2212, 4 == 2202
        # 2212, 1 == 2208
        # 2215, 2 == 2212
        # 2215, 5 == 2204

        curr_season = int(curr_term[3])
        curr_year = int(curr_term[0:3])
        index_curr_season = cycle.index(curr_season)
        divided = math.floor(num_terms_to_go_back / len(cycle))
        modded = (num_terms_to_go_back % len(cycle))
        if index_curr_season - modded >= 0:
            new_year = curr_year - divided
            new_season = cycle[index_curr_season - modded]
        else:
            new_year = curr_year - (1 + math.floor((num_terms_to_go_back - modded) / len(cycle)))
            new_season = cycle[len(cycle) + index_curr_season - modded]
        new_term = str(new_year*10 + new_season)
        return new_term
    
    def get_curr_season(self):
        curr_season = self.curr_term[3]
        int_season_to_string_dict = {
            "2": "spring",
            "4": "annual",
            "5": "summer",
            "8": "fall"
        }
        return int_season_to_string_dict[curr_season]

    #### PARSING ####
    def parse_sec_cap(self, cap_info):
        capacities = cap_info["reserved_cap"]
        return capacities

    def parse_prof_list(self, prof_list):
        results = prof_list
        profs_info = []
        for pind in range (0, len(results)):
            prof_info = results[pind]
            prof_info_db = {}
            prof_info_db["dept"] = prof_info["tDept"]
            prof_info_db["firstname"] = prof_info["tFname"]
            prof_info_db["middlename"] = prof_info["tMiddlename"]
            prof_info_db["lastname"] = prof_info["tLname"]
            prof_info_db["num_ratings"] = prof_info["tNumRatings"]
            prof_info_db["avg_rating"] = prof_info["overall_rating"]
            profs_info.append(prof_info_db)
        return profs_info

    def parse_attributes (self, attributes_info):
        attributes_db = []
        for i in range (0, len(attributes_info)):
            attribute_grp = attributes_info[i]
            attribute_db = attribute_grp["children"]
            for j in range (0, len(attribute_db)):
                attr_specific = attribute_db[j]["text"]
                attr_db = {}
                attr_db["text"] = attr_specific
                attributes_db.append(attr_db)
        return attributes_db

    def parse_cc(self, cc):
        day_to_int = { "Mo" : 1, "Tu" : 2, "We" : 3, "Th" : 4, "Fr": 5, "Sa": 6, "Su": 7}
        results = cc["searchResults"]
        courses_db = []
        sections_db = []
        for cind in range (0, len(results)):
            c_info = results[cind]
            c_info_db = {}
            c_info_db["desc_long"] = c_info["desc_long"]
            c_info_db["course_title"] = c_info["course_title"]
            c_info_db["course_num"] = c_info["course_num"]
            c_info_db["course_id"] = c_info["level1_groupid"]
            c_info_db["sections_temp"] = c_info["sections"] # temporary key that will be deleted in update_courses
            dict_sectype_units = {}
            dict_attrs = {}
            for secind in range (0, len(c_info["sections"])):
                sec_info_arr = c_info["sections"][secind]["components"]
                for com_ind in range(0, len(sec_info_arr)):
                    sec_info = sec_info_arr[com_ind]
                    sec_info_db = {}
                    sec_info_db["section_id"] = sec_info["class_num"].lstrip()
                    sec_info_db["course_id"] = c_info["level1_groupid"]
                    sec_info_db["course_num"] = c_info["course_num"]
                    sec_info_db["course_title"] = c_info["course_title"]
                    sec_info_db["units"] = sec_info["unit_max"]
                    sec_info_db["section_num"] = sec_info["section_num"]
                    sec_info_db["campus"] = sec_info["campus"]
                    sec_info_db["section_type"] = sec_info["component"]
                    sec_info_db["instr_mode"] = sec_info["instructionmode"]
                    dict_sectype_units[sec_info["component"]] = sec_info["unit_max"]
                    # get class attributes if they exist, empty array otherwise
                    if sec_info["class_attr"].find("|") > -1:
                        attributes = re.split("[|]", sec_info["class_attr"])
                        for i in range (0, len(attributes)):
                            attr = attributes[i]
                            dict_attrs[attr] = True
                    else:
                        attributes = []

                    sec_info_db["attributes"] = attributes
                    sec_info_db["status"] = sec_info["status"]
                    sec_info_db["capacities"] = []
                    classes_info_db = []
                    for locind in range (0, len(sec_info["locations"])):
                        location_info = sec_info["locations"][locind]
                        for timeind in range (0, len(location_info["meetings"])):
                            class_info = location_info["meetings"][timeind]
                            if len(class_info["days"]) == 0:
                                # there is no specified time for this section
                                class_info_db = {}
                                class_info_db["instructor"] = location_info["instructor"]
                                class_info_db["room"] = location_info["class_loc"]
                                class_info_db["campus"] = location_info["campus"]
                                class_info_db["start_time"] = -1
                                class_info_db["end_time"] = -1
                                class_info_db["day_of_week"] = -1
                                class_info_db["time_unspecified"] = True
                                classes_info_db.append(class_info_db)
                            else:
                                for dayind in range (0, len(class_info["days"])):
                                    day_of_week = class_info["days"][dayind]
                                    int_day_of_week = day_to_int[day_of_week]
                                    class_info_db = {}
                                    class_info_db["instructor"] = location_info["instructor"]
                                    class_info_db["room"] = location_info["class_loc"]
                                    class_info_db["campus"] = location_info["campus"]
                                    class_info_db["start_time"] = class_info["meet_start_min"]
                                    class_info_db["end_time"] = class_info["meet_end_min"]
                                    class_info_db["day_of_week"] = int_day_of_week
                                    class_info_db["time_unspecified"] = False
                                    classes_info_db.append(class_info_db)
                    sec_info_db["classes"] = classes_info_db
                    sections_db.append(sec_info_db)
            # add units
            units_total = 0
            for st in dict_sectype_units:
                try:
                    units_total += dict_sectype_units[st]
                except:
                    units_total = -1
                    break
            c_info_db["units_esti"] = units_total
            # get all attributes of this course
            all_attributes = []
            for attr in dict_attrs:
                all_attributes.append(attr)
            c_info_db["attributes"] = all_attributes
            c_info_db["closed"] = self.all_sections_closed(c_info_db["sections_temp"])
            courses_db.append(c_info_db)
        return courses_db, sections_db

    def all_sections_closed(self, sections):
        for sec_ind in range (0, len(sections)):
            sec_info_arr = sections[sec_ind]["components"]
            for com_ind in range(0, len(sec_info_arr)):
                sec_info = sec_info_arr[com_ind]
                if sec_info["status"] != "O" and sec_info["status"] != "W":
                    return True
        return False

    ### OLD ###
    '''
        def update_sections (self, sections_info):
        # delete sections that are from database
        old_term = self.get_previous_term(self.curr_term, 4)
        print("Removing sections from " + old_term + "...")
        
        old_time = datetime.datetime.now()
        self.db["sections"].remove({"curr_term":old_term})
        new_time = datetime.datetime.now()
        seconds = (new_time - old_time).total_seconds()
        print("Removing old sections took " + str(seconds) + " seconds")
        
        old_time = datetime.datetime.now()
        # insert or update curr_term's sections
        for i in range (0, len(sections_info)):
            curr_section = sections_info[i]
            curr_sid = curr_section["section_id"]
            section_db = self.db["sections"].find_one({"section_id": curr_sid})
            if section_db == None:
                # no section currently exists in databse with given section_id
                curr_section["curr_term"] = self.curr_term
                self.db["sections"].insert_one(curr_section)
            else:
                # section exists
                self.db["sections"].update(
                    {"section_id":curr_sid}, 
                    {"$set": {"status" : curr_section["status"]}}) # update status
        new_time = datetime.datetime.now()
        seconds = (new_time - old_time).total_seconds()
        print("Updating Sections collection took " + str(seconds) + " seconds")

    def update_courses (self, courses_info):
        old_time = datetime.datetime.now()
        for i in range(0, len(courses_info)):
            curr_course = courses_info[i]
            curr_cid = curr_course["course_id"]
            course_db = self.db["courses"].find_one({"course_id": curr_cid})
            if course_db == None:
                # no course currently exists in database with given course_id
                course_db = {}
                course_db["course_id"]    = curr_cid
                course_db["course_title"] = curr_course["course_title"]
                course_db["course_num"]   = curr_course["course_num"]
                course_db["desc_long"]    = curr_course["desc_long"]
                course_db["units_esti"]   = curr_course["units_esti"]
                course_db["curr_term"]    = self.curr_term
                course_db["closed"]       = self.all_sections_closed(curr_course["sections_temp"])
                
                # season 
                course_db["annual"]       = False
                course_db["fall"]         = False
                course_db["spring"]       = False
                course_db["summer"]       = False
                course_db[self.get_curr_season()] = True

                course_db["attributes"]   = curr_course["attributes"]
                self.db["courses"].insert_one(course_db)
            else:
                # there exists a course
                course_db["curr_term"]    = self.curr_term
                course_db["closed"]       = self.all_sections_closed(curr_course.pop("sections_temp", None))
                course_db[self.get_curr_season()] = True
                course_db["desc_long"]    = curr_course["desc_long"]
                course_db["course_title"] = curr_course["course_title"]
                course_db["course_num"]   = curr_course["course_num"]
                course_db["attributes"]   = curr_course["attributes"]
                course_db["units_esti"]   = curr_course["units_esti"]
                update_param = {"$set": {
                    "desc_long"        : course_db["desc_long"],
                    "course_title"     : course_db["course_title"],
                    "course_num"       : course_db["course_num"],
                    "attributes"       : course_db["attributes"],
                    "units_esti"       : course_db["units_esti"],
                    self.get_curr_season() : course_db[self.get_curr_season()]}}
                self.db["courses"].update({"course_id" : curr_cid}, update_param)
        new_time = datetime.datetime.now()
        seconds = (new_time - old_time).total_seconds()
        print("Main updates on Courses collection took " + str(seconds) + " seconds")
        old_time = datetime.datetime.now()
        courses_db = self.db.courses.find({self.get_curr_season() : True})
        for x in courses_db:
            curr_course_db = x
            curr_cid = curr_course_db["course_id"]
            if curr_course_db[self.get_curr_season()] == True:
                # this course was offered at this time of year before
                if curr_course_db["curr_term"] != self.curr_term:
                    # this course was not offered this term
                    
                    # update that this course is not offered in season like current
                    self.db["courses"].update({"course_id": curr_cid}, {"$set": {
                        self.get_curr_season() : False}})
        new_time = datetime.datetime.now()
        seconds = (new_time - old_time).total_seconds()
        print("curr_season updates on Courses collection took " + str(seconds) + " seconds")
        
    def init_course_catalog(self):
        self.cc_session, course_cat = self.cc_scraper.get_course_catalog(self.cc_session)
        courses, sections = self.parse_cc(course_cat)
        # init courses
        self.db.courses2208.drop()
        self.db["courses2208"].insert_many(courses)
        # init sections
        self.db.sections2208.drop()
        self.db["sections2208"].insert_many(sections)
        return courses, sections'''