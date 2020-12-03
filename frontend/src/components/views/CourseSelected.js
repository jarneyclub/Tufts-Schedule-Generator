import React from 'react';
import style from './styles/CourseSelected.module.css';

class CourseSelected extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSubmit(event) {
        //prevent default event handler
        event.preventDefault();
    }

    render() {
        return (
            <div className={style.course}>
                {this.props.courseID}
            </div>
        );
    }
}

export default CourseSelected;