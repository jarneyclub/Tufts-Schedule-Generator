import React from 'react';
import ReactDOM from 'react-dom';
import style from './styles/CourseNameInput.module.css';

class CourseNameInput extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
    }

    handleSubmit(event) {
        //prevent default event handler
        event.preventDefault();

    }

    render() {
        return (
            <div className = {style.container}>
                <h1>Choose a course</h1>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <div>
                            <input className={style.courseInput} type="text" placeholder="COMP-0015"/>
                        </div>
                        <div>
                            <input className={style.courseSubmit} type="submit" value="Generate"/>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default CourseNameInput;