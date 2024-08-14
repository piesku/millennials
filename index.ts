import {next_id} from "./lib/id.js";

const suits = ["♠", "♥", "♦", "♣"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const hand = document.querySelector("a-hand")!;
const table = document.querySelector("a-table")!;

function CreateCard(card_spec: string) {
    const card = document.createElement("a-card");
    card.textContent = card_spec;
    card.draggable = true;
    card.id = next_id().toString();

    card.addEventListener("dragstart", (e) => {
        let target = e.target as HTMLElement;
        if (e.dataTransfer) {
            e.dataTransfer.setData("text/plain", target.id);
            target.classList.add("dragging");
        }
    });

    card.addEventListener("dragend", (e) => {
        let target = e.target as HTMLElement;
        target.classList.remove("dragging");
    });

    return card;
}

// Create and shuffle the deck
const deck = suits.flatMap((suit) => values.map((value) => `${value}${suit}`));
for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
}

// Deal 5 cards to the hand
for (let i = 0; i < 5; i++) {
    const card = CreateCard(deck.pop()!);
    hand.appendChild(card);
}

// Set up the table as a drop zone
table.addEventListener("dragover", (e) => {
    e.preventDefault();
});

table.addEventListener("drop", (e) => {
    e.preventDefault();
    let drag = e as DragEvent;
    if (drag.dataTransfer) {
        const card_id = drag.dataTransfer.getData("text");
        const card = document.getElementById(card_id);
        if (card) {
            table.appendChild(card);
            card.style.position = "absolute";
            card.style.left = `${drag.clientX - 40}px`;
            card.style.top = `${drag.clientY - 60}px`;
        }
    }
});
