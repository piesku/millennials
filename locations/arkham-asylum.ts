import {LocationController} from "../controllers/LocationController.js";

customElements.define(
    "arkham-asylum",
    class extends LocationController {
        Name = "Arkham Asylum";
        Description = "Here, the line between reality and madness is blurred.";
    },
);
