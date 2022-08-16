import {ScrollPanel} from "primereact/scrollpanel";
import {Card} from "primereact/card";
import React, {useEffect, useMemo, useState} from "react";
import {Capture, Location, Pkmn} from "../data/Pkmn";
import {ListBox} from "primereact/listbox";
import {Badge} from "primereact/badge";
import {isDispoInVersion, useSearchContext} from "./SearchToolbar";
import {memoizeMap} from "../data/memoize";
import {collection, getDocs, query, where} from "firebase/firestore";
import {getFirestore} from "../firebase/firebase-config";
import {User} from "../data/User";
import {UserCaptures} from "./UserCaptures";

const getUser = memoizeMap(async (uid: string) => {
    const q = query(collection(getFirestore(), 'users/'), where('uid', '==', uid))
    const [doc] = (await getDocs(q)).docs;
    return doc.data() as User;
});

type PartLocation = Partial<Location>;

const PokeCard = (props: {pk: Pkmn, captures: Capture[], showLocationDetail: (pkmn: Pkmn) => void}) => {

    const {selectedVersion, versionsOfGens} = useSearchContext();
    const pk = props.pk;

    const locations: PartLocation[] = useMemo(() => {
        const locations: PartLocation[] = pk.locations.filter(location => location.version === selectedVersion);
        locations.unshift(...pk.evolving_methods.map(e => ({label: e})));
        return locations;
    }, [pk, selectedVersion]);

    const [users, setUsers] = useState<{user: User, versions :string[]}[]>([]);
    useEffect(() => {
        const promises = props.captures
            .map(x => x.uid)
            .filter((el, index, array) => array.findIndex(x => x === el) === index)
            .map(async uid => {
                const user = await getUser(uid);
                return ({user, versions: props.captures.filter(el => el.uid === uid).map(el => el.version)});
            })
        Promise.all(promises)
            .then(setUsers);
    }, [props.captures])

    const title = <div className="grid">
        <div className="col-8">
            #{pk.id} {pk.name}
        </div>
        <div className="col">
            {versionsOfGens.filter(v => isDispoInVersion(v.value, pk)).map(v =>
                <Badge key={v.value} style={{backgroundColor: v.color}}></Badge>
            )}
        </div>
    </div>

    return <Card title={title} className="card-blur" onClick={() => props.showLocationDetail(pk)} style={{cursor: 'pointer'}}>
        <div className="grid">
            <div className="col-4">
                <img src={pk.sprite} width={120} height={120} alt={'#'+pk.id}/>
                {users.map(u => <UserCaptures key={u.user.uid} data={u}/>)}
            </div>
            <div className="col">

                {isDispoInVersion(selectedVersion, pk)
                    ? <ScrollPanel style={{width: '100%', height: '200px'}}>
                        <ListBox options={locations}/>
                    </ScrollPanel>
                    : <ScrollPanel style={{width: '100%', height: '200px'}}>
                        <ListBox options={['Non disponible']}/>
                    </ScrollPanel>
                }
            </div>
        </div>
    </Card>
}

export default PokeCard;
