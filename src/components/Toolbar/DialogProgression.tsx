import {DialogProps} from "./SearchToolbar";
import {isMobile} from "react-device-detect";
import {Dialog} from "primereact/dialog";
import {Chart} from "primereact/chart";
import {useDataContext} from "../../pages/PokeList";
import React, {useMemo, useState} from "react";
import {GENS, PKMN_COUNT_BY_GEN, VersionName, VersionType} from "../../data/consts";
import {useAuthContext} from "../../firebase/AuthProvider";
import {SelectButton} from "primereact/selectbutton";
import {useGroup} from "../../hooks/useGroup";


export const DialogProgression = ({visible, setVisible}: DialogProps) => {

    const {captures, versionsOfGen, genIndex} = useDataContext();
    const {user} = useAuthContext();
    const {inGroup} = useGroup();

    const [byUser, setByUser] = useState(true);
    const [versionFilter, setVersionFilter] = useState<VersionName | 'none'>('red');

    const genOptions = useMemo(() => {
        return [...GENS[genIndex], {label: 'Toutes les versions', value: 'none', color: '#000000'}];
    }, [genIndex]);


    const chartData = useMemo(() => {
        const versionFilterFunc : (vName: VersionName) => boolean = versionFilter === 'none'
            ? vName => versionsOfGen.some(v => vName === v.value)
            : vName => vName === versionFilter;


        let pkmnCaptured = captures.filter(c => versionFilterFunc(c.version))
        if(byUser)
            pkmnCaptured = pkmnCaptured.filter(c => c.uid === user?.uid);
        const pkmnInPc = pkmnCaptured.filter(c => c.inPc);
        const pkmnInDex = pkmnCaptured.filter(c => !c.inPc && !pkmnInPc.includes(c));


        const capturesCount = [pkmnInPc.length, pkmnInDex.length, PKMN_COUNT_BY_GEN[genIndex] - pkmnInPc.length - pkmnInDex.length];
        return {
            labels: ['Capturés', 'Dans le Pokédex', 'Non capturés'],
            datasets: [
                {
                    data: capturesCount,
                    backgroundColor: ['#44881e', '#ff9101', '#981919']
                }
            ]
        };
    }, [captures, versionsOfGen, byUser, versionFilter])

    return <Dialog header="Progression" visible={visible} style={{width: isMobile ? '100vw' : '75vw', maxWidth: '1600px'}}
                   onHide={() => setVisible(false)} draggable={false}>
        <div className="grid">

            {inGroup && <>
                <h4 className="col-4">Pokémons capturés par</h4>
                <SelectButton value={byUser}
                              optionLabel="name"
                              optionValue="value"
                              className="col-8"
                              options={[{name: 'Vous', value: 'true'}, {name: 'Votre groupe', value: false}]}
                              onChange={e => setByUser(e.value)} />
            </>}

            <h4 className="col-4">Capture de la version</h4>
            <SelectButton value={versionFilter}
                          options={genOptions}
                          optionValue="value"
                          className="col-8"
                          itemTemplate={(e: VersionType) => <div style={{color: e.value === versionFilter ? 'white' : e.color}}>{e.label}</div>}
                          onChange={e => setVersionFilter(e.value)}
            />

            <div className="col-3"></div>
            <Chart type="pie" data={chartData} className="col-6"/>
        </div>

    </Dialog>


}