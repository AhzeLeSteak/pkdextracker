import {useGroup} from "../../hooks/useGroup";
import {InGroup} from "./InGroup";
import {NotInGroup} from "./NotInGroup";
import {useNavigate} from "react-router-dom";
import {Button} from "primereact/button";
import React from "react";

export const Group = () => {
    const {inGroup} = useGroup();
    const navigate = useNavigate();

    const footer = <div className="grid mt-1" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
        <div className="col-2">
            <Button icon="pi pi-arrow-left" className="p-button-rounded"/>
        </div>
    </div>

    return inGroup ? <InGroup footer={footer}/> : <NotInGroup footer={footer}/>
}


