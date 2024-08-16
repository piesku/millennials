import {html} from "../lib/html.js";

customElements.define(
    "a-deck",
    class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: "open"});
        }

        connectedCallback() {
            this.shadowRoot!.innerHTML = html`
                <style>
                    :host > * {
                        background-image: url("./assets/unrevealed.webp");
                        margin-right: -18px;
                    }
                </style>
                <flex-row wrap>
                    <slot></slot>
                </flex-row>
            `;
        }
    },
);
