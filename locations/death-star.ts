import {Location} from "./Location.js";

customElements.define(
    "death-star",
    class extends Location {
        Name = "Death Star";
        Description = "A moon-sized Imperial military battlestation.";
    },
);
