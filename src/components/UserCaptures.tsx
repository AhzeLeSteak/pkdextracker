import React, {useId, useMemo} from "react";
import {Button} from "primereact/button";
import {Capture} from "../data/Pkmn";
import {useUser} from "../data/User";
import {useSearchContext} from "../pages/PokeList";
import {Tooltip} from "primereact/tooltip";


export function UserCaptures({captures}: {captures: Capture[]}){

    const {versionsOfGen} = useSearchContext();
    const id = 'u'+useId().replaceAll(':', '');
    const user = useUser(captures[0].uid);

    const versions = useMemo(() => captures.map(c => c.version), [captures]);
    const tooltip = useMemo(() =>
            `Capturé par ${user?.name} dans les versions ${versions.map(v => versionsOfGen.find(vg => vg.value === v)!.label).join(', ')}`
        , [user, versions, versionsOfGen]);

    return !user ? <></> : <div data-pr-tooltip={tooltip} id={id} style={{display: 'flex', marginBottom: '4px'}}>
        <Tooltip target={'#'+id} />
        <img referrerPolicy="no-referrer" src={user.photoUrl} style={{borderRadius: '100%'}} className="ml-1 mr-1" width={30} alt="userPP"/>
        {versionsOfGen.filter(v => versions.includes(v.value)).map(v => {
                const inPc = captures.find(c => c.version === v.value)!.inPc;
                return <Button icon={inPc ? 'pi pi-desktop' : 'pi pi-eye'} className="p-button-rounded p-button-secondary" key={v.value}
                               style={{backgroundColor: v.color, width: '30px', height: '30px', marginRight: '2px'}}/>;
            }
        )}
    </div>
}
