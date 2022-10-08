import React, {createContext, useContext, useEffect, useState} from 'react';
import {Capture, Pkmn} from "../data/Pkmn";
import PokeCard from "../components/PokeCard/PokeCard";
import {PokeDetails} from "../components/PokeDetails/PokeDetails";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {COLLECTIONS, getFirestore} from "../firebase/firebase-config";
import {collection, getDocs, Query, query, where} from 'firebase/firestore'
import {allPkmn, GENS, PKMN_COUNT_BY_GEN, VersionName, VersionType} from "../data/consts";
import {FilterElements, isDispoInVersion, SearchToolbar} from "../components/Toolbar/SearchToolbar";
import {isMobile} from "react-device-detect";
import {useGroup} from "../hooks/useGroup";
import {useAuthContext} from "../firebase/AuthProvider";
import {MaskFilter} from "../components/Toolbar/MaskEnum";

export type SearchContextType = {
    genIndex: number,
    versionIndex: number,
    setVersionIndex: (_: number) => void,
    selectedVersionValue: string,
    versionsOfGen: VersionType[],
    captures: Capture[]
}
const SearchContext = createContext<SearchContextType>({
    genIndex: 0,
    versionIndex: 0,
    setVersionIndex: () => null,
    selectedVersionValue: 'red',
    versionsOfGen: GENS[0],
    captures: []
});

export const useDataContext = () => useContext(SearchContext);


function PokeList({genIndex}: {genIndex: number}) {
    const nbPk = PKMN_COUNT_BY_GEN[genIndex];
    const startIndex = PKMN_COUNT_BY_GEN.slice(0, genIndex).reduce((a, b) => a+b, 0);

    const [pokemons, setPokemons] = useState<Pkmn[]>(allPkmn.slice(startIndex, nbPk+startIndex));
    const [versionIndex, setVersionIndex] = useState(0);

    const [showDialog, setShowDialog] = useState(false);
    const [selectedPkmnId, setSelectedPkmnId] = useState<number>(0);

    const {group} = useGroup();
    const {user} = useAuthContext();
    const group_users = group ? group.users : [user!.uid];


    const captureCollection = collection(getFirestore(), COLLECTIONS.CAPTURES);
    const captureQuery = query(captureCollection, where('uid', 'in', group_users)) as Query<Capture>;
    let [captures] = useCollectionData(captureQuery);
    if(!captures)
        captures = [];

    const selectedVersionValue = GENS[genIndex][versionIndex].value;
    const onSearchChange = (f: FilterElements) => setPokemons(filterPokemons(genIndex, selectedVersionValue, GENS[genIndex], captures || [], f, user!.uid, group_users));


    return <SearchContext.Provider value={{
        genIndex, versionIndex,
        setVersionIndex,
        versionsOfGen: GENS[genIndex],
        selectedVersionValue,
        captures
    }}
    >
        <SearchToolbar onSearchChange={onSearchChange}></SearchToolbar>
        <div className={'grid '+(isMobile ? '' : 'pt-8')}>
            <div className="col-0 md:col-1 lg:col-1"></div>
            <div className="col-12 md:col-10 lg:col-10">
                <div className="grid">
                    {pokemons.map((pk, i) => (
                        <div key={pk.id} className="col-12 md:col-4 lg:col-3">
                            <PokeCard pk={pk} captures={captures?.filter(c => c.pkmnId === pk.id) || []}
                                      onClick={() => {setSelectedPkmnId(i);setShowDialog(true)}}/>
                        </div>))}
                </div>
            </div>
        </div>

        {showDialog && <PokeDetails pkmnId={selectedPkmnId} setPkmnId={setSelectedPkmnId} pokemons={pokemons}
                                    showDialog={showDialog} setShowDialog={setShowDialog}
                                    captures={captures?.filter(c => c.pkmnId === pokemons[selectedPkmnId].id) || []}/>
        }

    </SearchContext.Provider>;
}

function filterPokemons(genIndex: number, selectedVersion: VersionName, versionsOfGen: VersionType[], captures: Capture[], f: FilterElements, uid: string, group_uids: string[]){
    const nbPk = PKMN_COUNT_BY_GEN[genIndex];
    const startIndex = PKMN_COUNT_BY_GEN.slice(0, genIndex).reduce((a, b) => a+b, 0);
    const index = parseInt(f.search);
    return allPkmn.slice(startIndex, nbPk+startIndex).filter(pk => {

        //recherche dispo / pas dispo
        const dispo = isDispoInVersion(selectedVersion, pk);
        if (f.maskAvailable && dispo)
            return false;
        if (f.maskUnavailable && !dispo)
            return false;

        const pk_captures = captures.filter(c => c.pkmnId === pk.id && versionsOfGen.map(v => v.value).includes(c.version));
        const captured_by_user = pk_captures.some(c => c.uid === uid);
        const captured_by_group = pk_captures.some(c => group_uids.includes(c.uid));

        if((f.maskCaptured === MaskFilter.FromYou && captured_by_user) || (f.maskCaptured === MaskFilter.FromGroup && captured_by_group))
            return false;

        if((f.maskNotCaptured === MaskFilter.FromYou && !captured_by_user) || (f.maskNotCaptured === MaskFilter.FromGroup && !captured_by_group))
            return false;

        if (f.search === '')
            return true;

        //recherche index
        if (!isNaN(index))
            return pk.id === index;

        //recherche par nom / lieu
        const srch = f.search.toLowerCase();
        return pk.name.toLowerCase().includes(srch)
            || pk.base_name.toLowerCase().includes(srch)
            || pk.locations.some(l => l.version === selectedVersion && l.label.toLowerCase().includes(srch))
    })
}

export default PokeList;
