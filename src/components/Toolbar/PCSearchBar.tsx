import {useSearchContext} from "../../pages/PokeList";
import {useNavigate} from "react-router-dom";
import {Toolbar} from "primereact/toolbar";
import {GENS} from "../../data/consts";
import {InputText} from "primereact/inputtext";
import React, {useState} from "react";
import {FilterProps} from "./SearchToolbar";
import {Button} from "primereact/button";
import {DialogFiltres} from "./DialogFiltres";
import {Divider} from "primereact/divider";

export function PCSearchBar({filters, setFilters}: FilterProps){

    const {genIndex, versionIndex} = useSearchContext();
    const navigate = useNavigate();

    const [visible, setVisible] = useState(false);

    const left = <div onClick={() => navigate('/')} style={{color: 'white', fontSize: '36px', cursor: 'pointer'}}>Pkdex Tracker</div>
    const right = <>
        <Button label="Filtres" className="p-button-secondary pl-3 pr-3" onClick={() => setVisible(true)}/>
        <Divider layout="vertical"/>
        <InputText placeholder="Recherche (nom, id, lieu)" style={{width: '17rem'}}
                   value={filters.search} onChange={e => setFilters('search', e.target.value)}/>;
    </>

    return <>
        <Toolbar
            style={{
                backgroundColor: GENS[genIndex][versionIndex].color,
                width: '100%',
                backdropFilter: 'blur(20px) saturate(180%)',
                borderRadius: '0',
                border: 'none',
                position: 'fixed',
                zIndex: 999
            }}
            className="mb-4 pb-2 pt-2" left={left} right={right}
        />
        <Divider layout="vertical"/>
        <DialogFiltres filters={filters} setFilters={setFilters} visible={visible} setVisible={setVisible}/>
    </>
}
