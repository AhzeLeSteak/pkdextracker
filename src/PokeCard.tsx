import {ScrollPanel} from "primereact/scrollpanel";
import {Card} from "primereact/card";
import React, {useMemo} from "react";
import {isDispoInVersion, Location, Pkmn} from "./Pkmn";
import {ListBox} from "primereact/listbox";
import {GENS, LocationAndPkmnName} from "./App";
import './PokeCard.css';
import {Badge} from "primereact/badge";

type PartLocation = Partial<Location>;

const PokeCard = (props: {pk: Pkmn, allPkmn: Pkmn[], version: string, versions: typeof GENS[number], showLocationDetail: (location: LocationAndPkmnName) => void}) => {

    const pk = props.pk;
    const locations: PartLocation[] = useMemo(() => {
        const locations: PartLocation[] = pk.locations.filter(location => location.version === props.version);
        locations.unshift(...pk.evolving_methods.map(e => ({label: e})));
        console.log(locations, [pk.id, pk.loaded, props.version]);
        return locations;
    }, [pk.id, pk.loaded, props.version]);


    const change = (value: PartLocation | Location) => {
        if(!value.sub)
            return
        props.showLocationDetail({
            location: value as Location,
            name: `#${pk.id} ${pk.name}`
        })
    }

    const title = <div className="grid">
        <div className="col-8">
            #{pk.id} {pk.name}
        </div>
        <div className="col">
            {props.versions.filter(v => isDispoInVersion([v.value], props.allPkmn, pk)).map(v =>
                 <Badge key={v.value} style={{backgroundColor: v.color}}></Badge>
            )}
        </div>
    </div>

    return <Card title={title} className="poke-card">
        <div className="grid">
            <img src={pk.sprite} width={120} height={120} alt={'#'+pk.id}/>
            <div className="col">

                {isDispoInVersion([props.version], props.allPkmn, pk)
                    ? <ScrollPanel style={{width: '100%', height: '200px'}}>
                        <ListBox options={locations} onChange={e => change(e.value)}/>
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
