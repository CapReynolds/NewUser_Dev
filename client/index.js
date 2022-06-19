import axios from 'axios';

window.DoSomething = async function() {
    //api call to server end and can send data
    let stuff = await(axios.get('/api/stuff'));
   
}

window.TestFunc = async function() {
    console.log("You did something");
    // let usrObj = {};
    // usrObj.name = formData[0].name;
 

    // let msg = document.getElementById('root');
    // //console.dir(amr);
    
    // let blah2 = "<h1>Submitted!</h1>";
    // if(msg != null){
    //     msg.innerHTML = blah2;
    // }
    
    //alert(formData[0].value);
}

window.OtherFunc = async function(formData) {
    console.log("form Data:");
    console.dir(formData);
    //console.log(formData[0].value);
    // let usrObj = {
    //     name: formData[0].name,
    //     startDate: formData[1].startDate,
    //     title: formData[2].title,
    //     legalEntity: formData[3].legalEntity,
    //     state: formData[3].state,
    //     supervisor: formData[5].supervisor,
    //     department: formData[6].department,
    //     personalEmail: formData[7].email
    // };

    //let stuff = await(axios.get('/api/stuff'));

    //let user = await(axios.get('/api/newUser', usrObj));
    
    // await axios.post('/api/newUser', async(req,res,next)=>{  //users sales
    //     try {
    //         let sale = await Sale.create({...req.body, userId: req.params.id});
    //         sale = await Sale.findByPk(sale.id, {
    //             include: [ Car ]
    //         });
    //         res.send(sale);
    //     }
    //     catch(ex) {
    //         next(ex);
    //     }
    // });
    

    let msg = document.getElementById('root');
    //console.dir(amr);
    
    let blah2 = "<h1>Submitted!</h1>";
    if(msg != null){
        msg.innerHTML = blah2;
    }
    //alert('Submitted!', formData[0]);
    alert(formData[0].value);
}

//export OtherFunc;
export default {DoSomething, OtherFunc, TestFunc};

  

//export OtherFunc;