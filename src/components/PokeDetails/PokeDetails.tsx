import {Dialog} from "primereact/dialog";
import React, {useMemo, useState} from "react";
import {ListBox, ListBoxChangeParams} from "primereact/listbox";
import {Splitter, SplitterPanel} from "primereact/splitter";
import './PokeDetails.css';
import {Capture, Pkmn} from "../../data/Pkmn";
import {CaptureBadges} from "./CaptureBadges";
import {useSearchContext} from "../../pages/PokeList";
import {isMobile} from "react-device-detect";
import {Carousel} from "primereact/carousel";

type DialogEncouterProps =  {
    pokemons: Pkmn[],
    pkmnId : number, //position du pokémon dans le tableau pokemons
    setPkmnId: (_: number) => void,
    showDialog: boolean,
    setShowDialog: (_: boolean) => void,
    captures: Capture[]
};

export const PokeDetails = ({pkmnId, setPkmnId, pokemons, showDialog, setShowDialog, captures}: DialogEncouterProps) => {

    const {selectedVersionValue, genIndex} = useSearchContext();

    const [locationIndex, setLocationIndex] = useState<number>(-1);
    const [subIndex, setSubIndex] = useState<number>(-1)


    const pkmn = useMemo(() => pokemons[pkmnId], [pkmnId])!;
    const locations = useMemo(() => pkmn.locations.filter(l => l.version === selectedVersionValue), [pkmn, selectedVersionValue]);
    const sub_locations = useMemo(() => locationIndex >= 0 && locations.length ? locations[locationIndex].sub : [], [locations, locationIndex]);
    const details = useMemo(() => {
        return subIndex >= 0 && sub_locations.length >= subIndex + 1 ? sub_locations[subIndex].details : [];
    }, [sub_locations, subIndex])


    if(locationIndex < 0 && locations.length === 1)
        setLocationIndex(0);

    if(subIndex < 0 && locationIndex >= 0 && locations[locationIndex].sub.length === 1)
        setSubIndex(0);

    const onChangeLocation = (e: ListBoxChangeParams) => setLocationIndex(locations.findIndex(l => l.label === e.value));
    const onChangeSub = (e: ListBoxChangeParams) => setSubIndex(sub_locations.findIndex(s => s.label === e.value.label));


    return <Dialog header={pkmn.name} visible={showDialog} style={{width: isMobile ? '100vw' : '70vw', maxWidth: '1400px'}}
                   onHide={() => setShowDialog(false)} draggable={false}>

        <div className="grid">
            <div className="grid col-12">
                <div className="col-0 md:col-3 lg:col-4"></div>
                <Carousel value={pokemons}
                          page={pkmnId} onPageChange={({page}) => setPkmnId(page)}
                          itemTemplate={pk => <img className="pixelated" src={pk.sprite} alt={pk.base_name}/>}
                          indicatorsContentClassName="invisible" className="col-12 md:col-6 lg:col-4"
                />
            </div>

            <div className="mt-1 mb-1 col-12 lg:col-6">
                <CaptureBadges pkmnId={pkmn.id} captures={captures}/>
            </div>


            <Splitter className="col-12 lg:col-6">
                <SplitterPanel>
                    <ListBox options={locations.map(l => l.label).concat(pkmn.evolving_methods.filter(em => genIndex > 1 || !em.includes('bonheur')))} listStyle={{ maxHeight: '220px' }}
                             value={locationIndex} onChange={onChangeLocation}/>
                </SplitterPanel>
                <SplitterPanel style={sub_locations.length < 2 ? {display: 'none'} : {}}>
                    <ListBox options={sub_locations} value={subIndex} listStyle={{ maxHeight: '220px' }}
                             onChange={onChangeSub} />
                </SplitterPanel>
                <SplitterPanel style={details.length === 0 ? {display: 'none'} : {}}>
                    <ListBox options={details} listStyle={{ maxHeight: '220px' }}/>
                </SplitterPanel>
            </Splitter>
        </div>


    </Dialog>
}
