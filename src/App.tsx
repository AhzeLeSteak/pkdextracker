import React, {useMemo, useState} from 'react';
import './App.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/mdc-light-deeppurple/theme.css';
import {Toolbar} from "primereact/toolbar";

import {MainClient,} from "pokenode-ts";
import {isDispoInVersion, Location, Pkmn, usePkmn} from "./Pkmn";
import {Dropdown} from "primereact/dropdown";
import PokeCard from "./PokeCard";
import {InputText} from "primereact/inputtext";
import {DialogEncouter} from "./DialogEncouter";
import {InputSwitch} from "primereact/inputswitch";
import {Divider} from "primereact/divider";
import {SelectButton} from "primereact/selectbutton";


export const api = new MainClient();
export const GENS = [
    [
        {label: 'Rouge', value: 'red', color: '#BE0D07'},
        {label: 'Bleu', value: 'blue', color: '#1E4B89'},
        {label: 'Jaune', value: 'yellow', color: '#EFBF43'}
    ],
    [
        {label: 'Or', value: 'gold', color: '#878246'},
        {label: 'Argent', value: 'silver', color: '#87868B'},
        {label: 'Cristal', value: 'cristal', color: '#5A7F85'}
    ],
];

export const PKMN_COUNT_BY_GEN = [151, 100];

const GENS_OPTIONS = GENS.map((_, i) => ({label: `Gen ${i+1}`, value: i}));

export type LocationAndPkmnName = {
    location : Location,
    name : string
}


function App() {
    const [genIndex, setGenIndex] = useState(0);
    const [versionIndex, setVersionIndex] = useState(0);
    const version = GENS[genIndex][versionIndex].value;

    const [search, setSearch] = useState('');
    const [showUnavailable, setShowUnavailable] = useState(true);
    const [showAvailable, setShowAvailable] = useState(true);

    const [showDialog, setShowDialog] = useState(false);
    const [location, _setLocation] = useState<LocationAndPkmnName>();

    const showLocationDetails = (location: LocationAndPkmnName) => {
        _setLocation(location);
        setShowDialog(true);
    }

    const startIndex = 1
    let nbPk = 151;
    const _pkmn: Pkmn[] = [];
    for(let i = startIndex; i < nbPk+startIndex; i++){
        // eslint-disable-next-line react-hooks/rules-of-hooks
        _pkmn.push(usePkmn(i));
    }

    const loadedCount = _pkmn.filter(p => p.loaded).length;

    const srchVersion = useMemo(() => {
        let s = search.toLowerCase();
        let reverse = false;
        if(search.startsWith('!')){
            reverse = true;
            s = s.slice(1);
        }
        let versionFiltre : typeof GENS[number][number] | undefined = GENS[genIndex]
            .find(v => v.value.toLowerCase() === s
                || v.label.toLowerCase() === s);

        return versionFiltre ? {
            reverse,
            version: versionFiltre.value
        } : false;

    }, [search]);

    const pkmn = useMemo(() => _pkmn.filter(pk => {
        if(srchVersion){
            return isDispoInVersion([srchVersion.version], _pkmn, pk) !== srchVersion.reverse;
        }

        //recherche dispo / pas dispo
        const dispo = isDispoInVersion([version], _pkmn, pk);
        if(!showUnavailable && !dispo)
            return false;
        if(!showAvailable && dispo)
            return false;

        //recherche index
        const index = parseInt(search);
        if(!isNaN(index))
            return pk.id.toString().includes(index.toString());

        //recherche par nom
        const srch = search.toLowerCase();
        return pk.name.toLowerCase().includes(srch)
            || pk.base_name.toLowerCase().includes(srch)
            || pk.locations.some(l => l.version === version && l.label.toLowerCase().includes(srch))
    }), [version, showAvailable, showUnavailable, search, loadedCount]);


    const toolbar = <>
        <Dropdown options={GENS_OPTIONS} value={genIndex} onChange={e => setGenIndex(e.value)} className="ml-4"/>
        <SelectButton className="ml-2 mr-4" value={versionIndex} options={GENS[genIndex]} optionLabel="label"
                      onChange={(e) => setVersionIndex(GENS[genIndex].findIndex(v => v.value === e.value))}/>

        <Divider layout="vertical"/>

        <div style={{textAlign : 'right'}}>
            <label style={{maxWidth: '8rem', color: 'white'}}>Disponibles</label>
            <InputSwitch className="ml-1" checked={showAvailable} onChange={e => setShowAvailable(e.value)}/>
            <br/>
            <label style={{maxWidth: '8rem', color: 'white'}}>Indisponibles</label>
            <InputSwitch className="ml-1 mb-1" checked={showUnavailable} onChange={e => setShowUnavailable(e.value)}/>
        </div>

        <Divider layout="vertical"/>
        <h3 className="ml-4" style={{color: 'white'}}>Count : {pkmn.length}</h3>
    </>

    return (
        <div className="App">

            <div className="p-1">
                <Toolbar style={{backgroundColor: GENS[genIndex][versionIndex].color, width: '100%', backdropFilter: 'blur(20px) saturate(180%)' }}
                         className="mb-4 pl-4 pr-4 pb-2 pt-2" left={toolbar}
                         right={<InputText placeholder="Recherche (nom, id, lieu, version)" style={{width: '17rem'}} value={search} onChange={e => setSearch(e.target.value)}/>}
                ></Toolbar>
            </div>

            <div className="grid">
                <div className="col-1"></div>
                <div className="col-10">
                    <div className="grid">
                        {pkmn.map(pk => (
                            <div key={pk.id} className="col-3">
                                <PokeCard pk={pk} allPkmn={_pkmn} version={version} versions={GENS[genIndex]} showLocationDetail={showLocationDetails}></PokeCard>
                            </div>))}
                    </div>
                </div>
            </div>

            <DialogEncouter location={location} showDialog={showDialog} setShowDialog={setShowDialog}/>



        </div>)
}

export default App;
