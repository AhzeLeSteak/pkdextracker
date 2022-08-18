import {Pkmn} from "./Pkmn";

export type VersionName =
    'red' | 'blue' | 'yellow'
    | 'gold' | 'silver' | 'cristal'
    | 'ruby' | 'sapphire' | 'emerald'
    | 'diamond' | 'pearl' | 'platinium';

export type VersionType = {
    label: string,
    value: VersionName,
    color: string
};

export const GENS: VersionType[][] = [
    [
        {label: 'Rouge', value: 'red', color: '#BE0D07'},
        {label: 'Bleu', value: 'blue', color: '#1E4B89'},
        {label: 'Jaune', value: 'yellow', color: '#EFBF43'}
    ],
    [
        {label: 'Or', value: 'gold', color: '#878246'},
        {label: 'Argent', value: 'silver', color: '#87868B'},
        {label: 'Cristal', value: 'cristal', color: '#5A7F85'}
    ],
    [
        {label: 'Rubis', value: 'ruby', color: '#862224'},
        {label: 'Saphir', value: 'sapphire', color: '#1C2F5D'},
        {label: 'Emeraude', value: 'emerald', color: '#119347'}
    ],
    [
        {label: 'Diamant', value: 'diamond', color: '#4F577B'},
        {label: 'Perle', value: 'pearl', color: '#FBE9EB'},
        {label: 'Platine', value: 'platinium', color: '#373645'}
    ],
];


export const PKMN_COUNT_BY_GEN = [151, 100, 135, 107];

export const allPkmn: Pkmn[] = require('../data/data.json');
