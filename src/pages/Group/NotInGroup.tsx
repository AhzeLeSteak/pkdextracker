import {Card} from "primereact/card";
import {ImgTxtBtnRow} from "./ImgTxtBtnRow";
import {Group} from "../../data/User";
import {useUser} from "../../hooks/useUser";
import {Button} from "primereact/button";
import {addDoc, collection, CollectionReference, getDocs, query, Query, updateDoc, where} from "firebase/firestore";
import {COLLECTIONS, getFirestore} from "../../firebase/firebase-config";
import {useAuthContext} from "../../firebase/AuthProvider";
import {useInvitation} from "../../hooks/useGroup";
import {InputText} from "primereact/inputtext";
import {Dialog} from "primereact/dialog";
import React, {useState} from "react";
import {isMobile} from "react-device-detect";

export const NotInGroup = () => {
    const groups = useInvitation();
    const [createGroupDialogVisible, setCreateGroupDialogVisible] = useState(false);
    const {user, getUserRef} = useAuthContext();
    const [groupName, setGroupName] = useState('');

    const createGroup = async () => {
        const group_collection = collection(getFirestore(), COLLECTIONS.GROUPS) as unknown as CollectionReference<Group>;
        addDoc<Group>(group_collection, {
            users: [user!.uid],
            owner_uid: user!.uid,
            invited: [],
            name: groupName
        })
            .then(() => setCreateGroupDialogVisible(false));
        const userRef = (await getUserRef())!
        updateDoc(userRef, {
            inGroup: true
        })
    };

    return <div className="grid" style={{overflowY: 'hidden'}}>
        <Card className="card-blur centered" style={isMobile ? {width: '100%'} : {}}>

            <div className="grid mt-1" onClick={() => setCreateGroupDialogVisible(true)} style={{cursor: 'pointer'}}>
                <div className="col-2">
                    <Button icon="pi pi-plus" className="p-button-rounded"/>
                </div>
                <div className="col">
                    <h3>Créer un groupe</h3>
                </div>
            </div>

            {groups && groups.length > 0 && <>
                <h2>Groupe vous ayant invité</h2>

                {groups.map(group => <GroupRow key={group.owner_uid} group={group}/>)}
            </>}

        </Card>

        <Dialog onHide={() => setCreateGroupDialogVisible(false)} visible={createGroupDialogVisible} style={{width: '500px'}}
                header={<>Choisissez un nom de groupe</>}
                footer={<Button label="Valider" icon="pi pi-check" onClick={createGroup} />}>
            <InputText value={groupName} onChange={e => setGroupName(e.target.value)} style={{width: '100%'}}/>
        </Dialog>
    </div>
}


const GroupRow = ({group}: {group: Group}) => {
    const owner = useUser(group.owner_uid);
    const {user, getUserRef} = useAuthContext();

    const getGroupDoc = () => {
        const groupCollection = collection(getFirestore(), COLLECTIONS.GROUPS);
        const groupQuery = query(groupCollection, where('owner_uid', '==', group.owner_uid)) as Query<Group>;
        return getDocs(groupQuery).then(({docs}) => docs[0]);
    }

    const accept = async() => {
        const doc = await getGroupDoc();
        //ajout user connecté aux utilisateurs du groupe
        await updateDoc(doc.ref, {
            'users': [...group.users, user?.uid]
        });

        //suppresion des invitations de cet utilisateurs
        const query_groups = query(collection(getFirestore(), COLLECTIONS.GROUPS), where('invited', 'array-contains', user!.uid)) as Query<Group>
        const groupsThatInvitedUser = await getDocs(query_groups);
        groupsThatInvitedUser.docs.forEach(doc =>
            updateDoc(doc.ref, {
                'invited': doc.data().invited.filter(uid => uid !== user?.uid)
            }));

        const userRef = (await getUserRef())!;
        await updateDoc(userRef, {
            'inGroup': true
        });
    }

    const refus = async () => {
        const doc = await getGroupDoc();
        //ajout user connecté aux utilisateurs du groupe
        await updateDoc(doc.ref, {
            'invited': group.invited.filter(uid => uid !== user?.uid)
        });
    }

    const buttons = <>
        <Button icon="pi pi-check"
                className="p-button-rounded p-button-text"
                aria-label="Submit"
                onClick={accept}
        />
        <Button icon="pi pi-times"
                className="p-button-rounded p-button-danger p-button-text"
                aria-label="Cancel"
                onClick={refus}
        />
    </>;

    return owner ?
        <ImgTxtBtnRow imgUrl={owner?.photoUrl}
                      text={group.name + ' - créé par ' + owner.name}
                      buttons={buttons}
        />
        : <></>
}