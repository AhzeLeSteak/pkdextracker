import {AutoComplete} from "primereact/autocomplete";
import {collection, getDocs, query, updateDoc, where} from "firebase/firestore";
import {COLLECTIONS, getFirestore} from "../../firebase/firebase-config";
import {useEffect, useState} from "react";
import {UserRow} from "./UserRow";
import {User} from "../../data/User";
import {Button} from "primereact/button";
import {useGroup} from "../../hooks/useGroup";

export const AddToGroup = (props: {hide: () => void}) => {

    const {groupDocRef, usersInvited} = useGroup();
    const [userSearchStr, setUserSearchStr] = useState('');
    const [searchResult, setSearchResult] = useState<User[]>([]);
    const [usersToAdd, setUsersToAdd] = useState<User[]>([]);

    useEffect(() => {
        const users_collection = collection(getFirestore(), COLLECTIONS.USERS);
        getDocs(users_collection).then(({docs}) => {
            docs.forEach(doc => {
                if((doc.data() as User).inGroup === undefined)
                    updateDoc(doc.ref, {inGroup: false});
            })
        })
    }, []);


    const searchUsers = () => {
        if(userSearchStr.length < 2) return;
        const users_collection = collection(getFirestore(), COLLECTIONS.USERS);
        let q = query(users_collection, where('inGroup', '==', false));
        getDocs(q)
            .then(({docs}) => setSearchResult(docs.map(d => d.data() as User)
                .filter(u => u.name.toLowerCase().includes(userSearchStr.toLowerCase()))));
    }

    const onSelect = (user: User) => {
        setUsersToAdd(users => [user]);
        setUserSearchStr('');
    };

    const inviteUsers = () => {
        updateDoc(groupDocRef, {
            invited: [...usersToAdd.map(u => u.uid), ...usersInvited]
        }).then(props.hide);
    };

    return <div>
        <AutoComplete value={userSearchStr}
                      onChange={e => setUserSearchStr(e.target.value)}
                      completeMethod={searchUsers}
                      suggestions={searchResult}
                      field="name"
                      onSelect={e => onSelect(e.value)}
                      itemTemplate={user => <UserRow user={user}/>}
                      style={{width: '100%'}}
                      className="mb-4"
        />
        {usersToAdd.map(user => <UserRow key={user.uid} user={user}/> )}
        <Button onClick={() => inviteUsers()}>Valider</Button>
    </div>
}
