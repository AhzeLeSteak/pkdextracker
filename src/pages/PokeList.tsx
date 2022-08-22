import React, {createContext, useContext, useEffect, useState} from 'react';
import {Capture, Pkmn} from "../data/Pkmn";
import PokeCard from "../components/PokeCard/PokeCard";
import {PokeDetails} from "../components/PokeDetails/PokeDetails";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {COLLECTIONS, getFirestore} from "../firebase/firebase-config";
import {collection, getDocs, query, where} from 'firebase/firestore'
import {allPkmn, GENS, PKMN_COUNT_BY_GEN, VersionName, VersionType} from "../data/consts";
import {FilterElements, isDispoInVersion, SearchToolbar} from "../components/Toolbar/SearchToolbar";
import {useAuthContext} from "../firebase/AuthProvider";
import {isMobile} from "react-device-detect";

export type SearchContextType = {
    genIndex: number,
    versionIndex: number,
    setVersionIndex: (_: number) => void,
    selectedVersionValue: string,
    versionsOfGen: VersionType[],
    getPokemon: (id: number) => Pkmn | null,
}
const SearchContext = createContext<SearchContextType>({
    genIndex: 0,
    versionIndex: 0,
    setVersionIndex: () => null,
    selectedVersionValue: 'red',
    versionsOfGen: GENS[0],
    getPokemon: () => null
});

export const useSearchContext = () => useContext(SearchContext);


function PokeList({genIndex}: {genIndex: number}) {
    const nbPk = PKMN_COUNT_BY_GEN[genIndex];
    const startIndex = PKMN_COUNT_BY_GEN.slice(0, genIndex).reduce((a, b) => a+b, 0);

    const [pokemons, setPokemons] = useState<Pkmn[]>(allPkmn.slice(startIndex, nbPk+startIndex));
    const [versionIndex, setVersionIndex] = useState(0);

    const [showDialog, setShowDialog] = useState(false);
    const [selectedPkmnId, setSelectedPkmnId] = useState<number>(0);

    const {user} = useAuthContext();
    const [usersOfGroup, setUsersOfGroup] = useState<string[]>([user!.uid!]);

    useEffect(() => {
        const groups = collection(getFirestore(), COLLECTIONS.GROUPS);
        let groupsQuery = query(groups, where('users', 'array-contains', user?.uid));
        getDocs(groupsQuery).then(({docs}) => {
            const groups = docs.map(d => d.data()) as unknown as {users: string[]}[];
            if(groups.length)
                setUsersOfGroup(groups[0].users);
        })

    }, [user]);

    const captureCollection = collection(getFirestore(), COLLECTIONS.CAPTURES);
    const captureQuery = query(captureCollection, where('uid', 'in', usersOfGroup));
    const [captures] = useCollectionData(captureQuery) as unknown as [Capture[] | undefined, boolean];

    const selectedVersionValue = GENS[genIndex][versionIndex].value;
    const onSearchChange = (f: FilterElements) => setPokemons(filterPokemons(genIndex, selectedVersionValue, GENS[genIndex], captures || [], f));


    return <>
        <SearchContext.Provider value={{
            genIndex, versionIndex,
            setVersionIndex,
            versionsOfGen: GENS[genIndex],
            selectedVersionValue,
            getPokemon: (id) => allPkmn[id-1]}}
        >
            <SearchToolbar onSearchChange={onSearchChange} setVersionIndex={setVersionIndex}></SearchToolbar>
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

        </SearchContext.Provider>
    </>;
}

function filterPokemons(genIndex: number, selectedVersion: VersionName, versionsOfGen: VersionType[], captures: Capture[], f: FilterElements){
    const nbPk = PKMN_COUNT_BY_GEN[genIndex];
    const startIndex = PKMN_COUNT_BY_GEN.slice(0, genIndex).reduce((a, b) => a+b, 0);
    return allPkmn.slice(startIndex, nbPk+startIndex).filter(pk => {

        //recherche dispo / pas dispo
        const dispo = versionsOfGen.some(v => isDispoInVersion(v.value, pk));
        if (!f.showAvailable && dispo)
            return false;
        if (!f.showUnavailable && !dispo)
            return false;
        const captured = !!captures.find(c => c.pkmnId === pk.id && versionsOfGen.map(v => v.value).includes(c.version));
        if(!f.showCaptured && captured)
            return false;
        if(!f.showNotCaptured && !captured)
            return false;

        if (f.search === '')
            return true;

        //recherche index
        const index = parseInt(f.search);
        if (!isNaN(index))
            return pk.id === index;

        //recherche par nom
        const srch = f.search.toLowerCase();
        return pk.name.toLowerCase().includes(srch)
            || pk.base_name.toLowerCase().includes(srch)
            || pk.locations.some(l => l.version === selectedVersion && l.label.toLowerCase().includes(srch))
    })
}

export default PokeList;
