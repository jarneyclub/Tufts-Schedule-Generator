import React from 'react';
import './styles/course.css'
class Course extends React.Component {
    constructor(props) {
        super(props);
        this.course_name = "";
    }
    setCourseName( newName) {
        this.course_name = newName;
    }
    render() {
        return(
        <div id = "course_box">
            <center>
                <div id = "course_name">
                    <div>
                        {this.props.name}
                    </div>
                </div>
            </center>
        </div>
        );
    }
}

export default Course;