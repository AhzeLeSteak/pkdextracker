import {useEffect, useState} from "react";
import {collection, getDocs, query, where} from "firebase/firestore";
import {COLLECTIONS, getFirestore} from "../firebase/firebase-config";
import {useAuthContext} from "../firebase/AuthProvider";

export const useGroup = () => {
    const {user} = useAuthContext();
    const [usersOfGroup, setUsersOfGroup] = useState<string[]>([user!.uid!]);
    const [inGroup, setInGroup] = useState(false);

    useEffect(() => {
        const groups = collection(getFirestore(), COLLECTIONS.GROUPS);
        let groupsQuery = query(groups, where('users', 'array-contains', user?.uid));
        getDocs(groupsQuery).then(({docs}) => {
            const groups = docs.map(d => d.data()) as unknown as {users: string[]}[];
            if(groups.length){
                setInGroup(true);
                setUsersOfGroup(groups[0].users);
            }
        })

    }, [user]);

    return {
        usersOfGroup,
        inGroup
    }
}
