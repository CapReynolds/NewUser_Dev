import React, { useState, useEffect } from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

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
    const [pernr, setPernr] = useState('');


    const [displayVpnGroups, setDisplayVpnGroups] = useState([]);
    const [displayOktaGroups, setDisplayOktaGroups] = useState([]);
    const [oktaUserGroups, setOktaUserGroups] = useState([]);
    const [vpnUserGroups, setVpnUserGroups] = useState([]);
   
    const animatedComponents = makeAnimated();

    //for Display Data
    useEffect(() => {
        // declare the data fetching function
        const fetchData = async () => {
            const data = ( await axios.get('api/departments', {params:{val:usrState}})).data;
            setAllDepts(data);

            let allOkta = ( await axios.get('api/oktaGroups')).data;
            setDisplayOktaGroups(allOkta);

            let allGroups = ( await axios.get('api/VPNGroups')).data;
            setDisplayVpnGroups(allGroups);

        }

        // call the function
        fetchData()
          // make sure to catch any error
          .catch(console.err);
      }, [])
    
    //for Okta Groups in state
    useEffect(() => {
        //console.log(oktaUserGroups, "  okta groups in use effect")
        //console.log(vpnUserGroups, " vpn groups in use effect")
    }, [oktaUserGroups, vpnUserGroups])

    //for VPN Groups in state
    // useEffect(() => {
    //     // declare the data fetching function
    //     console.log(vpnUserGroups, " vpn groups in use effect")
    // }, [vpnUserGroups])

    const DisplaySetDepts = async (targetVal) => {
      
        setUsrState(targetVal);
        var username = HttpContext.Current.User.Identity.Name 
        console.log(username, 'Username');
        let all = ( await axios.get('api/departments', {params:{val:targetVal}})).data;
        setAllDepts(all);
    };

    const chkPernr = async (targetVal) => {
        if (targetVal != ''){
            if(!isNaN(targetVal) && targetVal.length >= 0){
                setPernr(targetVal)
            }
        }
    }

    const handleChange_okta = (selectedOkta) => {
        console.log("This is selected: ", selectedOkta);
        let tmp = selectedOkta;
        setOktaUserGroups([...selectedOkta]);
        console.log(oktaUserGroups, " okta user groups");
        
    }

    const handleChange_vpn = (selectedVPN) => {
        console.log("This is selected: ", selectedVPN);
        let tmp = selectedVPN;
        setVpnUserGroups([...selectedVPN]);
        console.log(vpnUserGroups, "  vpn user groups");
        
    }

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
            pernr: pernr,
            accountStatus: status,
            oktaUserGroups: oktaUserGroups,
            vpnUserGroups: vpnUserGroups
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
   
    //console.log(selectedGroup, " selected group");


    return (

        <form name="createUser" onSubmit={SubmitData} autoComplete="on">
             <div class="formVal3">
                <fieldset>
                    <legend> Account Status </legend>
                    <div class="radioID">
                        <div class="radio">
                            <input type="radio" id="full" name="full" value='full' checked={status === 'full'} onChange={e => setStatus(e.target.value)} />
                            <label for="full">Full Time</label>
                        </div>
                        <div class="radio">
                            <input type="radio" id="nm-marvel" name="nm-marvel" value='nm-marvel' checked={status === 'nm-marvel'} onChange={e => setStatus(e.target.value)} />
                            <label for="nm-marvel">Consultant/Non Marvel</label>
                        </div>
                        <div class="radio">
                            <input type="radio" id="temp" name="temp" value='temp' checked={status === 'temp'} onChange={e => setStatus(e.target.value)} />
                            <label for="temp">Temp/Intern</label>
                        </div>
                    </div>
                </fieldset>
             </div>
                <div class="formVal">
                    <div class="label">
                        <label for="firstName">First Name:<red>*</red></label>
                    </div>
                    <div class="values">
                        <input class="textType" type="text" id="firstName" name="firstName" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} autoComplete="given-name" required/>
                    </div>
                    <div class="label">
                        <label for="lastName">Last Name:<red>*</red></label>
                    </div>
                    <div class="values">
                        <input class="textType" type="text" id="lastName" name="lastName" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} autoComplete="family-name" required/>
                    </div>
                </div>
                    
                <div class="formVal">
                    <div class="label">
                        <label for="title">Title:<red>*</red></label>
                    </div>
                    <div class="values">
                        <input class="textType"  type="text" id="title" name="title" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} autoComplete="organization-title" required />
                    </div>
                    <div class="label">
                        <label for="legalEntity">Legal Entity:<red>*</red></label>
                    </div>
                    <div class="values">
                        <input class="textType"  type="text" id="legalEntity" name="legalEntity" placeholder="Legal Entity" value={legalEntity} onChange={e => setLegalEntity(e.target.value)} autoComplete="organization" required />
                    </div>
                </div>
                <div class="formVal4">
                    <fieldset>
                        <legend> Gender </legend>
                        <div class="radioID">
                            <div class="radio">
                                <input type="radio" id="male" name="male" value='male' checked={gender === 'male'} onChange={e => setGender(e.target.value)} />
                                <label for="male">Male</label>
                            </div>
                            <div class="radio">
                                <input type="radio" id="female" name="female" value='female' checked={gender === 'female'} onChange={e => setGender(e.target.value)} />
                                <label for="female">Female</label>
                            </div>
                            <div class="radio">
                                <input type="radio" id="nonconforming" name="nonconforming" value='nonconforming' checked={gender === 'nonconforming'} onChange={e => setGender(e.target.value)} />
                                <label for="nonconforming">Non-Conforming</label>
                            </div>
                            <div class="radio">
                                <input type="radio" id="other" name="other" value='other' checked={gender === 'other'} onChange={e => setGender(e.target.value)} />
                                <label for="other">Other</label>
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div class="formVal2">
                    <div class="container">
                        <div class="label">
                            <label for="state">Work State:</label>
                        </div>
                        <div class="values2">
                            <select id="state" placeholder="State" value={usrState} onChange={e => DisplaySetDepts(e.target.value)}>
                                <option value="New York">New York</option>
                                <option value="California">California</option>
                            </select>
                        </div>
                    </div>
                    <div class="container">
                        <div class="label">
                            <label for="department">Dept:</label>
                        </div>
                        <div class="values2">
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
                <div class="formVal">
                    <div class="label">
                        <label for="supervisor">Supervisor:<red>*</red></label>
                    </div>
                    <div class="values2">
                        <input class="textType2" type="text" id="supervisor" name="supervisor" placeholder="Full Name" value={supervisor} onChange={e => setSupervisor(e.target.value)} autoComplete="name" required />
                    </div>
                </div>
                <div class="formVal">
                    <div class="label">
                        <label for="date">Start Date:<red>*</red></label>
                    </div>
                    <div class="values2">
                        <input class="textType2" type="date" id="date" name="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        min="2022-01-01" max="2024-12-31" required />
                    </div>
                </div>
                <div class="formVal">
                    <div class="label">
                        <label for="email">Email Address:</label>
                    </div>
                    <div class="values2">
                        <input class="textType2" type="text" id="email" name="email" placeholder="Personal Email Address" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                    </div>
                </div>
                <div class="formVal">
                    <div class="label">
                        <label for="pernr">PERNR:</label>
                    </div>
                    <div class="values2">
                        <input class="textType2" type="text" id="pernr" name="pernr" placeholder="PERNR If Available" value={pernr} onChange={e => setPernr(e.target.value)} />
                    </div>
                </div>
                <div class="formVal4">
                    <fieldset>
                        <legend>Computer</legend>
                        <div class="radioID">
                            <div class="radio">
                                <input type="radio" id="mac" name="mac" value='mac' checked={computer === 'mac'} onChange={e => setComputer(e.target.value)} />
                                <label for="mac">Mac</label>
                            </div>
                            <div class="radio">
                                <input type="radio" id="windows" name="windows" value='windows' checked={computer === 'windows'} onChange={e => setComputer(e.target.value)} />
                                <label for="windows">Windows</label>
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div class="formVal4">
                <fieldset>
                        <legend> VPN Groups </legend>
                        <div class="selectID">
                            <div class="select_">
                                <Select 
                                    closeMenuOnSelect={false}
                                    components={animatedComponents}
                                    isMulti
                                    options={displayVpnGroups}
                                    onChange={handleChange_vpn}
                                />
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div className="formVal4">
                    <fieldset>
                        <legend> Okta Groups </legend>
                        <div class="selectID">
                            <div class="select_">
                                <Select 
                                    closeMenuOnSelect={false}
                                    components={animatedComponents}
                                    isMulti
                                    options={displayOktaGroups}
                                    onChange={handleChange_okta}
                                />
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div>
                    <input id="button" type="submit" value="Submit" />  
                </div>
            </form>
    )
}

export default SingleUsr;