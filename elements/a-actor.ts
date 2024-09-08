import {ActorController} from "../actors/ActorController.js";
import {EmpireController} from "../actors/empire.js";
import {KungFuController} from "../actors/kungfu.js";
import {PiratesController} from "../actors/pirates.js";
import {PlayerController} from "../actors/player.js";
import {html} from "../lib/html.js";
import {CardElement} from "./a-card.js";

export class ActorElement extends HTMLElement {
    Instance!: ActorController;

    static Controllers: Record<string, new (el: ActorElement) => ActorController> = {
        player: PlayerController,
        empire: EmpireController,
        pirates: PiratesController,
        kungfu: KungFuController,
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
                    <div>Energy: ${this.Instance.CurrentEnergy}/${this.Instance.MaxEnergy}</div>
                    <div>Total Score: ${this.Instance.GetScore()}</div>
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
