import React, {createContext, useContext, useState} from 'react';
import {Capture, Pkmn} from "../data/Pkmn";
import PokeCard from "../components/PokeCard";
import {PokeDetails} from "../components/PokeDetails";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {COLLECTIONS, getFirestore} from "../firebase/firebase-config";
import {collection} from 'firebase/firestore'
import {allPkmn, GENS, VersionType} from "../data/consts";
import {SearchToolbar} from "../components/SearchToolbar";

export type SearchContextType = {
    genIndex: number,
    versionIndex: number,
    selectedVersionValue: string,
    versionsOfGen: VersionType[],
    getPokemon: (id: number) => Pkmn | null,
}
const SearchContext = createContext<SearchContextType>({
    versionIndex: 0,
    genIndex: 0,
    selectedVersionValue: '',
    versionsOfGen: [],
    getPokemon: () => null
});

export const useSearchContext = () => useContext(SearchContext);


function PokeList({genIndex}: {genIndex: number}) {

    const [pokemons, setPokemons] = useState<Pkmn[]>([]);
    const [versionIndex, setVersionIndex] = useState(0);

    const [showDialog, setShowDialog] = useState(false);
    const [selectedPkmnId, setSelectedPkmnId] = useState<number>(1);

    const showLocationDetails = (pk: Pkmn) => {
        setSelectedPkmnId(pk.id);
        setShowDialog(true);
    }


    const [captures] = useCollectionData(collection(getFirestore(), COLLECTIONS.captures)) as unknown as [Capture[] | undefined, boolean];


    return <>
        <SearchContext.Provider value={{
            genIndex, versionIndex,
            versionsOfGen: GENS[genIndex],
            selectedVersionValue: GENS[genIndex][versionIndex].value,
            getPokemon: (id) => allPkmn[id-1]}}
        >
            <SearchToolbar setPkmns={setPokemons} setVersionIndex={setVersionIndex}></SearchToolbar>
            <div className="grid pt-8">
                <div className="col-1"></div>
                <div className="col-10">
                    <div className="grid">
                        {pokemons.map(pk => (
                            <div key={pk.id} className="col-3">
                                <PokeCard pk={pk} captures={captures?.filter(c => c.pkmnId === pk.id) || []} onClick={() => showLocationDetails(pk)}></PokeCard>
                            </div>))}
                    </div>
                </div>
            </div>

            {selectedPkmnId && <PokeDetails pkmnId={selectedPkmnId} setPkmnId={setSelectedPkmnId}
                                            showDialog={showDialog} setShowDialog={setShowDialog}
                                            captures={captures?.filter(c => c.pkmnId === selectedPkmnId) || []}/>}
        </SearchContext.Provider>
    </>;
}

export default PokeList;
