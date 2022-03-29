from pymongo import MongoClient
from pymongo import TEXT
import json
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

    def __init__(self, year = "2022", season = "spring", do_update = False):
        self.db = self.init_db()
        self.cc_scraper = cc_scraper(year, season)
        # self.rmp_scraper = rmp_scraper(1040)
        self.cc_session = self.cc_scraper.get_cookies()
        self.do_update = do_update
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
    
    def make_developer_private_degreq_to_public(self, userid):
        private_deg_reqs = self.db.degree_reqs_private.find({'user_id': userid})
        self.db.degree_reqs_public.drop()
        numReqsCopied = 0
        for record in private_deg_reqs:
            self.db["degree_reqs_public"].insert_one(record)
            numReqsCopied += 1
        print("Copied " + str(numReqsCopied) + " degree requirements from private to public.")
    
    def backup_database (self, backup_name):
        dburl = "mongodb+srv://backend:hGIGzx2cBFDSRmP1@cluster0.2mmvf.mongodb.net/" + backup_name + "?retryWrites=true&w=majority"
        client = MongoClient(dburl)
        backup_db = client[backup_name]
        collection_names = self.db.list_collection_names()
        for i in range (0, len(collection_names)):
            collection_name = collection_names[i]
            collection = self.db[collection_name]
            backup_collection = backup_db[collection_name]
            records = collection.find()
            for record in records:
                backup_collection.insert_one(record)

    def run_semesterly_database_update (self):
        '''
        If self.do_update is False, get course catalog of current semester from
        Tufts SISCS API but don't update the database.
        If self.do_update is True, get information of current seemster from
        Tufts SISCS API and
        1. REPLACE term sections and term courses with 
        selected semester's courses and classes 
        2. APPEND selected semester's courses onto general courses
        collection in the database. 
        3. REPLACE attributes in the database with selected semester's 
        attributes
        '''
        print("Getting course catalog from Tufts...")
        self.cc_session, course_cat = self.cc_scraper.get_course_catalog(self.cc_session)
        print("Getting attributes from Tufts...")
        self.cc_session, attributes_info = self.cc_scraper.get_attributes(self.cc_session)
        courses, sections = self.parse_cc(course_cat)
        map_termCourseIdIsVirtual = {}
        if self.do_update == True:
            print("Updating courses_general collection...")
            self.update_courses_general(courses)
            print("Updating sections collection...")
            self.update_sections_term(sections, map_termCourseIdIsVirtual)
            print("Updating courses collection...")
            self.update_courses_term(courses, map_termCourseIdIsVirtual)
            print("Updating attributes collection")
            attributes = self.parse_attributes(attributes_info)
            self.update_attributes(attributes)
        else:
            print("Skipping database update...")
            print("---------- courses ------------")
            print(json.dumps(courses, indent=4, sort_keys=True))
            print("---------- sections ------------")
            print(json.dumps(sections, indent=4, sort_keys=True))
        
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
                    "description": curr_course_info["desc_long"],
                    "units_esti": curr_course_info["units_esti"],
                    "last_term": int(self.curr_term)
                    }
            },
            upsert = True)
    
    def update_courses_term (self, courses_info, map_termCourseIdIsVirtual):
        docs_to_insert = []
        for i in range (0, len(courses_info)):
            curr_course = courses_info[i]
            doc = {}
            doc["term_course_id"] = curr_course["course_id"]
            doc["course_num"] = curr_course["course_num"]
            doc["units_esti"] = curr_course["units_esti"]
            doc["attributes"] = curr_course["attributes"]
            doc["closed"] = curr_course["closed"]
            doc["description"] = curr_course["desc_long"]
            doc["last_term"] = int(self.curr_term)
            # determine whether course is completely virtual or not and update course title accordingly
            virtualSectionExists = map_termCourseIdIsVirtual[curr_course["course_id"]]["virtual_classes_exist"]
            normalSectionExists = map_termCourseIdIsVirtual[curr_course["course_id"]]["normal_classes_exist"]
            doc["is_only_virtual"] = (virtualSectionExists == True) and (normalSectionExists == False)
            if doc["is_only_virtual"] == False:
                doc["course_title"] = curr_course["course_title"]
            else:
                doc["course_title"] = curr_course["course_title"] + " (Virtual)"
            docs_to_insert.append(doc)
        self.db.courses.drop()
        self.db["courses"].insert_many(docs_to_insert)
        self.db.courses.create_index([("term_course_id", TEXT), ("course_num", TEXT), ("course_title", TEXT)])
        self.db.courses.create_index([("attributes", 1)])
        self.db.courses.create_index([("closed", 1)])
    
    def update_sections_term (self, sections_info, map_termCourseIdIsVirtual):
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
            section_is_virtual = (doc["section_num"][0] == "M")
            doc["is_virtual"] = section_is_virtual

            # update course virtual/normal class info
            # initialize info if it doesnt exist
            if self.key_exists_in_dict(curr_section["course_id"], map_termCourseIdIsVirtual) == False:
                map_termCourseIdIsVirtual[curr_section["course_id"]] = {
                    "virtual_classes_exist" : False,
                    "normal_classes_exist" : False
                }
            # update info
            if section_is_virtual == True:
                map_termCourseIdIsVirtual[curr_section["course_id"]]["virtual_classes_exist"] = True
            else:
                map_termCourseIdIsVirtual[curr_section["course_id"]]["normal_classes_exist"] = True

            docs_to_insert.append(doc)
        self.db.sections.drop()
        self.db["sections"].insert_many(docs_to_insert)
        self.db.sections.create_index([("term_course_id", TEXT), ("term_section_id", TEXT), ("status", TEXT)])
        self.db.sections.create_index([("attributes", 1)])
    
    def update_program_names (self):
        self.cc_session, program_names = self.cc_scraper.get_programs(self.cc_session)
        docs_to_insert = []
        for i in range (0, len(program_names)):
            docs_to_insert.append({ 
                "name": program_names[i]})
        self.db.program_names.drop()
        self.db["program_names"].insert_many(docs_to_insert)
            
    def init_db(self):
        dburl = "mongodb+srv://backend:hGIGzx2cBFDSRmP1@cluster0.2mmvf.mongodb.net/schedule?retryWrites=true&w=majority"
        client = MongoClient(dburl)
        db = client.schedule
        return db
    
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
    def key_exists_in_dict(self, aKey, aDict):
        try:
            if aDict[aKey] != None:
                return True
        except:
            return False