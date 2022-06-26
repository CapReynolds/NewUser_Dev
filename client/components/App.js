import React, {useState} from 'react';
import {Route, HashRouter, Switch} from "react-router-dom";

import Form from "./Form";
import Header from "./Header";

const App = () => {

    return (
        //<Route path="/" component={Form} exact />
        <div>
            <Header />
            <Form />
        </div>
      
    );
    
}

export default App;
