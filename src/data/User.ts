import {collection, getDocs, query, where} from "firebase/firestore";
import {getFirestore} from "../firebase/firebase-config";
import {useState} from "react";

export interface User{
    name: string,
    photoUrl: string,
    uid: string
}

const users = new Map<string, User>();
const promises = new Map<string, Promise<User>>();

export const useUser = (uid: string) => {
    const [user, setUser] = useState<User | undefined>(users.get(uid));

    if(!users.has(uid) && !promises.has(uid)){
        const q = query(collection(getFirestore(), 'users/'), where('uid', '==', uid))
        const p = getDocs(q).then(({docs}) => {
            const u = docs[0].data() as User;
            setUser(u);
            users.set(uid, u)
            return u;
        });
        promises.set(uid, p);
    }
    else if(user === undefined && promises.get(uid))
        promises.get(uid)!.then(setUser);

    return user;
};
