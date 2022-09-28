import {FilterProps} from "./SearchToolbar";
import React from "react";
import {isMobile} from "react-device-detect";
import {Dialog} from "primereact/dialog";
import {GENS, VersionType} from "../../data/consts";
import {SelectButton} from "primereact/selectbutton";
import {useSearchContext} from "../../pages/PokeList";
import {Fieldset} from "primereact/fieldset";
import './DialogFiltres.css';
import {MaskFilter} from "./MaskEnum";

type DialogProps = {
    visible: boolean,
    setVisible: (_: boolean) => void,
    inline ?: true
}

export const DialogFiltres = ({filters, setFilters, inline, visible, setVisible}: FilterProps & DialogProps) => {

    const {genIndex, versionIndex, setVersionIndex, versionsOfGen} = useSearchContext();
    const versionName = versionsOfGen[versionIndex].label;
    const versionValue = versionsOfGen[versionIndex].value;

    const handleVersionChange = ({value}: {value: string}) => {
        if(!value)
            return;
        setVersionIndex(GENS[genIndex].findIndex(v => v.value === value));
        setFilters('maskAvailable', filters.maskAvailable);
    }

    const inside = <>
        <Fieldset legend="Version">
            <div className="grid">
                <div className="col-12 md:col-7">
                    Afficher les aide de capture pour la version :
                </div>
                <div className="col-12 md:col-5 end">
                    <SelectButton className="ml-4" value={versionValue} options={GENS[genIndex]} optionValue="value"
                                  itemTemplate={(e: VersionType) => <div style={{color: e.value === versionValue ? 'white' : e.color}}>{e.label}</div>}
                                  onChange={handleVersionChange}/>
                </div>


                <div className="col-12 md:col-9">
                    Masquer les pokémons disponibles dans la version {versionName}
                </div>
                <div className="col-12 md:col-3 end">
                    <SelectButton value={filters.maskAvailable} optionLabel="name" optionValue="value" options={yes_no_options} onChange={e => setFilters('maskAvailable', e.value)} />
                </div>

                <div className="col-12 md:col-9">
                    Masquer les pokémons non disponibles dans la version {versionName}
                </div>
                <div className="col-12 md:col-3 end">
                    <SelectButton value={filters.maskUnavailable} itemTemplate={i => <>{i.name}</>} options={yes_no_options} onChange={e => setFilters('maskUnavailable', e.value)} />
                </div>
            </div>
        </Fieldset>

        <Fieldset legend="Capture" className="mt-3">
            <div className="grid">

                <div className="col-12 md:col-8">
                    Masquer les pokémons capturés
                </div>
                <div className="col-12 md:col-4 end">
                    <SelectButton value={filters.maskCaptured} itemTemplate={i => <>{i.name}</>} options={mask_options} onChange={e => setFilters('maskCaptured', e.value)} />
                </div>

                <div className="col-12 md:col-8">
                    Masquer les pokémons non capturés
                </div>
                <div className="col-12 md:col-4 end">
                    <SelectButton value={filters.maskNotCaptured} itemTemplate={i => <>{i.name}</>} options={mask_options} onChange={e => setFilters('maskNotCaptured', e.value)} />
                </div>
            </div>
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
