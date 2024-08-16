export abstract class LocationController extends HTMLElement {
    abstract Name: string;
    abstract Description: string;

    connectedCallback() {
        this.innerHTML = `
            <a-location name="${this.Name}" description="${this.Description}"></a-location>
        `;
    }
}
