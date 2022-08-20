import {useSearchContext} from "../../pages/PokeList";
import {useNavigate} from "react-router-dom";
import {Divider} from "primereact/divider";
import {ToggleButton} from "primereact/togglebutton";
import {Toolbar} from "primereact/toolbar";
import {GENS} from "../../data/consts";
import {InputText} from "primereact/inputtext";
import React from "react";
import {FilterProps} from "./SearchToolbar";

export function PCSearchBar({filters, setFilters}: FilterProps){

    const {genIndex, versionIndex} = useSearchContext();
    const navigate = useNavigate();

    const left = <>
        <div onClick={() => navigate('/')} style={{color: 'white', fontSize: '36px'}}>Pkdex Tracker</div>
        <Divider layout="vertical"/>
        <ToggleButton className="ml-1" onLabel="Disponibles affichés" offLabel="Disponibles cachés" checked={filters.showAvailable} onChange={e => setFilters('showAvailable', e.value)}/>
        <Divider layout="vertical"/>
        <ToggleButton onLabel="Indisponibles affichés" offLabel="Indisponibles cachés" checked={filters.showUnavailable} onChange={e => setFilters('showUnavailable', e.value)}/>
        <Divider layout="vertical"/>
        <ToggleButton className="ml-1" onLabel="Capturés affichés" offLabel="Capturés cachés" checked={filters.showCaptured} onChange={e => setFilters('showCaptured', e.value)}/>
        <Divider layout="vertical"/>
        <ToggleButton onLabel="Non capturés affichés" offLabel="Non capturés cachés" checked={filters.showNotCaptured} onChange={e => setFilters('showNotCaptured', e.value)}/>

    </>;


    return <Toolbar
        style={{backgroundColor: GENS[genIndex][versionIndex].color, width: '100%', backdropFilter: 'blur(20px) saturate(180%)', borderRadius: '0', position: 'fixed', zIndex: 999}}
        className="mb-4 pb-2 pt-2" left={left}
        right={<InputText placeholder="Recherche (nom, id, lieu)" style={{width: '17rem'}} value={filters.search} onChange={e => setFilters('search', e.target.value)}/>}
    ></Toolbar>
}
