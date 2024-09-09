import TabbedContent from "./TabbedContent_old";
import React, { useState } from "react";
import imageFile from "./../../public/assets/short-paragraph.png";
//import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';

const MultiDisable = () => {

    const [file, setFile] = useState('');

    const validateFile = (fileValue) =>{
        //console.log("validating")
        let flag = true;
        if(!fileValue.includes('.csv')){
            //alert("Please select a CSV file");
            window.location.reload(true);
            flag = false;
        }
        //console.log(fileValue);
        return flag
    }

    const handleFileChange = (ev) => {
        if(validateFile(ev.target.value)){
            setFile(ev.target.files[0]);
        }
    }

    const SubmitData = async (ev) => {
        ev.preventDefault();

    
        const formData = new FormData();
        formData.append("file", file);

        //window.location.reload(false);

       if(file != ''){
            await axios.post('/api/multi_disable_account', formData, {
                headers: {
                    "Content-type": "multipart/form-data"
                }
            }).then(
                alert("CSV Uploaded"),
                response => {
                    //console.log(response.data);
                    //window.location.reload(true);
                }).catch((ex)=>{
                    console.log(ex);
            }); 
       }
       else {
         alert("Please Upload a CSV");
         
        }
        //window.location.reload(false);
    }

    return (
        <form name="deleteUser" onSubmit={SubmitData} autoComplete="off">
            <div class="formVal5">
                <fieldset >
                    <legend>
                        Please upload a CSV with users to disable.
                    </legend>
                    <div class="formVal6">
                        <div id="formVal0">
                            <input link type="file" id="fileInput" name="file" onChange={handleFileChange} accept=".csv" />
                        </div>
                    </div>
                </fieldset>
                <div className="submitButtonDiv">
                    <input id="button" type="submit" value="SUBMIT" />  
                </div>
            </div>
        </form>
    )
}

export default MultiDisable;