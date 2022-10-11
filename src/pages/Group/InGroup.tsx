import {useGroup} from "../../hooks/useGroup";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {useState} from "react";
import {Dialog} from "primereact/dialog";
import {UserIdRow} from "./ImgTxtBtnRow";
import {AddToGroup} from "./AddToGroup";
import {useAuthContext} from "../../firebase/AuthProvider";
import {collection, doc, getDocs, Query, query, updateDoc, where} from "firebase/firestore";
import {COLLECTIONS, getFirestore} from "../../firebase/firebase-config";
import {Group} from "../../data/User";
import {useNavigate} from "react-router-dom";
import {deleteDoc} from "@firebase/firestore";
import {isMobile} from "react-device-detect";

export const InGroup = () => {

    const {user, getUserRef} = useAuthContext();
    const {group, isOwner} = useGroup();
    const [showDialog, setShowDialog] = useState(false);
    const navigate = useNavigate();

    if (!group)
        return <></>;

    const getGroupDoc = () => {
        const groupCollection = collection(getFirestore(), COLLECTIONS.GROUPS);
        const groupQuery = query(groupCollection, where('owner_uid', '==', group.owner_uid)) as Query<Group>;
        return getDocs(groupQuery).then(({docs}) => docs[0]);
    }

    const leaveGroup = async() => {
        const doc = await getGroupDoc();
        //ajout user connecté aux utilisateurs du groupe
        await updateDoc(doc.ref, {
            'users': group.users.filter(uid => uid !== user?.uid)
        });
        const userRef = (await getUserRef())!;
        await updateDoc(userRef, {
            inGroup: false
        });
        navigate('/');
    };

    const deleteGroup = async() => {
        group.users
            .map(u => doc(getFirestore(), COLLECTIONS.USERS + u))
            .forEach(doc => updateDoc(doc, {inGroup: false}));

        const groupCollection = collection(getFirestore(), COLLECTIONS.GROUPS);
        const groupQuery = query(groupCollection, where('owner_uid', '==', group.owner_uid)) as Query<Group>;
        const group_doc = await getDocs(groupQuery).then(({docs}) => docs[0].ref);
        await deleteDoc(group_doc);
    };

    return <div className="grid" style={{overflowY: 'hidden'}}>
        <Card className="card-blur centered mb-4" style={isMobile ? {width: '100%'} : {}}>
            <h2 style={{marginTop: 0}}>Membres</h2>
            {group.users.map(uid => <UserIdRow key={uid} userId={uid}/>)}

            {!!group.invited.length && isOwner && <>
                <h2>Invités</h2>
                {group.invited.map(uid => <UserIdRow key={uid} userId={uid}/>)}
            </>}

            {isOwner && <div className="grid mt-1" onClick={() => setShowDialog(true)} style={{cursor: 'pointer'}}>
                <div className="col-2">
                    <Button icon="pi pi-plus" className="p-button-rounded"/>
                </div>
                <div className="col">
                    <h3>Inviter un utilisateur</h3>
                </div>
            </div>}

            {!isOwner && <div className="grid mt-1" onClick={leaveGroup} style={{cursor: 'pointer'}}>
                <div className="col-2">
                    <Button icon="pi pi-times" className="p-button-rounded p-button-danger"/>
                </div>
                <div className="col">
                    <h3>Quitter le groupe</h3>
                </div>
            </div>}

            {isOwner && <div className="grid mt-1" onClick={deleteGroup} style={{cursor: 'pointer'}}>
                <div className="col-2">
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-danger"/>
                </div>
                <div className="col">
                    <h3>Supprimer le groupe</h3>
                </div>
            </div>}

        </Card>

        <Dialog header="Inviter un utilisateur dans votre groupe" onHide={() => setShowDialog(false)} visible={showDialog}>
            <AddToGroup hide={() => setShowDialog(false)}></AddToGroup>
        </Dialog>


    </div>
}


