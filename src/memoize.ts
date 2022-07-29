export function memoizeMap<T, R>(fn: (arg: T) => Promise<R>, name ?: string) : (_: T) => Promise<R> {
    const map = new Map();
    return (val: T) => map.has(val) ? map.get(val) : map.set(val, fn(val)) && map.get(val);
}

export function memoizeLocalStorage<T, R>(fn: (arg: T) => Promise<R>, name: string) : (_: T) => Promise<R> {
    return function (this: any, val: T) {
        const key = name + '_' + val;
        if (localStorage.getItem(key))
            return new Promise(resolve => resolve(JSON.parse(localStorage.getItem(key)!)))

        return fn.call(this, val)
            .then(data => {
                localStorage.setItem(key, JSON.stringify(data));
                return data;
            })

    };
}
