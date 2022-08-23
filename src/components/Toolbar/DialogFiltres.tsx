import {FilterProps} from "./SearchToolbar";
import React from "react";
import {isMobile} from "react-device-detect";
import {Dialog} from "primereact/dialog";
import {GENS, VersionType} from "../../data/consts";
import {SelectButton} from "primereact/selectbutton";
import {useSearchContext} from "../../pages/PokeList";
import {Fieldset} from "primereact/fieldset";
import './DialogFiltres.css';

type DialogProps = {
    visible: boolean,
    setVisible: (_: boolean) => void,
    inline ?: true
}

export const DialogFiltres = ({filters, setFilters, inline, visible, setVisible}: FilterProps & DialogProps) => {

    const {genIndex, versionIndex, setVersionIndex, versionsOfGen} = useSearchContext();
    const versionName = versionsOfGen[versionIndex].label;
    const versionValue = versionsOfGen[versionIndex].value;
    const options = [
        {
            name: 'Oui',
            value: true
        },
        {
            name: 'Non',
            value: false
        }];

    const inside = <>
        <Fieldset legend="Version">
            <div className="grid">
                <div className="col-12 md:col-7">
                    Afficher les aide de capture pour la version :
                </div>
                <div className="col-12 md:col-5 end">
                    <SelectButton className="ml-4" value={versionValue} options={GENS[genIndex]} optionValue="value"
                                  itemTemplate={(e: VersionType) => <div style={{color: e.value === versionValue ? 'white' : e.color}}>{e.label}</div>}
                                  onChange={(e) => e.value !== null && setVersionIndex(GENS[genIndex].findIndex(v => v.value === e.value))}/>
                </div>


                <div className="col-12 md:col-9">
                    Afficher les pokémons disponibles dans la version {versionName}
                </div>
                <div className="col-12 md:col-3 end">
                    <SelectButton value={filters.showAvailable} optionLabel="name" optionValue="value" options={options} onChange={e => setFilters('showAvailable', e.value)} />
                </div>

                <div className="col-12 md:col-9">
                    Afficher les pokémons non disponibles dans la version {versionName}
                </div>
                <div className="col-12 md:col-3 end">
                    <SelectButton value={filters.showUnavailable} itemTemplate={i => <>{i.name}</>} options={options} onChange={e => setFilters('showUnavailable', e.value)} />
                </div>
            </div>
        </Fieldset>

        <Fieldset legend="Capture" className="mt-3">
            <div className="grid">

                <div className="col-12 md:col-9">
                    Afficher les pokémons capturés
                </div>
                <div className="col-12 md:col-3 end">
                    <SelectButton value={filters.showCaptured} itemTemplate={i => <>{i.name}</>} options={options} onChange={e => setFilters('showCaptured', e.value)} />
                </div>

                <div className="col-12 md:col-9">
                    Afficher les pokémons non capturés
                </div>
                <div className="col-12 md:col-3 end">
                    <SelectButton value={filters.showNotCaptured} itemTemplate={i => <>{i.name}</>} options={options} onChange={e => setFilters('showNotCaptured', e.value)} />
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
