// Server setup
const express = require("express");
const app = express();
const { urlencoded } = require('express');


const config = require("./config");

const {index: { port, local, consoleMsg, MultiUserScript, SingleUserScript, ExcelPath}} = config;

app.use(express.json());
app.use(urlencoded({ extended: false }));

const path = require("path");


const util = require('util');
const exec = util.promisify(require('child_process').exec);

//for iisserver
const http = require('http');

let loggedInUser = '';
let loggedInPass = '';
let loggedAuthType = '';
let loggedOnUser = '';


//for reading in a file
const fileUpload = require("express-fileupload");
app.use(fileUpload());

const PORT = process.env.PORT || port;

let httpServer = http.createServer(app);
httpServer.listen(8080);

//for production
app.use(express.static(path.join(__dirname, "../build")));

//for development
//app.use(express.static(path.join(__dirname, "../public")));

//var username = req.headers['x-iisnode-auth_user'];

/*
http.createServer(function (req, res) {
    var username = req.headers['x-iisnode-auth_user'];
    var authenticationType = req.headers['x-iisnode-auth_type'];
    // ...
	
	//loggedInUser = username;
}).listen(process.env.PORT);  */

app.get('/api/departments', async(req,res,next)=> {
    try{

        const {val} = req.query;
        let depts = '';
		
		//username = HttpContext.Current.User.Identity.Name;

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
                name:"Disney",
                values: [
                    {name: "Disney", value: "Disney"}
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
            },
            {
                name:"TEMP Users",
                values: [
                    {name: "TEMP Users", value: "TEMP Users-Users"}
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
                name:"Disney",
                values: [
                    {name: "Disney", value: "Disney"}
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
            },
            {
                name:"TEMP Users",
                values: [
                    {name: "TEMP Users", value: "TEMP Users-Users"}
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

app.get('/api/oktaGroups', async(req,res,next)=> {
    try{
        const okta_groups = [
            { id: 1, value: 'APP-VPN-ALTA', label: 'APP-VPN-ALTA'},
            { id: 2, value: 'APP-VPN-API-WIZARD', label: 'APP-VPN-API-WIZARD'},
            { id: 3, value: 'APP-VPN-DEV-OT', label: 'APP-VPN-DEV-OT'},
            { id: 4, value: 'APP-VPN-Digital-Media', label: 'APP-VPN-Digital-Media'},
            { id: 5, value: 'APP-VPN-DISNEY135-RDP', label: 'APP-VPN-DISNEY135-RDP'},
            { id: 6, value: 'APP-VPN-Hitachi-HCI', label: 'APP-VPN-Hitachi-HCI'},
            { id: 7, value: 'APP-VPN-OCI', label: 'APP-VPN-OCI'},
            { id: 8, value: 'APP-VPN-Subnet-250', label: 'APP-VPN-Subnet-250'}
        ];

        res.send(okta_groups);
    }
    catch(ex){
        next(ex);
   }
});

app.get('/api/VPNGroups', async(req,res,next)=> {
    try{
        const vpn_groups = [
            { id: 0, value: 'NY-VPN Access', label: 'NY-VPN Access'},
            { id: 1, value: 'NY-VPN Disney135-RDP', label: 'NY-VPN Disney135-RDP'},
            { id: 2, value: 'NY-VPN Hitachi HCI', label: 'NY-VPN Hitachi HCI'},
            { id: 3, value: 'NY-VPN RDP Only', label: 'NY-VPN RDP Only'},
            { id: 4, value: 'NY-VPN Subnet 250', label: 'NY-VPN Subnet 250'},
            { id: 5, value: 'NY-VPN-1290-TESTNET', label: 'NY-VPN-1290-TESTNET'},
            { id: 6, value: 'NY-VPN-ALTA', label: 'NY-VPN-ALTA'},
            { id: 7, value: 'NY-VPN-API-WIZARD', label: 'NY-VPN-API-WIZARD'},
            { id: 8, value: 'NY-VPN-DEV-OT', label: 'NY-VPN-DEV-OT'},
            { id: 9, value: 'NY-VPN-Digital-Media', label: 'NY-VPN-Digital-Media'},
            { id: 10, value: 'NY-VPN-Disney-Publishing', label: 'NY-VPN-Disney-Publishing'},
            { id: 11, value: 'NY-VPN-Legends', label: 'NY-VPN-Legends'},
            { id: 12, value: 'NY-VPN-OCI', label: 'NY-VPN-OCI'},
            { id: 13, value: 'NY-VPN-PLATFORMS', label: 'NY-VPN-PLATFORMS'},
            { id: 14, value: 'NY-VPN-PROJ_PEGASUS', label: 'NY-VPN-PROJ_PEGASUS'}
        ];

        res.send(vpn_groups);
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
        const {firstName, lastName, startDate, title, legalEntity, usrState, supervisor, department, email, computer, gender, pernr, accountStatus, oktaUserGroups, vpnUserGroups
        } = req.body;

        // let oktaGroups = [];
        // //oktaGroups, vpnGroups
        // oktaUserGroups.forEach((group) => {
        //     oktaGroups.push(group.id);
        // });

        // let vpnGroups = [];
        // //oktaGroups, vpnGroups
        // vpnUserGroups.forEach((group) => {
        //     vpnGroups.push(group.id);
        // });

        //Functions Run and TrimCheck
        async function Run(){
          
		    //const {stdout, stderr, err} = await exec(`${SingleUserScript} '${usrObj.firstName}' '${usrObj.lastName}' '${usrObj.startDate}' '${usrObj.title}' '${usrObj.legalEntity}' '${usrObj.usrState}' '${usrObj.supervisor}' '${usrObj.department}' '${usrObj.email}' '${usrObj.computer}' '${usrObj.gender}' '${usrObj.accountStatus}' '${usrObj.pernr}' '${loggedInUser}' '${loggedInPass}' '${loggedAuthType}' '${loggedOnUser}'`, {'shell':'powershell.exe'})
            
            let combinedData = usrObj.pernr +":"+ usrObj.startDate;

            let string_vpn = "";
            let string_okta = "";

            if(usrObj.oktaGroups != "") {

                let test = [];
                usrObj.oktaGroups.forEach((group) =>{
                    test.push(group.value);
                })
                
                string_okta = test.toString();
            }
            

            if(usrObj.vpnGroups != "") {

                let test2 = [];
                usrObj.vpnGroups.forEach((group) =>{
                    test2.push(group.value);
                })
    
                string_vpn = test2.toString();
            }

           
            const {stdout, stderr, err} = await exec(`${SingleUserScript} '${usrObj.firstName}' '${usrObj.lastName}' '${usrObj.title}' '${usrObj.legalEntity}' '${usrObj.usrState}' '${usrObj.supervisor}' '${usrObj.department}' '${usrObj.email}' '${usrObj.computer}' '${usrObj.gender}' '${usrObj.accountStatus}' '${combinedData}' '${string_vpn}' '${string_okta}' '${loggedInUser}' '${loggedInPass}' '${loggedAuthType}' '${loggedOnUser}'`, {'shell':'powershell.exe'})
            
            if(stdout)
                return stdout;
            else if(stderr)
                return stderr;
            else
                return err;
        }

        function TrimCheck(userObject){
            const regex = /[@~`!#$%\^&*+=\\[\]\\';,/{}|\\":<>\?]/g;

            for(const prop in userObject){
                if(prop !== "oktaGroups" && prop !== "vpnGroups" && prop !== "startDate" && prop !== "gender" && prop !== "computer" && prop !== "usrState" && prop !== "department" && prop !== "accountStatus" && prop !== "email"){
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
            pernr: pernr,
            oktaGroups: oktaUserGroups,
            vpnGroups: vpnUserGroups,
            accountStatus: accountStatus
        };

        //response object to send back to the client
        const resObj = {
            responseStatus: "Success",
            responseData: 'All good'
        }

        //Remove special characters 
    
        TrimCheck(usrObj);
    
        //console.log(usrObj);
        //Call the run to launch powershell and assign the stdout to output
        
        const output = await Run();
       
        resObj.responseData = output;

        //Extract the first word from output, either will be Successs or Error, along with the message assign to resobj
        let outputStatus = output.split(' ').splice(0,1).toString();
        let outputMsg = output.split(' ').splice(1, output.length - 1).join(' ').toString();
        resObj.responseStatus = outputStatus;

        resObj.responseData = outputMsg;
        
        res.json(resObj);
    }
    catch(ex){
        //console.log("error in the server");
        console.log(ex);
        next(ex);
   }
});

app.post('/api/multiUser', async (req,res,next)=> {
    try{

        async function Run(data){
            let fileInfo = '';
            for(let row of data){
                //row Scott,Summers,IT Person,Marvel Entertainment,California,Publishing-Game Development,Alcott Vernon,12/24/2022,mac,male,test@yahoo.com,012345,NY-VPN Access,APP-VPN-DEV-OT
                fileInfo += row.toString() + "\n"
            }

            //console.log(fileInfo);
            const {stdout, stderr, err} = await exec(`${MultiUserScript} '${fileInfo}'`, {'shell':'powershell.exe'})
           
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

app.get('/api/download', async(req,res,next)=> {
    try{
        //let basePath = path.join(__dirname, "../build");
        //let excelFile = `${basePath}/Template/import_template_new.xlsx`;
        res.download(ExcelPath, function (error) {
            console.log("Error: ", error);
        })
        //res.download(path.join(__dirname, "../build/Template/import_template_new.xlsx"))
    }
    catch(ex){
        console.log("error downloading file");
        res.send('An error occured wdownloading the file');
        console.log(ex);
        next(ex);
    }
});


// For development
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "../public/index.html"));
// });

//for production Environment and iis Server
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../build/index.html"));
	var username = req.headers['x-iisnode-auth_user'];
	var pass = req.headers['x-iisnode-AUTH_PASSWORD'];
	var authType = req.headers['x-iisnode-auth_type'];
	var logOnUser = req.headers['x-iisnode-logon_user'];
	loggedInUser = username;
	loggedInPass = pass;
	loggedAuthType = authType;
	loggedOnUser = logOnUser;
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


