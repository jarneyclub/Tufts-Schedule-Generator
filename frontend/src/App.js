import React from 'react';
import Homepage from "./components/Homepage.js";
import Schedule from "./components/Schedule.js";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

export default class App extends React.Component {

    render() {
        //return <Form/>;
        return (
            <div>
                {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}
                <Switch>
                    <Route path="/schedule">
                        <Schedule />
                    </Route>
                    <Route path="/">
                        <Homepage />
                    </Route>
                </Switch>
            </div>
        );
    }
}