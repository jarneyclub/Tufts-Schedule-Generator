import React from 'react';
import style from './styles/OptionsMainList.module.css';
import OptionMainButton from './OptionMainButton.js';

class OptionsMainList extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSubmit(event) {
        //prevent default event handler
        event.preventDefault();
    }

    render() {
        return (
            <div className={style.container}>
                <OptionMainButton></OptionMainButton>
                <OptionMainButton></OptionMainButton>
                <OptionMainButton></OptionMainButton>
            </div>
        );
    }
}

export default OptionsMainList;