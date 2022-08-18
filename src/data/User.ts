import {collection, getDocs, query, where} from "firebase/firestore";
import {getFirestore} from "../firebase/firebase-config";
import {useState} from "react";

export interface User{
    name: string,
    photoUrl: string,
    uid: string
}

const users = new Map<string, User | undefined>();

export const useUser = (uid: string) => {
    const [user, setUser] = useState<User | undefined>(users.get(uid));

    if(!users.has(uid)){
        users.set(uid, undefined);
        const q = query(collection(getFirestore(), 'users/'), where('uid', '==', uid))
        getDocs(q).then(({docs}) => {
            const u = docs[0].data() as User;
            setUser(u);
            users.set(uid, u);
        })
    }
    else if(user === undefined && users.get(uid))
        setUser(users.get(uid));

    return user;
};
