import './HowTo.css';
import {useNavigate} from "react-router-dom";
import {Card} from "primereact/card";
import {Carousel} from "primereact/carousel";
import PokeCard from "../components/PokeCard/PokeCard";
import {Pkmn} from "../data/Pkmn";
import {ScrollPanel} from "primereact/scrollpanel";
import {ListBox} from "primereact/listbox";
import React from "react";
import {isMobile} from "react-device-detect";

export const HowTo = () => {

    const navigate = useNavigate();

    const render1 = () => {

        return <p>Bienvenue sur PokédexTracker, un outil ayant pour but de track l'avancée de ses pokédex dans les différentes versions</p>
    }



    const pages = [render1(), renderPokeCard()];
    const value = Array.from({length: pages.length}, (_, i) => i)

    return <div className="grid" style={{overflowY: 'hidden'}}>
        <div className="col-0 md:col-1 lg:col-2"></div>
        <div className="col-12 md:col-10 lg:col-8">
            <Card style={{marginTop: isMobile ? '0' : '10vh'}} className="card-blur">

                <Carousel value={value} itemTemplate={i => pages[i]}/>

            </Card>
        </div>;
    </div>
}


function renderPokeCard(){

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

    const title = <div className="grid">
        <div className="col-fixed" style={{display: 'grid', width: '300px'}}>
            #Id Nom
            <small className="ml-1" style={{fontSize: '0.5em'}}>Nom anglais</small>
        </div>
        <div className="col-12 md:col lg:col" style={{fontSize: '0.7em'}}>
            <small>Versions dans lesquelles le Pokémon est disponible</small>
        </div>
    </div>

    return <div className="grid">
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
                    <ScrollPanel style={{width: '100%', height: '130px'}}>
                        <ListBox options={['Localisation du Pokémon']}/>
                    </ScrollPanel>
                </div>
            </Card>
        </div>
    </div>
}
