import {useEffect, useState} from "react";
import {collection, getDocs, query, where} from "firebase/firestore";
import {COLLECTIONS, getFirestore} from "../firebase/firebase-config";
import {useAuthContext} from "../firebase/AuthProvider";
import {Group} from "../data/User";

export const useGroup = () => {
    const {user} = useAuthContext();

    const [groupId, setGroupId] = useState('');
    const [usersOfGroup, setUsersOfGroup] = useState<string[]>([user!.uid!]);
    const [usersInvited, setUsersInvited] = useState<string[]>([]);
    const [inGroup, setInGroup] = useState(false);
    const [groupDocRef, setGroupDocRef] = useState<any>()

    useEffect(() => {
        if(!user) return;
        const groups = collection(getFirestore(), COLLECTIONS.GROUPS);
        let groupsQuery = query(groups, where('users', 'array-contains', user?.uid));
        getDocs(groupsQuery).then(({docs}) => {
            if(!docs.length)
                return;
            const doc = docs[0];
            const group = doc.data() as Group;
            setInGroup(true);
            setGroupDocRef(doc.ref);
            setGroupId(doc.id);
            setUsersOfGroup(group.users);
            setUsersInvited(group.invited || [])

        })

    }, [user]);

    return {
        groupDocRef,
        usersOfGroup,
        usersInvited,
        groupId,
        inGroup
    }
}
