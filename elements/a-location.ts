import {html} from "../lib/html.js";
import {LocationController} from "../locations/LocationController.js";
import {ANewHope} from "../locations/StarWars_ANewHope.js";
import {ReturnOfTheJedi} from "../locations/StarWars_ReturnOfTheJedi.js";
import {TheEmpireStrikesBack} from "../locations/StarWars_TheEmpireStrikesBack.js";

export class LocationElement extends HTMLElement {
    Instance!: LocationController;

    static Controllers: Record<string, new (el: LocationElement) => LocationController> = {
        "arkham-asylum": TheEmpireStrikesBack,
        "death-star": ANewHope,
        "future-hill-valley": ReturnOfTheJedi,
    };

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    static observedAttributes = ["type"];
    attributeChangedCallback(name: string, old_value: string, new_value: string) {
        this.Instance = new LocationElement.Controllers[new_value](this);
    }

    connectedCallback() {
        if (DEBUG && !this.hasAttribute("type")) {
            throw new Error("LocationElement: type attribute is required");
        }

        this.innerHTML = `
            <location-owner slot="player">
                <location-slot label=1></location-slot>
                <location-slot label=2></location-slot>
                <location-slot label=3></location-slot>
                <location-slot label=4></location-slot>
            </location-owner>

            <location-owner slot="villain" reverse>
                <location-slot label=1></location-slot>
                <location-slot label=2></location-slot>
                <location-slot label=3></location-slot>
                <location-slot label=4></location-slot>
            </location-owner>
        `;

        this.Render();
    }

    Render() {
        this.id = `_${this.Instance.Id}`;
        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    padding: 10px;
                    margin: 10px;
                    background-color: bisque;
                }
                :host(.won) {
                    background-color: lightgreen;
                }
                :host(.lost) {
                    background-color: lightcoral;
                }
                .description {
                    margin: 10px 0;
                }
                ::slotted(location-owner) {
                    width: 35%;
                }
                .points {
                    margin: 20px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    font-size: 20px;
                }
                .name-description {
                    opacity: 0.3;
                    text-align: center;
                    width: 30%;
                }
                :host(.frontside) .name-description {
                    opacity: 1;
                }
            </style>
            <flex-row>
                <slot name="player"></slot>
                <div id="player-points" class="points">${this.Instance.GetScore(this.Instance.Battle.Player)}</div>
                <div class="name-description">
                    <div class="name">${this.Instance.Name}</div>
                    <div class="description">
                        <slot name="description">${this.Instance.Description}</slot>
                    </div>
                </div>
                <div id="enemy-points" class="points">${this.Instance.GetScore(this.Instance.Battle.Villain)}</div>
                <slot name="villain"></slot>
            </flex-row>
        `;
    }
}

customElements.define("a-location", LocationElement);
