import {next_id} from "../lib/id.js";
import {Sprites} from "../sprites/sprites.js";

export abstract class CardController extends HTMLElement {
    abstract Name: string;
    abstract Cost: number;
    abstract Power: number;
    abstract Text: string;
    abstract Sprite: Sprites;

    IsRevealed = false;

    connectedCallback() {
        this.innerHTML = `
            <a-card name="${this.Name}" cost="${this.Cost}" power="${this.Power}" text="${this.Text}" image="${this.Sprite}"></a-card>
        `;

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

    *Reveal() {
        yield console.log(`${this.Name} is revealed`);
        this.IsRevealed = true;
        this.querySelector("a-card")!.setAttribute("revealed", "");
    }

    handleEvent(event: Event) {}
}
