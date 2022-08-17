export type Location = {version: string, label: string, sub: {label: string, details: string[]}[]};

export type Pkmn = {
    id: number,
    name: string,
    base_name: string,
    preEvoBaseName ?: string,
    locations: Location[],
    evolving_methods: string[],
    sprite: string,
    loaded: boolean,
    captures ?: Capture[]
};

export type Capture = {
    uid: string,
    version: string,
    inPc: boolean
}

