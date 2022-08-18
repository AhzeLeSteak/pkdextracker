import {ScrollPanel} from "primereact/scrollpanel";
import {Card} from "primereact/card";
import React, {useMemo} from "react";
import {Capture, Location, Pkmn} from "../data/Pkmn";
import {ListBox} from "primereact/listbox";
import {Badge} from "primereact/badge";
import {isDispoInVersion} from "./SearchToolbar";
import {UserCaptures} from "./UserCaptures";
import {useSearchContext} from "../pages/PokeList";


type PartLocation = Partial<Location>;

const PokeCard = (props: {pk: Pkmn, captures: Capture[], onClick: (pkmn: any) => any}) => {

    const {selectedVersionValue, versionsOfGen} = useSearchContext();
    const pk = props.pk;

    const locations: PartLocation[] = useMemo(() => {
        const locations: PartLocation[] = pk.locations.filter(location => location.version === selectedVersionValue);
        locations.unshift(...pk.evolving_methods.map(e => ({label: e})));
        return locations;
    }, [pk, selectedVersionValue]);

    const title = <div className="grid">
        <div className="col-8">
            #{pk.id} {pk.name}
        </div>
        <div className="col">
            {versionsOfGen.filter(v => isDispoInVersion(v.value, pk)).map(v =>
                <Badge key={v.value} style={{backgroundColor: v.color}}></Badge>
            )}
        </div>
    </div>

    return <Card title={title} className="card-blur" style={{cursor: 'pointer'}} onClick={props.onClick}>
        <div className="grid">
            <div className="col-5">
                <img src={pk.sprite} width={120} height={120} alt={'#'+pk.id}/>
                {props.captures.map(c => c.uid).filter((el, index, array) => array.findIndex(x => x === el) === index)
                    .map(uid => props.captures.filter(capture => capture.uid === uid))
                    .map((userCaptures, i) => <UserCaptures key={i} captures={userCaptures}/>)}
            </div>
            <div className="col">

                {isDispoInVersion(selectedVersionValue, pk)
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
