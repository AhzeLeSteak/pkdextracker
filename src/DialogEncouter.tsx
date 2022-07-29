import {Location} from "./Pkmn";
import {Dialog} from "primereact/dialog";
import React, {useState} from "react";
import {ListBox} from "primereact/listbox";
import {Splitter, SplitterPanel} from "primereact/splitter";
import {LocationAndPkmnName} from "./App";

type DialogEncouterProps =  {
    location ?: LocationAndPkmnName,
    showDialog: boolean,
    setShowDialog: (_: boolean) => void
};

export const DialogEncouter = ({location : locationAndName, showDialog, setShowDialog}: DialogEncouterProps) => {

    const [selectedSub, setSelectedSub] = useState<Location['sub'][number]>()

    if(!locationAndName)
        return <></>

    const location = locationAndName.location;
    const name = locationAndName.name;


    if(!location.sub.includes(selectedSub!))
        setSelectedSub(location.sub[0]);

    return <Dialog header={name + ' : ' +location.label} visible={showDialog} style={{ width: '30vw' }} onHide={() => setShowDialog(false)} draggable={false}>

        {location.sub.length > 1 ?
            <Splitter>
                <SplitterPanel>
                    <ListBox options={location.sub} optionLabel="label" value={selectedSub} onChange={e => setSelectedSub(e.value)}/>
                </SplitterPanel>
                <SplitterPanel>
                    <ListBox options={selectedSub ? selectedSub.details : []} />
                </SplitterPanel>
            </Splitter>
            :
            <ListBox options={location.sub[0].details}/>
        }

    </Dialog>
}
