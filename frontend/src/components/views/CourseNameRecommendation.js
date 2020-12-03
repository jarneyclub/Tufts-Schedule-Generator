import React from 'react';
//import style from './styles/CourseNameRecommendation.module.css';


class CourseNameRecommendation extends React.Component {
    
    constructor (props) {
        super(props);
        console.log("render");

        this.state = {
            recommendedCourseIDs: null
        }
    }
    // O(k) where k is length of courseID
    recommendSearch(listCourseIDs, courseID) {
        var courseIDsRecommended = [];

        if (courseID != undefined || courseID != null) {
            // recommend if there is at least one character in input
            if (courseID[0] != undefined) {
                let courseIDLength = courseID.length;
                let firstLetter = courseID[0];


                // check there is a course that matches the first letter of user input
                var courseIDsMatchingFirstLetter = listCourseIDs[firstLetter];
                if (courseIDsMatchingFirstLetter != undefined) {

                    // iterate over every course ID with first letter matching input
                    for (let index = 0; index < courseIDsMatchingFirstLetter.length; index++) {
                        let currentCourseIDMatching = courseIDsMatchingFirstLetter[index];

                        // if the beginning substring of matched Course ID is equal to the input, recommend course id
                        let substr = "";
                        for (let i = 0; i < courseIDLength; i++) {
                            substr += currentCourseIDMatching[i];
                        }

                        if (substr == courseID) {
                            courseIDsRecommended.push(courseIDsMatchingFirstLetter[index]);

                            // cap recommendation to reduce lag
                            if (courseIDsRecommended.length > 20)
                                break
                        }

                    }

                    if (courseIDsRecommended.length == 1) {
                        courseIDsRecommended = [];
                    }

                }
                //console.log(courseIDsRecommended);
            }
            else {
                courseIDsRecommended = [];
            }
        }
        else {
            courseIDsRecommended = [];
        }

        return courseIDsRecommended
    }

    render() {
        let currentInput = this.props.currentInput;
        let listCourseIDs = this.props.listCourseIDs;
        console.log("rendeing")
        var recommendedCourseIDs = this.recommendSearch(listCourseIDs, currentInput);
        // if (this.props.currentInput.length > 2) {
        //     console.log(this.props.currentInput)
        // }
        // else {
        //     console.log(this.props.currentInput)
        //     recommendedCourseIDs = this.recommendSearch(this.state.recommendedCourseIDs, currentInput);
        //     this.setState({ recommendedCourseIDs: recommendedCourseIDs });
        // }

        console.log(recommendedCourseIDs);

        return(
            <datalist id="recommendedCourseIDs">
                {recommendedCourseIDs.map(function (id) {
                    return <option key={id} value={id} ></option>
                })}
            </datalist>
        );
    }

}
export default CourseNameRecommendation;