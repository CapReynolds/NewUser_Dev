import React, { useState, useEffect } from "react";
//import 'semantic-ui-css/semantic.min.css';
import CreateUser from "./CreateUser";
import CheckUser from "./CheckUser";
import DisableUser from "./DisableUser";
import axios from "axios";
import {Icon} from "semantic-ui-react";

const Form = () => {

    const [activeIndex, setActiveIndex] = useState(0);
    const [visible, setVisible] = useState(true);
    const [allUsers, setAllUsers] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    //const [pageView, setPageView] = useState(0);

     function ChangeView(viewVal) {
        
        setActiveIndex(viewVal);
        if(viewVal === 0) 
            setVisible(true);
        else
            setVisible(false);
        
     }

     function ToggleDarkMode() {
        
        //document.getElementById("")
        const body = document.getElementsByTagName("body")[0];
        const form = document.getElementById("form");
        const inputField = document.getElementsByClassName("textType2")[1];

        console.dir(inputField);
        console.dir(body);

        if(darkMode === false){
            body.style.backgroundColor = "black";
            form.style.backgroundColor = "#212120";
            body.style.color = "white";
            inputField.style.backgroundColor = "grey";
            // if(inputField)
            //     inputField.style.backgroundColor = "grey";

            setDarkMode(true);
        }
        else{
            body.style.backgroundColor = "white";
            form.style.backgroundColor = "#f2f2f2";
            body.style.color = "black";
            
            // if(inputField)
            //     inputField.style.backgroundColor = "white";
            
            setDarkMode(false);
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
      }, [visible])

    return (
            //<div class="form_content">
            <div id = "form">
                <div class ="nav">
                <Icon className="icons" circular bordered inverted={activeIndex == 0 ?  true : false} color='white' name='lightbulb outline' onClick={() => ToggleDarkMode()} />
                    
                    <Icon className="icons" circular bordered inverted={activeIndex == 0 ?  true : false} color='green' link name='user plus' onClick={() => ChangeView(0)} />
                    <Icon className="icons" circular inverted ={activeIndex == 1 ? true : false} color='yellow' link name='users' onClick={() => ChangeView(1)} />
                    <Icon className="icons" circular inverted={activeIndex == 2 ? true : false} color='red' link name='user delete' onClick={() => ChangeView(2)} />
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