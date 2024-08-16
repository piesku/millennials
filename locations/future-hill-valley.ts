import {LocationController} from "../controllers/LocationController.js";

customElements.define(
    "future-hill-valley",
    class extends LocationController {
        Name = "Future Hill Valley";
        Description = "Please fly safely. Ejection seats save live";
    },
);
