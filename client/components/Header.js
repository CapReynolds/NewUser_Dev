import React from "react";
import './../../public/assets/styles.css';
import imageFile from "./../../public/assets/Marvel-Comics.png";

const Header = () => {
    return (
        <div id="logo">
            <img id="marvel" src={imageFile} alt="Marvel" width="300" height="125" />
        </div>
      
    );
}

export default Header;