import React from 'react';
import style from './styles/OptionMainButton.module.css';

class OptionMainButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option: "default"
        };
    }

    handleSubmit(event) {
        //prevent default event handler
        event.preventDefault();
    }
    render() {
        return (
            <button className={style.button}>
                {this.state.option}
            </button>
        );
    }
}

export default OptionMainButton;