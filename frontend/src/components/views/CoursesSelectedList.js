import React from 'react';
import style from './styles/CoursesSelectedList.module.css';
import CourseSelected from './CourseSelected.js';
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
                <button onClick = {this.props.handleGenerate} >Generate</button>
            </div>
        );
    }
}

export default CoursesSelectedList;