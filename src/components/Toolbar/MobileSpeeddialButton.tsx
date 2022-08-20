import React, {useState} from "react";
import {useSearchContext} from "../../pages/PokeList";
import {MenuItem} from "primereact/menuitem";
import {SelectButton} from "primereact/selectbutton";
import {GENS, VersionType} from "../../data/consts";
import {Button} from "primereact/button";
import {SpeedDial} from "primereact/speeddial";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {FilterProps} from "./SearchToolbar";

export function MobileSpeeddialButton({filters, setFilters, setVersionIndex}: FilterProps){
    const [showDialog, setShowDialog] = useState(false);
    const [newSearch, setNewSearch] = useState('');
    const {genIndex, versionIndex} = useSearchContext();
    const dialItems: MenuItem[] = [
        {
            icon: 'pi pi-search',
            command: () => setShowDialog(true)
        },
        {
            template: () => <SelectButton className="ml-4" value={versionIndex} options={GENS[genIndex]}
                                          itemTemplate={(e: VersionType) => <div style={{color: e.color}}>{e.label}</div>}
                                          onChange={(e) => setVersionIndex(GENS[genIndex].findIndex(v => v.value === e.value))}/>
        },
        {
            template: () => <Button label={filters.showAvailable ? 'Cacher disponibles' : 'Afficher disponibles'}
                                    onClick={() => setFilters('showAvailable', !filters.showAvailable)}
                                    className="p-button-raised p-button-rounded" />
        },
        {
            template: () => <Button label={filters.showUnavailable ? 'Cacher indisponibles' : 'Afficher indisponibles'}
                                    onClick={() => setFilters('showUnavailable', !filters.showUnavailable)}
                                    className="p-button-raised p-button-rounded" />
        },
        {
            template: () => <Button label={filters.showCaptured ? 'Cacher capturés' : 'Afficher capturés'}
                                    onClick={() => setFilters('showCaptured', !filters.showCaptured)}
                                    className="p-button-raised p-button-rounded" />
        },
        {
            template: () => <Button label={filters.showNotCaptured ? 'Cacher manquants' : 'Afficher manquants'}
                                    onClick={() => setFilters('showNotCaptured', !filters.showNotCaptured)}
                                    className="p-button-raised p-button-rounded" />
        },
    ];
    return <>
        <SpeedDial model={dialItems} direction="up" className="speeddial-left"
                   buttonClassName="p-button-help" style={{right: '1em',bottom: '1em', position: 'fixed', zIndex: 99}} />

        <Dialog onHide={() => setShowDialog(false)} visible={showDialog} style={{width: '100%'}}
                header={<>Rechercher des Pokémons</>}
                footer={<Button label="Valider" icon="pi pi-check" onClick={() => {setFilters('search', newSearch); setShowDialog(false)}} />}>
            <InputText value={newSearch} onChange={e => setNewSearch(e.target.value)} style={{width: '100%'}}/>
        </Dialog>
    </>

}