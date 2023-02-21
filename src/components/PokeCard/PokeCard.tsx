import './PokeCard.css';
import {Card} from "primereact/card";
import React from "react";
import {Capture, Pkmn} from "../../data/Pkmn";
import {Badge} from "primereact/badge";
import {isDispoInVersion} from "../Toolbar/SearchToolbar";
import {UserCaptures} from "./UserCaptures";
import {useDataContext} from "../../pages/List/ListPage";
import {GENS} from "../../data/consts";


const PokeCard = (props: { pk: Pkmn, captures: Capture[], onClick: (pkmn: any) => any }) => {

    const {genIndex, versionIndex} = useDataContext();
    const versionsOfGen = GENS[genIndex];
    const pk = props.pk;



    return <Card className="card-blur cursor-pointer h-8rem" onClick={props.onClick}>
        <div className="flex justify-content-between" style={{width: '100%'}}>
            <div className="flex flex-column">
                <h3 className="mt-0">#{pk.id} {pk.name}</h3>
                <div>
                    {versionsOfGen.filter(v => isDispoInVersion(v.value, pk)).map(v =>
                        <Badge key={v.value} style={{backgroundColor: v.color}}></Badge>
                    )}
                </div>
            </div>
            <div>
                {props.captures.filter(c => versionsOfGen.some(v => v.value === c.version)).map(c => c.uid).filter((el, index, array) => array.findIndex(x => x === el) === index)
                    .map(uid => props.captures.filter(capture => capture.uid === uid))
                    .map((userCaptures, i) => <UserCaptures key={i} captures={userCaptures}/>)}
            </div>
            <img src={pk.sprite} alt={'#' + pk.id} className="pk-img"/>
        </div>

    </Card>
}

export default PokeCard;
