import {html} from "../lib/html.js";

export class ModifierElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.shadowRoot!.innerHTML = html`
            <style></style>
            <div>${this.getAttribute("origin-name")}: ${this.getAttribute("op")} ${this.getAttribute("value")}</div>
        `;
    }
}

customElements.define("a-modifier", ModifierElement);
