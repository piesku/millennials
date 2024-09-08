import {STARTING_DECK} from "../actors/player.js";
import {html} from "../lib/html.js";
import {element, set_seed} from "../lib/random.js";
import {load_game_state, save_game_state} from "../storage.js";
import {BattleScene} from "./battle-scene.js";
import {CollectionViewer} from "./collection-viewer.js";

export class GameContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    Render() {
        let has_previous_run = this.CurrentOpponent > -1;
        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    display: block;
                }
                button {
                    width: 200px;
                    padding: 20px;
                }
            </style>
            <multi-view current="${this.CurrentView}">
                <main name="title">
                    <flex-col center name="title" style="height:90vh;">
                        <h1 style="font-size:18vw; color:#f60;">
                            <i>Millennials</i>
                        </h1>

                        <flex-row gap center>
                            ${has_previous_run && html`<button id="continue">Continue Run</button>`}
                            <button id="run">Start a New Run</button>
                            <button id="collection">Collection</button>
                        </flex-row>
                    </flex-col>
                </main>
                <main name="run">
                    <multi-view current="${this.CurrentOpponent}">
                        <slot></slot>
                    </multi-view>
                </main>
                <collection-viewer name="collection"></collection-viewer>
            </multi-view>
            <dialog>
                <table></table>
                <button id="reset">Play Again</button>
            </dialog>
        `;
    }

    connectedCallback() {
        load_game_state(this);

        history.replaceState(this.CurrentView, "");

        this.shadowRoot!.addEventListener("click", (e) => {
            let target = e.target as HTMLElement;
            switch (target.id) {
                case "continue":
                    this.Populate();
                    this.InitBattle();
                    this.CurrentView = "run";
                    this.Commit();
                    break;
                case "run":
                    this.CurrentView = "run";
                    this.ResetState();
                    this.Populate();
                    this.ProgressToNextOpponent();
                    break;
                case "reset":
                    this.Reset();
                    break;
                case "collection":
                    this.CurrentView = "collection";
                    this.Commit();
                    break;
            }
        });

        window.addEventListener("popstate", (e) => {
            if (e.state) {
                this.CurrentView = e.state as string;
                this.Render();
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
    CurrentOpponent = -1;
    CardsInShop = 1;
    PlayerDeck = [...STARTING_DECK];

    get Collection() {
        let collection = this.shadowRoot!.querySelector<CollectionViewer>("collection-viewer");
        DEBUG: if (!collection) {
            throw "Collection not found";
        }
        return collection;
    }

    Populate() {
        set_seed(this.Seed);

        let by_cost = this.Collection.AllCardsByCost();
        let villains = ["empire", "pirates", "kungfu"];
        for (let [i, villain] of villains.entries()) {
            let battle = document.createElement("battle-scene");
            battle.setAttribute("name", i.toString());
            battle.innerHTML = html`
                <a-actor type="${villain}" id="villain" slot="villain">
                    <a-deck reverse></a-deck>
                    <a-hand></a-hand>
                    <a-trash hidden></a-trash>
                </a-actor>
                <a-location slot="location" type="death-star"></a-location>
                <a-location slot="location" type="arkham-asylum"></a-location>
                <a-location slot="location" type="future-hill-valley"></a-location>
                <a-actor type="player" id="player" slot="player">
                    <a-deck></a-deck>
                    <a-hand></a-hand>
                    <a-trash hidden></a-trash>
                </a-actor>
                <a-log slot="log"></a-log>

                <a-card type="${element(by_cost[1]!).Sprite}" slot="shop" draggable="true" class="frontside"></a-card>
                <a-card type="${element(by_cost[2]!).Sprite}" slot="shop" draggable="true" class="frontside"></a-card>
                <a-card type="${element(by_cost[3]!).Sprite}" slot="shop" draggable="true" class="frontside"></a-card>
                <a-card type="${element(by_cost[4]!).Sprite}" slot="shop" draggable="true" class="frontside"></a-card>
                <a-card type="${element(by_cost[5]!).Sprite}" slot="shop" draggable="true" class="frontside"></a-card>
                <a-card type="${element(by_cost[6]!).Sprite}" slot="shop" draggable="true" class="frontside"></a-card>

                <a-card type="${element(by_cost[1]!).Sprite}" slot="shop" draggable="true" class="frontside"></a-card>
                <a-card type="${element(by_cost[2]!).Sprite}" slot="shop" draggable="true" class="frontside"></a-card>
                <a-card type="${element(by_cost[3]!).Sprite}" slot="shop" draggable="true" class="frontside"></a-card>
                <a-card type="${element(by_cost[4]!).Sprite}" slot="shop" draggable="true" class="frontside"></a-card>
                <a-card type="${element(by_cost[5]!).Sprite}" slot="shop" draggable="true" class="frontside"></a-card>
                <a-card type="${element(by_cost[6]!).Sprite}" slot="shop" draggable="true" class="frontside"></a-card>
            `;
            this.append(battle);
        }
    }

    InitBattle() {
        let battle = this.querySelector<BattleScene>(`battle-scene[name="${this.CurrentOpponent}"]`);
        if (battle) {
            battle.PrepareBattle();
        } else if (DEBUG) {
            throw `<battle-scene name="${this.CurrentOpponent}"> not found`;
        }
    }

    ProgressToNextOpponent() {
        this.CurrentOpponent++;

        let next_battle = this.querySelector<BattleScene>(`battle-scene[name="${this.CurrentOpponent}"]`);
        if (!next_battle) {
            this.ShowSummary();
            alert("You win the run!");
        }

        this.Commit();
        this.InitBattle();
    }

    ShowSummary() {
        let dialog = this.shadowRoot!.querySelector("dialog");
        DEBUG: if (!dialog) {
            throw "Dialog not found";
        }

        let table = dialog.querySelector("table");
        DEBUG: if (!table) {
            throw "Table not found";
        }

        let total_battles = this.querySelectorAll<BattleScene>("battle-scene").length;
        let prcnfmt = new Intl.NumberFormat("en-US", {style: "percent", maximumFractionDigits: 0});
        let total_minutes = (Date.now() - this.Stats.DateStarted) / 1000 / 60;
        let unitfmt = new Intl.NumberFormat("en-US", {
            style: "unit",
            unit: "minute",
            unitDisplay: "long",
            maximumFractionDigits: 0,
        });
        let villains_bested = this.Stats.Battles - 1;

        table.innerHTML = html`
            <tr>
                <td>Villains Bested</td>
                <td>${villains_bested} (${prcnfmt.format(villains_bested / total_battles)})</td>
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
                <td>${unitfmt.format(total_minutes)}</td>
            </tr>
        `;

        dialog.showModal();
    }

    Reset() {
        this.CurrentView = "title";
        this.ResetState();
        this.Populate();
        this.Commit();
    }

    ResetState() {
        this.Seed = Date.now();
        this.CurrentOpponent = -1;
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
        history.pushState(this.CurrentView, "");
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

customElements.define("game-container", GameContainer);
