export abstract class Location extends HTMLElement {
    abstract Name: string;
    abstract Description: string;

    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    connectedCallback() {
        this.shadowRoot!.innerHTML = this.Render();
    }

    Render() {
        return `
            <a-location name="${this.Name}" description="${this.Description}"></a-location>
        `;
    }
}
