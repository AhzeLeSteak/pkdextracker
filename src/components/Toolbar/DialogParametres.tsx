import {DialogProps} from "./SearchToolbar";
import React from "react";
import {isMobile} from "react-device-detect";
import {Dialog} from "primereact/dialog";
import {GENS, VersionType} from "../../data/consts";
import {SelectButton} from "primereact/selectbutton";
import {useDataContext} from "../../pages/List/ListPage";
import {Fieldset} from "primereact/fieldset";
import './DialogFiltres.css';
import {MaskFilter} from "./MaskEnum";

export const DialogParametres = ({inline, visible, setVisible}: DialogProps) => {

    const {genIndex, versionIndex, setVersionIndex, filters, setFilters} = useDataContext();
    const versionsOfGen = GENS[genIndex];
    const versionName = versionsOfGen[versionIndex].label;
    const versionValue = versionsOfGen[versionIndex].value;

    const handleVersionChange = ({value}: {value: string}) => {
        if(!value)
            return;
        setVersionIndex(GENS[genIndex].findIndex(v => v.value === value));
    }

    const inside = <>
        <Fieldset legend="Version">
            <div className="grid" style={{textAlign: 'center'}}>
                <div className="col-12 md:col-6">
                    <h4>Afficher les informations de capture pour la version :</h4>
                    <SelectButton value={versionValue}
                                  options={GENS[genIndex]}
                                  optionValue="value"
                                  itemTemplate={(e: VersionType) => <div style={{color: e.value === versionValue ? 'white' : e.light_color ? 'black' : e.color}}>{e.label}</div>}
                                  onChange={handleVersionChange}
                    />
                </div>
                <div className="col-12 md:col-6">
                    <h4>Utiliser le Pokédex national</h4>
                    <SelectButton value={filters.nationalDex} optionLabel="name" optionValue="value" options={yes_no_options} onChange={e => setFilters('nationalDex', e.value)} />
                </div>
            </div>
        </Fieldset>
        <Fieldset legend="Disponibilité">
            <div className="grid" style={{textAlign: 'center'}}>
                <div className="col-12 md:col-6">
                    <h4>Masquer les pokémons disponibles dans la version {versionName}</h4>
                    <SelectButton value={filters.maskAvailable} optionLabel="name" optionValue="value" options={yes_no_options} onChange={e => setFilters('maskAvailable', e.value)} />
                </div>
                <div className="col-12 md:col-6">
                    <h4>Masquer les pokémons non disponibles dans la version {versionName}</h4>
                    <SelectButton value={filters.maskUnavailable} itemTemplate={i => <>{i.name}</>} options={yes_no_options} onChange={e => setFilters('maskUnavailable', e.value)} />
                </div>
            </div>
        </Fieldset>

        <Fieldset legend="Capture" className="mt-3">
            <div className="grid" style={{textAlign: 'center'}}>
                <div className="col-12 md:col-6">
                    <h4>Masquer les pokémons capturés</h4>
                    <SelectButton value={filters.maskCaptured} itemTemplate={i => <>{i.name}</>} options={mask_options} onChange={e => setFilters('maskCaptured', e.value)} />
                </div>
                <div className="col-12 md:col-6">

                    <h4>Masquer les pokémons non capturés</h4>
                    <SelectButton value={filters.maskNotCaptured} itemTemplate={i => <>{i.name}</>} options={mask_options} onChange={e => setFilters('maskNotCaptured', e.value)} />
                </div>
            </div>
        </Fieldset>
    </>

    return inline ? inside :
        <Dialog header="Paramètres" visible={visible} style={{width: isMobile ? '100vw' : '75vw', maxWidth: '1600px'}}
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
