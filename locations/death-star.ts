import {LocationController} from "../controllers/LocationController.js";

customElements.define(
    "death-star",
    class extends LocationController {
        Name = "Death Star";
        Description = "A moon-sized Imperial military battlestation.";
    },
);
