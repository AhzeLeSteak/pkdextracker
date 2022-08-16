import {Dialog} from "primereact/dialog";
import React, {useMemo, useState} from "react";
import {ListBox, ListBoxChangeParams} from "primereact/listbox";
import {Splitter, SplitterPanel} from "primereact/splitter";
import './PokeDetails.css';
import {Button} from "primereact/button";
import {useSearchContext} from "./SearchToolbar";
import {Capture} from "../data/Pkmn";
import {CaptureBadges} from "./CaptureBadges";

type DialogEncouterProps =  {
    pkmnId : number,
    setPkmnId: (id: number) => void,
    showDialog: boolean,
    setShowDialog: (_: boolean) => void,
    captures: Capture[]
};

export const PokeDetails = ({pkmnId, setPkmnId, showDialog, setShowDialog, captures}: DialogEncouterProps) => {

    const {getPokemon, selectedVersion} = useSearchContext();

    const [locationIndex, setLocationIndex] = useState<number>(-1);
    const [subIndex, setSubIndex] = useState<number>(-1)


    const pkmn = useMemo(() => getPokemon(pkmnId), [pkmnId, getPokemon])!;
    const locations = useMemo(() => pkmn.locations.filter(l => l.version === selectedVersion), [pkmn, selectedVersion]);
    const sub_locations = useMemo(() => locationIndex >= 0 && locations.length ? locations[locationIndex].sub : [], [locations, locationIndex]);
    const details = useMemo(() => {
        return subIndex >= 0 && sub_locations.length >= subIndex + 1 ? sub_locations[subIndex].details : [];
    }, [sub_locations, subIndex])


    if(locationIndex < 0 && locations.length === 1)
        setLocationIndex(0);

    if(subIndex < 0 && locationIndex >= 0 && locations[locationIndex].sub.length === 1)
        setSubIndex(0);



    const onChangeLocation = (e: ListBoxChangeParams) => {
        setLocationIndex(locations.findIndex(l => l.label === e.value));
    };

    const onChangeSub = (e: ListBoxChangeParams) => {
        setSubIndex(sub_locations.findIndex(s => s.label === e.value.label))
    };


    return <Dialog header={pkmn.name} visible={showDialog} style={{ width: '40vw'}} onHide={() => setShowDialog(false)} draggable={false}>
        <div className="slider-fixed grid">
            <div className="col-2 arrow-container">
                <Button icon="pi pi-arrow-left" className="p-button-rounded p-button-primary" onClick={() => setPkmnId(pkmnId-1)} />
            </div>
            <img className="col-8" src={pkmn.sprite} alt={pkmn.base_name}/>
            <div className="col-2 arrow-container">
                <Button icon="pi pi-arrow-right" className="p-button-rounded p-button-primary" onClick={() => setPkmnId(pkmnId+1)} />
            </div>
        </div>

        <Splitter>
            <SplitterPanel>
                <ListBox options={locations.map(l => l.label).concat(pkmn.evolving_methods)} listStyle={{ maxHeight: '220px' }}
                         value={locationIndex} onChange={onChangeLocation}/>
            </SplitterPanel>
            <SplitterPanel>
                <ListBox options={sub_locations} value={subIndex} listStyle={{ maxHeight: '220px' }}
                         onChange={onChangeSub} />
            </SplitterPanel>
            <SplitterPanel>
                <ListBox options={details} listStyle={{ maxHeight: '220px' }}/>
            </SplitterPanel>
        </Splitter>

        <CaptureBadges pkmnId={pkmnId} captures={captures}/>


    </Dialog>
}
