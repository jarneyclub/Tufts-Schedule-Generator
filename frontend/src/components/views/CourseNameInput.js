import React from 'react';
import ReactDOM from 'react-dom';
import style from './styles/CourseNameInput.module.css';
import CourseNameRecommendation from './CourseNameRecommendation';
import CourseSelected from './CourseSelected';

class CourseNameInput extends React.Component {
    
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            listCourseIDs: props.listCourseIDs, // all course IDs in semester catalog (mapped alphabetically)
            currentInput: null,
            recommendedCourseIDs: null,
            handleSubmit: props.onSubmit
        }
        console.log(props.onSubmit);
        // this.handleSubmit = this.handleSubmit.bind(this);
        this.recommendSearch = this.recommendSearch.bind(this);
    }

    /* TODO: improve coverage beyond first letter */
    /* recommendSearch() is defined in this compoenent because 
    it is the event listener for input change*/
    async recommendSearch() {
        let nameField = document.getElementById("input");
        let name = nameField.value.toUpperCase(); // get user input
        let nameLength = name.length;
        this.setState((state) => ({ currentInput: name })); // update state
        
        // recommend if there is at least one character in input
        if (name[0] != undefined) {
            let firstLetter = name[0];

            var courseIDsRecommended = [];
            
            // check there is a course that matches the first letter of user input
            var courseIDsMatchingFirstLetter = this.state.listCourseIDs[firstLetter];
            if (courseIDsMatchingFirstLetter != undefined) {
                // iterate over every course ID with first letter matching input
                for (let index in courseIDsMatchingFirstLetter) {
                    let currentCourseIDMatching = courseIDsMatchingFirstLetter[index];

                    // if the beginning substring of matched Course ID is equal to the input, recommend course id
                    let substr = await currentCourseIDMatching.substring(0, nameLength);
                    if ( substr == name ) {
                        courseIDsRecommended.push(courseIDsMatchingFirstLetter[index]);
                    }
                }
                this.setState((state) => ({ recommendedCourseIDs: courseIDsRecommended })); // update state
            }
            //console.log(courseIDsRecommended);
        }
        else {
            this.setState((state) => ({ recommendedCourseIDs: null })); // update state
        }
    }

    render() {
        if (this.state.currentInput == null || this.state.currentInput == undefined || this.state.currentInput == "") {
            console.log("currentInput is null right now");
            return (
                <div className={style.container}>
                    <h1>Choose a course</h1>
                    <div>
                        <form onSubmit={this.props.handleSubmit}>
                            <div>
                                <input onChange={this.recommendSearch} list='recommendedCourseIDs' id="input" className={style.courseInput} type="text" autoComplete = "off" placeholder="COMP-0015" />
                            </div>
                            <div>
                                <input className={style.courseSubmit} type="submit" value="Generate" />
                            </div>
                        </form>
                    </div>
                </div>
            );
        }
        else {
            console.log("currentInput is defined right now");
            return (
                <div className={style.container}>
                    <h1>Choose a course</h1>
                    <div>
                        <form onSubmit={this.props.handleSubmit}>
                            <div>
                                <input onChange={this.recommendSearch} list='recommendedCourseIDs' id="input" className={style.courseInput} type="text" autoComplete="off" placeholder="COMP-0015" />
                                <CourseNameRecommendation recommendedCourseIDs = {this.state.recommendedCourseIDs} ></CourseNameRecommendation>
                            </div>
                            <div>
                                <input className={style.courseSubmit} type="submit" value="Generate" />
                            </div>
                        </form>
                    </div>
                </div>
            );
        }
    }
}

export default CourseNameInput;