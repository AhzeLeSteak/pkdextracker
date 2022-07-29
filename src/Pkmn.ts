import {ChainLink} from "pokenode-ts";
import {api} from "./App";
import {memoizeMap} from "./memoize";
import {captureDetails, evolDetail, getFrName, idFromUrl} from "./additional_data";
import {useEffect, useState} from "react";

export type Location = {version: string, label: string, sub: {label: string, details: string[]}[]};

export type Pkmn = {
    id: number,
    name: string,
    base_name: string,
    preEvoBaseName ?: string,
    locations: Location[],
    evolving_methods: string[],
    sprite: string,
    loaded: boolean
};

const getEvolutionChainById = memoizeMap((id: number) => api.evolution.getEvolutionChainById(id));
const getLocationAreaByName = memoizeMap((name: string) => api.location.getLocationAreaByName(name), 'getLocationAreaByName');
const getLocationByName = memoizeMap((name: string) => api.location.getLocationByName(name));


export const usePkmn = (id: number): Pkmn => {
    const [name, setName] = useState('');
    const [preEvoBaseName, setPreEvoName] = useState<string>();
    const [base_name, setBaseName] = useState('');
    const [locations, setLocations] = useState<Location[]>([]);
    const [evolving_methods, setEvolvingMethods] = useState<string[]>([]);
    const [sprite, setSprite] = useState('');

    const [locationLoaded, setLocationLoaded] = useState(false);
    const [evolLoaded, setEvolLoaded] = useState(false);

    useEffect(() => {
        api.pokemon.getPokemonById(id)
            .then(data => {
                const base_name = data.name;
                setBaseName(base_name);
                setSprite(data.sprites.front_default!);
                api.pokemon.getPokemonSpeciesById(id)
                    .then(species => {
                        setName(getFrName(species) ?? base_name);
                        getEvolutionChainById(idFromUrl(species.evolution_chain.url))
                            .then(({chain}) => {
                                const promises: Promise<string>[] = [];
                                const search = (actual: ChainLink, before ?: ChainLink) => {
                                    if (actual.species.name === base_name && before) {
                                        setPreEvoName(before.species.name);
                                        actual.evolution_details.forEach(e => promises.push(evolDetail(e)));
                                        return true;
                                    }
                                    let found = false;
                                    for (let i = 0; i < actual.evolves_to.length && !found; i++) {
                                        if (search(actual.evolves_to[i], actual))
                                            found = true;
                                    }
                                    return found;
                                }
                                search(chain);
                                Promise.all(promises).then(res => {
                                    setEvolvingMethods(res);
                                    setEvolLoaded(true);
                                });
                            });
                    })
            })

        api.pokemon.getPokemonLocationAreaById(id)
            .then(data =>
                Promise.all(
                    data.map(encounter =>
                        getLocationAreaByName(encounter.location_area.name)
                            .then(locationArea => getLocationByName(locationArea.location.name)
                                .then(location => {
                                    let sub_label = locationArea.names[0]?.name;
                                    if(!sub_label || sub_label.length === 0)
                                        sub_label = locationArea.name;
                                    return encounter.version_details.map(detail => ({
                                        version: detail.version.name,
                                        label: getFrName(location) ?? locationArea.name,
                                        sub_label,
                                        details: captureDetails(detail.encounter_details)
                                    }))
                                })
                            )
                    )
                ))
            .then(data => {
                const locations: Location[] = [];
                data.flat().forEach(location => {
                    const selectedLocation = locations.find(l => l.label === location.label && l.version === location.version);
                    if (selectedLocation)
                        selectedLocation.sub.push({
                            label: location.sub_label,
                            details: location.details
                        })
                    else
                        locations.push({
                            label: location.label,
                            version: location.version,
                            sub: [{
                                label: location.sub_label,
                                details: location.details
                            }]
                        })
                });
                setLocations(locations);
                setLocationLoaded(true);
            });


    }, [id]);


    return {
        id, name, base_name, preEvoBaseName,
        locations, evolving_methods,
        sprite,
        loaded: evolLoaded && locationLoaded
    };
}


export const preEvolution = (pk: Pkmn, allPkmn: Pkmn[]) => allPkmn.find(p => p.base_name === pk.preEvoBaseName);
export const isDispoInVersion = (v: string[], allPkmn: Pkmn[], pk ?: Pkmn): boolean => {
    if(!pk) return false;
    const preEvo = preEvolution(pk, allPkmn);
    return pk.locations.some(l => v.includes(l.version))
        || (preEvo ? isDispoInVersion(v, allPkmn, preEvo) : false);
}
