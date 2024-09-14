import {STARTING_DECK} from "../actors/player.js";
import {html} from "../lib/html.js";
import {format_time} from "../lib/number.js";
import {integer, set_seed, shuffle} from "../lib/random.js";
import {load_game_state, save_game_state} from "../storage.js";
import {ActorType} from "./a-actor.js";
import {BattleScene} from "./battle-scene.js";
import {CollectionTitle} from "./collection-title.js";

export const VILLAINS_COUNT = 3;

export class GameContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    Render() {
        let has_previous_run = this.CurrentOpponent > 0;
        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    display: block;
                }

                dialog {
                    outline: none;
                    border-radius: 5px;
                    width: 30vw;
                }

                dialog::backdrop {
                    background: radial-gradient(#f69d3caa, #3f87a6aa);
                }

                table {
                    width: 100%;
                }

                button {
                    flex: 1;
                    margin: 10px;
                }
            </style>
            <multi-view current="${this.CurrentView}">
                <collection-title name="title">
                    ${has_previous_run && html`<button id="continue">Continue Run</button>`}
                    <button id="run">New Run</button>
                    <button id="daily">Daily Challenge</button>
                </collection-title>
                <main name="run">
                    <multi-view current="${this.CurrentOpponent}">
                        <slot></slot>
                    </multi-view>
                </main>
            </multi-view>
            <dialog></dialog>
        `;
    }

    connectedCallback() {
        load_game_state(this);

        this.shadowRoot!.addEventListener("click", (e) => {
            let target = e.target as HTMLElement;
            switch (target.id) {
                case "continue":
                    this.Populate(this.CurrentOpponent > VILLAINS_COUNT);
                    this.InitBattle();
                    this.Commit();
                    break;
                case "run":
                    this.ResetState();
                    this.ProgressToNextOpponent();
                    break;
                case "daily":
                    this.ResetState(Math.floor(Date.now() / (24 * 60 * 60 * 1000)));
                    this.ProgressToNextOpponent();
                    break;
                case "reset":
                    this.Reset();
                    break;
            }
        });

        this.addEventListener("dragstart", (e) => {
            let card = e.target as HTMLElement;
            card.classList.add("dragging");
        });

        this.addEventListener("dragend", (e) => {
            let card = e.target as HTMLElement;
            card.classList.remove("dragging");
        });

        switch (this.CurrentView) {
            case "run":
                this.InitBattle();
                break;
        }

        this.Render();
    }

    Seed = Date.now();
    CurrentView = "title";
    CurrentOpponent = 0;
    CardsInShop = 1;
    PlayerDeck = [...STARTING_DECK];

    get Collection() {
        let collection = this.shadowRoot!.querySelector<CollectionTitle>("collection-title");
        DEBUG: if (!collection) {
            throw "Collection not found";
        }
        return collection;
    }

    Populate(endless = false) {
        set_seed(this.Seed * this.CurrentOpponent);

        let villains = shuffle([ActorType.Cartoon, ActorType.Pirates, ActorType.Space]);
        let offset = 1;

        if (endless) {
            villains = [ActorType.Endless];
            offset = this.CurrentOpponent;
        }

        for (let [i, villain] of villains.entries()) {
            let battle = document.createElement("battle-scene");
            battle.setAttribute("name", (offset + i).toString());
            battle.innerHTML = html`
                <a-location slot="location" title="Left" type="${integer(0, 17)}"></a-location>
                <a-location slot="location" title="Middle" type="${integer(0, 17)}"></a-location>
                <a-location slot="location" title="Right" type="${integer(0, 17)}"></a-location>
                <a-actor type="${ActorType.Player}" id="player" slot="player">
                    <a-deck></a-deck>
                    <a-hand></a-hand>
                    <a-trash hidden></a-trash>
                </a-actor>
                <a-actor type="${villain}" id="villain" slot="villain">
                    <a-deck reverse></a-deck>
                    <a-hand></a-hand>
                    <a-trash hidden></a-trash>
                </a-actor>
                <a-log slot="log"></a-log>
            `;
            this.append(battle);
        }
    }

    InitBattle() {
        this.CurrentView = "run";
        let battle = this.querySelector<BattleScene>(`battle-scene[name="${this.CurrentOpponent}"]`);
        if (battle) {
            battle.PrepareBattle();
        } else if (DEBUG) {
            throw `<battle-scene name="${this.CurrentOpponent}"> not found`;
        }
    }

    ProgressToNextOpponent() {
        this.CurrentOpponent++;

        if (this.CurrentOpponent === 1) {
            this.Populate();
            this.InitBattle();
            this.Commit();
        } else if (this.CurrentOpponent <= VILLAINS_COUNT) {
            this.InitBattle();
            this.Commit();
        } else if (this.CurrentOpponent === VILLAINS_COUNT + 1) {
            this.ShowSummary(true);
        } else if (this.CurrentOpponent > VILLAINS_COUNT + 1) {
            this.Populate(true);
            this.InitBattle();
            this.Commit();
        }
    }

    ShowSummary(won: boolean) {
        let dialog = this.shadowRoot!.querySelector("dialog");
        DEBUG: if (!dialog) {
            throw "Dialog not found";
        }

        let total_seconds = (Date.now() - this.Stats.DateStarted) / 1000;
        let villains_bested = this.Stats.Battles - Number(!won);

        dialog.innerHTML = html`
            <h2>${won ? "You win the run!" : "You lose the run."}</h2>
            <flex-col gap>
                <table>
                    <tr>
                        <td>Villains Bested</td>
                        <td>${villains_bested}</td>
                    </tr>
                    <tr>
                        <td>Cards Played</td>
                        <td>${this.Stats.CardsPlayed}</td>
                    </tr>
                    <tr>
                        <td>Cards Trashed</td>
                        <td>${this.Stats.CardsTrashed}</td>
                    </tr>
                    <tr>
                        <td>Cards Moved</td>
                        <td>${this.Stats.CardsMoved}</td>
                    </tr>
                    <tr>
                        <td>Cards Acquired</td>
                        <td>${this.Stats.CardsAcquired}</td>
                    </tr>
                    <tr>
                        <td>Locations Won</td>
                        <td>${this.Stats.LocationsWon}</td>
                    </tr>
                    <tr>
                        <td>Locations Lost</td>
                        <td>${this.Stats.LocationsLost}</td>
                    </tr>
                    <tr>
                        <td>Total Power</td>
                        <td>${this.Stats.TotalPower}</td>
                    </tr>
                    <tr>
                        <td>Energy Spent</td>
                        <td>${this.Stats.EnergySpent}</td>
                    </tr>
                    <tr>
                        <td>Total Time</td>
                        <td>${format_time(total_seconds)}</td>
                    </tr>
                </table>
                <flex-row>
                    <button id="reset">Play Again</button>
                    ${won && `<button id="continue">Continue Playing</button>`}
                </flex-row>
            </flex-col>
        `;

        dialog.showModal();
    }

    Reset() {
        this.CurrentView = "title";
        this.ResetState();
        this.Commit();
    }

    ResetState(seed = Date.now()) {
        this.Seed = seed;
        this.CurrentOpponent = 0;
        this.CardsInShop = 1;
        this.PlayerDeck = [...STARTING_DECK];
        this.Stats = {
            Battles: 0,
            CardsPlayed: 0,
            CardsTrashed: 0,
            CardsMoved: 0,
            CardsAcquired: 0,
            LocationsWon: 0,
            LocationsLost: 0,
            TotalPower: 0,
            EnergySpent: 0,
            DateStarted: Date.now(),
        };

        for (let battle of this.querySelectorAll<BattleScene>("battle-scene")) {
            battle.remove();
        }
    }

    Commit() {
        save_game_state(this);
        this.Render();
    }

    Stats = {
        Battles: 0,
        CardsPlayed: 0,
        CardsTrashed: 0,
        CardsMoved: 0,
        CardsAcquired: 0,
        LocationsWon: 0,
        LocationsLost: 0,
        TotalPower: 0,
        EnergySpent: 0,
        DateStarted: Date.now(),
    };
}

customElements.define("g-c", GameContainer);
