import React, {useState} from "react";
import {MenuItem} from "primereact/menuitem";
import {Button} from "primereact/button";
import {SpeedDial} from "primereact/speeddial";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {FilterProps} from "./SearchToolbar";
import {DialogFiltres} from "./DialogFiltres";
import {useNavigate} from "react-router-dom";

export function MobileSpeeddialButton({filters, setFilters}: FilterProps){
    const [searchDialogVisible, setSearchDialogVisible] = useState(false);
    const [filterDialogVisible, setFilterDialogVisible] = useState(false);
    const [newSearch, setNewSearch] = useState('');
    const navigate = useNavigate();

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
            icon: 'pi pi-home',
            command: () => navigate('/')
        },
    ];
    return <>
        <SpeedDial model={dialItems} direction="up" className="speeddial-left"
                   showIcon="pi pi-list" rotateAnimation={false} style={{right: '1em',bottom: '1em', position: 'fixed', zIndex: 99}} />

        <DialogFiltres filters={filters} setFilters={setFilters} visible={filterDialogVisible} setVisible={setFilterDialogVisible}/>

        <Dialog onHide={() => setSearchDialogVisible(false)} visible={searchDialogVisible} style={{width: '100%'}}
                header={<>Rechercher des Pokémons</>}
                footer={<Button label="Valider" icon="pi pi-check" onClick={() => {setFilters('search', newSearch); setSearchDialogVisible(false)}} />}>
            <InputText value={newSearch} onChange={e => setNewSearch(e.target.value)} style={{width: '100%'}}/>
        </Dialog>
    </>

}
