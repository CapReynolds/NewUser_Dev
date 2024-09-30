import React, { useState, useEffect, useContext } from "react";
//import 'semantic-ui-css/semantic.min.css';
import CreateUser from "./CreateUser";
import CheckUser from "./CheckUser";
import DisableUser from "./DisableUser";
import axios from "axios";
import {Icon} from "semantic-ui-react";
import { DarkModeContext } from "./DarkModeContext";

const Form = () => {

    const [activeIndex, setActiveIndex] = useState(0);
    const [visible, setVisible] = useState(true);
    const [allUsers, setAllUsers] = useState([]);
    //const [darkMode, setDarkMode] = useState(false);
    //const [pageView, setPageView] = useState(0);
    const {darkMode, setDarkMode } = useContext(DarkModeContext);
    
     function ChangeView(viewVal) {
        
        setActiveIndex(viewVal);
        if(viewVal === 0) 
            setVisible(true);
        else
            setVisible(false);
        
     }

     function ToggleDarkMode() {
        
        //document.getElementById("")
        //const body = document.getElementsByTagName("body")[0];

        //body.setAttribute('class', 'bodyLight');
        //const form = document.getElementById("form");
        //const inputField = document.getElementsByClassName("textType2")[1];

        //console.dir(body);

        if(darkMode === false){
            //const body = document.getElementsByTagName("body")[0];
            //body.style.backgroundColor = "black";
            //body.style.color = "white";

            setDarkMode(true);
            //setBodyClass('bodyDark');

            //const body = document.getElementsByTagName("body")[0];
            //body.setAttribute('class', 'bodyDark');
            //body.style.backgroundColor = "black";
            //body.style.color = "white";
        }
        else{
            //const body = document.getElementsByTagName("body")[0];
            //body.style.backgroundColor = "white";
            //body.style.color = "black";
            
            setDarkMode(false);
            //setBodyClass('bodyLight');

            //const body = document.getElementsByTagName("body")[0];
            //body.setAttribute('class', 'bodyLight');


            //body.style.backgroundColor = "white";
            //body.style.color = "black";
        }
     }

     //for Display Data
    useEffect(() => {
        // declare the data fetching function
        const fetchData = async () => {
            
            let all_users = ( await axios.get('api/managerLookup')).data;
            setAllUsers(all_users);
           
            
        }

        // call the function
        fetchData()
          // make sure to catch any error
          .catch(console.err);
      }, [visible]);

    useEffect(()=>{
        const body = document.getElementsByTagName("body")[0];
        darkMode ? body.setAttribute('class', 'bodyDark') : body.setAttribute('class', 'bodyLight');
    },[darkMode]);

    return (
            //<div class="form_content">
            <div id = "form" class = {darkMode  ? "formDark" : "formLight"}>
                <div class ="nav">
                    <div class ="nav1">
                        <Icon className="icons" circular bordered color='orange' link name='lightbulb' onClick={() => ToggleDarkMode()} />
                    </div>
                    <div class ="nav2">
                        <Icon className="icons" circular bordered inverted={activeIndex == 0 ?  true : false} color='green' link name='user plus' onClick={() => ChangeView(0)} />
                        <Icon className="icons" circular bordered inverted ={activeIndex == 1 ? true : false} color='yellow' link name='users' onClick={() => ChangeView(1)} />
                        <Icon className="icons" circular bordered inverted={activeIndex == 2 ? true : false} color='red' link name='user delete' onClick={() => ChangeView(2)} />
                    </div>
                </div>
                    {activeIndex == 0 ? <CreateUser 
                        headerTitle="Create a New User"
                        isActive={activeIndex === 0}
                        allEmployees={allUsers}
            /> : activeIndex == 1 ? <CheckUser
                    headerTitle="Check the Status of a User"
                    isActive={activeIndex === 1}
                    allEmployees={allUsers}
            /> :
                <DisableUser
                    headerTitle="Disable a User"
                    isActive={activeIndex === 2}
                />
                }
            </div>
    )
}

export default Form;