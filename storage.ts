import {CardController} from "./cards/CardController.js";
import {GameContainer} from "./elements/game-container.js";

const enum Storage {
    CurrentRun = "RUNv1",
    Collection = "COLv1",
}

interface CurrentRunState {
    seed: number;
    curr: number;
    deck: number[];
}

export function save_game_state(game: GameContainer) {
    let state: CurrentRunState = {
        seed: game.Seed,
        curr: game.CurrentOpponent,
        deck: game.PlayerDeck,
    };
    localStorage.setItem(Storage.CurrentRun, JSON.stringify(state));
    console.log("%cGame state saved", "color: red");
}

export function has_game_state() {
    return localStorage.getItem(Storage.CurrentRun) !== null;
}

export function get_game_state() {
    let state = localStorage.getItem(Storage.CurrentRun);
    if (state) {
        return JSON.parse(state) as CurrentRunState;
    }
}

export function load_game_state(game: GameContainer) {
    let state = get_game_state();
    if (state) {
        game.Seed = state.seed;
        game.CurrentOpponent = state.curr;
        game.PlayerDeck = state.deck;
        console.log("%cGame state loaded", "color: red");
    }
}

export const enum CollectionFlag {
    None = 0,
    Seen = 1,
    Owned = 2,
}

interface CollectionState {
    cards: {
        [name: string]: CollectionFlag;
    };
}

export function get_collection_state() {
    let state = localStorage.getItem(Storage.Collection);
    if (state) {
        return JSON.parse(state) as CollectionState;
    } else {
        return {cards: {}};
    }
}

export function save_card_state(card: CardController, flags: CollectionFlag) {
    let state = get_collection_state();
    let already_known = state.cards[card.Name] & CollectionFlag.Seen;
    state.cards[card.Name] |= flags;
    localStorage.setItem(Storage.Collection, JSON.stringify(state));
    // Return true if this is the first time the card is seen.
    return !already_known;
}
