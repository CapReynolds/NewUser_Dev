import React, { createContext, useState, useEffect } from "react";

export const DarkModeContext = createContext(null);
export const DarkModeContextProvider = ({children}) => {
    const [darkMode, setDarkMode] = useState(false);
    

    //const body = document.getElementsByTagName("body")[0];

    useEffect(()=>{
        setDarkMode(JSON.parse(window.localStorage.getItem('darkMode')))
    }, []);

    useEffect(()=>{
        window.localStorage.setItem('darkMode', darkMode);
    },[darkMode]);

    return (
        <DarkModeContext.Provider value={{darkMode, setDarkMode}}>
            {children}
        </DarkModeContext.Provider>
    );
};