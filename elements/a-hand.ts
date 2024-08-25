import {html} from "../lib/html.js";

export class HandElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    display: block;
                }
            </style>
            <flex-row center>
                <slot></slot>
            </flex-row>
        `;
    }
}
customElements.define("a-hand", HandElement);
