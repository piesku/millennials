import {CardController} from "../controllers/CardController.js";
import {html} from "../lib/html.js";

export class CardElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        const name = this.getAttribute("name") ?? "";
        const cost = this.getAttribute("cost") ?? "";
        const power = this.getAttribute("power") ?? "";
        const text = "Add the top card of your deck the first free slot of this location"; //this.getAttribute("text") ?? "";
        const imageIndex = parseInt(this.getAttribute("image") ?? "0", 10);
        const spriteSize = 16;
        const spriteMargin = 1;
        const targetSize = 120;
        const scale = targetSize / spriteSize;

        const spriteYPosition = (spriteSize + spriteMargin) * imageIndex * scale;

        const img_src = document.querySelector("body > img[hidden]")?.getAttribute("src");
        const backgroundImageUrl = `url(${img_src})`;

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
                    overflow: hidden;
                }

                :host > * {
                    visibility: hidden;
                }

                :host-context(a-hand) > *,
                :host([revealed]) > * {
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
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.8em;
                    font-family: Arial, sans-serif;
                    margin-bottom: 5px;
                    padding: 0 2px;
                    position: relative;
                    z-index: 1;
                }

                .header span {
                    font-weight: bold;
                    font-size: 20px;
                }

                .text-container {
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    z-index: 1;
                    background-color: rgba(255, 255, 255, 0.5);
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
            </style>

            <flex-col>
                <div class="header">
                    <span>${cost}</span>
                    <span>${power}</span>
                </div>
                <div class="sprite"></div>
                <div class="text-container">
                    <div class="name">${name}</div>
                    <div class="description">${text}</div>
                </div>
            </flex-col>
        `;
    }

    get Controller(): CardController {
        return this.parentElement as CardController;
    }
}

customElements.define("a-card", CardElement);
