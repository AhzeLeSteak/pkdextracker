import {Badge} from "primereact/badge";
import React, {useState} from "react";
import {useSearchContext} from "./SearchToolbar";
import {VersionType} from "../data/consts";
import {addDoc, collection, getDocs, query, where} from "firebase/firestore";
import {COLLECTIONS, getFirestore} from "../firebase/firebase-config";
import {deleteDoc} from "@firebase/firestore";
import {useAuthContext} from "../firebase/AuthProvider";
import {Capture} from "../data/Pkmn";

export const CaptureBadges = ({pkmnId, captures}: {pkmnId: number, captures: Capture[]}) => {

    const {versionsOfGens} = useSearchContext();
    const {user} = useAuthContext();

    const [loading, setLoading] = useState(-1);

    function setCapturedInVersion(version: VersionType, index: number) {
        const capture_collection = collection(getFirestore(), COLLECTIONS.captures);
        setLoading(index);
        addDoc(capture_collection, {
            uid: user?.uid,
            pkmnId,
            version: version.value
        })
            .then(() => setLoading(-1));
    }

    function setNotCaptured(v: VersionType, index: number) {
        const captued_collection = collection(getFirestore(), COLLECTIONS.captures);
        let q = query(captued_collection, where('pkmnId', '==', pkmnId));
        q = query(q, where('uid', '==', user?.uid));
        q = query(q, where('version', '==', v.value));
        setLoading(index);
        getDocs(q)
            .then(({docs}) => deleteDoc(docs[0].ref))
            .then(() => setLoading(-1));

    }

    return <div className="grid mt-4">
        <div className="col-4"></div>
        <div className="col-4" style={{textAlign: 'center'}}>
            {versionsOfGens.map((v, i) => {
                    const captured = captures.some(c => c.uid === user?.uid && c.version === v.value);
                    return <Badge key={v.value} style={{backgroundColor: v.color}} size='large'
                                  value={loading === i ? 'Loading' : (captured ? '✓' : 'x')}
                                  onClick={() => captured ? setNotCaptured(v, i) : setCapturedInVersion(v, i)}
                    ></Badge>;
                }
            )}
        </div>
    </div>
};
