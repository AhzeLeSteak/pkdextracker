import {Capture, Pkmn} from "../../data/Pkmn";
import {isMobile} from "react-device-detect";
import PokeCard from "../../components/PokeCard/PokeCard";
import React from "react";

export const PokeList = (props: {pokemons: Pkmn[], captures: Capture[], setSelectedPkmnId: (id: number) => void}) => {

    return <div className={'grid '+(isMobile ? '' : 'pt-8')}>
        <div className="col-0 md:col-1 lg:col-1"></div>
        <div className="col-12 md:col-10 lg:col-10">
            <div className="grid">
                {props.pokemons.map((pk, i) => (
                    <div key={pk.id} className="col-12 md:col-4 lg:col-3">
                        <PokeCard pk={pk} captures={props.captures.filter(c => c.pkmnId === pk.id)}
                                  onClick={() => props.setSelectedPkmnId(i)}/>
                    </div>))}
            </div>
        </div>
    </div>;
}