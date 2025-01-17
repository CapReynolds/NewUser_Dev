import React, { useState } from "react";
import './../../public/assets/styles.css';
import Form from "./Form";

import SingleUsr from "./SingleUsr";
import MultiUsr from "./MultiUsr";
import SingleDisable from "./SingleDisable";
import MultiDisable from "./MultiDisable";

const TabbedContent = ({passedComponenet1, passedComponenet2}) => {

    const [tabView, setTabView] = useState('single');
    const [visible, setVisible] = useState(false);
    const [formView, setFormView] = useState(null);

    function OpenView(ev, tabView){
        let i, tablinks;

        setTabView(tabView);
        ev.preventDefault();

        tablinks = document.getElementsByClassName("tablinks");
        for(i=0; i < tablinks.length; i++){
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        ev.currentTarget.className +=" active";

        switch(tabView){
            case 'single':
                setVisible(true);
                setFormView(passedComponenet1)
                break;
            case 'multi':
                setVisible(true);
                setFormView(passedComponenet2)
                break;
            default:
                setFormView(passedComponenet1)
        }
    }

    return (
        <div class="content">
            <div class="tab">
                <button class="tablinks" onClick={ e => OpenView(e, 'single')}>Single</button>
                <button class="tablinks" onClick={ e => OpenView(e, 'multi')}>Multiple</button>
            </div>
            <div class="tabbedcontent">
                {visible ? formView : ''}
            </div>
        </div>
    )
}

export default TabbedContent;