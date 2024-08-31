export class LogElement extends HTMLElement {
    connectedCallback() {
        this.addEventListener("click", (e) => {
            let target = e.target as HTMLElement;
            if (target.tagName === "LOG-CHIP") {
                let elem = document.querySelector<HTMLElement>(`#_${target.getAttribute("for")!}`);
                if (elem) {
                    elem.classList.add("hilite");
                }
            }
        });

        if (this.parentElement) {
            this.parentElement.addEventListener("transitionend", (e) => {
                console.log(e);

                let target = e.target as HTMLElement;
                target.classList.remove("hilite");
            });
        }
    }
}

customElements.define("a-log", LogElement);
