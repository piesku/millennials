import {ActorController} from "../actors/ActorController.js";
import {CartoonVillainsController} from "../actors/cartoon.js";
import {EndlessController} from "../actors/endless.js";
import {FantasyController} from "../actors/fantasy.js";
import {PlayerController} from "../actors/player.js";
import {SpaceVillainsController} from "../actors/space.js";
import {html} from "../lib/html.js";
import {CardElement} from "./a-card.js";

export class ActorElement extends HTMLElement {
    Instance!: ActorController;

    static Controllers: Record<string, new (el: ActorElement) => ActorController> = {
        player: PlayerController,
        space: SpaceVillainsController,
        pirates: FantasyController,
        cartoon: CartoonVillainsController,
        endless: EndlessController,
    };

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    static observedAttributes = ["type"];
    attributeChangedCallback(name: string, old_value: string, new_value: string) {
        this.Instance = new ActorElement.Controllers[new_value](this);
    }

    connectedCallback() {
        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    display: block;
                    padding: 20px;
                }
                h2 {
                    margin-top: 0;
                }
                ::slotted(button) {
                    flex: 1;
                    margin-top: 10px;
                }
                flex-col,
                ::slotted(a-deck) {
                    flex: 1;
                }
                ::slotted(a-hand) {
                    flex: 3;
                }
            </style>
            <flex-row ${this.Instance.Type === "villain" && "reverse"}>
                <slot></slot>
                <div>
                    <h2>${this.Instance.Name}</h2>
                    <div>Mana: $${this.Instance.CurrentEnergy}</div>
                    <div>Trash: ${this.querySelectorAll("a-trash a-card").length}</div>
                    <b style="font-size:100px;">${this.Instance.GetScore()}</b>
                </div>
            </flex-row>
        `;
    }

    Render() {
        this.connectedCallback();

        if (this.Instance.Type === "player") {
            for (let card of this.querySelectorAll<CardElement>("a-hand a-card")) {
                if (card.Instance.CurrentCost > this.Instance.CurrentEnergy) {
                    card.classList.add("unplayable");
                } else {
                    card.classList.remove("unplayable");
                }
            }
        }
    }
}

customElements.define("a-actor", ActorElement);
