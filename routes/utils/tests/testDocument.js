exports.testDocument = {
    course_name: "Data Structures",
    course_id: "COMP-0015",
    available_section_types: [
        "Lecture",
        "Laboratory"
    ],
    sections: {
        Lecture: [
            {
                section_id: "01-LEC",
                classes: [
                    {
                        time_start: 900,
                        time_end: 975,
                        days_of_week: 1,
                        faculties: [
                            "Mark A Sheldon"
                        ],
                        room: "Virtual",
                        city: ""
                    },
                    {
                        time_start: 900,
                        time_end: 975,
                        days_of_week: 3,
                        faculties: [
                            "Mark A Sheldon"
                        ],
                        room: "Virtual",
                        city: ""
                    }
                ]
            },
            {
                section_id: "02-LEC",
                classes: [
                    {
                        time_start: 900,
                        time_end: 1065,
                        days_of_week: 1,
                        faculties: [
                            "Mark A Sheldon"
                        ],
                        room: "Virtual",
                        city: ""
                    },
                    {
                        time_start: 900,
                        time_end: 1065,
                        days_of_week: 3,
                        faculties: [
                            "Mark A Sheldon"
                        ],
                        room: "Virtual",
                        city: ""
                    }
                ]
            }
        ],
        Laboratory: [
            {
                section_id: "LA-LAB",
                classes: [
                    {
                        time_start: 540,
                        time_end: 615,
                        days_of_week: 2,
                        faculties: [
                            "Mark A Sheldon"
                        ],
                        room: "Virtual",
                        city: ""
                    }
                ]
            },
            {
                section_id: "LB-LAB",
                classes: [
                    {
                        time_start: 540,
                        time_end: 615,
                        days_of_week: 2,
                        faculties: [
                            "Mark A Sheldon"
                        ],
                        room: "Virtual",
                        city: ""
                    }
                ]
            }
        ]
    }

}