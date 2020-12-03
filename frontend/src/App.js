import React from 'react';
import Form from "./components/views/form.js"
import Homepage from "./components/Homepage.js";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

export default class App extends React.Component {

    render() {
        //return <Form/>;
        return <Homepage/>;
    }
}