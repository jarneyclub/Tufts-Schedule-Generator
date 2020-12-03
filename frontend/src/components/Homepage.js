import React from 'react';
import CoursesSelectedList from './views/CoursesSelectedList.js';
import CourseNameRecommendation from './views/CourseNameRecommendation';
import OptionsMainList from './views/OptionsMainList.js';
import style from './views/styles/Homepage.module.css';

class Homepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listCourseIDs: null, // all course IDs in semester catalog (mapped first letter)
            currentInput: null,
            recommendedCourseIDs: null,
            selectedCourses: []
        }

        this.handleAdd = this.handleAdd.bind(this);
        this.recommendSearch = this.recommendSearch.bind(this);
    }

    // O(n)
    checkCourseID(courseID) {
        if (courseID != "") {
            let firstLetter = courseID[0];
            let listMatches = this.state.listCourseIDs[firstLetter];
            if (listMatches != undefined) {
                let exists = false;
                for (let index in listMatches) {
                    if (listMatches[index] == courseID)
                        exists = true;
                }
                return exists;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    handleAdd(event) {
        //prevent default event handler
        event.preventDefault();

        let nameField = document.getElementById("input");
        let name = nameField.value.toUpperCase(); // get user input

        // Check existence of user input and UPDATE STATE selectedCourses 
        if (this.checkCourseID(name)) {
            var arrayJoined = this.state.selectedCourses.concat(name);
            this.setState({ selectedCourses: arrayJoined });
        }

        nameField.value = "";
    }

    handleGenerate() {
        var selectedCourses = this.state.selectedCourses;
        console.log("handling generate");
    }

    componentDidMount() {
        // initialize {listCourseIDs} in this component's state
        this.getListCourseIDs();
    }
    
    async getListCourseIDs() {
        var API_URL = process.env.REACT_APP_API_URL + "/courses/list";
        fetch(API_URL)
            .then(
                (response) => response.json()
            )
            .then(result => {
                //if the request is valid
                if (result.status === "200") {
                    this.mapCourseIDs(result.list_courseids);
                }
            },
            (error) => {
                console.log("error", error);
        });
    }

    // O(n)
    mapCourseIDs(list_courseids) {
        var mapAlphabetical = {};
        for (let index in list_courseids) {
            let firstLetter = list_courseids[index][0];

            if (mapAlphabetical[firstLetter] == undefined) {
                mapAlphabetical[firstLetter] = [];
            }

            mapAlphabetical[firstLetter].push(list_courseids[index]);
        }
        //initialize {listCourseIDs} with list of all course ids
        this.setState({
            listCourseIDs: mapAlphabetical
        });
    }

    /* CourseID input scripts */

    /* TODO: improve coverage beyond first letter */
    /* TODO: move script to recommendation */
    /* recommendSearch() is defined in this compoenent because 
    it is the event listener for input change*/
    async recommendSearch() {
        let nameField = document.getElementById("input");
        let name = nameField.value.toUpperCase(); // get user input

        this.setState((state) => ({ currentInput: name })); // update state (currentInput)
    }

    // todo: link
    handleChange() {
        let nameField = document.getElementById("input");
        let name = nameField.value.toUpperCase(); // get user input
        let nameLength = name.length;
        this.setState((state) => ({ currentInput: name })); // update state (currentInput)
    }


    render() {
        /* asynchronously render home page after getting courseIDs*/
        if (this.state.listCourseIDs == null) {
            // render loading state...
            return (
                <div className={style.container}>
                    Loading...
                </div>
            );
        }
        else {
            // render real UI..
                return (
                    <div className={style.container}>
                        <CoursesSelectedList handleGenerate = {this.handleGenerate.bind(this)} selectedCourses={this.state.selectedCourses}>
                            <input type = "submit"></input>
                        </CoursesSelectedList>
                        <div className={style.containerInput}>
                            <h1>Choose a course</h1>
                            <div>
                                <form onSubmit={this.handleAdd}>
                                    <div>
                                        <input onChange={this.recommendSearch} list='recommendedCourseIDs' id="input" className={style.courseInput} type="text" autoComplete="off" placeholder="COMP-0015" />
                                        <CourseNameRecommendation listCourseIDs = {this.state.listCourseIDs} currentInput = {this.state.currentInput}></CourseNameRecommendation>
                                    </div>
                                    <div>
                                        <input className={style.courseSubmit} type="submit" value="Add" />
                                    </div>
                                </form>
                            </div>
                        </div>
                        <OptionsMainList></OptionsMainList>
                    </div>
                );
        }
    }
}

export default Homepage;