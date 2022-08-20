import {allPkmn} from "../../data/consts";
import React, {useState} from "react";
import {Pkmn} from "../../data/Pkmn";
import './SearchToolbar.css';
import {isMobile} from 'react-device-detect';
import {MobileSpeeddialButton} from "./MobileSpeeddialButton";
import {PCSearchBar} from "./PCSearchBar";

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

export type FilterProps = {
    filters: FilterElements,
    setFilters: <K extends keyof FilterElements>(key: K, val: FilterElements[K]) => void,
    setVersionIndex: (_: number) => void
}


export const SearchToolbar = ({onSearchChange, setVersionIndex}: SearchToolbarProps) => {


    const [filters, _setFilters] = useState<FilterElements>({
        search: '',
        showAvailable: true,
        showUnavailable: true,
        showCaptured: true,
        showNotCaptured: true,
    });


    const setFilters = <K extends keyof typeof filters>(key: K, val: typeof filters[K]) => {
        const newSearchState = {...filters, [key]: val};
        onSearchChange(newSearchState);
        _setFilters(newSearchState)
    }

    return isMobile ? <MobileSpeeddialButton setVersionIndex={setVersionIndex} filters={filters} setFilters={setFilters}/>
                    : <PCSearchBar setVersionIndex={setVersionIndex} filters={filters} setFilters={setFilters}/>;

}




const preEvolution = (pk: Pkmn) => allPkmn.find(p => p.base_name === pk.preEvoBaseName);
export const isDispoInVersion = (v: string, pk ?: Pkmn): boolean => {
    if(!pk) return false;
    const preEvo = preEvolution(pk);
    return pk.locations.some(l => v.includes(l.version))
        || (preEvo ? isDispoInVersion(v, preEvo) : false);
}
