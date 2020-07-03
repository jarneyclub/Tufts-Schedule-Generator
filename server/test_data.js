json_file = {
    course_id_names: ["VID-0004", "eng1", "eng2", "ang5", "etc"],
    courses_names: ["Video I", "english composition", "etc"],
    Courses: {
        //a single course dict (made with [])
        "VID-0004": {
            //a sectypes header
            Section_types: ["Studio"],
            //a single section type list
            Studio: [ //a sec dict
                        {     Section_name: "01-STU", 
                            Settings: [ 
                                { Times : ["We2:00PM - 4:30PM", "We9:30AM - 12:00PM"], Location: "230 Fenway: B115 (Video)", City: "Fenway" } 
                                    ], 
                            Instructor: ['Mary Ellen Strom'] },
                    {
                            Section_name: "02-STU",
                            Settings: [
                                { Times: ['We1:00PM - 6:00PM'], Locations: "Barnum Hall, Room 200 - Lab", City: ""},
                                { Times: ['We1:00PM - 6:00PM'], Locations: "Barnum, Room LL26", City: "Medford/Somerville"}
                                        ],
                            Instructor: ['Jane Gillooly'] } 
        ]
        },
        "eng2": {
            
        }
    }
}