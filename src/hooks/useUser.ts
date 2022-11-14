import {collection, query, Query, where} from "firebase/firestore";
import {getFirestore} from "../firebase/firebase-config";
import {User} from "../data/User";
import {useCollectionData} from "react-firebase-hooks/firestore";


export const useUser = (uid: string) => {
    const q = query(collection(getFirestore(), 'users/'), where('uid', '==', uid)) as Query<User>
    const [users] = useCollectionData(q);
    return users ? users[0] : undefined;
};
