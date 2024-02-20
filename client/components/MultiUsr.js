import axios from "axios";
import React, { useState } from "react";
import './../../public/assets/styles.css';
import Form from "./Form";

const MultiUsr = () => {

    const [file, setFile] = useState('');

    const validateFile = (fileValue) =>{
        console.log("validating")
        let flag = true;
        if(!fileValue.includes('.csv')){
            alert("Please select a CSV file");
            //window.location.reload(true);
            flag = false;
        }
        console.log(fileValue);
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

        window.location.reload(false);

       if(file != ''){
            await axios.post('/api/multiUser', formData, {
                headers: {
                    "Content-type": "multipart/form-data"
                }
            }).then(
                alert("CSV Uploaded"),
                response => {
                    console.log(response.data);
                    
                }).catch((ex)=>{
                    console.log(ex);
            }); 
       }
       else {
         alert("Please Upload a CSV");
         
        }
        window.location.reload(false);
    }

    return (
        <form name="createUser" onSubmit={SubmitData} autoComplete="off">
            <h3>
                Please upload a CSV file
            </h3>
            <h5>
                Click <a href='/api/download'> Here </a>  to download a template file
            </h5>
                <div id="formVal">
                    <input type="file" id="fileInput" name="file" onChange={handleFileChange} accept=".csv" />
                </div>
                <div>
                    <input id="button" type="submit" value="Submit" />  
                </div>
            </form>
    )
}

export default MultiUsr;