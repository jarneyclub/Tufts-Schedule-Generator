import React from 'react';
import style from './styles/CoursesSelectedList.module.css';
import CourseSelected from './CourseSelected.js';
import {
    Link
} from "react-router-dom";
class CoursesSelectedList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className = {style.container} id = "coursesSelectedList">
                <h1>Your selected courses</h1>
                <div>
                    {this.props.selectedCourses.map(function (courseID) {
                        return <CourseSelected courseID = {courseID}></CourseSelected>
                    })}
                </div>
                <Link className = {style.button} onClick = {this.props.handleGenerate} to = "/schedule">
                    Schedule
                </Link>
            </div>
        );
    }
}

export default CoursesSelectedList;