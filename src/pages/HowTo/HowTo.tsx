import './HowTo.css';
import {useNavigate} from "react-router-dom";
import {Card} from "primereact/card";
import {Carousel} from "primereact/carousel";
import PokeCard from "../../components/PokeCard/PokeCard";
import {Pkmn} from "../../data/Pkmn";
import React, {useMemo} from "react";
import {isMobile} from "react-device-detect";
import g2 from "../img/g2.png";
import g1 from '../img/g1.png'
import {CaptureButtons} from "../../components/PokeDetails/CaptureButtons";
import {VersionName} from "../../data/consts";
import {DialogFiltres} from "../../components/Toolbar/DialogFiltres";
import {FilterElements} from "../../components/Toolbar/SearchToolbar";
import {ScrollPanel} from "primereact/scrollpanel";
import {ListBox} from "primereact/listbox";
import {SpeedDial} from "primereact/speeddial";
import {MaskFilter} from "../../components/Toolbar/MaskEnum";

const bg = [g1, g2];

export const HowTo = () => {

    const navigate = useNavigate();


    const pages = useMemo(() => [renderBienvenue(), renderHome(), renderPokeCard(), renderFiltres(), renderRegisterCapture(), renderStats()], []);
    const value = Array.from({length: pages.length}, (_, i) => i)
    const height = useMemo(() => isMobile ? '80vh' : '70vh', []);

    return <div className="grid" style={{overflowY: 'hidden'}}>
        {isMobile && <SpeedDial model={[]} onClick={() => navigate('/')}
                                direction="up" showIcon="pi pi-home" rotateAnimation={false}
                                style={{left: '0.5em',bottom: '0.5em', position: 'fixed', zIndex: 99}} />}
        <div className="col-0 md:col-1 lg:col-2"></div>
        <div className="col-12 md:col-10 lg:col-8">
            <Card id="how-to" style={isMobile ? {height: '99vh'} : {marginTop: '10vh'}} className="card-blur">
                <Carousel orientation={isMobile ? "vertical" : 'horizontal'} value={value}
                          itemTemplate={i => <ScrollPanel style={{height: height}}>{pages[i]}</ScrollPanel>} verticalViewPortHeight={height}/>
            </Card>
        </div>
    </div>
}

const renderBienvenue = () => <div className="center">
    <h1>Bienvenue sur PokédexTracker</h1> un outil ayant pour but de suivre la progression de ses pokédex
    au travers des différentes générations de jeux Pokémon.
</div>;

const renderHome = () => <div className="grid">
    <div className="col-0 md:col-2"></div>
    <div className="col-12 md:col-8" style={{textAlign: 'center'}}>
        <h1>Première étape</h1>
        <h3>Se connecter et choisir une génération parmis celles disponibles</h3>
        <div>Pour le moment, toutes les générations ne sont pas disponibles</div>
        <br className="mb-2"/>
        {bg.map((i, g) =>
            <div key={g} className="glass-button pt-3 pb-3" style={{cursor: 'none', backgroundImage: `url(${g < bg.length ? bg[g] : g2})`}}>
                Génération {g+1}
            </div>)}
    </div>
</div>

const renderPokeCard = () => {

    const title = <div className="grid">
        <div className="col-fixed" style={{display: 'grid', width: '250px'}}>
            #58 Caninos
            <small className="ml-1" style={{fontSize: '0.5em'}}>Nom anglais</small>
        </div>
        <div className="col-12 md:col lg:col">
            <small style={{fontSize: '0.7em'}}>Versions où le pokémon est disponible</small>
        </div>
    </div>

    return <div className="grid">
        <div className="col-0 md:col-2"></div>
        <div className="col-12 md:col-8" style={{textAlign: 'center'}}>
            <h1>Deuxième étape</h1>
            <h3>Choisir un pokémon à enregistrer</h3>
            <div>
                Chaque Pokémon est représenté par une carte comprenant des données sur
                sa disponibilité (badges de couleur) et sa localisation
            </div>
        </div>
        <div className="col-0 md:col-2"></div>

        <div className="col-12 md:col-6">
            <PokeCard pk={caninos} captures={[]} onClick={() => null}/>
        </div>


        <div className="col-12 md:col-6">
            <Card title={title} className="card-blur">
                <div className="grid">
                    <div className="col-6">
                        <img src={caninos.sprite} alt={'#'+caninos.id} className="pk-img"/>
                    </div>
                    <div className="col-6">

                    </div>
                </div>

                <div>
                    <ScrollPanel style={{width: '100%', height: '200px'}}>
                        <ListBox options={['Localisation du Pokémon']}/>
                    </ScrollPanel>
                </div>
            </Card>
        </div>
    </div>
};

const renderFiltres = () => {
    const f: FilterElements = {
        search: "",
        maskAvailable: true,
        maskCaptured: MaskFilter.None,
        maskNotCaptured: MaskFilter.None,
        maskUnavailable: false,
        nationalDex: false
    }

    return <div className="grid">
        <div className="col-0 md:col-2"></div>
        <div className="col-12 md:col-8" style={{textAlign: 'center'}}>
            <h1>Deuxième étape - bis</h1>
            <h3>Filtrer les pokémons</h3>
            <div>
                Pour faciliter la recherche de Pokémons, il est possible de les filtrer selon
                leur disponibilité ou capture
            </div>
        </div>
        <div className="col-0 md:col-2"></div>

        <div className="col-0 md:col-2"></div>
        <div className="col-12 md:col-8">
            <DialogFiltres filters={f} setFilters={() => null} visible={false} setVisible={() => null} inline={true}/>
        </div>
    </div>
};

const renderRegisterCapture = () => {
    const captures = [
        {
            pkmnId: caninos.id,
            uid: '',
            version: 'red' as VersionName,
            inPc: true
        },
        {
            pkmnId: caninos.id,
            uid: '',
            version: 'blue' as VersionName,
            inPc: false
        }
    ];
    return <div className="grid">
        <div className="col-0 md:col-2"></div>
        <div className="col-12 md:col-8" style={{textAlign: 'center'}}>
            <h1>Troisième étape</h1>
            <h3>Indiquer dans quelle(s) version(s) le Pokémon a été attrapé </h3>
            <div className="grid mt-1">
                <div className="col-6">Pokémon dans le Pokédex des versions Rouge et Bleu</div>
                <div className="col-6">Pokémon dans le pc de la version rouge</div>
            </div>
            <CaptureButtons pkmnId={caninos.id} captures={captures} demo={true}></CaptureButtons>
        </div>
    </div>;
}

const renderStats = () => <div className="grid">
    <div className="col-0 md:col-2"></div>
    <div className="col-12 md:col-8" style={{textAlign: 'center'}}>
        <h1>Visualiser sa progression</h1>
        <h3>Des stats sur l'avancée sont en cours de développement !</h3>
    </div>
</div>;


const caninos: Pkmn = {
    id: 58,
    name: "Caninos",
    "base_name": "growlithe",
    locations: [
        {
            label: "Route 7",
            version: "red",
            sub: [
                {
                    label: "kanto-route-7-area",
                    details: [
                        "Marche 5% (lvl 18)",
                        "Marche 5% (lvl 20)"
                    ]
                }
            ]
        },
        {
            label: "Route 8",
            version: "red",
            sub: [
                {
                    label: "kanto-route-8-area",
                    details: [
                        "Marche 10% (lvl 16)",
                        "Marche 5% (lvl 17)",
                        "Marche 4% (lvl 15)",
                        "Marche 1% (lvl 18)"
                    ]
                }
            ]
        },
        {
            label: "Manoir Pokémon",
            version: "red",
            sub: [
                {
                    label: "1F",
                    details: [
                        "Marche 10% (lvl 34)"
                    ]
                },
                {
                    label: "2F",
                    details: [
                        "Marche 20% (lvl 32)"
                    ]
                },
                {
                    label: "3F",
                    details: [
                        "Marche 20% (lvl 33)"
                    ]
                },
                {
                    label: "B1F",
                    details: [
                        "Marche 15% (lvl 35)"
                    ]
                }
            ]
        },
        {
            label: "Manoir Pokémon",
            version: "yellow",
            sub: [
                {
                    label: "1F",
                    details: [
                        "Marche 10% (lvl 26)",
                        "Marche 5% (lvl 30)",
                        "Marche 4% (lvl 34)",
                        "Marche 1% (lvl 38)"
                    ]
                }
            ]
        }
    ],
    "evolving_methods": [],
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/58.png"
};
