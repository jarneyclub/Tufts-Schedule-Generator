import React from 'react';
import style from './styles/CoursesSelectedList.module.css';
import CourseSelected from './CourseSelected.js';
class CoursesSelectedList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className = {style.container}>
                <h1>Your selected courses</h1>
                <CourseSelected></CourseSelected>
                <CourseSelected></CourseSelected>
                <CourseSelected></CourseSelected>
                <CourseSelected></CourseSelected>
                <CourseSelected></CourseSelected>
                <CourseSelected></CourseSelected>
            </div>
        );
    }
}

export default CoursesSelectedList;