import Environment from "./Environment.js";
import Prison from "./Prison.js";
import {component} from "bidello";
import Experience from "@/webgl/Experience";
import {GridHelper} from "three";
import Player from "@/webgl/World/Player";
import Item from "@/webgl/World/Item";
import BoxCollision from "@/webgl/Collision/BoxCollision";

export default class World extends component() {
    init() {
        const experience = new Experience();
        this._renderer = experience.renderer;
        this._scene = experience.scene;
        this._camera = experience.camera;
        this._isLoaded = false;
    }

    onResourcesIsReady() {
        console.log("world is ready");
        this.prison = new Prison();
        this.environment = new Environment();
        this.players = []
        console.log(typeof this.players)
        this.item = new Item();
        this.boxCollision = new BoxCollision()
        const grid = new GridHelper(20, 20);
        this._scene.add(grid);
        this._isLoaded = true;
    }

    onRaf() {
        this._renderer.render(this._scene, this._camera);

        /*
        if (this._isLoaded) {
            this.players.map(player => {
                console.log(player.id, this.boxCollision.hit(player.mesh, this.item.mesh))
            })
        }
        */
    }

    onAddPlayer({playerId}) {
        this.players[playerId] = new Player(playerId);
    }

    onMovePlayer({playerId, vector2}) {
        this.players[playerId].vectorControls = vector2
    }
}
