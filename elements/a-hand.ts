import {html} from "../lib/html.js";
import {map_range} from "../lib/number.js";

export class HandElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.Render();

        this.shadowRoot!.addEventListener("slotchange", (e) => {
            let cards = this.querySelectorAll("a-card");
            let index = 0;
            for (let card of cards) {
                let tilt = 0.5 + index - cards.length / 2;
                let x = map_range(tilt, -2.5, 2.5, -Math.PI / 2, Math.PI / 2);
                card.setAttribute(
                    "style",
                    `
                        --tilt: ${tilt * 5}deg;
                        --y: ${(1 - Math.cos(x)) * 30}px;
                        --z: ${index};
                    `,
                );
                index++;
            }
        });
    }

    Render() {
        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    display: block;
                }
                ::slotted(a-card) {
                    transform: translateY(var(--y)) rotate(var(--tilt));
                    margin: 0 -20px;
                    transition: scale 0.1s;
                    z-index: var(--z);
                }
                ::slotted(a-card:hover) {
                    transform: translateY(calc(var(--y) - 30px)) rotate(var(--tilt)) scale(1.2);
                    z-index: 100;
                }
            </style>
            <flex-row center>
                <slot></slot>
            </flex-row>
        `;
    }
}
customElements.define("a-hand", HandElement);
