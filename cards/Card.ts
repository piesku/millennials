import {next_id} from "../lib/id.js";
import {Sprites} from "../sprites/sprites.js";

export abstract class Card extends HTMLElement {
    abstract Name: string;
    abstract Cost: number;
    abstract Power: number;
    abstract Text: string;
    abstract Sprite: Sprites;

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.shadowRoot!.innerHTML = this.Render();

        this.draggable = true;
        this.id = next_id().toString();

        this.addEventListener("dragstart", (e) => {
            let target = e.target as HTMLElement;
            if (e.dataTransfer) {
                e.dataTransfer.setData("text/plain", target.id);
                target.classList.add("dragging");
            }
        });

        this.addEventListener("dragend", (e) => {
            let target = e.target as HTMLElement;
            target.classList.remove("dragging");
        });

        this.addEventListener("CardEntersTable", this);
    }

    Render() {
        return `
            <a-card name="${this.Name}" cost="${this.Cost}" power="${this.Power}" text="${this.Text}" image="${this.Sprite}"></a-card>
        `;
    }

    handleEvent(event: Event) {}
}
