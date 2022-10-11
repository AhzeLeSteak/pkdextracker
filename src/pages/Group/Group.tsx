import {useGroup} from "../../hooks/useGroup";
import {InGroup} from "./InGroup";
import {NotInGroup} from "./NotInGroup";
import {useNavigate} from "react-router-dom";
import React from "react";
import {SpeedDial} from "primereact/speeddial";

export const Group = () => {
    const {inGroup} = useGroup();
    const navigate = useNavigate();


    return <>
        {inGroup ? <InGroup/> : <NotInGroup/>}

        <SpeedDial model={[]} onClick={() => navigate('/')}
                   direction="up" showIcon="pi pi-home" rotateAnimation={false}
                   style={{left: '0.5em', bottom: '0.5em', position: 'fixed', zIndex: 99}}/>
    </>
}


