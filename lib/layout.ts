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

                    :host([wrap]) {
                        flex-wrap: wrap;
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

                    :host([end]) {
                        justify-content: flex-end;
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
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    }

                    :host([wrap]) {
                        flex-wrap: wrap;
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

                    :host([end]) {
                        justify-content: flex-end;
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
    "stack-layout",
    class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: "open"});
        }

        static observedAttributes = ["active"];
        attributeChangedCallback(name: string) {
            if (name === "active") {
                this.Render();
            }
        }

        connectedCallback() {
            this.Render();
        }

        Render() {
            const current = this.getAttribute("active");
            this.shadowRoot!.innerHTML = html`
                <style>
                    :host {
                        display: block;
                        position: relative;
                        width: 100vw;
                        height: 100vh;
                    }
                    ::slotted(*) {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        display: none;
                    }
                    ::slotted([name="${current}"]) {
                        display: block;
                    }
                </style>
                <slot></slot>
            `;
        }
    },
);
