import React, {useState} from "react";
import {VersionType} from "../data/consts";
import {addDoc, collection, getDocs, query, setDoc, where} from "firebase/firestore";
import {COLLECTIONS, getFirestore} from "../firebase/firebase-config";
import {deleteDoc} from "@firebase/firestore";
import {useAuthContext} from "../firebase/AuthProvider";
import {Capture} from "../data/Pkmn";
import './CaptureBadges.css'
import {Button} from "primereact/button";
import {useSearchContext} from "../pages/PokeList";

export const CaptureBadges = ({pkmnId, captures}: {pkmnId: number, captures: Capture[]}) => {

    const {versionsOfGen} = useSearchContext();
    const {user} = useAuthContext();

    const [loading, setLoading] = useState<number[]>([]);
    const addLoading = (i: number) => setLoading(l => [...l, i]);
    const removeLoading = (i: number) => setLoading(l => l.filter(el => el !== i));

    function getDoc(v: VersionType){
        const captured_collection = collection(getFirestore(), COLLECTIONS.captures);
        let q = query(captured_collection, where('pkmnId', '==', pkmnId));
        q = query(q, where('uid', '==', user?.uid));
        q = query(q, where('version', '==', v.value));
        return getDocs(q)
            .then(({docs}) => docs[0]);
    }

    async function setCaptured(version: VersionType, inPc: boolean, buttonIndex: number) {
        addLoading(buttonIndex);
        getDoc(version)
            .then(doc => {
                const capture = doc.data() as Capture;
                capture.inPc = inPc;
                return setDoc(doc.ref, capture);
            })
            .catch(() => {
                const capture_collection = collection(getFirestore(), COLLECTIONS.captures);
                return addDoc(capture_collection, {
                    uid: user?.uid,
                    pkmnId,
                    version: version.value,
                    inPc
                } as Capture)
            })
            .then(() => removeLoading(buttonIndex));

    }

    function deleteCapture(v: VersionType, buttonIndex: number) {
        addLoading(buttonIndex);
        return getDoc(v).then(d => deleteDoc(d.ref)).then(() => removeLoading(buttonIndex));
    }

    const loadingBtn = (cls: string) => <Button
        className={'p-button-rounded ' + cls}
        style={{color: 'black'}}
        label="Chargement"
    ></Button>

    return <div style={{textAlign: 'center'}}>
        {versionsOfGen.map((v, i) => {
                const capture = captures.find(c => c.uid === user?.uid && c.version === v.value);
                const inPc = capture && capture.inPc;
                return <div key={v.value} className="row" style={{backgroundColor: v.color}}>
                    {loading.includes(i*2) ? loadingBtn('first') :
                        <Button style={capture ? {backgroundColor: v.color, color: 'white'} : {}}
                                      className={'p-button-rounded first ' + (!capture ? 'p-button-outlined' : '')}
                                      label="Pokédex"
                                      onClick={() => !capture ? setCaptured(v, false, i*2) : deleteCapture(v, i*2)}
                        ></Button>}
                    {loading.includes(i*2+1) ? loadingBtn('second') :
                        <Button style={inPc ? {backgroundColor: v.color, color: 'white'} : {}}
                                      className={'p-button-rounded second ' + (!inPc ? 'p-button-outlined' : '')}
                                      label="PC/équipe"
                                      onClick={() => setCaptured(v, !inPc, i*2+1)}
                        ></Button>}

                </div>
            }
        )}
    </div>
};
