export abstract class Location extends HTMLElement {
    abstract Name: string;
    abstract Description: string;

    connectedCallback() {
        this.innerHTML = this.Render();
    }

    Render() {
        return `
            <a-location name="${this.Name}" description="${this.Description}"></a-location>
        `;
    }
}
