type Interpolation = string | number | boolean | undefined | null | Array<Interpolation>;

function shift(values: Array<Interpolation>) {
    let value = values.shift();
    if (typeof value === "boolean" || value == undefined) {
        return "";
    } else if (Array.isArray(value)) {
        return value.join("");
    } else {
        return value;
    }
}

/**
 * Template literal tag for generating HTML strings in UI components.
 */
export function html(strings: TemplateStringsArray, ...values: Array<Interpolation>) {
    return strings.reduce((out, cur) => out + shift(values) + cur);
}

export function fragment(string: string) {
    let template = document.createElement("template");
    template.innerHTML = string;
    return template.content;
}

export function create<T extends HTMLElement>(
    tag: string,
    props: Record<string, string>,
    ...children: Array<Node | string>
) {
    let element = document.createElement(tag) as T;
    for (let [key, value] of Object.entries(props)) {
        element.setAttribute(key, value);
    }
    for (let child of children) {
        element.append(child);
    }
    return element;
}
