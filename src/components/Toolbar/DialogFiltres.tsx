import {DialogProps, FilterProps} from "./SearchToolbar";
import React from "react";
import {isMobile} from "react-device-detect";
import {Dialog} from "primereact/dialog";
import {GENS, VersionType} from "../../data/consts";
import {SelectButton} from "primereact/selectbutton";
import {useDataContext} from "../../pages/PokeList";
import {Fieldset} from "primereact/fieldset";
import './DialogFiltres.css';
import {MaskFilter} from "./MaskEnum";



export const DialogFiltres = ({filters, setFilters, inline, visible, setVisible}: FilterProps & DialogProps) => {

    const {genIndex, versionIndex, setVersionIndex, versionsOfGen} = useDataContext();
    const versionName = versionsOfGen[versionIndex].label;
    const versionValue = versionsOfGen[versionIndex].value;

    const handleVersionChange = ({value}: {value: string}) => {
        if(!value)
            return;
        setVersionIndex(GENS[genIndex].findIndex(v => v.value === value));
    }

    const inside = <>
        <Fieldset legend="Version">
            <h4>Afficher les aide de capture pour la version :</h4>
            <SelectButton value={versionValue}
                          options={GENS[genIndex]}
                          optionValue="value"
                          itemTemplate={(e: VersionType) => <div style={{color: e.value === versionValue ? 'white' : e.color}}>{e.label}</div>}
                          onChange={handleVersionChange}
            />


            <h4>Masquer les pokémons disponibles dans la version {versionName}</h4>
            <SelectButton value={filters.maskAvailable} optionLabel="name" optionValue="value" options={yes_no_options} onChange={e => setFilters('maskAvailable', e.value)} />

            <h4>Masquer les pokémons non disponibles dans la version {versionName}</h4>
            <SelectButton value={filters.maskUnavailable} itemTemplate={i => <>{i.name}</>} options={yes_no_options} onChange={e => setFilters('maskUnavailable', e.value)} />
        </Fieldset>

        <Fieldset legend="Capture" className="mt-3">
            <h4>Masquer les pokémons capturés</h4>
            <SelectButton value={filters.maskCaptured} itemTemplate={i => <>{i.name}</>} options={mask_options} onChange={e => setFilters('maskCaptured', e.value)} />

            <h4>Masquer les pokémons non capturés</h4>
            <SelectButton value={filters.maskNotCaptured} itemTemplate={i => <>{i.name}</>} options={mask_options} onChange={e => setFilters('maskNotCaptured', e.value)} />
        </Fieldset>
    </>

    return inline ? inside :
        <Dialog header="Filtres" visible={visible} style={{width: isMobile ? '100vw' : '75vw', maxWidth: '1600px'}}
                onHide={() => setVisible(false)} draggable={false}>
            {inside}
        </Dialog>
}

const yes_no_options = [
    {
        name: 'Oui',
        value: true
    },
    {
        name: 'Non',
        value: false
    }];

const mask_options = [
    {
        name: 'Non',
        value: MaskFilter.None
    },
    {
        name: 'Par vous',
        value: MaskFilter.FromYou
    },
    {
        name: 'Par votre groupe',
        value: MaskFilter.FromGroup
    },
]
