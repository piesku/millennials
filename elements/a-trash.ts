import {html} from "../lib/html.js";

export class TrashElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    display: none;
                }
            </style>
            <flex-row>
                <slot></slot>
            </flex-row>
        `;
    }
}
customElements.define("a-trash", TrashElement);
