from urllib import FancyURLopener
from urllib2 import urlopen
from bs4 import BeautifulSoup
from selenium import webdriver
import time
import os
import re
import json

class webscraper():

    # initialize object
    def __init__(self, wait = 30):
        # version number of webscraperlib (YYYYMM last modified)
        self.version = "202010"
        # store all possible section types
        self.section_types_dict = { "Lecture" : 0, "Laboratory" : 1, "Recitation" : 2, "Recitation (Optional)" : 3, "Internship" : 4, "Seminar" : 5, 
        "Continuance" : 6, "Project" : 7, "Teaching Assistant" : 8, "Independent Study" : 9, "Thesis" : 10, "Research" : 11, "Laboratory (Optional)": 12, "Discussion" : 13, 
        "Thesis Research" : 14, "Exam": 15, "Clinical" : 16, "Rotation": 17, 
        "Studio": 18, "Small Group": 19, "Evaluated Recitation": 20, "Workshop": 21, "Field Studies": 22, "Practicum": 23, "Once Per Week": 24, 
        "Non-credit Online": 25, "Cross Registration": 26 }
        self.section_types_array = ["Lecture", "Laboratory", "Recitation", "Recitation (Optional)", "Internship", "Seminar", "Continuance", "Project", "Teaching Assistant", "Independent Study", "Thesis", "Research", "Laboratory (Optional)", "Discussion", "Thesis Research", "Exam", "Clinical", "Rotation", 
        "Studio", "Small Group", "Evaluated Recitation", "Workshop", "Field Studies", "Practicum", "Once Per Week", "Non-credit Online", "Cross Registration"]
        self.total_section_types = len(self.section_types_array)

        # how much to wait for course catalog to load
        self.waiting_time = wait
    
    # retrieve_html() - Get the entire course catalog page in HTML
    #
    # Parameters:
    #
    # Returns: A Beautiful Soup object of the HTML for later parsing
    # Note: Blocks the entire workflow waiting for page to load
    def retrieve_html(self):
        driver = webdriver.Chrome(executable_path= os.path.abspath('')+'/chromedriver')
        #all courses
        URL = 'https://sis.uit.tufts.edu/psp/paprd/EMPLOYEE/EMPL/h/?tab=TFP_CLASS_SEARCH#search_results/term/2208/career/ALL/subject/course/attr/keyword/instructor'
        driver.get(URL)
        for x in range(0,self.waiting_time):
            time.sleep(1)
            print(x)
            if x % 1 == 0:
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        page_html = driver.page_source
        print(page_html)
        bsoup = BeautifulSoup(page_html, 'html.parser')
        driver.close()
        print("closed driver")
        return bsoup

    # scrape_web() - "main" function populating {master_list} with course catalog
    #
    # Parameters:
    #
    # Returns: {master_list} - list of all courses and its info
    #
    def scrape_web(self):
        # beautiful soup HTML object to parse
        bsoup = self.retrieve_html()        
        
        # {course_list} - list of courses names
        # {tr_list} - list of <tr> objects for serious parsing
        course_list, tr_list = self.init_lists(bsoup)
        
        # {master_list} - list to which all important course information will be appended
        master_list = []
        
        size = len(course_list) # number of courses this semester
        
        # append some TEMPLATE indices to master_list. 
        for x in range(0, size):
            master_list.append(["course_name","courseID",[]])

        # iterate through each course
        for x in range(0,size):
            
            # iterate through each section type
            for y in range (0,self.total_section_types):
                
                sections = []
                # iterate through sections and gather info about a particular section
                for tr in tr_list[x][y]:
                    
                    # {single_section} - list containing all information of a SINGLE section
                    single_section = []
                    # single_section : ["section name", "time(day and time)", "location", "city", "teacher"]                   
                    
                    ########## append section name ##########
                    
                    # get the section name (ex. LEC-01 )
                    section_name = str(self.input_section_name(tr))
                    
                    # identify OPTIONAL section types
                    if y == 3: # optional recit
                        section_name = "(OR)" + section_name
                    elif y == 12: # optional lab
                        section_name = "(OL)" + section_name
                    
                    single_section.append(section_name)
                    
                    ########## append section times, location, city (!!! a seciton may have multiple of each !!!) ##########

                    div_tfploc = tr.find_all('div','tfp-loc') # list of < div id = "tfp-loc" > objects

                    # {options} - list containing all options for a section (ex. sometimes a section can have multiple times)
                    options = []
                    # iterate through every <tl> in div_tfploc
                    for divtl in div_tfploc:
                        single_option = []
                        
                        # {div_time_loc} - list containing all <div> objects with time and location info
                        div_time_loc = divtl.find_all('div')
                        
                        # get the time period of the section in integer format
                        times = self.input_time(div_time_loc)
                        
                        single_option.append(times)
                        
                        # get the location of the section
                        location = self.input_loc(divtl)
                        city = self.input_city(div_time_loc)

                        single_option.append(location)
                        single_option.append(city)

                        # append a single option for a section
                        options.append(single_option)
                    
                    single_section.append(options)

                    ########## append section instructor ##########
                    teacher_name = self.input_teacher(tr)
                    
                    single_section.append(teacher_name)
                    
                    ########## append a section ###########
                    sections.append(single_section)

                ########## append all sections of a section type ##########
                master_list[x][2].append(sections)
                
                ########## append course name and course ID ##########
                self.input_course_name_ID_master(master_list, course_list, x)

        return master_list


    ####################################
    #                                  #
    #     PARSING HELPER FUNCTIONS     #
    #                                  #
    ####################################

    # init_lists() - initiailize course list and HTML element list that will be parsed
    #
    # Parameters: Beautiful Soup of the course catalog HTML
    #
    # Returns: 
    # {course_list} 
    # {tr_list}
    #
    def init_lists( self, bsoup ):
        course_list = [] # list of course names

        ### HTML elements lists ( for parsing ) ###
        div_list = bsoup.find_all('div','tfp_accordion_row cls-show-js') # list of <div> objects of every general course info 
        tables_list = [] # list of <table> objects of sections of courses
        tbody_list = [] # list of <tbody> of the section types

        # extract info from every course
        for d in div_list:
            # contains the name of every course in this semester
            course_list.append(d.find_all('a','accorion-head')[0])
            tables_list.append(d.find_all('table','tfp-results-sections'))
            tbody_list.append(d.find_all('tbody'))

        tr_list = self.init_tr_list(tables_list, tbody_list) # list of <tr> objects for serious parsing
        
        return course_list, tr_list

    # init_tr_list() - populates tr_list 
    #
    # Parameters: 
    # - tables_list
    # - tbody_list
    #
    # Returns: 
    # {tr_list} - list of <tr> objects
    #
    def init_tr_list ( self, tables_list, tbody_list ) :
        tr_list = []

        #shows what the section_type is of each table tag in sequence
        section_types = []
        for course in tables_list:
            section_types_in_course = []
            #iterate through section_type
            for table in course:
                #run if there are 'caption' tags in table
                if table.find_all('caption') > 0:
                    section_type_name = str(table.find('caption').text)
                    #removes leading whitespace characters
                    section_type_name = section_type_name.lstrip()
                    section_type_name = section_type_name.replace("\n", "")
                    section_types_in_course.append(section_type_name)
            section_types.append(section_types_in_course)
        
        index_in_section_types = 0
        #extracting
        for course in tbody_list:
            course_trs = []
            for x in range(0,self.total_section_types):
                course_trs.append([])
            section_type_index = 0
            for tbody in course:
                section_type = str(section_types[index_in_section_types][section_type_index])
                #add the tr arrays to its section_type
                try:
                    index_to_use = self.section_types_dict[section_type]
                    course_trs[index_to_use] = tbody.find_all('tr', 'accorion-head')
                except IndexError:
                    print "IndexError: new section type in course catalog. Codebase need sync. New section_type: "
                    print section_type
                except KeyError:
                    print "KeyError: New section type in course catalog. Codebase need sync. New section_type: "
                    print section_type
                section_type_index+=1
            index_in_section_types+=1
            #tr_list[0][0] is lectures [0][1] would be like labs
            tr_list.append(course_trs)

        return tr_list
    
    # time_to_integer() - takes a string of a time interval and makes it into integer interval
    #
    # Parameters: 
    # - {time} - a string formatted like We, ThXX:XXAM - XX:XXPM
    #
    # Returns: a three element list [ day(1-7), starting time (0-1440), ending time (0-1440) ]
    #
    def time_to_integer(self, time):
        day_dict = { "Mo" : 1, "Tu" : 2, "We" : 3, "Th" : 4, "Fr": 5, "Sa": 6, "Su": 7}
        regobject = re.search(r"\d",time)
        #if digit in time exists
        if regobject:
            #get the index of the first instance of digit
            dig_first_index = regobject.start()
            #day of week regobject
            dow_regobject = re.search(r"[M][o]|[T][u]|[W][e]|[T][h]|[F][r]|[S][a]|[S][u]",time)
            int_days_list = []
            if dow_regobject:
                #string with the days of week (We, Th)
                days = time[0:dig_first_index]
                string_days_list = [day.strip() for day in days.split(',')]
                #convert the days of the week strings to integers
                for day in string_days_list:
                    int_days_list.append(day_dict[day])
            #times of day (X:XXAM - XX:XXPM)
            tod = time[dig_first_index:]
            #get time without AM/PM
            time_1_end = re.search(r"[a-z]|[A-Z]",tod).start()
            time_1_full = tod[0:time_1_end+2]
            time_2_full = tod[time_1_end+5:]
            time_2_end = re.search(r"[a-z]|[A-Z]",time_2_full).start()
            #m_start_index for index of A or P in AM or PM in time_1_full or time_2_full
            m_start_index = re.search(r"[A-Z]",time_1_full).start()
            time_1_meridiem = time_1_full[m_start_index:m_start_index+2]
            m_start_index = re.search(r"[A-Z]",time_2_full).start()
            time_2_meridiem = time_2_full[m_start_index:m_start_index+2]
            #(X:XX is start XX:XX is end)
            start = tod[0:time_1_end]
            end = time_2_full[:time_2_end]
            start_colon = re.search(r"[:]",start).start()
            end_colon = re.search(r"[:]",end).start()
            #get hours and minutes strings of each time
            start_hours = start[0:start_colon]
            start_minutes = start[start_colon+1:start_colon+3]
            end_hours = end[0:end_colon]
            end_minutes = end[end_colon+1:end_colon+3]
            if time_1_meridiem == "AM":
                hours = int(float(start_hours))
                minutes = int(float(start_minutes))
                time_1 = hours * 60 + minutes
            else:
                hours = int(float(start_hours))
                minutes = int(float(start_minutes))
                time_1 = hours * 60 + minutes + 720
            if time_2_meridiem == "AM":
                hours = int(float(end_hours))
                minutes = int(float(end_minutes))
                time_2 = hours * 60 + minutes
            else:
                hours = int(float(end_hours))
                minutes = int(float(end_minutes))
                time_2 = hours * 60 + minutes + 720
            times = []
            times.append(time_1)
            times.append(time_2)
            result = []
            result.append(int_days_list)
            result.append(times)
            return result

    # input_course_name_ID_master() - populate master_list with course names and course ID's
    #
    # Parameters: 
    # - {master_list}
    # - {course_list}
    # - {curr_index} - index betweeen 0 and the total amount of courses
    #
    # Returns: 
    #
    def input_course_name_ID_master(self, master_list, course_list, curr_index):
        if len(course_list[curr_index].find_all('span')) > 0:
            #decompose permanently deletes the element in bsoup (not in page_html. after decomposing page_html != bsoup) (actually it's fucking confusing) so just run beautifulsoup func on bsoup again
            course_list[curr_index].span.decompose()
        name_found = False
        for c in course_list[curr_index].contents:
            #only append string without newline char
            if c.string != '\n':
                string_size = len(str(c))
                #content is course ID
                if name_found == False:
                    master_list[curr_index][1] = str(c)[1:string_size-1]
                    name_found = True
                #content is course name
                else:
                    raw_string = str(c)[7:string_size-8]
                    master_list[curr_index][0] = raw_string.replace("&amp;", "&")

    # input_section_name() - get section name (ex. LEC-01)
    #
    # Parameters: 
    # - {tr} - a <tr> object 
    #
    # Returns: extracted section name 
    #
    def input_section_name(self, tr):
        td = tr.find('td')
        if len(tr.find_all('a')) > 0:
            td.a.decompose()
        td_string = str(td.text)
        section_name = td_string.replace("\n","")
        return section_name
    
    # input_time() - get the time for a section
    #
    # Parameters: 
    #  {div_time_loc} - a <div> element containing time and location info
    #
    # Returns: 
    #  {times} = list of all times of a section
    # 
    def input_time(self, div_time_loc):
        size = len(div_time_loc)
        #for when there are multiple times for a single section
        times = []
        for x in range(0,size-1):
            if len(div_time_loc[x].find_all('span')) > 0:
                div_time_loc[x].span.decompose()
            time_string = str(div_time_loc[x].text)
            integer_time = self.time_to_integer(time_string)
            times.append(integer_time)
        return times
    
    # input_loc() - get the location of a section
    #
    # Parameters: 
    #  {div_tfoloc} - a <div> element with id #tfploc
    #
    # Returns: 
    #  {location} - a string
    # 
    def input_loc(self, div_tfploc):
        div_tfploc_contents= div_tfploc.contents
        size = len(div_tfploc_contents)
        #size-2 was 2 previously
        location = str(div_tfploc_contents[size-3])
        location = location.replace("\n", "")
        return location

    # input_city() - get the city of the section
    #
    # Parameters: 
    #  {div_time_loc} - a <div> element containing time and location info
    #
    # Returns: 
    #  {city} - string of a city name
    # 
    def input_city(self, div_time_loc):
        try:
            div_tl_size = len(div_time_loc)
            #was originally 1
            city = str(div_time_loc[div_tl_size-1].text)
            return city
        except IndexError:
            print "list index out of range"
            print div_time_loc
        except KeyError as e:
            print ("KeyError at input_city()")
            print e
            print ("city:")
            print(city)
            print ("div_time_loc")
            print(div_time_loc)
    
    # input_teacher() - get the names of the section's instructors
    #
    # Parameters: 
    # {tr} - a <tr> object
    #
    # Returns: 
    #  {teacher_name} - a string
    # 
    def input_teacher(self, tr):
        div_tfpins = tr.find('div','tfp-ins')
        teacher_name = str(div_tfpins.text)
        teacher_name = teacher_name.replace("\n","")
        return teacher_name

    
    ####################################
    #                                  #
    #        JSONIFY FUNCTIONS         #
    #                                  #
    ####################################

    # write_json() - parse master_list into readable dictionary and write the JSON into data.txt in current directory
    #
    # Parameters: 
    # - {master_list}
    #
    # Returns: the dictionary of the course catalog
    def write_json(self, master_list):
        courses_amnt = len(master_list)
        courses_id_names = []
        courses_names = []
        dict_file = {}
        for x in range(0, courses_amnt):
            courses_id_names.append(str(master_list[x][1]))
            courses_names.append(str(master_list[x][0]))
        dict_file['courses_id_names'] = courses_id_names
        dict_file['courses_names'] = courses_names
        all_courses = []
        for course_num in range(0, courses_amnt):
            #list used to make a course dict
            sec_type_list = []
            #keep a list of used section types
            available_sec_types = []
            #iterate through section types
            for sec_type_num in range(0, self.total_section_types):
                section_type = self.section_types_array[sec_type_num]
                #list of sections used to make sec type dict
                sec_list = []
                #index 2 is the list of sections
                if len(master_list[course_num][2][sec_type_num]) > 0:
                    available_sec_types.append(str(section_type))
                    section_amnt = len(master_list[course_num][2][sec_type_num])
                    #iterate through sections
                    for sec_num in range(0, section_amnt):
                        #write section name
                        section_name = str(master_list[course_num][2][sec_type_num][sec_num][0])
                        #list times
                        subsec_size = len(master_list[course_num][2][sec_type_num][sec_num][1])
                        #list of settings dicts
                        settings_list = []
                        #iterate through settings==subsec (subsections are only settigns)
                        for subsec_num in range(0, subsec_size):
                            #iterate through times
                            times_list = []
                            for subsec_time in master_list[course_num][2][sec_type_num][sec_num][1][subsec_num][0]:
                                times_list.append(subsec_time)
                            #make settings list tuple
                            location = str(master_list[course_num][2][sec_type_num][sec_num][1][subsec_num][1])
                            city = str(master_list[course_num][2][sec_type_num][sec_num][1][subsec_num][2])
                            times_value = ("times", times_list)
                            location_value = ("location", location)
                            city_value = ("city", city)
                            settings_dict = dict([times_value, location_value, city_value])
                            settings_list.append(settings_dict)
                        #make settings list tuple
                        settings_tuple = ("settings", settings_list)
                        #make instructors list tuple
                        instructors_text = str(master_list[course_num][2][sec_type_num][sec_num][2])
                        instructors_list = instructors_text.split(", ")
                        instructors_tuple = ("instructors", instructors_list)
                        #make section name tuple
                        sec_name_tuple = ("section_name", section_name)
                        #make section dictionary
                        sec_dict = dict([sec_name_tuple, settings_tuple, instructors_tuple])
                        sec_list.append(sec_dict)
                    sec_type_dict = (str(section_type), sec_list)
                    sec_type_list.append(sec_type_dict)
            sec_type_header = ("section_types", available_sec_types)
            sec_type_list.append(sec_type_header)
            all_courses.append((courses_id_names[course_num], dict(sec_type_list)))
        dict_file['courses'] = dict(all_courses)
        json.dumps(dict_file, indent = 2)
        self.write_file(dict_file)
        return dict_file

    # write_file() - write the JSON object into data.txt
    #
    # Parameters:
    # - {dict_file} - the dictionary of course catalog
    #
    # Returns:
    def write_file(self, dict_file):
        with open ('data.txt', 'w') as outfile:
            json.dump(dict_file, outfile)
