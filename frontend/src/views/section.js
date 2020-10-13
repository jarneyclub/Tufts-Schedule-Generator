import React from 'react';
import './styles/section.css';

class Section extends React.Component {
    constructor(props) {
        super(props);
        this.section_name = "";
        this.instructor = "";
        this.start_time = "";
        this.end_time = "";
        this.location = "";
        this.course = "";
    }
    render() {
        return (
            <div id = "section_box">
            <div id ="course_title">
                <center>
                    01-STU (Studio)
                </center>
            </div>
            <div></div>
            <div>Mary Ellen Strom</div>
            <div> 2:00PM - 4:30PM</div>
            </div>
        );
    }
}