import {html} from "../lib/html.js";

customElements.define(
    "a-hand",
    class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: "open"});
        }

        connectedCallback() {
            this.shadowRoot!.innerHTML = html`
                <flex-row>
                    <slot></slot>
                </flex-row>
            `;
        }
    },
);
