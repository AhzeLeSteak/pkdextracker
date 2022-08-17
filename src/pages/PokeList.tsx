import React, {useEffect, useState} from 'react';
import {Capture, Pkmn} from "../data/Pkmn";
import PokeCard from "../components/PokeCard";
import {PokeDetails} from "../components/PokeDetails";
import {useSearchContext} from "../components/SearchToolbar";
import {useCollectionData} from "react-firebase-hooks/firestore";
import {COLLECTIONS, getFirestore} from "../firebase/firebase-config";
import {collection} from 'firebase/firestore'

function PokeList() {

    const [showDialog, setShowDialog] = useState(false);
    const [selectedPkmnId, setSelectedPkmnId] = useState<number>(1);

    const showLocationDetails = (pk: Pkmn) => {
        setSelectedPkmnId(pk.id);
        setShowDialog(true);
    }

    const {filteredPokemons} = useSearchContext();

    const [captures] = useCollectionData(collection(getFirestore(), COLLECTIONS.captures));

    const [captureMap, setCaptureMap] = useState<Map<number, Capture[]>>(new Map());

    useEffect(() => {
        const tmp = new Map<number, Capture[]>();
        for(const capture of captures || []){
            const id = capture.pkmnId;
            if(!tmp.has(id))
                tmp.set(id, []);
            tmp.set(id, [...(tmp.get(id)!), {uid: capture.uid, version: capture.version, inPc: capture.inPc}]);
        }
        setCaptureMap(tmp);
    }, [captures])

    return <>

        <div className="grid pt-8">
            <div className="col-1"></div>
            <div className="col-10">
                <div className="grid">
                    {filteredPokemons.map(pk => (
                        <div key={pk.id} className="col-3">
                            <PokeCard pk={pk} captures={captureMap.get(pk.id) || []}  showLocationDetail={showLocationDetails}></PokeCard>
                        </div>))}
                </div>
            </div>
        </div>

        {selectedPkmnId && <PokeDetails pkmnId={selectedPkmnId} setPkmnId={setSelectedPkmnId}
                                        showDialog={showDialog} setShowDialog={setShowDialog}
                                        captures={captureMap.get(selectedPkmnId) || []}/>}
    </>;
}

export default PokeList;
