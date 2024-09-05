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
            </style>
            <multi-view current="${this.CurrentView}">
                <main name="title">
                    <flex-col name="title" style="height:100vh; justify-content:center; align-items:center;">
                        <h1><i>The Dirty Dozen</i></h1>

                        ${has_previous_run && html`<button id="continue">Continue Previous Run</button>`}
                        <button id="run">Start a New Run</button>
                        <button id="collection">Collection</button>
                    </flex-col>
                </main>
                <main name="run">
                    <multi-view current="${this.CurrentOpponent}">
                        <slot></slot>
                    </multi-view>
                </main>
                <collection-viewer name="collection"></collection-viewer>
            </multi-view>
        `;
    }

    connectedCallback() {
        load_game_state(this);

        history.replaceState(this.CurrentView, "");
        document.title = this.CurrentView.toUpperCase();

        this.shadowRoot!.addEventListener("click", (e) => {
            let target = e.target as HTMLElement;
            switch (target.id) {
                case "title":
                    this.CurrentView = "title";
                    this.Commit();
                    break;
                case "continue":
                    this.InitBattle();
                    this.CurrentView = "run";
                    this.Commit();
                    break;
                case "run":
                    this.CurrentView = "run";
                    this.ResetState();
                    this.ProgressToNextOpponent();
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

        this.Populate();
    }

    Seed = Date.now();
    CurrentView = "title";
    CurrentOpponent = -1;
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
            alert("You win the run!");
        }

        this.Commit();
        this.InitBattle();
    }

    Reset() {
        this.CurrentView = "title";
        this.ResetState();
        this.Commit();

        // TODO: New seed, regen the battles.
    }

    ResetState() {
        this.Seed = Date.now();
        this.CurrentOpponent = -1;
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
    }

    Commit() {
        save_game_state(this);
        history.pushState(this.CurrentView, "");
        document.title = this.CurrentView.toUpperCase();
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
