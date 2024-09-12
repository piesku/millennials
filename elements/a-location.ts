import {html} from "../lib/html.js";
import {CastleBonehead} from "../locations/cant_play_here.js";
import {CopyToOpponentHand} from "../locations/copy_to_opponent_hand.js";
import {CopyToOwnerHand} from "../locations/copy_to_owner_hand.js";
import {GainOneEnergy} from "../locations/gain_one_energy.js";
import {GainOneEnergyEmpty} from "../locations/gain_one_energy_empty.js";
import {GiveCostHand} from "../locations/give_cost_hand.js";
import {LocationController, LocationType} from "../locations/LocationController.js";
import {LoseOnePower} from "../locations/lose_one_power.js";
import {NoOp} from "../locations/no_op.js";
import {OnceDontWork} from "../locations/once_dont_work.js";
import {OneTwoThree} from "../locations/one_two_three.js";
import {ReturnToOwnerHand} from "../locations/return_to_owner_hand.js";
import {Roulette} from "../locations/roulette.js";
import {ShuffleMarbles} from "../locations/shuffle_marbles.js";
import {ANewHope} from "../locations/StarWars_ANewHope.js";
import {AttackOfTheClones} from "../locations/StarWars_AttackOfTheClones.js";
import {ReturnOfTheJedi} from "../locations/StarWars_ReturnOfTheJedi.js";
import {TheEmpireStrikesBack} from "../locations/StarWars_TheEmpireStrikesBack.js";
import {TrashFourthTurn} from "../locations/trash_fourth_turn.js";
import {TrashFromHand} from "../locations/trash_from_hand.js";
import {TurnSeven} from "../locations/turn_seven.js";
import {WinnerDrawsTwo} from "../locations/winner_draws_two.js";

export class LocationElement extends HTMLElement {
    Instance!: LocationController;

    static Controllers: Record<LocationType, new (el: LocationElement) => LocationController> = {
        [LocationType.StarWars_ANewHope]: TheEmpireStrikesBack,
        [LocationType.StarWars_TheEmpireStrikesBack]: ANewHope,
        [LocationType.StarWars_ReturnOfTheJedi]: ReturnOfTheJedi,
        [LocationType.StarWars_AttackOfTheClones]: AttackOfTheClones,
        [LocationType.GainOneEnergy]: GainOneEnergy,
        [LocationType.GainOneEnergyEmpty]: GainOneEnergyEmpty,
        [LocationType.GiveCostHand]: GiveCostHand,
        [LocationType.LoseOnePower]: LoseOnePower,
        [LocationType.OnceDontWork]: OnceDontWork,
        [LocationType.OneTwoThree]: OneTwoThree,
        [LocationType.TrashFourthTurn]: TrashFourthTurn,
        [LocationType.TrashFromHand]: TrashFromHand,
        [LocationType.TurnSeven]: TurnSeven,
        [LocationType.WinnerDrawsTwo]: WinnerDrawsTwo,
        [LocationType.NoOp]: NoOp,
        [LocationType.CopyToOwnerHand]: CopyToOwnerHand,
        [LocationType.CopyToOpponentHand]: CopyToOpponentHand,
        [LocationType.ReturnToOwnerHand]: ReturnToOwnerHand,
        [LocationType.Roulette]: Roulette,
        [LocationType.ShuffleMarbles]: ShuffleMarbles,
        [LocationType.CantPlayHere]: CastleBonehead,
    };

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    static observedAttributes = ["type"];
    attributeChangedCallback(name: string, old_value: string, new_value: string) {
        this.Instance = new LocationElement.Controllers[parseInt(new_value) as LocationType](this);
        this.Render();
    }

    connectedCallback() {
        if (DEBUG && !this.hasAttribute("type")) {
            throw new Error("LocationElement: type attribute is required");
        }

        this.innerHTML = `
            <location-owner slot="player"></location-owner>
            <location-owner slot="villain"></location-owner>
        `;

        this.Render();
    }

    Render() {
        this.id = `_${this.Instance.Id}`;
        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    flex: 1;
                    padding: 10px;
                    margin: 10px;
                    background: bisque;
                }
                .description {
                    margin: 10px 0;
                }
                .points {
                    margin: 20px;
                    font-size: 20px;
                }
                .name-description {
                    opacity: 0.3;
                    text-align: center;
                }
                :host(.frontside) .name-description {
                    opacity: 1;
                }
            </style>
            <flex-col style="height: 100%; align-items: center;">
                <slot name="villain"></slot>
                <div id="villain-points" class="points">${this.Instance.GetScore(this.Instance.Battle.Villain)}</div>
                <div class="name-description">
                    <div class="name">${this.Instance.Name}</div>
                    <div class="description">
                        <slot name="description">${this.Instance.Description}</slot>
                    </div>
                </div>
                <div id="player-points" class="points">${this.Instance.GetScore(this.Instance.Battle.Player)}</div>
                <slot name="player"></slot>
            </flex-col>
        `;
    }
}

customElements.define("a-location", LocationElement);
