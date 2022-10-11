import React, {createContext, useContext, useMemo, useState} from 'react';
import {Capture, Pkmn} from "../../data/Pkmn";
import {PokeDetails} from "../../components/PokeDetails/PokeDetails";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {COLLECTIONS, getFirestore} from "../../firebase/firebase-config";
import {collection, Query, query, where} from 'firebase/firestore'
import {allPkmn, GENS, PKMN_COUNT_BY_GEN} from "../../data/consts";
import {FilterElements, isDispoInVersion, SearchToolbar} from "../../components/Toolbar/SearchToolbar";
import {useGroup} from "../../hooks/useGroup";
import {useAuthContext} from "../../firebase/AuthProvider";
import {MaskFilter} from "../../components/Toolbar/MaskEnum";
import {PokeList} from "./PokeList";
import {SpeedDial} from "primereact/speeddial";
import {useNavigate} from "react-router-dom";
import {isMobile} from "react-device-detect";

export type SearchContextType = {
    genIndex: number,
    versionIndex: number,
    setVersionIndex: (_: number) => void,
    captures: Capture[],
    filters: FilterElements,
    setFilters: <K extends keyof FilterElements>(key: K, val: FilterElements[K]) => void
}

const defaultFilterValue: FilterElements = {
    search: '',
    maskAvailable: false,
    maskUnavailable: false,
    maskCaptured: MaskFilter.None,
    maskNotCaptured: MaskFilter.None,
    nationalDex: false
};

const SearchContext = createContext<SearchContextType>({
    genIndex: 0,
    versionIndex: 0,
    setVersionIndex: () => null,
    captures: [],
    filters: defaultFilterValue,
    setFilters: () => null
});

export const useDataContext = () => useContext(SearchContext);


function ListPage({genIndex}: {genIndex: number}) {
    const navigate = useNavigate();
    const [versionIndex, setVersionIndex] = useState(0);
    const [_selectedPkmnId, setSelectedPkmnId] = useState<number>(-1);

    const {group} = useGroup();
    const {user} = useAuthContext();
    const group_users = group ? group.users : [user!.uid];


    const captureCollection = collection(getFirestore(), COLLECTIONS.CAPTURES);
    const captureQuery = query(captureCollection, where('uid', 'in', group_users)) as Query<Capture>;
    let [captures] = useCollectionData(captureQuery);
    if(!captures)
        captures = [];

    const [filters, _setFilters] = useState<FilterElements>(defaultFilterValue);
    const setFilters = <K extends keyof FilterElements>(key: K, val: FilterElements[K]) => _setFilters({
        ...filters,
        [key]: val
    })

    const pokemons: Pkmn[] = useMemo(() => {
        const nbPk = PKMN_COUNT_BY_GEN[genIndex];
        const startIndex = PKMN_COUNT_BY_GEN.slice(0, genIndex).reduce((a, b) => a+b, 0);
        const index = parseInt(filters.search);
        const versionsOfGen = GENS[genIndex];
        const selectedVersion = versionsOfGen[versionIndex].value;
        return allPkmn.slice(filters.nationalDex ? 0 :startIndex, nbPk+startIndex).filter(pk => {

            //recherche dispo / pas dispo
            const dispo = isDispoInVersion(selectedVersion, pk);
            if (filters.maskAvailable && dispo)
                return false;
            if (filters.maskUnavailable && !dispo)
                return false;

            const pk_captures = captures!.filter(c => c.pkmnId === pk.id && versionsOfGen.map(v => v.value).includes(c.version));
            const captured_by_user = pk_captures.some(c => c.uid === user!.uid);
            const captured_by_group = group ? pk_captures.some(c => group.users.includes(c.uid)) : [];

            if((filters.maskCaptured === MaskFilter.FromYou && captured_by_user) || (filters.maskCaptured === MaskFilter.FromGroup && captured_by_group))
                return false;

            if((filters.maskNotCaptured === MaskFilter.FromYou && !captured_by_user) || (filters.maskNotCaptured === MaskFilter.FromGroup && !captured_by_group))
                return false;

            if (filters.search === '')
                return true;

            //recherche index
            if (!isNaN(index))
                return pk.id === index;

            //recherche par nom / lieu
            const srch = filters.search.toLowerCase();
            return pk.name.toLowerCase().includes(srch)
                || pk.base_name.toLowerCase().includes(srch)
                || pk.locations.some(l => l.version === selectedVersion && l.label.toLowerCase().includes(srch))
        })
    }, [captures, filters.maskAvailable, filters.maskCaptured, filters.maskNotCaptured, filters.maskUnavailable, filters.nationalDex, filters.search, genIndex, group, user, versionIndex]);

    let selectedPkmnId = _selectedPkmnId;
    if(selectedPkmnId >= pokemons.length)
        selectedPkmnId--;

    return <SearchContext.Provider value={{
        genIndex,
        versionIndex,
        setVersionIndex,
        captures,
        filters, setFilters
    }}
    >
        <SearchToolbar></SearchToolbar>
        <PokeList pokemons={pokemons} captures={captures} setSelectedPkmnId={setSelectedPkmnId}/>

        {selectedPkmnId >= 0 && <PokeDetails pkmnId={selectedPkmnId} setPkmnId={setSelectedPkmnId} pokemons={pokemons}
                                             showDialog={selectedPkmnId >= 0} hide={() => setSelectedPkmnId(-1)}
                                             captures={captures.filter(c => c.pkmnId === pokemons[selectedPkmnId].id)}/>
        }

        {!isMobile && <SpeedDial model={[]} onClick={() => navigate('/')}
                                 direction="up" showIcon="pi pi-home" rotateAnimation={false}
                                 style={{left: '0.5em', bottom: '0.5em', position: 'fixed', zIndex: 99}}/>}

    </SearchContext.Provider>;
}


export default ListPage;
