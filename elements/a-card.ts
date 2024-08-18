import {CardController} from "../controllers/CardController.js";
import {html} from "../lib/html.js";

export class CardElement extends HTMLElement {
    InitialCost = parseInt(this.getAttribute("cost") ?? "0");
    InitialPower = parseInt(this.getAttribute("power") ?? "0");

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        const name = this.getAttribute("name") ?? "";
        const cost = this.getAttribute("cost") ?? "";
        const power = this.getAttribute("power") ?? "";
        const text = this.getAttribute("text") ?? "";
        const imageIndex = parseInt(this.getAttribute("image") ?? "0", 10);
        const spriteSize = 16;
        const spriteMargin = 1;
        const targetSize = 120;
        const scale = targetSize / spriteSize;

        const spriteYPosition = (spriteSize + spriteMargin) * imageIndex * scale;

        const img_src = document.querySelector("body > img[hidden]")?.getAttribute("src");
        const backgroundImageUrl = `url(${img_src})`;
        const card_body = html`
            <div class="header">
                <span
                    id="cost"
                    class="${parseInt(cost) > this.InitialCost
                        ? "incr"
                        : parseInt(cost) < this.InitialCost
                          ? "decr"
                          : ""}"
                >
                    ${cost}
                </span>
                <span
                    id="power"
                    class="${parseInt(power) > this.InitialPower
                        ? "incr"
                        : parseInt(power) < this.InitialPower
                          ? "decr"
                          : ""}"
                >
                    ${power}
                </span>
            </div>
            <div class="sprite"></div>
            <div class="text-container">
                <div class="name">${name}</div>
                <div class="description">${text}</div>
            </div>
        `;

        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    display: block;
                    width: 120px;
                    height: 180px;
                    background-color: white;
                    border: 1px solid black;
                    border-radius: 5px;
                    cursor: move;
                    user-select: none;
                    position: relative;
                }

                :host > * {
                    visibility: hidden;
                }

                :host-context(a-hand) > *,
                :host(.frontside) > * {
                    visibility: visible;
                }

                :host(.dragging) {
                    opacity: 0.5;
                }

                .sprite {
                    width: ${targetSize}px;
                    height: ${targetSize}px;
                    background-image: ${backgroundImageUrl};
                    background-position: 0 -${spriteYPosition}px;
                    background-size: ${targetSize}px auto;
                    image-rendering: pixelated;
                    margin: 0 auto;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.8em;
                    font-family: Arial, sans-serif;
                    padding: 0 3px;
                    background-color: rgba(255, 255, 255, 0.5);
                }

                .header span {
                    font-weight: bold;
                    font-size: 16px;
                }

                #cost.incr,
                #power.decr {
                    color: red;
                    scale: 5;
                }

                #cost.decr,
                #power.incr {
                    color: green;
                    scale: 5;
                }

                .text-container {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    background-color: rgba(255, 255, 255, 0.7);
                    text-align: center;
                    font-family: Arial, sans-serif;
                }

                .name {
                    font-size: 1em;
                    white-space: normal;
                    word-wrap: break-word;
                    padding: 0 2px;
                    font-weight: bold;
                }

                .description {
                    font-size: 0.8em;
                }

                dialog,
                dialog:active {
                    background: transparent;
                    outline: none;
                    border: none;
                    width: 120px;
                    min-height: 180px;
                    scale: 3;
                    overflow: visible;
                }

                card-detail {
                    width: 120px;
                    height: 180px;
                    background: white;
                    border: 1px solid black;
                    padding: 0;
                    user-select: none;
                    position: relative;
                }

                card-modifiers {
                    font-size: 30%;
                    margin: 0 10px;
                    width: 100px;
                    background: white;
                }
            </style>

            <flex-col onclick="event.stopPropagation(); this.nextElementSibling.showModal();">${card_body}</flex-col>
            <dialog onclick="event.stopPropagation(); this.close()">
                <flex-col>
                    <card-detail>
                        <flex-col>${card_body}</flex-col>
                    </card-detail>
                    <card-modifiers>
                        <slot></slot>
                    </card-modifiers>
                </flex-col>
            </dialog>
        `;
    }

    static observedAttributes = ["cost", "power"];

    attributeChangedCallback(name: string, old_value: string, new_value: string) {
        this.connectedCallback();
    }

    get Controller(): CardController {
        return this.parentElement as CardController;
    }
}

customElements.define("a-card", CardElement);
