import {ActorController} from "../actors/ActorController.js";
import {CartoonVillainsController} from "../actors/cartoon.js";
import {EndlessController} from "../actors/endless.js";
import {FantasyController} from "../actors/fantasy.js";
import {PlayerController} from "../actors/player.js";
import {SpaceVillainsController} from "../actors/space.js";
import {html} from "../lib/html.js";
import {CardElement} from "./a-card.js";

export const enum ActorType {
    Player,
    Space,
    Pirates,
    Cartoon,
    Endless,
}
export class ActorElement extends HTMLElement {
    Controller!: ActorController;

    static Controllers: Array<new (el: ActorElement) => ActorController> = [
        PlayerController, // 0
        SpaceVillainsController, // 1
        FantasyController, // 2
        CartoonVillainsController, // 3
        EndlessController, // 4
    ];

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    static observedAttributes = ["type"];
    attributeChangedCallback(name: string, old_value: string, new_value: string) {
        this.Controller = new ActorElement.Controllers[parseInt(new_value) as ActorType](this);
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
            <flex-row ${this.Controller.Type === "villain" && "reverse"}>
                <slot></slot>
                <div>
                    <h2>${this.Controller.Name}</h2>
                    <div>Energy: $${this.Controller.CurrentEnergy}</div>
                    <div>Trash: ${this.querySelectorAll("a-trash a-card").length}</div>
                    <b style="font-size:100px;">${this.Controller.GetScore()}</b>
                </div>
            </flex-row>
        `;
    }

    Render() {
        this.connectedCallback();

        if (this.Controller.Type === "player") {
            for (let card of this.querySelectorAll<CardElement>("a-hand a-card")) {
                if (card.Controller.CurrentCost > this.Controller.CurrentEnergy) {
                    card.classList.add("unplayable");
                } else {
                    card.classList.remove("unplayable");
                }
            }
        }
    }
}

customElements.define("a-actor", ActorElement);
