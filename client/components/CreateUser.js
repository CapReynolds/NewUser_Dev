import TabbedContent_old from "./TabbedContent_old";
import TabbedContent from "./TabbedContent";
import SingleUsr from "./SingleUsr";
import MultiUsr from "./MultiUsr";
import React, { useState } from "react";
//import 'semantic-ui-css/semantic.min.css';
import {Icon} from "semantic-ui-react";

const CreateUser = ({isActive, headerTitle, ShowView, allEmployees}) => {

    return (
        <div id = "form2">
            <div class ="menu">
                <div id="title_div">
                    <h1>{headerTitle}</h1>
                </div>
            </div>
            <div class="form_view">
                {/* <TabbedContent allEmployees={allEmployees} />  */}
                <TabbedContent passedComponenet1={<SingleUsr allEmployees={allEmployees}/>} passedComponenet2={<MultiUsr />}  /> 
                
            </div>
        </div>
    )
}

export default CreateUser;