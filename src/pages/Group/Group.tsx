import {useGroup} from "../../hooks/useGroup";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {useState} from "react";
import {Dialog} from "primereact/dialog";
import {UserIdRow} from "./UserRow";
import {AddToGroup} from "./AddToGroup";

export const Group = () => {

    const {inGroup, usersOfGroup, usersInvited} = useGroup();
    const [showDialog, setShowDialog] = useState(false);


    if(!inGroup)
        return <>"Gros nullos !"</>


    return <div className="grid" style={{overflowY: 'hidden'}}>
            <Card className="card-blur centered mb-4">
                <h2>Membres</h2>
                {usersOfGroup.map(uid => <UserIdRow key={uid} userId={uid}/>)}

                {!!usersInvited.length && <>
                    <h2>Invités</h2>
                    {usersInvited.map(uid => <UserIdRow key={uid} userId={uid}/>)}
                </>}

                <div className="grid mt-1" onClick={() => setShowDialog(true)} style={{cursor: 'pointer'}}>
                    <div className="col-2">
                        <Button icon="pi pi-plus" className="p-button-rounded"/>
                    </div>
                    <div className="col">
                        <h3>Inviter un utilisateur</h3>
                    </div>
                </div>
            </Card>

        <Dialog header="Inviter un utilisateur dans votre groupe" onHide={() => setShowDialog(false)} visible={showDialog}>
            <AddToGroup hide={() => setShowDialog(false)}></AddToGroup>
        </Dialog>


    </div>
}


