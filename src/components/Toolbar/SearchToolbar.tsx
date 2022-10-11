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
    nationalDex: boolean
}

export type DialogProps = {
    visible: boolean,
    setVisible: (_: boolean) => void,
    inline ?: true
}


export const SearchToolbar = () => {

    return isMobile ? <MobileSpeeddialButton />
                    : <PCSearchBar />;

}




const preEvolution = (pk: Pkmn) => allPkmn.find(p => p.base_name === pk.preEvoBaseName);
export const isDispoInVersion = (v: string, pk ?: Pkmn): boolean => {
    if(!pk) return false;
    const preEvo = preEvolution(pk);
    return pk.locations.some(l => v.includes(l.version))
        || pk.evolving_methods.length > 0
        || (preEvo ? isDispoInVersion(v, preEvo) : false);
}
