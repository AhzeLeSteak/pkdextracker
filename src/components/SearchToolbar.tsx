import {useNavigate} from "react-router-dom";
import {SelectButton} from "primereact/selectbutton";
import {allPkmn, GENS} from "../data/consts";
import {Divider} from "primereact/divider";
import React, {useState} from "react";
import {InputText} from "primereact/inputtext";
import {Toolbar} from "primereact/toolbar";
import {Pkmn} from "../data/Pkmn";
import {ToggleButton} from "primereact/togglebutton";
import {useSearchContext} from "../pages/PokeList";

export type FilterElements = {
    search: string,
    showAvailable: boolean,
    showUnavailable: boolean,
    showCaptured: boolean,
    showNotCaptured: boolean,
}

type SearchToolbarProps = {
    onSearchChange: (_: FilterElements) => void,
    setVersionIndex: (_: number) => void
};


export const SearchToolbar = ({onSearchChange, setVersionIndex}: SearchToolbarProps) => {

    const {genIndex, versionIndex} = useSearchContext();

    const [filters, _setFilters] = useState<FilterElements>({
        search: '',
        showAvailable: true,
        showUnavailable: true,
        showCaptured: true,
        showNotCaptured: true,
    });

    const navigate = useNavigate();

    const setFilters = <K extends keyof typeof filters>(key: K, val: typeof filters[K]) => {
        const newSearchState = {...filters, [key]: val};
        onSearchChange(newSearchState);
        _setFilters(newSearchState)
    }


    const left = <>
        <div onClick={() => navigate('/')} style={{color: 'white', fontSize: '36px'}}>Pkdex Tracker</div>
        <SelectButton className="ml-4 mr-4" value={versionIndex} options={GENS[genIndex]} optionLabel="label"
                      onChange={(e) => setVersionIndex(GENS[genIndex].findIndex(v => v.value === e.value))}/>
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

const preEvolution = (pk: Pkmn) => allPkmn.find(p => p.base_name === pk.preEvoBaseName);
export const isDispoInVersion = (v: string, pk ?: Pkmn): boolean => {
    if(!pk) return false;
    const preEvo = preEvolution(pk);
    return pk.locations.some(l => v.includes(l.version))
        || (preEvo ? isDispoInVersion(v, preEvo) : false);
}
