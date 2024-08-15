import {html} from "../lib/html.js";

customElements.define(
    "a-table",
    class extends HTMLElement {
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
                <slot></slot>
            `;
        }
    },
);
