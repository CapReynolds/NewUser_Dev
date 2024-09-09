import React, { useState, useEffect } from "react";
//import 'semantic-ui-css/semantic.min.css';
import {Icon, Card, CardContent, CardHeader, CardDescription, CardMeta, Button, Segment, Loader, Image, Dimmer} from "semantic-ui-react";
import {autoCompleteFunc, closeList} from "./AutoComplete";
import imageFile from "./../../public/assets/short-paragraph.png";
import axios from "axios";

const CheckUser = ({isActive, headerTitle, ShowView, allEmployees}) => {

    const [fullName, setFullName] = useState('');
    const [user, setUser] = useState({
        name: '',
        lockedStatus: '',
        passwordLastSet: '',
        isLocked: false,
        accountName: ''
        });
    const [userSet, setuserSet] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const SetEmployeeName = (targetVal) => {
        autoCompleteFunc(targetVal,allEmployees,setFullName,'suggestions2');
    }

    useEffect(() =>{
       
    }, [userSet, user]);

    useEffect(() => {
        let supDiv = document.getElementById('sup');

            document.addEventListener("click",(ev) => {
               
                if(ev.target.id != "suggestion_list"){
                    closeList('suggestions2');
                }
            })
    },[]);

    const SubmitData = async(ev) => {
        ev.preventDefault();

        let subForm = document.getElementById('form');
        let bttn = document.getElementById('button');
        
        subForm.style.opacity = .5;
        bttn.disabled = true;
       
        setIsLoading(true);
        await axios.get('api/checkUserStatus', {params:{val:fullName}}).then(
            response => {
                setIsLoading(false);
                if(response.status === 200 && response.data != ''){
                    
                    bttn.disabled = false;
                    subForm.style.opacity = 1;
                    
                    setUser(user => ({ ...user,
                        name: response.data.Name,
                        lockedStatus: response.data.lockedout.toString().toUpperCase(),
                        passwordLastSet: response.data.PasswordLastSet,
                        isLocked: response.data.lockedout.toString().toUpperCase() === 'TRUE' ? true : false,
                        accountName: response.data.SAMAccountName
                    }));

                  
                    setuserSet(true);
                }
                else{
                    alert('An Error occurred, this user cannot be found');
                    bttn.disabled = false;

                    subForm.style.opacity = 1;
                }
            }
        ).catch((ex)=>{
            console.log(ex);
        }); 
        
    }

    const UnlockAccount = async(ev) => {

        let subForm = document.getElementById('form');
        let bttn = document.getElementById('button');
        
        subForm.style.opacity = .5;
        bttn.disabled = true;
        setIsLoading(true);
        await axios.post('api/unlock_account',user).then(

            response => {
                //console.log(response);
                setIsLoading(true);
                if(response.data.responseStatus === 'Success'){
                 
                    bttn.disabled = false;
                    subForm.style.opacity = 1;

                    alert(response.data.responseData);
                    setUser(user => ({ ...user,
                        isLocked: false,
                        lockedStatus: 'FALSE'
                    }));
                    //window.location.reload(true);
                }
                else{
                    alert(response.data.responseData);
                    bttn.disabled = false;

                    subForm.style.opacity = 1;
                }
            }
        ).catch((ex) =>{
            console.log(ex);
        });
    }

    return (
        <div id = "form2">
            <div class ="menu">    
                <div id="title_div">
                    <h1>{headerTitle}</h1>
                </div>
            </div>
            <div class="form_view">
                <form name="checkUser" onSubmit={SubmitData} autoComplete="off">
                    <div class ="formVal">
                        <div id="sup">
                            <input class="textType2" type="text" id="fullName" placeholder="Enter Name" value={fullName} onChange={e => setFullName(e.target.value)} onKeyUp={ e => SetEmployeeName(e.target.value)} required/>
                        </div>
                        <div>
                            <input id="button" type="submit" value="SUBMIT" />  
                        </div>
                    </div>
                </form>
            </div>
            <div class="result">
                {isLoading  && <Segment id="segment_loader">
                        <Dimmer active inverted ><Loader size='big' content='Loading'/></Dimmer>
                        <Image src={imageFile} />
                        </Segment>}
                {userSet && isLoading === false ? 
                <Card>
                    <CardContent>
                        <CardHeader>
                            {user.name}
                        </CardHeader>
                        <CardMeta>
                           Password Last Set: {user.passwordLastSet}
                        </CardMeta>
                        <CardDescription> 
                            Locked Out: {user.isLocked ? <b style={{color:"red"}}>{user.lockedStatus}</b> : <b style={{color:"green"}}>{user.lockedStatus}</b>}
                        </CardDescription>
                        {user.isLocked ? <Button basic color='green' onClick={UnlockAccount}>
                            Unlock
                        </Button> : ''}
                    </CardContent>
                </Card> : '' }
            </div>
        </div>
    )
}

export default CheckUser;