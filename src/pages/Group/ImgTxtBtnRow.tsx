import {useUser} from "../../hooks/useUser";
import {ReactNode} from "react";
import {User} from "../../data/User";

export const UserIdRow = ({userId}: {userId: string}) => {
    const user = useUser(userId);

    return user ? <UserRow user={user}></UserRow> : <></>;
}

export const UserRow = ({user}: {user: User}) => {
    return <ImgTxtBtnRow imgUrl={user.photoUrl} text={user.name}/>
}


export const ImgTxtBtnRow = ({imgUrl, text, buttons}: {imgUrl: string, text: string, buttons ?: ReactNode}) => {

    return <div className="grid">
        <div className="col-2">
            <img referrerPolicy="no-referrer" src={imgUrl} style={{borderRadius: '100%'}} width={50} alt="userPP"/>
        </div>
        <div className="col">
            <h3> {text} </h3>
        </div>
        <div className="col-2">
            {buttons}
        </div>
    </div>
}

