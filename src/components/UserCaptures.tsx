import {Tooltip} from "primereact/tooltip";
import {Badge} from "primereact/badge";
import React, {useId, useMemo} from "react";
import {useSearchContext} from "./SearchToolbar";
import {User} from "../data/User";

export function UserCaptures({data}: {data: {user: User, versions :string[]}}){
    const id = 'u'+useId().replaceAll(':', '');
    const {versionsOfGens} = useSearchContext();
    const tooltip = useMemo(() => `Capturé par ${data.user.name} dans les versions ${data.versions.join(',')}`, [data]);
    return <div data-pr-tooltip={tooltip} id={id}>
        <Tooltip target={'#'+id} />
        <img referrerPolicy="no-referrer" src={data.user.photoUrl} style={{borderRadius: '100%'}} className="ml-1 mr-1" width={25} alt="userPP"/>
        {versionsOfGens.filter(v => data.versions.includes(v.value)).map(v =>
            <Badge key={v.value} style={{backgroundColor: v.color}}></Badge>
        )}
    </div>
}
