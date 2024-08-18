import {html} from "../lib/html.js";

export class AvatarElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        let name = this.getAttribute("name") ?? "";
        let current_energy = this.getAttribute("current-energy") ?? "0";
        let max_energy = this.getAttribute("max-energy") ?? "0";

        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    display: block;
                    padding: 10px;
                }
            </style>
            <flex-col>
                <div>${name}</div>
                <div>Energy: ${current_energy}/${max_energy}</div>
                <slot></slot>
            </flex-col>
        `;
    }

    static observedAttributes = ["current-energy", "max-energy"];

    attributeChangedCallback(name: string, old_value: string, new_value: string) {
        this.connectedCallback();
    }
}

customElements.define("a-avatar", AvatarElement);
