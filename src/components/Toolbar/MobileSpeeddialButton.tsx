import React, {useState} from "react";
import {MenuItem} from "primereact/menuitem";
import {Button} from "primereact/button";
import {SpeedDial} from "primereact/speeddial";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {DialogParametres} from "./DialogParametres";
import {useNavigate} from "react-router-dom";
import {useDataContext} from "../../pages/List/ListPage";
import {DialogProgression} from "./DialogProgression";

export function MobileSpeeddialButton(){
    const navigate = useNavigate();

    const {setFilters} = useDataContext();

    const [searchDialogVisible, setSearchDialogVisible] = useState(false);
    const [filterDialogVisible, setFilterDialogVisible] = useState(false);
    const [progressionVisible, setProgressionVisible] = useState(false);
    const [newSearch, setNewSearch] = useState('');

    const dialItems: MenuItem[] = [
        {
            icon: 'pi pi-search',
            command: () => setSearchDialogVisible(true)
        },
        {
            icon: 'pi pi-filter',
            command: () => setFilterDialogVisible(true)
        },
        {
            icon: 'pi pi-chart-pie',
            command: () => setProgressionVisible(true)
        },
        {
            icon: 'pi pi-home',
            command: () => navigate('/')
        },
    ];
    return <>
        <SpeedDial model={dialItems} direction="up" className="speeddial-left"
                   showIcon="pi pi-list" rotateAnimation={false} style={{right: '1em',bottom: '1em', position: 'fixed', zIndex: 99}} />

        <DialogParametres visible={filterDialogVisible} setVisible={setFilterDialogVisible}/>
        <DialogProgression visible={progressionVisible} setVisible={setProgressionVisible}/>

        <Dialog onHide={() => setSearchDialogVisible(false)} visible={searchDialogVisible} style={{width: '100%'}}
                header={<>Rechercher des Pokémons</>}
                footer={<>
                    <Button label="Vider" className="p-button-danger" icon="pi pi-trash" onClick={() => {setFilters('search', ''); setSearchDialogVisible(false)}} />
                    <Button label="Valider" icon="pi pi-check" onClick={() => {setFilters('search', newSearch); setSearchDialogVisible(false)}} />
                </>}>
            <InputText value={newSearch} onChange={e => setNewSearch(e.target.value)} style={{width: '100%'}}/>
        </Dialog>
    </>

}
