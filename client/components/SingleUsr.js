import React, { useState, useEffect } from "react";

import './../../public/assets/styles.css';
import axios from 'axios';
import { Navigate, useNavigate, Redirect } from "react-router-dom";

const SingleUsr = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [title, setTitle] = useState('');
    const [legalEntity, setLegalEntity] = useState('');
    const [usrState, setUsrState] = useState('New York');
    const [supervisor, setSupervisor] = useState('');
    const [department, setDepartment] = useState('Administrators-Users');
    const [email, setEmail] = useState('');
    const [computer, setComputer] = useState('mac');
    const [gender, setGender] = useState('male');
    const [status, setStatus] = useState('full');
    const [alldepts, setAllDepts] = useState([]);
   
    useEffect(() => {
        // declare the data fetching function
        const fetchData = async () => {
          const data = ( await axios.get('api/departments', {params:{val:usrState}})).data;
          setAllDepts(data);
        }
      
        // call the function
        fetchData()
          // make sure to catch any error
          .catch(console.err);
      }, [])
    


    const DisplaySetDepts = async (targetVal) => {
      
        setUsrState(targetVal);
        var username = HttpContext.Current.User.Identity.Name 
        console.log(username, 'Username');
        let all = ( await axios.get('api/departments', {params:{val:targetVal}})).data;
        setAllDepts(all);
    };

 

    const SubmitData = async (ev) => {
        ev.preventDefault();

        let subForm = document.getElementById('form');
        let bttn = document.getElementById('button');
        
        subForm.style.opacity = .5;
        bttn.disabled = true;
       
        let userData = {
            firstName: firstName,
            lastName: lastName,
            startDate: startDate,
            title: title,
            legalEntity: legalEntity,
            usrState: usrState,
            supervisor: supervisor,
            department: department,
            email: email,
            computer: computer, 
            gender: gender,
            accountStatus: status
        }
        
        await axios.post('api/singleUser', userData).then(
            response => {
                if(response.data.responseStatus === 'Success'){
                    bttn.disabled = false;
                    subForm.style.opacity = 1;
                    
                    alert(response.data.responseData);
                    window.location.reload(true);
                }
                else{
                    alert(response.data.responseData);
                    bttn.disabled = false;

                    subForm.style.opacity = 1;
                }
            }).catch((ex)=>{
                console.log(ex);
            }); 
    }
   
    return (
        <form name="createUser" onSubmit={SubmitData} >
             <div id="formVal3">
                <div id="radioID">
                    <div id="radio">
                        <input type="radio" id="status" name="full" value='full' checked={status === 'full'} onChange={e => setStatus(e.target.value)} />
                        <label for="full">Full Time</label>
                    </div>
                    <div id="radio">
                        <input type="radio" id="status" name="nm-marvel" value='nm-marvel' checked={status === 'nm-marvel'} onChange={e => setStatus(e.target.value)} />
                        <label for="non-marvel">Consultant/Non Marvel</label>
                    </div>
                    <div id="radio">
                        <input type="radio" id="status" name="temp" value='temp' checked={status === 'temp'} onChange={e => setStatus(e.target.value)} />
                        <label for="temp">Temp/Intern</label>
                    </div>
                </div>
             </div>
                <div id="formVal">
                    <div id="label">
                        <label>First Name:<red>*</red></label>
                    </div>
                    <div id="values">
                        <input id="textType" type="text" name="firstName" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} required/>
                    </div>
                    <div id="label">
                        <label>Last Name:<red>*</red></label>
                    </div>
                    <div id="values">
                        <input id="textType" type="text" name="lastName" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} required/>
                    </div>
                </div>
                    
                <div id="formVal">
                    <div id="label">
                        <label>Title:<red>*</red></label>
                    </div>
                    <div id="values">
                        <input id="textType"  type="text" name="title" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div id="label">
                        <label>Legal Entity:<red>*</red></label>
                    </div>
                    <div id="values">
                        <input id="textType"  type="text" name="legalEntity" placeholder="Legal Entity" value={legalEntity} onChange={e => setLegalEntity(e.target.value)} required />
                    </div>
                </div>
                <div id="formVal4">
                    <div id="label2">
                        <label>Gender:</label>
                    </div>
                    <div id="radioID">
                        <div id="radio">
                            <input type="radio" id="gender" name="male" value='male' checked={gender === 'male'} onChange={e => setGender(e.target.value)} />
                            <label>Male</label>
                        </div>
                        <div id="radio">
                            <input type="radio" id="gender" name="female" value='female' checked={gender === 'female'} onChange={e => setGender(e.target.value)} />
                            <label>Female</label>
                        </div>
                        <div id="radio">
                            <input type="radio" id="gender" name="nonconforming" value='nonconforming' checked={gender === 'nonconforming'} onChange={e => setGender(e.target.value)} />
                            <label>Non-Conforming</label>
                        </div>
                        <div id="radio">
                            <input type="radio" id="gender" name="other" value='other' checked={gender === 'other'} onChange={e => setGender(e.target.value)} />
                            <label>Other</label>
                        </div>
                    </div>
                </div>
                <div id="formVal2">
                    <div id="container">
                        <div id="label">
                            <label>Work State:</label>
                        </div>
                        <div id="values2">
                            <select id="state" placeholder="State" value={usrState} onChange={e => DisplaySetDepts(e.target.value)}>
                                <option value="New York">New York</option>
                                <option value="California">California</option>
                            </select>
                        </div>
                    </div>
                    <div id="container">
                        <div id="label">
                            <label>Dept:</label>
                        </div>
                        <div id="values2">
                            <select id="department" value={department} onChange={e => setDepartment(e.target.value)}>
                            {alldepts.map((dept) =>(
                                <optgroup label={dept.name}>
                                    {dept.values.map((deptGroup) =>(
                                    <option value={deptGroup.value}>{deptGroup.name}</option>
                                    ))}
                                </optgroup>
                                ))} 
                            
                            </select>
                        </div>
                    </div>
                </div> 
                <div id="formVal">
                    <div id="label">
                        <label>Supervisor:<red>*</red></label>
                    </div>
                    <div id="values2">
                        <input id="textType2"  type="text" name="supervisor" placeholder="Full Name" value={supervisor} onChange={e => setSupervisor(e.target.value)}required />
                    </div>
                </div>
                <div id="formVal">
                    <div id="label">
                        <label>Start Date:<red>*</red></label>
                    </div>
                    <div id="values2">
                        <input id="textType2" type="date" name="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        min="2022-01-01" max="2024-12-31" required />
                    </div>
                </div>
                <div id="formVal">
                    <div id="label">
                        <label>Email Address:</label>
                    </div>
                    <div id="values2">
                        <input id="textType2" type="text" name="email" placeholder="Personal Email Address" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                </div>
                <div id="formVal4">
                    <div id="label2">
                        <label>Computer:</label>
                    </div>
                    <div id="radioID">
                        <div id="radio">
                            <input type="radio" id="computer" name="mac" value='mac' checked={computer === 'mac'} onChange={e => setComputer(e.target.value)} />
                            <label>Mac</label>
                        </div>
                        <div id="radio">
                            <input type="radio" id="windows" name="windows" value='windows' checked={computer === 'windows'} onChange={e => setComputer(e.target.value)} />
                            <label>Windows</label>
                        </div>
                    </div>
                </div>
                <div>
                    <input id="button" type="submit" value="Submit" />  
                </div>
            </form>
    )
}

export default SingleUsr;