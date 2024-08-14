document.body.insertAdjacentHTML(
    "beforeend",
    `<template id="a-hand">
		<flex-row>
			<slot></slot>
		</flex-row>
	</template>`,
);

customElements.define(
    "a-hand",
    class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({mode: "open"});
        }

        connectedCallback() {
            let template = document.getElementById("a-hand") as HTMLTemplateElement;
            this.shadowRoot?.appendChild(template.content.cloneNode(true));
        }
    },
);
