export abstract class Location extends HTMLElement {
    abstract Name: string;
    abstract Description: string;
    abstract Points: number;

    connectedCallback() {
        this.innerHTML = this.Render();
    }

    Render() {
        return `
            <a-location name="${this.Name}" description="${this.Description}" points="${this.Points}"></a-location>
        `;
    }
}
