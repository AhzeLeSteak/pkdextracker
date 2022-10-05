import {useEffect, useMemo, useState} from "react";
import {collection, getDocs, query, where} from "firebase/firestore";
import {COLLECTIONS, getFirestore} from "../firebase/firebase-config";
import {useAuthContext} from "../firebase/AuthProvider";
import {Group} from "../data/User";
import {useCollection} from "react-firebase-hooks/firestore";

export const useGroup = () => {
    const {user} = useAuthContext();


    const q = useMemo(() => {
        const groups = collection(getFirestore(), COLLECTIONS.GROUPS);
        return query(groups, where('users', 'array-contains', user?.uid));
    }, [user]);

    const [querySnapshot] = useCollection(q);
    const docs = querySnapshot?.docs;
    const inGroup = !!(docs?.length);
    const group = inGroup ? docs[0].data() as Group: undefined;
    const groupDocRef = inGroup ? docs[0].ref : undefined;


    return {
        groupDocRef,
        group,
        inGroup
    }
}


export const useInvitation = () => {
    const {user} = useAuthContext();
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        if(!user) return;
        const groups = collection(getFirestore(), COLLECTIONS.GROUPS);
        let groupsQuery = query(groups, where('invited', 'array-contains', user?.uid));
        getDocs(groupsQuery).then(({docs}) => {
            if(!docs.length)
                return;
            const groups = docs.map(doc => doc.data() as Group);
            setGroups(groups);
        });

    }, [user]);

    return {
        groups
    }
}