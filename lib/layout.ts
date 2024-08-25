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
    "multi-view",
    class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: "open"});
        }

        connectedCallback() {
            this.shadowRoot!.innerHTML = `
                <style>
                    ::slotted(*) {
                        display: none;
                    }

                    ::slotted([selected]) {
                        display: block;
                    }
                </style>
                <slot></slot>
            `;
        }

        static observedAttributes = ["current"];
        attributeChangedCallback(name: string, old_value: string, new_value: string) {
            this.querySelector(`[name=${old_value}]`)?.removeAttribute("selected");
            this.querySelector(`[name=${new_value}]`)?.setAttribute("selected", "true");
        }
    },
);
