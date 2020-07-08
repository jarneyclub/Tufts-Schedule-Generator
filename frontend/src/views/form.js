import React from 'react';
import ReactDOM from 'react-dom';
import Course from './course.js';
import './styles/form.css';

var chosen_courses = []
var chosen_courses_info = []

var course = {
    courseName: "courseName",
    information: ""
}
//Form to take user's course preferences
class Form extends React.Component {
    constructor(props) {
        super(props);
        this.size = 0;
        this.state = { courseNames: [], course: '', coursesInfo: []};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    //make API call and add course if it exists
    addCourse(API_URL, callback) {
        fetch(API_URL)
            .then(
                (response) => response.json()
            )
            .then(result => {
                //if the request is valid
                if (result.status == "200") {
                    //modify the selected courses and selected courses info state arrays
                    this.setState( state => {
                        const coursesInfo = this.state.coursesInfo.concat(result.data);
                        const courseNames = this.state.courseNames.concat(this.state.course);
                        return {
                            coursesInfo,
                            courseNames
                        };
                    });
                    this.size++;
                    callback();
                }
            }, 
            (error) => {
                console.log("error", error);
            });
    }

    handleChange(event) {
        this.setState( {course: event.target.value} );
    }
    //when the "Search" button is clicked
    async handleSubmit(event) {
        //prevent default event handler
        event.preventDefault();
        //add the course query to the base URL
        var API_URL = process.env.REACT_APP_API_URL + "/?course=" + this.state.course;
        //send API call to database, add course if it exists
        this.addCourse(API_URL, () => {
            console.log(this.state.coursesInfo);
        });
    }
    //in url, %20 means a space in keyword
    render() {
        return (
                <div>
                    <h1> Choose your courses </h1>
                    <div id = "course_selection_prompt">
                        <form onSubmit = {this.handleSubmit}>
                            <label>
                            Course Name:
                            <input
                            type = "text"
                            id = "course_form"
                            onChange = {this.handleChange}
                            />
                            
                            </label>
                            <input 
                            type="submit" 
                            value="Search" 
                            id = "form_submit"
                            />
                        </form>
                        <h2> You chose: </h2>
                        <ul>
                            {this.state.courseNames.map(item => {
                                return <Course name = {item} key = {item.toString()}></Course>;
                                })}
                        </ul>
                    </div>
                    <button id = "form_complete">
                        Those are all the courses!
                    </button>
                </div>
        );
    }
}

export default Form;