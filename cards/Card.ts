import {next_id} from "../lib/id.js";

export class Card extends HTMLElement {
    connectedCallback() {
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

        this.innerHTML = this.render();

        this.draggable = true;
        this.id = next_id().toString();

        this.addEventListener("CardEntersTable", this);
    }

    render() {
        return "";
    }

    handleEvent(event: Event) {}
}
