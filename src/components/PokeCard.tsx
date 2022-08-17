import {ScrollPanel} from "primereact/scrollpanel";
import {Card} from "primereact/card";
import React, {useMemo} from "react";
import {Capture, Location, Pkmn} from "../data/Pkmn";
import {ListBox} from "primereact/listbox";
import {Badge} from "primereact/badge";
import {isDispoInVersion, useSearchContext} from "./SearchToolbar";
import {UserCaptures} from "./UserCaptures";


type PartLocation = Partial<Location>;

const PokeCard = (props: {pk: Pkmn, captures: Capture[], showLocationDetail: (pkmn: Pkmn) => void}) => {

    const {selectedVersion, versionsOfGens} = useSearchContext();
    const pk = props.pk;

    const locations: PartLocation[] = useMemo(() => {
        const locations: PartLocation[] = pk.locations.filter(location => location.version === selectedVersion);
        locations.unshift(...pk.evolving_methods.map(e => ({label: e})));
        return locations;
    }, [pk, selectedVersion]);

    /*
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
    }, [props.captures])*/

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
            <div className="col-5">
                <img src={pk.sprite} width={120} height={120} alt={'#'+pk.id}/>
                {props.captures.map(c => c.uid).filter((el, index, array) => array.findIndex(x => x === el) === index)
                    .map(uid => props.captures.filter(capture => capture.uid === uid))
                    .map((userCaptures, i) => <UserCaptures key={i} captures={userCaptures}/>)}
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
