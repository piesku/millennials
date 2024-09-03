import {STARTING_DECK} from "../actors/player.js";
import {html} from "../lib/html.js";
import {load_game_state, save_game_state} from "../storage.js";
import {CardElement} from "./a-card.js";
import {BattleScene} from "./battle-scene.js";

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
    }

    CurrentView = "title";
    CurrentOpponent = -1;
    PlayerDeck = [...STARTING_DECK];

    get AllCards() {
        let card_elements = this.shadowRoot!.querySelectorAll<CardElement>("collection-viewer a-card");
        return Array.from(card_elements, (card) => card.Instance);
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
        this.CurrentOpponent = -1;
        this.PlayerDeck = [...STARTING_DECK];
    }

    Commit() {
        save_game_state(this);
        history.pushState(this.CurrentView, "");
        document.title = this.CurrentView.toUpperCase();
        this.Render();
    }
}

customElements.define("game-container", GameContainer);
