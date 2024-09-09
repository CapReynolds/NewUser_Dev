import TabbedContent from "./TabbedContent_old";
import React, { useState } from "react";
import imageFile from "./../../public/assets/short-paragraph.png";
//import 'semantic-ui-css/semantic.min.css';
import {Confirm, Dimmer, Loader, Image, Segment} from "semantic-ui-react";
import axios  from "axios";

const SingleDisable = () => {

    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [isEnabled, setIsEnabled] = useState(true);
    const [confirmWindow, setConfirmWindow] = useState({open: false});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (accountName) => {
        setUsername(accountName);
    }

    const SubmitData = async(ev) =>{
        ev.preventDefault();
        setIsLoading(true);
        await axios.get('api/getAccountName', {params:{val:username}}).then(
            response => {
                
                setIsLoading(false);
                if(response.status === 200 && response.data != 'NOT FOUND\n'){
                    //if user is not disabled
                    console.log(response.data);
                    if (response.data.Enabled === true)
                        setIsEnabled(true)
                    else
                        setIsEnabled(false)
                    

                    setDisplayName(response.data.Name);
                    ShowWindow();
                }
                else{
                    alert('An Error occurred, this user cannot be found');
                }
            }
        ).catch((ex)=>{
            console.log(ex);
        }); 
    }

    const ShowWindow = () =>{
        setConfirmWindow({open: true});
    }

    const handleConfirm = async() => {
        setConfirmWindow({open: false});

        if(isEnabled === true){
            let user = {username: username};
            setIsLoading(true);
            await axios.post('/api/DisableUser', user).then(
                response => {
                    //console.log(response.data);
                    setIsLoading(false);
                    alert(response.data.responseData);
                    window.location.reload(true);
                }
            ).catch((ex)=>{
                console.log(ex);
            });
        }
        

    }

    const handleCancel = () => {
        setConfirmWindow({open: false});
    }

    return (
        <div id = "form2">
            <div class ="menu">
                <div id="title_div">
                  <h4>Enter the account name that you would like to disable.</h4>
                </div>
            </div>
            {isLoading && <Segment id="segment_loader"><Dimmer active inverted ><Loader size='big' content='Loading'/></Dimmer><Image src={imageFile} /></Segment>}
            {isLoading === false && 
            <div class="form_view">
                <form name="DisableUser" onSubmit={SubmitData} autoComplete="off">
                    <div class="formVal">
                        <input id="accountName" class="textType2" placeholder="Account Name" type="text" value={username} onChange={(e)=>handleChange(e.target.value)} />
                        <input id="button" name="submit" type="submit" value="SUBMIT" />
                        <Confirm 
                            open={confirmWindow.open}
                            content={isEnabled ? 'Are you sure you would like to disable: ' + displayName + '?' : `This user is already disabled.`}
                            onCancel={handleCancel}
                            onConfirm={handleConfirm}
                            confirmButton="Confirm"
                        />
                    </div>
                </form>
            </div>}
        </div>
    )
}

export default SingleDisable;