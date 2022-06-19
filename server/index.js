// Server setup
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 5000;


app.use(express.static(path.join(__dirname, "../public")));

// Middleware Logging
//app.use(morgan("dev"));

// Api Routes
//
//

app.get('/api/stuff', async(req,res,next)=> {
    try{
        const { exec } = require('child_process');

        exec("C:\\Users\\avernon\\Documents\\Test\\howdy.ps1", {'shell':'powershell.exe'}, (err, stdout, stderr)=> {
            // do whatever with stdout
            if(err) console.log(err);

        })

        res.send('yoyp');
    }
    catch(ex){
        next(ex);
   }
});

app.get('/api/newUser', async(req,res,next)=> {
    try{
        console.log(req.params)
        const { exec } = require('child_process');

        exec("C:\\Users\\avernon\\Documents\\Test\\howdy.ps1", {'shell':'powershell.exe'}, (err, stdout, stderr)=> {
            // do whatever with stdout
            if(err) console.log(err);

        })

        res.send('in the axios post');
    }
    catch(ex){
        next(ex);
   }
});


// app.get('/api/users/:id', async(req,res,next)=> {
//     try{
//         res.send(await User.findByPk(req.params.id));
//     }
//     catch(ex){
//         next(ex);
//     }
// });


// Send the app
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// app.get("/scripts/require.js", (req, res) => {
//     res.sendFile(path.join(__dirname, "../scripts/require.js"));
// });

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err.message || "Internal server error");
});

app.listen(PORT, () =>
    console.log(`
        Listening on Port ${PORT}
        http://localhost:${PORT}
`),
);

// process.on("SIGINT", () => {
//     console.log("Bye bye!");
//     process.exit();
// });

module.exports = { app, PORT };

