let seed = 1;

export function set_seed(new_seed: number) {
    seed = 198706 * new_seed;
}

export function rand() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
}

export function integer(min = 0, max = 1) {
    return ~~(rand() * (max - min + 1) + min);
}

export function float(min = 0, max = 1) {
    return rand() * (max - min) + min;
}

interface Indexable<T> {
    length: number;
    [index: number]: T;
}

export function element<T>(list: Indexable<T>) {
    return list[integer(0, list.length - 1)];
}

export function shuffle<T>(arr: Array<T>) {
    // https://en.wikipedia.org/wiki/Fisher–Yates_shuffle
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
