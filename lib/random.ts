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

export function element<T extends Node>(list: NodeListOf<T>): T;
export function element<T>(list: Array<T>): T;
export function element(list: Array<any> | NodeList) {
    return list[integer(0, list.length - 1)];
}
