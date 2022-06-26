//import { Redirect } from 'react-router';
import React, { useState } from "react";

//import App from '../../../../Assignments/stackathon_proj/src/client/components/App';
import './../../public/assets/styles.css';
import axios from 'axios';


const Form = () => {

    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [title, setTitle] = useState('');
    const [legalEntity, setLegalEntity] = useState('');
    const [usrState, setUsrState] = useState('');
    const [supervisor, setSupervisor] = useState('');
    const [department, setDepartment] = useState('');
    const [email, setEmail] = useState('');
    
    const OtherFunc = async (ev) => {
        //ev.preventDefault();
        
        //alert("clicked");
       
        
        let start = await(axios.get('/api/newUser', {
            params: {
                name: name,
                startDate: startDate,
                title: title,
                legalEntity: legalEntity,
                usrState: usrState,
                supervisor: supervisor,
                department: department,
                email: email
            }
        }));
        //console.log(start);

        alert("submitted");

        window.location.reload(false);
    }

    //this.OtherFunc = this.OtherFunc.bind(this);

    return (
        <div id = "form">
         <h1>Create a User</h1>
            <form name="createUser" method="get" onSubmit={OtherFunc} >
                <label>
                    Name: <input type="text" name="fullName" value={name} onChange={e => setName(e.target.value)} required/>
                </label>
                    
                <label>
                    Start Date: 
                    <input type="date" id="start" name="datae"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    min="2022-01-01" max="2024-12-31" />
                </label>
                    
                <label>
                    Title: <input type="text" name="title" value={title} onChange={e => setTitle(e.target.value)} required />
                </label>

                <label>
                    Legal Entitty: <input type="text" name="legalEntity" value={legalEntity} onChange={e => setLegalEntity(e.target.value)} required />
                </label>

                <label>
                    Work State: 
                    <select id="state" onChange={e => setUsrState(e.target.value)}>
                        <option value="New York">New York</option>
                        <option value="California">California</option>
                    </select>
                </label> 

                <label>
                    Supervisor: <input type="text" name="supervisor" value={supervisor} onChange={e => setSupervisor(e.target.value)}required />
                </label>
                
                <label>
                    Department: 
                    <select id="department" onChange={e => setDepartment(e.target.value)}>
                        <option value="Digital Media Production">Digital Media Production</option>
                        <option value="Corporate IT">Corporate IT</option>
                        <option value="Corporate Legal">Corporate Legal</option>
                        <option value="Licensing - Creative Services">Licensing - Creative Services</option>
                    </select>
                </label>
                
                <label>
                    Email Address: <input type="text" name="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </label>
                <div>
                    <input id="button" type="submit" value="Submit" />  
                </div>
            </form>
         
           
            
        </div>
    )
}

export default Form;