import {allPkmn} from "../../data/consts";
import React, {useState} from "react";
import {Pkmn} from "../../data/Pkmn";
import './SearchToolbar.css';
import {isMobile} from 'react-device-detect';
import {MobileSpeeddialButton} from "./MobileSpeeddialButton";
import {PCSearchBar} from "./PCSearchBar";
import {MaskFilter} from "./MaskEnum";

export type FilterElements = {
    search: string,
    maskAvailable: boolean,
    maskUnavailable: boolean,
    maskCaptured: MaskFilter,
    maskNotCaptured: MaskFilter,
}

type SearchToolbarProps = {
    onSearchChange: (_: FilterElements) => void,
    setVersionIndex: (_: number) => void
};

export type FilterProps = {
    filters: FilterElements,
    setFilters: <K extends keyof FilterElements>(key: K, val: FilterElements[K]) => void
}


export const SearchToolbar = ({onSearchChange, setVersionIndex}: SearchToolbarProps) => {


    const [filters, _setFilters] = useState<FilterElements>({
        search: '',
        maskAvailable: false,
        maskUnavailable: false,
        maskCaptured: MaskFilter.None,
        maskNotCaptured: MaskFilter.None,
    });


    const setFilters = <K extends keyof typeof filters>(key: K, val: typeof filters[K]) => {
        const newSearchState = {...filters, [key]: val};
        onSearchChange(newSearchState);
        _setFilters(newSearchState)
    }

    return isMobile ? <MobileSpeeddialButton  filters={filters} setFilters={setFilters}/>
                    : <PCSearchBar filters={filters} setFilters={setFilters}/>;

}




const preEvolution = (pk: Pkmn) => allPkmn.find(p => p.base_name === pk.preEvoBaseName);
export const isDispoInVersion = (v: string, pk ?: Pkmn): boolean => {
    if(!pk) return false;
    const preEvo = preEvolution(pk);
    return pk.locations.some(l => v.includes(l.version))
        || pk.evolving_methods.length > 0
        || (preEvo ? isDispoInVersion(v, preEvo) : false);
}
