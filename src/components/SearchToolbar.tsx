import {Link} from "react-router-dom";
import {SelectButton} from "primereact/selectbutton";
import {allPkmn, GENS, PKMN_COUNT_BY_GEN, VersionType} from "../data/consts";
import {Divider} from "primereact/divider";
import React, {useEffect, useState} from "react";
import {InputText} from "primereact/inputtext";
import {Toolbar} from "primereact/toolbar";
import {Pkmn} from "../data/Pkmn";
import {ToggleButton} from "primereact/togglebutton";
import {useSearchContext} from "../pages/PokeList";


export const SearchToolbar = ({setPkmns, setVersionIndex}: {setPkmns: (_: Pkmn[]) => void, setVersionIndex: (_: number) => void}) => {

    const {genIndex, versionIndex, selectedVersionValue} = useSearchContext();

    const [search, _setSearch] = useState('');
    const [showUnavailable, _setShowUnavailable] = useState(true);
    const [showAvailable, _setShowAvailable] = useState(true);
    const [mustUpdate, setMustUpdate] = useState(false);
    const update = () => setMustUpdate(true);

    const nbPk = PKMN_COUNT_BY_GEN[genIndex];
    const startIndex = PKMN_COUNT_BY_GEN.slice(0, genIndex).reduce((a, b) => a+b, 0);

    //const srchVersion = useMemo(() => getSearchVersion(search, genIndex), [search, genIndex]);


    if(mustUpdate){
        setMustUpdate(false);
        setPkmns(allPkmn.slice(startIndex, nbPk+startIndex).filter(pk => {
            //if (srchVersion)
            //    return isDispoInVersion(srchVersion.version, pk) !== srchVersion.reverse;

            //recherche dispo / pas dispo
            const dispo = isDispoInVersion(selectedVersionValue, pk);
            if (!showAvailable && dispo)
                return false;
            if (!showUnavailable && !dispo)
                return false;

            if (search === '')
                return true;

            //recherche index
            const index = parseInt(search);
            if (!isNaN(index))
                return pk.id == index;

            //recherche par nom
            const srch = search.toLowerCase();
            return pk.name.toLowerCase().includes(srch)
                || pk.base_name.toLowerCase().includes(srch)
                || pk.locations.some(l => l.version === selectedVersionValue && l.label.toLowerCase().includes(srch))
        }));
    }

    const setSearch = (e: string) => {  _setSearch(e); update() };
    const setShowUnavailable = (e: boolean) => {  _setShowUnavailable(e); update() };
    const setShowAvailable = (e: boolean) => {  _setShowAvailable(e); update() };

    useEffect(() => update(), []);


    const left = <>
        <Link to={'/'} style={{textDecoration: 'none'}}><div style={{color: 'white', fontSize: '36px'}}>Pkdex Tracker</div></Link>
        <SelectButton className="ml-4 mr-4" value={versionIndex} options={GENS[genIndex]} optionLabel="label"
                      onChange={(e) => setVersionIndex(GENS[genIndex].findIndex(v => v.value === e.value))}/>
        <Divider layout="vertical"/>
        <ToggleButton className="ml-1" onLabel="Disponibles affichés" offLabel="Disponibles cachés" checked={showAvailable} onChange={e => setShowAvailable(e.value)}/>
        <Divider layout="vertical"/>
        <ToggleButton className="ml-1" onLabel="Indisponibles affichés" offLabel="Indisponibles cachés" checked={showUnavailable} onChange={e => setShowUnavailable(e.value)}/>

    </>;

    return <div className="p-1">
        <Toolbar style={{backgroundColor: GENS[genIndex][versionIndex].color, width: '100%', backdropFilter: 'blur(20px) saturate(180%)', borderRadius: '18px', position: 'fixed', zIndex: 999}}
                 className="mb-4 pl-8 pr-8 pb-2 pt-2" left={left}
                 right={<InputText placeholder="Recherche (nom, id, lieu, version)" style={{width: '17rem'}} value={search} onChange={e => setSearch(e.target.value)}/>}
        ></Toolbar>
    </div>
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
