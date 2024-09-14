export class LogElement extends HTMLElement {
    connectedCallback() {
        this.addEventListener("click", (e) => {
            let target = e.target as HTMLElement;
            let for_id = target.getAttribute("for");
            if (for_id) {
                let elem = document.querySelector<HTMLElement>(`#_${for_id}`);
                if (elem) {
                    elem.classList.add("hilite");
                }
            }
        });

        if (this.parentElement) {
            this.parentElement.addEventListener("transitionend", (e) => {
                let target = e.target as HTMLElement;
                target.classList.remove("hilite");
            });
        }
    }
}

customElements.define("a-log", LogElement);
