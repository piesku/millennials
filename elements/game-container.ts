import {STARTING_DECK} from "../actors/player.js";
import {html} from "../lib/html.js";
import {format_time} from "../lib/number.js";
import {set_seed, shuffle} from "../lib/random.js";
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
                <multi-view name="run" current="${this.CurrentOpponent}">
                    <slot></slot>
                </multi-view>
            </multi-view>
            <dialog></dialog>
        `;
    }

    connectedCallback() {
        load_game_state(this);

        history.replaceState(this.CurrentView, "");

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

        window.addEventListener("popstate", (e) => {
            if (e.state) {
                this.CurrentView = e.state as string;
                this.Render();
            }
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
        let villains: ActorType[];
        let offset: number;

        if (endless) {
            set_seed(this.Seed * this.CurrentOpponent);
            villains = [ActorType.Endless];
            offset = this.CurrentOpponent;
        } else {
            set_seed(this.Seed);
            villains = shuffle([ActorType.Cartoon, ActorType.Pirates, ActorType.Space]);
            offset = 1;
        }

        for (let [i, villain] of villains.entries()) {
            // Choose 3 non-repeating locations. C(18, 3) = 816
            let all_locations = Array.from({length: 18}, (_, i) => i);
            let battle_locations = shuffle(all_locations).slice(0, 3);

            let battle = document.createElement("battle-scene");
            battle.setAttribute("name", (offset + i).toString());
            battle.innerHTML = html`
                <a-location slot="location" title="Left" type="${battle_locations[0]}"></a-location>
                <a-location slot="location" title="Middle" type="${battle_locations[1]}"></a-location>
                <a-location slot="location" title="Right" type="${battle_locations[2]}"></a-location>
                <a-actor type="${ActorType.Player}" slot="player">
                    <a-deck></a-deck>
                    <a-hand></a-hand>
                    <a-trash hidden></a-trash>
                </a-actor>
                <a-actor type="${villain}" slot="villain">
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

        let contents = `
            <h2>${won ? "You win the run!" : "You lose the run."}</h2>
            <flex-col gap>
                <table>
        `;

        for (let stat in this.Stats) {
            contents += `
                <tr>
                    <td>${stat}</td>
                    <td>${this.Stats[stat]}</td>
                </tr>
            `;
        }

        contents += html`
                <tr>
                    <td>Total Time</td>
                    <td>${format_time(this.TotalTime / 1000)}</td>
                </tr>
                </table>
                <flex-row>
                    <button id="reset">Play Again</button>
                    ${won && `<button id="continue">Continue Playing</button>`}
                </flex-row>
            </flex-col>
        `;

        dialog.innerHTML = contents;
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
        this.TotalTime = 0;
        this.Stats = {
            ["Battles"]: 0,
            ["Cards Played"]: 0,
            ["Cards Trashed"]: 0,
            ["Cards Moved"]: 0,
            ["Cards Acquired"]: 0,
            ["Locations Won"]: 0,
            ["Locations Lost"]: 0,
            ["Total Power"]: 0,
            ["Energy Spent"]: 0,
        };

        for (let battle of this.querySelectorAll<BattleScene>("battle-scene")) {
            battle.remove();
        }
    }

    Commit() {
        this.TotalTime += Date.now() - this.LastSavedAt;
        this.LastSavedAt = Date.now();
        save_game_state(this);
        history.pushState(this.CurrentView, "");
        this.Render();
    }

    TotalTime = 0;
    LastSavedAt = Date.now();
    Stats: {
        [key: string]: number;
    } = {
        ["Battles Played"]: 0,
        ["Cards Played"]: 0,
        ["Cards Trashed"]: 0,
        ["Cards Moved"]: 0,
        ["Cards Acquired"]: 0,
        ["Locations Won"]: 0,
        ["Locations Lost"]: 0,
        ["Total Power"]: 0,
        ["Energy Spent"]: 0,
    };
}

customElements.define("g-c", GameContainer);
