import { component } from "bidello";
import Pirate from "./Pirate";
export default class BotPirate extends component(Pirate) {
    constructor(botId, position, body) {
        super(body, botId, position);
    }

    init() {
        this.id = this._args[1];
        const position = this._args[2];

        this.isPlayer = false;

        this.position = position.clone();

        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    }
}
