import {Encounter, EvolutionDetail, Name} from "pokenode-ts";
import {memoizeLocalStorage, memoizeMap} from "./memoize";
import {api} from "./App";

const encounterMap = new Map();
encounterMap.set('gift', 'Cadeau');
encounterMap.set('good-rod', 'Super canne');
encounterMap.set('old-rod', 'Canne');
encounterMap.set('super-rod', 'Méga canne à pêche');
encounterMap.set('super-rod-spots', 'Méga canne à pêche (cases sombres)');
encounterMap.set('dark-grass', 'Hautes herbes');
encounterMap.set('surf', 'Surf');
encounterMap.set('surf-spots', 'Surf (cases sombres)');
encounterMap.set('walk', 'Marche');
encounterMap.set('headbutt-normal', 'Attaque Coup d\'boule sur un arbre');
encounterMap.set('headbutt-low', 'Attaque Coup d\'boule sur un arbre');
encounterMap.set('headbutt-high', 'Attaque Coup d\'boule sur un arbre');
encounterMap.set('yellow-flowers', 'Marcher dans les fleurs jaunes');
encounterMap.set('red-flowers', 'Marcher dans les fleurs rouges');
encounterMap.set('purple-flowers', 'Marcher dans les fleurs violettes');
encounterMap.set('rock-smash', 'Utiliser Eclate-Roc sur une pierre');
encounterMap.set('rough-terrain', 'Terrain dur ??');
encounterMap.set('cave-spots', 'Nuage de poussière');
encounterMap.set('grass-spots', 'Hautes herbes sombres');
encounterMap.set('pokeflute', 'Pokéflute');
encounterMap.set('only-one', 'Rencontre unique');


const getItemByName = memoizeLocalStorage((name: string) => api.item.getItemByName(name), 'getItemByName');
const getMoveByName = memoizeMap((name: string) => api.move.getMoveByName(name));
const getFrName = (obj: {names: Name[]}) => obj.names.find(n => n.language.name === 'fr')?.name;
const idFromUrl = (url: string) => {
    const path = url.split('/').filter(el => el.length);
    return parseInt(path[path.length-1]);
}


function captureDetails(encounter_details: Encounter[]) {
    function onlyUnique<T>(value: T, index: number, self: T[]) {
        return self.indexOf(value) === index;
    }
    const res = encounter_details.map(encounter => {
        const method = encounterMap.get(encounter.method.name);
        if(method)
            return `${method} ${encounter.chance}% (lvl ` +
                (encounter.min_level === encounter.max_level
                        ? encounter.min_level
                        : `${encounter.min_level} - ${encounter.max_level}`
                ) + ')\n'
        console.warn('unknowk method', encounter);
        return 'Méthode d\'obtention inconnue';
    });
    return res.filter(onlyUnique);
}

async function evolDetail(evolDetail: EvolutionDetail) {
    switch (evolDetail.trigger.name) {
        case 'level-up':
            if(evolDetail.min_level)
                return 'Évolue au niveau ' + evolDetail.min_level;
            else if(evolDetail.min_happiness)
                return 'Évolue avec un niveau de bonheur de ' + evolDetail.min_happiness;
            else if(evolDetail.held_item !== null){
                const objet = await getItemByName(evolDetail.held_item?.name!);
                const nom = getFrName(objet);
                return 'Montée de niveau en tenant l\'objet ' + nom;
            }
            else if(evolDetail.known_move !== null){
                const move = await getMoveByName(evolDetail.known_move.name);
                const nom = getFrName(move);
                return 'Montée de niveau en connaissant l\'attaque ' + nom;
            }
            console.log(evolDetail);
            return 'Montée de niveau (condition inconnue)';
        case 'use-item':
            const objet = await getItemByName(evolDetail.item?.name!);
            const nom = getFrName(objet);
            return 'Utiliser objet ' + (nom ?? objet.name);
        case 'trade':
            return 'Évolue lors d\'un échange'
    }
    return 'unknown evolving method : ' + evolDetail.trigger.name;
}


export {
    encounterMap,
    evolDetail,
    captureDetails,
    getFrName,
    idFromUrl
}
