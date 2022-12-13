// Server setup
const express = require("express");
const app = express();
const { urlencoded } = require('express');
const config = require("../config");

const {index: { port, local, consoleMsg,multiUserScript, singleUserScript}} = config;
app.use(express.json());
app.use(urlencoded({ extended: false }));

const path = require("path");
const { start } = require("repl");
const fs = require('fs');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

const PORT = process.env.PORT || port;

app.use(express.static(path.join(__dirname, "../public")));

//for reading in a file
const fileUpload = require("express-fileupload");
app.use(fileUpload());

app.get('/api/departments', async(req,res,next)=> {
    try{

        const {val} = req.query;
        let depts = '';

        
        const allDepartmentsLA = [
            {
                name:"Administrators",
                values: [
                    {name: "Administrators", value: "Administrators-Users"}
                ]
            },
            {
                name:"Animation",
                values: [
                    {name: "Executive", value: "Animation-Executive"},
                    {name: "IT", value: "Animation-IT"},
                    {name: "Marketing", value: "Animation-Marketing"},
                    {name: "Office Administration", value: "Animation-Office Administration"},
                    {name: "Prod Direct", value: "Animation-Prod Direct"},
                    {name: "Production", value: "Animation-Production"},
                    {name: "Office Administration", value: "Animation-Office Administration"}
                    ]
            },
            {
                name:"Corporate",
                values: [
                    {name: "Brand and Franchise Management", value: "Corporate-Brand and Franchise Management"},
                    {name: "Digital Technology", value: "Corporate-Digital Technology"},
                    {name: "Executive", value: "Corporate-Executive"},
                    {name: "Finance and Accounting", value: "Corporate-Finance and Accounting"},
                    {name: "Information Technology", value: "Corporate-Information Technology"},
                    {name: "Legal", value: "Corporate-Legal"},
                    {name: "Office Administration", value: "Corporate-Office Administration"}
                    ]
            },
            {
                name:"Digital Media",
                values: [
                    {name: "Editorial", value: "Digital Media-Editorial"},
                    {name: "Executive", value: "Digital Media-Executive"},
                    {name: "Game Development", value: "Digital Media-Game Development"},
                    {name: "Production", value: "Digital Media-Production"},
                    {name: "Sales and Distribution", value: "Digital Media-Sales and Distribution"},
                    {name: "Social", value: "Digital Media-Social"}
                    ]
            },
            {
                name:"Interactive",
                values: [
                    {name: "Game Development", value: "Interactive-Game Development"},
                    {name: "Sales and Distribution", value: "Interactive-Sales and Distribution"}
                    ]
            },
            {
                name:"Licensing",
                values: [
                    {name: "Brand Assurance", value: "Licensing-Brand Assurance"},
                    {name: "Creative Services", value: "Licensing-Creative Services"},
                    {name: "Merchandising", value: "Licensing-Merchandising"},
                    {name: "Sales", value: "Licensing-Sales"}
                    ]
            },
            {
                name:"Partnerships",
                values: [
                    {name: "Events", value: "Partnerships-Events"},
                    {name: "IT", value: "Partnerships-IT"},
                    {name: "Legal", value: "Partnerships-Legal"},
                    {name: "Office Administration", value: "Partnerships-Office Administration"},
                    {name: "Operations", value: "Partnerships-Operations"},
                    {name: "Project Management", value: "Partnerships-Project Management"},
                    {name: "Sales", value: "Partnerships-Sales"}
                    ]
            },
            {
                name:"Publishing",
                values: [
                    {name: "Advertising Sales", value: "Publishing-Advertising Sales"},
                    {name: "Custom Solutions Sales", value: "Publishing-Custom Solutions Sales"},
                    {name: "Editorial", value: "Publishing-Editorial"},
                    {name: "Manufacturing", value: "Publishing-Manufacturing"},
                    {name: "Productions", value: "Publishing-Productions"},
                    {name: "Publisher", value: "Publishing-Publisher"},
                    {name: "Sales", value: "Publishing-Sales"}
                    ]
            }

        ];

        const allDepartmentsNY = [
            {
                name:"Administrators",
                values: [
                    {name: "Administrators", value: "Administrators-Users"}
                ]
            },
            {
                name:"Animation",
                values: [
                    {name: "Executive", value: "Animation-Executive"},
                    {name: "IT", value: "Animation-IT"},
                    {name: "Marketing", value: "Animation-Marketing"},
                    {name: "Office Administration", value: "Animation-Office Administration"},
                    {name: "Prod Direct", value: "Animation-Prod Direct"},
                    {name: "Production", value: "Animation-Production"}
                    ]
            },
            {
                name:"Corporate",
                values: [
                    {name: "Brand and Franchise Management", value: "Corporate-Brand and Franchise Management"},
                    {name: "Digital Technology", value: "Corporate-Digital Technology"},
                    {name: "Executive", value: "Corporate-Executive"},
                    {name: "Finance and Accounting", value: "Corporate-Finance and Accounting"},
                    {name: "Information Technology", value: "Corporate-Information Technology"},
                    {name: "Legal", value: "Corporate-Legal"},
                    {name: "Office Administration", value: "Corporate-Office Administration"}
                    ]
            },
            {
                name:"Digital Media",
                values: [
                    {name: "Audience Engagement", value: "Digital Media-Audience Engagement"},
                    {name: "Development", value: "Digital Media-Development"},
                    {name: "Digital Technology", value: "Digital Media-Digital Technology"},
                    {name: "Editorial", value: "Digital Media-Editorial"},
                    {name: "Executive", value: "Digital Media-Executive"},
                    {name: "Game Development", value: "Digital Media-Game Development"},
                    {name: "Platform", value: "Digital Media-Platform"},
                    {name: "Production", value: "Digital Media-Production"},
                    {name: "Sales and Distribution", value: "Digital Media-Sales and Distribution"},
                    {name: "Sales Integration", value: "Digital Media-Sales Integration"},
                    {name: "Social", value: "Digital Media-Social"},
                    {name: "Special Projects", value: "Digital Media-Special Projects"}
                    ]
            },
            {
                name:"Interactive",
                values: [
                    {name: "Game Development", value: "Interactive-Game Development"},
                    {name: "Sales and Distribution", value: "Interactive-Sales and Distribution"}
                    ]
            },
            {
                name:"Licensing",
                values: [
                    {name: "Brand Assurance", value: "Licensing-Brand Assurance"},
                    {name: "Creative Services", value: "Licensing-Creative Services"},
                    {name: "Executive", value: "Licensing-Executive"},
                    {name: "Merchandising", value: "Licensing-Merchandising"},
                    {name: "Retail Management", value: "Licensing-Retail Management"},
                    {name: "Sales", value: "Licensing-Sales"}
                    ]
            },
            {
                name:"Partnerships",
                values: [
                    {name: "IT", value: "Partnerships-IT"},
                    {name: "Legal", value: "Partnerships-Legal"},
                    {name: "Live Events", value: "Partnerships-Live Events"},
                    {name: "Office Administration", value: "Partnerships-Office Administration"},
                    {name: "Operations", value: "Partnerships-Operations"},
                    {name: "Project Management", value: "Partnerships-Project Management"},
                    {name: "Sales", value: "Partnerships-Sales"}
                    ]
            },
            {
                name:"Publishing",
                values: [
                    {name: "Advertising Sales", value: "Publishing-Advertising Sales"},
                    {name: "Custom Solutions Sales", value: "Publishing-Custom Solutions Sales"},
                    {name: "Editorial", value: "Publishing-Editorial"},
                    {name: "Executive", value: "Publishing-Executive"},
                    {name: "Manufacturing", value: "Publishing-Manufacturing"},
                    {name: "Online Digital Tech", value: "Publishing-Online Digital Tech"},
                    {name: "Productions", value: "Publishing-Productions"},
                    {name: "Publisher", value: "Publishing-Publisher"},
                    {name: "Sales", value: "Publishing-Sales"},
                    {name: "Support And Assurance", value: "Publishing-Support And Assurance"}
                    ]
            }

        ];

        if(val == 'California')
            depts = allDepartmentsLA;
        else
            depts = allDepartmentsNY;

        res.send(depts);
    }
    catch(ex){
        next(ex);
   }
});

app.post('/api/singleUser', async (req,res,next)=> {
    try{
        //util and exec for calling the powershell application
        //const util = require('util');
        //const exec = util.promisify(require('child_process').exec);

        //Extact user data from request.body
        const {firstName, lastName,startDate, title, legalEntity, usrState, supervisor, department, email, computer, gender, tempStatus 
        } = req.body;

        //Functions Run and TrimCheck
        async function Run(){
            const {stdout, stderr, err} = await exec(`${singleUserScript} '${usrObj.firstName}'  '${usrObj.lastName}' '${usrObj.startDate}'  '${usrObj.title}' '${usrObj.legalEntity}' '${usrObj.usrState}' '${usrObj.supervisor}' '${usrObj.department}' '${usrObj.email}' '${usrObj.computer}' '${usrObj.gender}' '${usrObj.tempStatus}'`, {'shell':'powershell.exe'})
            
            return stdout;
            
        }

        function TrimCheck(userObject){
            const regex = /[@~`!#$%\^&*+=\\[\]\\';,/{}|\\":<>\?]/g;

            for(const prop in userObject){
                if(prop !== "startDate" && prop !== "gender" && prop !== "computer" && prop !== "usrState" && prop !== "department" && prop !== "tempStatus"){
                    userObject[prop] = userObject[prop].replace(regex, "").trim();
                }
            }
        }

        //usrObj data to send to powershell script
        const usrObj = {
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
            tempStatus: tempStatus
        };

        //response object to send back to the client
        const resObj = {
            responseStatus: "success",
            responseData: 'All good'
        }

        //Remove special characters 
        TrimCheck(usrObj);
        
    
        //Call the run to launch powershell and assign the stdout to output
        const output = await Run();

        //Extract the first word from output, either will be Successs or Error, along with the message assign to resobj
        let outputStatus = output.split(' ').splice(0,1).toString();
        let outputMsg = output.split(' ').splice(1, output.length - 1).join(' ').toString();
        resObj.responseStatus = outputStatus;

        resObj.responseData = outputMsg;
        res.json(resObj);
    }
    catch(ex){
        console.log("error in the server");
        console.log(ex);
        next(ex);
   }
});

app.post('/api/multiUser', async (req,res,next)=> {
    try{

        async function Run(data){
            let fileInfo = '';
            for(let row of data){
                //row Scott,Summers,IT Person,Marvel Entertainment,California,Publishing-Game Development,Alcott Vernon,12/24/2022,test@yahoo.com,mac,male
                fileInfo += row.toString() + "\n"
            }

            //console.log(fileInfo);
            const {stdout, stderr, err} = await exec(`${multiUserScript} '${fileInfo}'`, {'shell':'powershell.exe'})
            console.log(stdout);
            return stdout;
            
        }

        async function GetAccounts(file){
            let data = JSON.stringify(file.data.toString('utf8'))
            
            const accounts = [];

            let arrData = data.split( '\\r\\n');
           
            for(let i = 1; i < arrData.length; i++){
                //start at line 1 to skip headers
                if(arrData[i].length > 1){
                    accounts.push(arrData[i].split(','));
                }
            }

            //console.log('accounts', accounts);
            return accounts;
        }
        
        
        const {file} = req.files;
        
        const allAccounts = await GetAccounts(file);
   
        //console.log(allAccounts);
        await Run(allAccounts);
  
        res.send('CSV Imported!');
    }
    catch(ex){
        console.log("error in the server");
        res.send('An error occured with the CSV');
        console.log(ex);
        next(ex);
   }
});

// Send the app
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message || "Internal server error");
});

app.listen(PORT, () =>
    console.log(`
    ${consoleMsg + PORT}
        ${local + PORT}
`),
);

module.exports = { app, PORT };


