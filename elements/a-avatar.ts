import {ActorController} from "../controllers/ActorController.js";
import {PlayerController} from "../controllers/PlayerController.js";
import {html} from "../lib/html.js";
import {EmpireController} from "../villains/empire.js";

export class AvatarElement extends HTMLElement {
    Instance!: ActorController;

    static Controllers: Record<string, new (el: AvatarElement) => ActorController> = {
        player: PlayerController,
        empire: EmpireController,
    };

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    static observedAttributes = ["type"];
    attributeChangedCallback(name: string, old_value: string, new_value: string) {
        this.Instance = new AvatarElement.Controllers[new_value](this);
    }

    connectedCallback() {
        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    display: block;
                    padding: 10px;
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
                <flex-col>
                    <h2>${this.Instance.Name}</h2>
                    <div>Energy: ${this.Instance.CurrentEnergy}/${this.Instance.MaxEnergy}</div>
                    <slot name="end"></slot>
                </flex-col>
            </flex-row>
        `;
    }

    ReRender() {
        this.connectedCallback();
    }
}

customElements.define("a-avatar", AvatarElement);
