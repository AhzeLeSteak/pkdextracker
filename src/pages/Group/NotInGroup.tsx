import {useInvitation} from "../../hooks/useGroup";
import {Card} from "primereact/card";
import {ImgTxtBtnRow, UserIdRow} from "./ImgTxtBtnRow";
import {Group} from "../../data/User";
import {useUser} from "../../hooks/useUser";
import {Button} from "primereact/button";
import {collection, getDocs, query, where} from "firebase/firestore";
import {COLLECTIONS, getFirestore} from "../../firebase/firebase-config";

export const NotInGroup = () => {

    const {groups} = useInvitation();




    return <div className="grid" style={{overflowY: 'hidden'}}>
        <Card className="card-blur centered">
            <h2>Groupe vous ayant invité</h2>

            {groups.map(group => <GroupRow key={group.owner_uid} group={group}/>)}

        </Card>
    </div>
}


const GroupRow = ({group}: {group: Group}) => {
    const owner = useUser(group.owner_uid);

    const getGroupRef = () => {
        const groupCollection = collection(getFirestore(), COLLECTIONS.GROUPS);
        const groupQuery = query(groupCollection, where('owner_uid', '==', group.owner_uid));
        return getDocs(groupQuery)
    }

    const buttons = <>
        <Button icon="pi pi-check" className="p-button-rounded p-button-text" aria-label="Submit"
                onClick={() => console.log('join group !', group)}
        />
        <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-text" aria-label="Cancel"
                onClick={() => console.log('remove invitation', group)}
        />
    </>;

    return owner ?
        <ImgTxtBtnRow imgUrl={owner?.photoUrl}
                      text={group.name + ' - créé par ' + owner.name}
                      buttons={buttons}
        />
        : <></>
}