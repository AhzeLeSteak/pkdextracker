import {VersionName} from "./consts";

export type Location = {version: VersionName, label: string, sub: {label: string, details: string[]}[]};

export type Pkmn = {
    id: number,
    name: string,
    base_name: string,
    preEvoBaseName ?: string,
    locations: Location[],
    evolving_methods: string[],
    sprite: string,
    captures ?: Capture[]
};

export type Capture = {
    uid: string,
    version: VersionName,
    inPc: boolean,
    pkmnId: number
}

