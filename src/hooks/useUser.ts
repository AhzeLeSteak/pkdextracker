import {useState} from "react";
import {collection, getDocs, query, Query, where} from "firebase/firestore";
import {getFirestore} from "../firebase/firebase-config";
import {User} from "../data/User";

const users = new Map<string, User>();
const promises = new Map<string, Promise<User>>();

export const useUser = (uid: string) => {
    const [user, setUser] = useState<User | undefined>(users.get(uid));

    if(!users.has(uid) && !promises.has(uid)){
        const q = query(collection(getFirestore(), 'users/'), where('uid', '==', uid)) as Query<User>
        const p = getDocs(q).then(({docs}) => {
            const u = docs[0].data();
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
