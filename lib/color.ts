export function color_from_seed(seed: number): string {
    seed /= Math.PI;
    let hue = seed - Math.floor(seed);
    return `hsl(${Math.floor(hue * 360)} 50% 40%)`;
}
