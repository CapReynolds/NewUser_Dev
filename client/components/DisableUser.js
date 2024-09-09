import React, { useState } from "react";
import TabbedContent from "./TabbedContent";
import SingleDisable from "./SingleDisable";
import MultiDisable from "./MultiDisable";
//import 'semantic-ui-css/semantic.min.css';

const DisableUser = ({isActive, headerTitle,}) => {

    const [username, setUsername] = useState('');

    return (
        <div id = "form2">
            <div class ="menu">
                <div id="title_div">
                    <h1>{headerTitle}</h1>
                </div>
            </div>
            <div class="form_view">
                <TabbedContent passedComponenet1={<SingleDisable />} passedComponenet2={<MultiDisable />}  /> 
            </div>
        </div>
    )
}

export default DisableUser;