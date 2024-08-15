import {Location} from "./Location.js";

customElements.define(
    "arkham-asylum",
    class extends Location {
        Name = "Arkham Asylum";
        Description = "Here, the line between reality and madness is blurred.";
    },
);
