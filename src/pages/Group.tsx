import {useGroup} from "../hooks/useGroup";
import {Card} from "primereact/card";
import {useUser} from "../hooks/useUser";
import {Button} from "primereact/button";
import {useState} from "react";
import {Dialog} from "primereact/dialog";

export const Group = () => {

    const {inGroup, usersOfGroup} = useGroup();
    const [showDialog, setShowDialog] = useState(false);

    if(!inGroup)
        return <>"Gros nullos !"</>

    return <div className="grid" style={{overflowY: 'hidden'}}>
        <div className="col-0 md:col-3 lg:col-4"></div>
        <div className="col-12 md:col-6 lg:col-4">
            <Card style={{marginTop: '40vh'}} className="card-blur mb-4">
                {usersOfGroup.map(user => <UserRow userId={user}/>)}

                <div className="grid mt-1" onClick={() => setShowDialog(true)} style={{cursor: 'pointer'}}>
                    <div className="col-2">
                        <Button icon="pi pi-plus" className="p-button-rounded"/>
                    </div>
                    <div className="col">
                        <h3>Inviter un utilisateur</h3>
                    </div>
                </div>
            </Card>
        </div>

        <Dialog header="Inviter un utilisateur dans votre groupe" onHide={() => setShowDialog(false)} visible={showDialog}>


        </Dialog>


    </div>
}

const UserRow = ({userId}: {userId: string}) => {
    const user = useUser(userId);

    return !user ? <></> : <div className="grid">
        <div className="col-2">
            <img referrerPolicy="no-referrer" src={user.photoUrl} style={{borderRadius: '100%'}} width={50} alt="userPP"/>
        </div>
        <div className="col">
            <h3>{user.name}</h3>
        </div>
    </div>
}


