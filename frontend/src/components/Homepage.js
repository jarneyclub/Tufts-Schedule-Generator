import React from 'react';
import CourseNameInput from './views/CourseNameInput.js';
import CoursesSelectedList from './views/CoursesSelectedList.js';
import OptionsMainList from './views/OptionsMainList.js';
import style from './views/styles/Homepage.module.css';

class Homepage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listCourseIDs: null, // all course IDs in semester catalog
        }
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
                if (result.status == "200") {
                    //initialize {listCourseIDs} with list of all course ids
                    this.setState({
                        listCourseIDs: result.list_courseids
                    });
                }
            },
            (error) => {
                console.log("error", error);
            });
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
                    <CoursesSelectedList></CoursesSelectedList>
                    <CourseNameInput listCourseIDs={this.state.listCourseIDs} ></CourseNameInput>
                    <OptionsMainList></OptionsMainList>
                </div>
            );
        }
    }
}

export default Homepage;