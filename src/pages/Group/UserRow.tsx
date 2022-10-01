import {useUser} from "../../hooks/useUser";
import {User} from "../../data/User";

export const UserIdRow = ({userId}: {userId: string}) => {
    const user = useUser(userId);

    return <UserRow user={user}/>
}


export const UserRow = ({user}: {user ?: User}) => {

    return !user ? <></> : <div className="grid">
        <div className="col-2">
            <img referrerPolicy="no-referrer" src={user.photoUrl} style={{borderRadius: '100%'}} width={50} alt="userPP"/>
        </div>
        <div className="col">
            <h3>{user.name}</h3>
        </div>
    </div>
}

