import {ScrollPanel} from "primereact/scrollpanel";
import {Card} from "primereact/card";
import React, {useMemo} from "react";
import {Capture, Location, Pkmn} from "../../data/Pkmn";
import {ListBox} from "primereact/listbox";
import {Badge} from "primereact/badge";
import {isDispoInVersion} from "../Toolbar/SearchToolbar";
import {UserCaptures} from "./UserCaptures";
import {useSearchContext} from "../../pages/PokeList";


type PartLocation = Partial<Location>;

const PokeCard = (props: {pk: Pkmn, captures: Capture[], onClick: (pkmn: any) => any}) => {

    const {selectedVersionValue, versionsOfGen, genIndex} = useSearchContext();
    const pk = props.pk;

    const locations: PartLocation[] = useMemo(() => {
        const locations: PartLocation[] = pk.locations.filter(location => location.version === selectedVersionValue);
        locations.unshift(...pk.evolving_methods.filter(l => genIndex > 1 || !l.includes('bonheur')).map(e => ({label: e})));
        return locations;
    }, [pk, selectedVersionValue]);

    const title = <div className="grid">
        <div className="col-fixed" style={{display: 'grid', width: '250px'}}>
            #{pk.id} {pk.name}
            <small className="ml-1" style={{fontSize: '0.5em'}}>{pk.base_name}</small>
        </div>
        <div className="col-12 md:col lg:col">
            {versionsOfGen.filter(v => isDispoInVersion(v.value, pk)).map(v =>
                <Badge key={v.value} style={{backgroundColor: v.color}}></Badge>
            )}
        </div>
    </div>

    return <Card title={title} className="card-blur" style={{cursor: 'pointer'}} onClick={props.onClick}>
        <div className="grid">
            <div className="col-6">
                <img src={pk.sprite} alt={'#'+pk.id} style={{width: '100%'}}/>
            </div>
            <div className="col-6">
                {props.captures.map(c => c.uid).filter((el, index, array) => array.findIndex(x => x === el) === index)
                    .map(uid => props.captures.filter(capture => capture.uid === uid))
                    .map((userCaptures, i) => <UserCaptures key={i} captures={userCaptures}/>)}
            </div>
        </div>

        <div>

            {locations.length
                ? <ScrollPanel style={{width: '100%', height: '200px'}}>
                    <ListBox options={locations}/>
                </ScrollPanel>
                : <ScrollPanel style={{width: '100%', height: '200px'}}>
                    <ListBox options={['Non disponible']}/>
                </ScrollPanel>
            }
        </div>
    </Card>
}

export default PokeCard;
