import {Link} from "react-router-dom";
import {SelectButton} from "primereact/selectbutton";
import {allPkmn, GENS, PKMN_COUNT_BY_GEN, VersionType} from "../data/consts";
import {Divider} from "primereact/divider";
import {InputSwitch} from "primereact/inputswitch";
import React, {createContext, useContext, useMemo, useState} from "react";
import {InputText} from "primereact/inputtext";
import {Toolbar} from "primereact/toolbar";
import {Pkmn} from "../data/Pkmn";

export type SearchContextType = {
    selectedVersion: string,
    versionsOfGens: VersionType[],
    showUnavailable: boolean,
    showAvailable: boolean,
    filteredPokemons: Pkmn[],
    getPokemon: (id: number) => Pkmn | null,
}
const SearchContext = createContext<SearchContextType>({
    selectedVersion: '',
    versionsOfGens: [],
    showAvailable: false,
    showUnavailable: false,
    filteredPokemons: [],
    getPokemon: () => null
});

export const useSearchContext = () => useContext(SearchContext);


export const SearchToolbar = (props: any) => {

    const genIndex = props.genIndex;
    const [versionIndex, setVersionIndex] = useState(0);
    const selectedVersion = GENS[genIndex][versionIndex].value;

    const [search, setSearch] = useState('');
    const [showUnavailable, setShowUnavailable] = useState(true);
    const [showAvailable, setShowAvailable] = useState(true);

    const nbPk = PKMN_COUNT_BY_GEN[genIndex];
    const startIndex = PKMN_COUNT_BY_GEN.slice(0, genIndex).reduce((a, b) => a+b, 0);


    const srchVersion = useMemo(() => getSearchVersion(search, genIndex), [search, genIndex]);



    const pokemons = useMemo(() => allPkmn.slice(startIndex, nbPk+startIndex).filter(pk => {
        if(search === '')
            return true;

        if(srchVersion)
            return isDispoInVersion(srchVersion.version, pk) !== srchVersion.reverse;

        //recherche dispo / pas dispo
        const dispo = isDispoInVersion(selectedVersion, pk);
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
            || pk.locations.some(l => l.version === selectedVersion && l.label.toLowerCase().includes(srch))
    }), [selectedVersion, showAvailable, showUnavailable, search, srchVersion, startIndex, nbPk]);


    const getPokemon = (id: number) => allPkmn[id-1];

    const left = <>
        <Link to={'/'} style={{textDecoration: 'none'}}><div style={{color: 'white', fontSize: '36px'}}>Pkdex Tracker</div></Link>
        <SelectButton className="ml-4 mr-4" value={versionIndex} options={GENS[genIndex]} optionLabel="label"
                      onChange={(e) => setVersionIndex(GENS[genIndex].findIndex(v => v.value === e.value))}/>

        <Divider layout="vertical"/>

        <label style={{maxWidth: '8rem', color: 'white'}}>Disponibles</label>
        <InputSwitch className="ml-1" checked={showAvailable} onChange={e => setShowAvailable(e.value)}/>

        <Divider layout="vertical"/>

        <label style={{maxWidth: '8rem', color: 'white'}}>Indisponibles</label>
        <InputSwitch className="ml-1 mb-1" checked={showUnavailable} onChange={e => setShowUnavailable(e.value)}/>

    </>;

    return <SearchContext.Provider value={{selectedVersion, versionsOfGens: GENS[genIndex], showAvailable, showUnavailable, filteredPokemons: pokemons, getPokemon}}>

        <div className="p-1">
            <Toolbar style={{backgroundColor: GENS[genIndex][versionIndex].color, width: '100%', backdropFilter: 'blur(20px) saturate(180%)', borderRadius: '18px', position: 'fixed', zIndex: 999}}
                     className="mb-4 pl-8 pr-8 pb-2 pt-2" left={left}
                     right={<InputText placeholder="Recherche (nom, id, lieu, version)" style={{width: '17rem'}} value={search} onChange={e => setSearch(e.target.value)}/>}
            ></Toolbar>
        </div>


        {props.children}
    </SearchContext.Provider>
}

function getSearchVersion(search: string, genIndex: number){
    let s = search.toLowerCase();
    let reverse = false;
    if(search.startsWith('!')){
        reverse = true;
        s = s.slice(1);
    }
    let versionFiltre : VersionType | undefined = GENS[genIndex]
        .find(v => v.value.toLowerCase() === s
            || v.label.toLowerCase() === s);

    return versionFiltre ? {
        reverse,
        version: versionFiltre.value
    } : false;
}

const preEvolution = (pk: Pkmn) => allPkmn.find(p => p.base_name === pk.preEvoBaseName);
export const isDispoInVersion = (v: string, pk ?: Pkmn): boolean => {
    if(!pk) return false;
    const preEvo = preEvolution(pk);
    return pk.locations.some(l => v.includes(l.version))
        || (preEvo ? isDispoInVersion(v, preEvo) : false);
}
