import {useEffect, useMemo, useState} from "react";
import {collection, getDocs, Query, query, where} from "firebase/firestore";
import {COLLECTIONS, getFirestore} from "../firebase/firebase-config";
import {useAuthContext} from "../firebase/AuthProvider";
import {Group} from "../data/User";
import {useCollection, useCollectionData} from "react-firebase-hooks/firestore";

export const useGroup = () => {
    const {user} = useAuthContext();


    const q = useMemo(() => {
        const groups = collection(getFirestore(), COLLECTIONS.GROUPS);
        return query(groups, where('users', 'array-contains', user?.uid)) as Query<Group>;
    }, [user]);

    const [querySnapshot] = useCollection(q);
    const docs = querySnapshot?.docs;
    const inGroup = !!(docs?.length);
    const group = inGroup ? docs[0].data() : undefined;
    const groupDocRef = inGroup ? docs[0].ref : undefined;


    return {
        groupDocRef,
        group,
        inGroup,
        isOwner: group && user?.uid === group.owner_uid
    }
}


export const useInvitation = () => {
    const {user} = useAuthContext();

    const group_collection = collection(getFirestore(), COLLECTIONS.GROUPS);
    const groupsQuery = query(group_collection, where('invited', 'array-contains', user?.uid)) as Query<Group>;
    const [groups] = useCollectionData(groupsQuery);

    return groups ?? [];
}