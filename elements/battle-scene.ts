import {ActorController} from "../actors/ActorController.js";
import {CardController} from "../cards/CardController.js";
import {color_from_seed} from "../lib/color.js";
import {html} from "../lib/html.js";
import {set_seed} from "../lib/random.js";
import {delay} from "../lib/timeout.js";
import {LocationController} from "../locations/LocationController.js";
import {Message, Trace} from "../messages.js";
import {CollectionFlag, save_card_state} from "../storage.js";
import {ActorElement, ActorType} from "./a-actor.js";
import {CardElement} from "./a-card.js";
import {LocationElement} from "./a-location.js";
import {GameContainer} from "./game-container.js";
import {LocationOwner} from "./location-owner.js";

export class BattleScene extends HTMLElement {
    CurrentTurn = 0;
    MaxTurns = 6;
    State: "prep" | "play" | "won" | "lost" = "prep";

    PlayedCardsQueue: Array<CardController> = [];

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    get Game() {
        let game = this.closest<GameContainer>("g-c");
        DEBUG: if (!game) {
            throw "BattleScene must be a child of GameContainer";
        }
        return game;
    }

    get Player() {
        let player_element = this.querySelector<ActorElement>(`a-actor[type="${ActorType.Player}"]`);
        DEBUG: if (!player_element) {
            throw "BattleScene must have a player";
        }
        return player_element!.Controller;
    }

    get Villain() {
        let villain_element = this.querySelector<ActorElement>(`a-actor:not([type="${ActorType.Player}"])`);
        DEBUG: if (!villain_element) {
            throw "BattleScene must have a villain";
        }
        return villain_element.Controller;
    }

    get TheButton() {
        let button_element = this.shadowRoot!.querySelector<HTMLButtonElement>("#end");
        DEBUG: if (!button_element) {
            throw "BattleScene must have the end turn button";
        }
        return button_element;
    }

    get Locations() {
        return Array.from(this.querySelectorAll<LocationElement>("a-location"), (location) => location.Controller);
    }

    Render() {
        let location_elements = this.querySelectorAll<LocationElement>("a-location");
        if (location_elements.length === 0 && DEBUG) {
            throw "BattleScene must have locations";
        }
        let locations: Array<LocationController> = [];
        for (let location of location_elements) {
            locations.push(location.Controller);
        }

        const sprite_height = 10;
        const target_height = 480;
        const pixel_size = target_height / sprite_height;
        const sprite_y = (sprite_height + 1) * this.Villain.Sprite * pixel_size;

        const spritesheet_src = document.querySelector("img#sheet")?.getAttribute("src");
        const background_url = `url(${spritesheet_src})`;

        const mask_src = document.querySelector("img#mask")?.getAttribute("src");
        const mask_url = `url(${mask_src})`;

        this.shadowRoot!.innerHTML = html`
            <style>
                :host {
                    display: block;
                }

                main {
                    box-sizing: border-box;
                    height: 100vh;
                    overflow-y: auto;
                }

                .grid {
                    display: grid;
                    grid-template-columns: repeat(6, min-content);
                    gap: 20px;
                    padding: 20px;
                    border-radius: 5px;
                }

                ::slotted(a-actor) {
                    flex: 1;
                }

                ::slotted(a-log) {
                    display: block;
                    box-sizing: border-box;
                    width: 40vw;
                    height: 100vh;
                    padding: 10px;
                    overflow-y: auto;
                }

                button {
                    margin: 10px;
                    width: 100px;
                    font-size: 100%;
                }

                .spr {
                    position: relative;
                    background: ${color_from_seed(this.Villain.Sprite)};
                }

                .sprite {
                    width: ${target_height / 2}px;
                    height: ${target_height}px;
                    margin: 0 ${pixel_size * 2}px 0 ${pixel_size * 3}px;
                    background-position: 0 -${sprite_y}px;
                    background-size: ${target_height / 2}px auto;
                    background-image: ${background_url};
                    image-rendering: pixelated;
                }

                .mask {
                    position: absolute;
                    inset: 0;
                    border-radius: 5px;
                    background-image: ${mask_url};
                    background-size: ${target_height}px auto;
                    image-rendering: pixelated;
                }

                dd {
                    font-weight: bold;
                    margin: 0 0 20px 20px;
                }
            </style>
            <multi-view current="${this.State}">
                <main name="prep" style="padding:20px;">
                    <flex-row gap start>
                        <div>
                            <h2>Card Exchange — Pick ${this.Game.CardsInShop} or <button id="skip">Skip</button></h2>
                            <div class="grid" style="background:#E9967A;">
                                <slot name="shop"></slot>
                            </div>
                            <h2>Your Deck — Drop Here to Replace</h2>
                            <div class="grid" style="background:#8FBC8F;">
                                <slot name="deck"></slot>
                            </div>
                        </div>
                        <div style="width:520px">
                            <h2>Next Duel</h2>
                            <div style="padding:20px; background:#ADD8E6; border-radius:5px;">
                                <h3 style="margin-top:0;">${this.Villain.Name}</h3>
                                <div class="spr">
                                    <div class="sprite"></div>
                                    <div class="mask"></div>
                                </div>
                                <p><i>${this.Villain.Description}</i></p>
                                <hr />
                                ${locations.map(
                                    (location) => html`
                                        <dt>${location.Name}</dt>
                                        <dd>${location.Description}</dd>
                                    `,
                                )}
                            </div>
                        </div>
                    </flex-row>
                </main>
                <main name="play">
                    <flex-row>
                        <flex-col style="flex: 1; justify-content: space-evenly;">
                            <flex-row>
                                <slot name="villain"></slot>
                            </flex-row>
                            <flex-row>
                                <slot name="location"></slot>
                            </flex-row>
                            <flex-row>
                                <slot name="player"></slot>
                                <flex-col>
                                    <button id="end" style="flex:1" disabled>End Turn</button>
                                    <button id="undo">Undo</button>
                                </flex-col>
                            </flex-row>
                        </flex-col>
                        <slot name="log"></slot>
                    </flex-row>
                </main>
            </multi-view>
        `;
    }

    connectedCallback() {
        this.Render();

        this.addEventListener("drop", (e) => {
            let side = e.target as LocationOwner;
            let data = e.dataTransfer!.getData("text/plain");
            let card = document.getElementById(data) as CardElement;
            if (card) {
                card.Controller.Owner.CurrentEnergy -= card.Controller.CurrentCost;
                card.Controller.Owner.Element.Render();

                this.PlayedCardsQueue.push(card.Controller);
                this.Log(new Trace(), `You play ${card.Controller} to ${side.Location}`);
            }
        });

        this.shadowRoot!.addEventListener("click", (e) => {
            let game = this.closest("g-c") as GameContainer;
            let target = e.target as HTMLElement;
            if (target.id === "end") {
                switch (this.State) {
                    case "play":
                        this.RunEndTurn();
                        break;
                    case "won":
                        game.ProgressToNextOpponent();
                        break;
                    case "lost":
                        game.ShowSummary(false);
                        break;
                }
            } else if (target.id === "undo") {
                let card = this.PlayedCardsQueue.pop();
                if (card && card.Owner === this.Player && !card.IsRevealed) {
                    card.Owner.CurrentEnergy += card.CurrentCost;
                    card.Owner.Element.Render();

                    // TODO This reorders the cards in the hand.
                    this.Player.Hand.append(card.Element);

                    let log_element = this.querySelector("a-log");
                    log_element?.lastElementChild?.remove();
                }
            } else if (target.id === "skip") {
                this.InitBattle();
            }
        });
    }

    RenderChildren() {
        this.Player.Element.Render();
        this.Villain.Element.Render();

        for (let location of this.Locations) {
            location.Element.Render();
        }
    }

    PrepareBattle() {
        this.Render();

        set_seed(this.Game.Seed * (this.Game.CurrentOpponent + 1));

        for (let card of this.querySelectorAll<CardElement>("a-card")) {
            card.addEventListener("dragstart", (e) => {
                let card = e.target as CardElement;
                if (e.dataTransfer) {
                    e.dataTransfer.setData("text/plain", card.id);
                }
            });

            // Update the collection state for the cards in the shop.
            save_card_state(card.Controller, CollectionFlag.Seen);
        }

        let game = this.closest("g-c") as GameContainer;

        let player_cards: Array<CardElement> = [];
        for (let card_type of game.PlayerDeck) {
            let card = document.createElement("a-card") as CardElement;
            card.setAttribute("type", card_type.toString());
            card.setAttribute("slot", "deck");
            card.classList.add("frontside");

            card.addEventListener("dragover", (e) => {
                e.preventDefault();
            });

            card.addEventListener("drop", (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (e.dataTransfer) {
                    const data = e.dataTransfer.getData("text/plain");
                    const new_card = document.getElementById(data) as CardElement;
                    if (new_card) {
                        new_card.setAttribute("draggable", "false");

                        let backcard = new_card.cloneNode(true) as CardElement;
                        backcard.classList.remove("frontside");
                        new_card.replaceWith(backcard);

                        // Update the deck data.
                        let offset = game.PlayerDeck.indexOf(card.Controller.Sprite);
                        game.PlayerDeck.splice(offset, 1, new_card.Controller.Sprite);

                        // Update the deck UI.
                        new_card.setAttribute("slot", "deck");
                        card.replaceWith(new_card);

                        // Update the collection state for the new card in deck.
                        save_card_state(new_card.Controller, CollectionFlag.Owned);
                        this.Game.Stats.CardsAcquired++;

                        if (this.Game.CardsInShop > 1) {
                            this.Game.CardsInShop--;
                            this.Render();
                        } else {
                            this.InitBattle();
                        }
                    }
                }
            });

            player_cards.push(card);

            // Update the collection state for the cards in hand.
            save_card_state(card.Controller, CollectionFlag.Seen | CollectionFlag.Owned);
        }

        player_cards.sort(CardElement.Compare);
        this.append(...player_cards);
    }

    async InitBattle() {
        this.State = "play";
        this.Render();

        this.Game.Stats.Battles++;

        for (let [trace, message] of this.StartBattle()) {
            this.Log(trace, message);
            this.RenderChildren();
            await delay(INTERVAL);
        }
    }

    *StartBattle() {
        let trace = new Trace();

        const villain = this.querySelector(`a-actor:not([type="${ActorType.Player}"])`) as ActorElement;
        yield* villain.Controller.StartBattle(trace.Fork());

        const player = this.querySelector(`a-actor[type="${ActorType.Player}"]`) as ActorElement;
        yield* player.Controller.StartBattle(trace.Fork());

        // yield* this.BroadcastGameMessage(Message.BattleStarts);
        yield* this.StartTurn();
    }

    *StartTurn() {
        let trace = new Trace();

        this.CurrentTurn++;
        this.TheButton.textContent = `End Turn ${this.CurrentTurn}`;

        yield trace.Log(`<h3>Turn ${this.CurrentTurn} of ${this.MaxTurns}</h3>`);

        if (this.CurrentTurn < 4) {
            let location = this.Locations[this.CurrentTurn - 1];
            yield* location.Reveal(trace.Fork());
        }

        yield* this.Player.StartTurn(this.CurrentTurn, trace.Fork());
        yield* this.Villain.StartTurn(this.CurrentTurn, trace.Fork());

        yield* this.BroadcastGameMessage(Message.TurnStarts);

        yield* this.Villain.VillAIn(trace.Fork());

        yield trace.Log("<hr>");
        this.TheButton.disabled = false;
    }

    async RunEndTurn() {
        for (let [trace, message] of this.EndTurn()) {
            this.Log(trace, message);
            this.RenderChildren();
            await delay(INTERVAL);
        }
    }

    *EndTurn() {
        let trace = new Trace();
        yield trace.Log("<hr>");

        this.TheButton.disabled = true;

        for (let card of this.querySelectorAll<CardElement>("a-table a-card")) {
            if (!card.Controller.IsRevealed) {
                card.classList.remove("frontside");
            }
        }

        let unrevealed_cards = this.PlayedCardsQueue.filter((card) => !card.IsRevealed);
        for (let card of unrevealed_cards) {
            yield* this.BroadcastCardMessage(Message.CardLeavesHand, trace.Fork(), card);
            yield* card.Reveal(trace.Fork());

            if (card.Owner === this.Player) {
                this.Game.Stats.CardsPlayed++;
                this.Game.Stats.EnergySpent += card.CurrentCost;
            }
        }

        yield* this.BroadcastGameMessage(Message.TurnEnds);

        if (this.CurrentTurn >= this.MaxTurns) {
            yield* this.EndBattle();
        } else {
            yield* this.StartTurn();
        }
    }

    *EndBattle() {
        let trace = new Trace();

        let locations_won: Array<LocationController> = [];
        for (let location of this.Locations) {
            let score = location.GetScore(this.Player);
            if (score >= location.GetScore(this.Villain)) {
                locations_won.push(location);
            }

            this.Game.Stats.TotalPower += score;
        }

        this.Game.CardsInShop = locations_won.length;
        this.Game.Stats.LocationsWon += locations_won.length;
        this.Game.Stats.LocationsLost += this.Locations.length - locations_won.length;

        this.TheButton.disabled = true;

        let player_score = this.Player.GetScore();
        let villain_score = this.Villain.GetScore();

        if (player_score > villain_score || (player_score === villain_score && locations_won.length > 1)) {
            this.State = "won";
            yield trace.Log(`<h3>You win ${player_score} — ${villain_score}!</h3>`);
            yield trace.Log(`You win ${locations_won.join(", ")}.`);
            yield trace.Log(`Choose ${locations_won.length} card(s) in the shop.<br><br>`);
            yield trace.Log(`<button id="end" style="width:100%">Next!</button>`);
        } else {
            this.State = "lost";
            yield trace.Log(`<h3>You lose ${player_score} — ${villain_score}!</h3>`);
            yield trace.Log(`<button id="end" style="width:100%">Summary</button>`);
        }

        // yield* this.BroadcastGameMessage(Message.BattleEnds);
    }

    *BroadcastGameMessage(kind: Message) {
        // if (DEBUG) {
        //     console.log("%c" + Message[kind], "color: orange");
        // }

        let processed: Array<LocationController | CardController> = [];
        let trace = new Trace();

        for (let location of this.Locations) {
            if (location.IsRevealed && !trace.includes(location) && !processed.includes(location)) {
                yield* location.OnMessage(kind, trace.Fork(location));
                processed.push(location);
            }

            for (let card of location.GetRevealedCards()) {
                if (!trace.includes(card) && !processed.includes(card)) {
                    yield* card.OnMessage(kind, trace.Fork(card));
                    processed.push(card);
                }
            }
        }
    }

    *BroadcastCardMessage(kind: Message, trace: Trace, card: CardController) {
        // DEBUG: console.log(
        //     Message[kind],
        //     card.Name,
        //     trace.map((value) => (typeof value === "number" ? value : value.Name)),
        // );

        // Each card should only be processed once per message.
        let processed: Array<LocationController | CardController> = [];

        // First, broadcast the message to the card itself.
        yield* card.OnMessageSelf(kind, trace.Fork(card));

        let card_location = card.Field;
        if (card_location) {
            // Then, broadcast the message to the card's location, if it's revealed.
            if (card_location.IsRevealed && !trace.includes(card_location) && !processed.includes(card_location)) {
                yield* card_location.OnMessage(kind, trace.Fork(card_location), card);
                processed.push(card_location);
            }

            // Then, broadcast the message to other revealed cards in the same location.
            for (let other of card_location.GetRevealedCards()) {
                if (other.Element !== card.Element && !trace.includes(other) && !processed.includes(other)) {
                    yield* other.OnMessage(kind, trace.Fork(other), card);
                    processed.push(other);
                }
            }
        }

        // Finally, broadcast the message to other locations and their revealed cards.
        // We don't need card.Location here, this breaks the Trash events
        let other_locations = this.Locations.filter((location) => location !== card_location);
        for (let other_location of other_locations) {
            // We don't have locations using this mechanic.
            // if (other_location.IsRevealed && !trace.includes(other_location) && !processed.includes(other_location)) {
            //     yield* other_location.OnMessage(kind, trace.fork(other_location), card);
            //     processed.push(other_location);
            // }

            for (let other_card of other_location.GetRevealedCards()) {
                if (
                    other_card.Element !== card.Element &&
                    !trace.includes(other_card) &&
                    !processed.includes(other_card)
                ) {
                    yield* other_card.OnMessage(kind, trace.Fork(other_card), card);
                    processed.push(other_card);
                }
            }
        }
    }

    GetRevealedCards(actor?: ActorController) {
        return [...this.querySelectorAll<LocationElement>("a-location")].flatMap((location) =>
            location.Controller.GetRevealedCards(actor),
        );
    }

    GetPossibleLocations(card: CardController) {
        return this.Locations.filter(
            (location) =>
                !location.IsFull(card.Owner) &&
                (!location.IsRevealed || location.CanBePlayedHere(card)) &&
                card.CanBePlayedHere(location),
        );
    }

    CleanUp(card: CardController) {
        let modifiers = this.querySelectorAll(`a-modifier[origin-id="${card.Id}"]`);
        for (let modifier of modifiers) {
            modifier.remove();
        }
    }

    Log(trace: Trace, message: string) {
        const logDisplay = this.querySelector("a-log") as HTMLElement;
        if (logDisplay) {
            let tabs = trace.map((item) => (typeof item === "number" ? item : 1)).reduce((a, b) => a + b, 0);
            let indent = new Array(tabs).fill("…").join(" ");
            console.log(`%c${indent} ${message}`, "color: green", trace);

            logDisplay.innerHTML += `<div>${indent} ${message}</div>`;
            logDisplay.scrollTo({
                top: logDisplay.scrollHeight,
                behavior: "smooth",
            });
        }
    }
}

customElements.define("battle-scene", BattleScene);
