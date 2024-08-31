import {STARTING_DECK} from "../actors/player.js";
import {html} from "../lib/html.js";
import {CardElement} from "./a-card.js";
import {BattleScene} from "./battle-scene.js";

export class GameContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.PushState();
    }

    Render() {
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
        this.shadowRoot!.addEventListener("click", (e) => {
            let target = e.target as HTMLElement;
            switch (target.id) {
                case "title":
                    this.CurrentView = "title";
                    this.PushState();
                    this.Render();
                    break;
                case "run":
                    this.CurrentView = "run";
                    this.ProgressToNextOpponent();
                    this.Render();
                    break;
                case "collection":
                    this.CurrentView = "collection";
                    this.PushState();
                    this.Render();
                    break;
            }
        });

        window.addEventListener("popstate", (e) => {
            if (e.state) {
                Object.assign(this, e.state);
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

    CurrentView = history.state?.CurrentView ?? "title";
    CurrentOpponent = history.state?.CurrentOpponent ?? -1;
    PlayerDeck = history.state?.PlayerDeck ?? [...STARTING_DECK];

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
        let previous_battle = this.querySelector<BattleScene>(`battle-scene[name="${this.CurrentOpponent}"]`);
        if (previous_battle) {
            previous_battle.remove();
        }

        this.CurrentOpponent++;

        let next_battle = this.querySelector<BattleScene>(`battle-scene[name="${this.CurrentOpponent}"]`);
        if (!next_battle) {
            alert("You win the run!");
        }

        this.PushState();
        this.Render();

        this.InitBattle();
    }

    Reset() {
        this.CurrentView = "title";
        this.CurrentOpponent = -1;
        this.PlayerDeck = [...STARTING_DECK];
        this.PushState();

        // TODO: New seed, regen the battles.
        history.go();
    }

    PushState() {
        let state = {
            CurrentView: this.CurrentView,
            CurrentOpponent: this.CurrentOpponent,
            PlayerDeck: this.PlayerDeck,
        };

        history.pushState(state, this.CurrentView.toUpperCase(), "#" + this.CurrentView);
    }
}

customElements.define("game-container", GameContainer);
