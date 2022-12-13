import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Form from "./Form";

const Main = () => (
    
    <Routes>
        <Route exact path = "/" element={<Form/>} />
    </Routes>
)

export default Main;
