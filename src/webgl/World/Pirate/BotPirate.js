import { component } from "bidello";
import Pirate from "./Pirate";
import Experience from "../../Experience";
import configs from "@/configs";

const { character: confCharacter } = configs;
const { animation: confAnimation } = confCharacter;
export default class BotPirate extends component(Pirate) {
    constructor(botId, position, body) {
        super(body, botId, position);
    }

    init() {
        this.id = this._args[1];
        const position = this._args[2];

        this.isPlayer = false;

        // const experience = new Experience();

        this.position = position.clone();

        this.mesh.position.set(this.position.x, this.position.y, this.position.z);

        this.path = [];

        this.idle = {
            active: confAnimation.idle.chance(),
            duration: 0,
            interval: null,
            angle: 0,
        };
    }

    // onRaf({ delta }) {
    //     if (!this.isPlayer && !this.idle.active) {
    //         const oldPosition = this.position.clone();

    //         if (this.path && this.path.length) {
    //             // this._helper.reset().setPlayerPosition(this.position).setPath(this.path);

    //             // Steering behavior
    //             // Move from A to B
    //             const targetPosition = this.path[0];
    //             const velocity = targetPosition.clone().sub(this.position);

    //             if (velocity.lengthSq() > 0.05 * 0.05) {
    //                 velocity.normalize();
    //                 this.position.add(velocity.multiplyScalar(delta * confCharacter.speed));
    //                 // this._helper.setPlayerPosition(this.position);
    //             } else {
    //                 // Remove node from the path we calculated
    //                 this.path.shift();
    //             }
    //         } else {
    //             this._setPath();
    //         }

    //         if (this.animation && this.animation.mixer) this.animation.mixer.update(delta);

    //         if (this.mesh) {
    //             this.mesh.position.set(this.position.x, this.position.y, this.position.z);

    //             // common way to get the  angle between two vectors
    //             const deltaPosition = this.position.clone();
    //             deltaPosition.sub(oldPosition);
    //             let angle = Math.atan2(deltaPosition.x, deltaPosition.z);
    //             if (angle < 0) angle += 2 * Math.PI;

    //             this.mesh.rotation.y += (angle - this.mesh.rotation.y) * confCharacter.rotationSpeed;
    //         }
    //     }

    //     if (!this.isPlayer) {
    //         if (this.idle.active) {
    //             if (!this.idle.angle) this.idle.angle = randomNumberInRange(-Math.PI * 2, Math.PI * 2);
    //             this.mesh.rotation.y += (this.idle.angle - this.mesh.rotation.y) * confCharacter.rotationSpeed * 3.2;
    //         }

    //         if (!this.idle.interval) {
    //             this.idle.interval = setInterval(() => (this.idle.duration += 1), 1000);
    //         }

    //         if (this.idle.interval && this.idle.duration === confAnimation.idle.duration) {
    //             clearInterval(this.idle.interval);
    //             this.idle.interval = null;

    //             this.idle.angle = 0;
    //             this.idle.duration = 0;
    //             this.idle.active = confAnimation.idle.chance();
    //         }
    //     }
    // }
}
