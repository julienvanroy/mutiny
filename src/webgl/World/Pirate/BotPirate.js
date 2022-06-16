import { component } from "bidello";
import Pirate from "./Pirate";
export default class BotPirate extends component(Pirate) {
    constructor(botId, body) {
        super(body, botId);
    }

    init() {
        this.id = this._args[1];

        this.isPlayer = false;
    }
}
