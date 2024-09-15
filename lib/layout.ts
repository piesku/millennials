import {html} from "./html.js";

customElements.define(
    "flex-row",
    class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: "open"});
        }

        connectedCallback() {
            this.shadowRoot!.innerHTML = `
                <style>
                    :host {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                    }

                    :host([reverse]) {
                        flex-direction: row-reverse;
                    }

                    :host([center]) {
                        justify-content: center;
                        align-items: center;
                    }

                    :host([start]) {
                        justify-content: flex-start;
                    }

                    :host([gap]) {
                        gap: 20px;
                    }
                </style>
                <slot></slot>
            `;
        }
    },
);

customElements.define(
    "flex-col",
    class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: "open"});
        }

        connectedCallback() {
            this.shadowRoot!.innerHTML = `
                <style>
                    :host {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    }

                    :host([reverse]) {
                        flex-direction: column-reverse;
                    }

                    :host([center]) {
                        justify-content: center;
                        align-items: center;
                    }

                    :host([start]) {
                        justify-content: flex-start;
                    }

                    :host([gap]) {
                        gap: 20px;
                    }
                </style>
                <slot></slot>
            `;
        }
    },
);

customElements.define(
    "multi-view",
    class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: "open"});
        }

        static observedAttributes = ["current"];
        attributeChangedCallback() {
            this.Render();
        }

        Render() {
            let current = this.getAttribute("current");
            this.shadowRoot!.innerHTML = html`
                <style>
                    ::slotted(:not([name="${current}"])) {
                        display: none;
                    }
                </style>
                <slot></slot>
            `;
        }
    },
);
