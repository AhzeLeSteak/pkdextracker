import {ChainLink, MainClient} from 'pokenode-ts'
import {memoizeMap} from "../../data/memoize";
import {Location, Pkmn} from "../../data/Pkmn";
import {captureDetails, evolDetail, getFrName, idFromUrl} from "./additional_data";

const api = new MainClient();

const getEvolutionChainById = memoizeMap((id: number) => api.evolution.getEvolutionChainById(id));
const getLocationAreaByName = memoizeMap((name: string) => api.location.getLocationAreaByName(name));
const getLocationByName = memoizeMap((name: string) => api.location.getLocationByName(name));


export const get_pokemon = async (id: number): Promise<Pkmn> => {

    const {base_name, name, preEvoBaseName, sprite, evolving_methods} = await api.pokemon.getPokemonById(id)
        .then(data => {
            const base_name = data.name;
            const sprite = data.sprites.front_default!;
            return api.pokemon.getPokemonSpeciesById(id)
                .then(species => {
                    const name = getFrName(species) ?? base_name;
                    return getEvolutionChainById(idFromUrl(species.evolution_chain.url))
                        .then(async ({chain}) => {
                            const promises: Promise<string>[] = [];
                            let preEvoBaseName: string | undefined = undefined;
                            const search = (actual: ChainLink, before ?: ChainLink) => {
                                if (actual.species.name === base_name && before) {
                                    preEvoBaseName = before.species.name;
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
                            return {
                                evolving_methods: await Promise.all(promises),
                                base_name,
                                name,
                                sprite,
                                preEvoBaseName
                            }
                        });
                })
        })

    const locations = await api.pokemon.getPokemonLocationAreaById(id)
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
            return locations;
        });


    return {
        id,
        name,
        base_name,
        preEvoBaseName,
        sprite,
        locations,
        evolving_methods
    }


}
