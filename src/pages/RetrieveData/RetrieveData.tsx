import {useEffect, useMemo, useState} from "react";
import {Pkmn} from "../../data/Pkmn";
import {get_pokemon} from "./get_pokemon";

export const RetrieveData = () => {

    const [pokemons, setPokemons] = useState(new Map<number, Pkmn>());

    useEffect(() => {
        const p = [];
        for(let i = 252; i <= 386; i++)
            p.push(get_pokemon(i));
        Promise.all(p).then(console.log);
    }, []);

    const entries = useMemo(() => {
        const res: Pkmn[] = [];
        pokemons.forEach((p, key) => res.push(p));
        return res;
    }, [pokemons]);

    return <div>
        {entries.map(pk => <div key={pk.id}>{JSON.stringify(pk, null, 2)}</div>)}
    </div>
}
