import {LocationController} from "../controllers/LocationController.js";
import {html} from "../lib/html.js";
import {ArkhamAsylum} from "../locations/arkham-asylum.js";
import {DeathStar} from "../locations/death-star.js";
import {FutureHillValey} from "../locations/future-hill-valley.js";

export class LocationElement extends HTMLElement {
    Instance!: LocationController;

    static Controllers: Record<string, new (el: LocationElement) => LocationController> = {
        "arkham-asylum": ArkhamAsylum,
        "death-star": DeathStar,
        "future-hill-valley": FutureHillValey,
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

        this.shadowRoot!.innerHTML = html`
            <style>
                .location {
                    border: 1px solid #000;
                    padding: 10px;
                    margin: 10px;
                    background-color: bisque;
                }
                .description {
                    margin: 10px 0;
                }
                ::slotted(location-owner) {
                    width: 45%;
                }
                .points {
                    margin: 20px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    font-size: 20px;
                }
                .name-description {
                    text-align: center;
                    margin: 0 10px;
                }
            </style>
            <flex-row class="location">
                <slot name="player"></slot>
                <div id="player-points" class="points">${0}</div>
                <div class="name-description">
                    <div class="name">${this.Instance.Name}</div>
                    <div class="description">
                        <slot name="description">${this.Instance.Description}</slot>
                    </div>
                </div>
                <div id="enemy-points" class="points">${0}</div>
                <slot name="villain"></slot>
            </flex-row>
        `;

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
    }
}

customElements.define("a-location", LocationElement);
