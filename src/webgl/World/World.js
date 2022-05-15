import Environment from "./Environment.js";
import Prison from "./Prison.js";
import {component} from "bidello";
import Experience from "@/webgl/Experience";
import {GridHelper, Vector2} from "three";
import Player from "@/webgl/World/Player";
import Item from "@/webgl/World/Item";
import BoxCollision from "@/webgl/Collision/BoxCollision";

export default class World extends component() {
    init() {
        const experience = new Experience();
        this._debug = experience.debug
        this._renderer = experience.renderer;
        this._scene = experience.scene;
        this._camera = experience.camera;
        this._controls = experience.controls;

        this._isLoaded = false;
    }

    onResourcesIsReady() {
        console.log("world is ready");
        this.prison = new Prison();
        this.environment = new Environment();
        this.players = new Map()
        console.log(typeof this.players)
        this.item = new Item();
        this.boxCollision = new BoxCollision()
        const grid = new GridHelper(20, 20);
        this._scene.add(grid);
        this.onDebug()
        this._isLoaded = true;
    }

    _keyboard() {
        const player = this.players.get('debug')
        if (!this._debug.active || !this._controls.isPressed || !player) return

        const vectorControls = new Vector2()

        if (this._controls.actions.up && this._controls.actions.down)
            vectorControls.y = 0;
        else if (this._controls.actions.up)
            vectorControls.y = 1;
        else if (this._controls.actions.down)
            vectorControls.y = -1;
        else vectorControls.y = 0;

        if (this._controls.actions.right && this._controls.actions.left)
            vectorControls.x = 0;
        else if (this._controls.actions.right)
            vectorControls.x = 1;
        else if (this._controls.actions.left)
            vectorControls.x = -1;
        else vectorControls.x = 0;

        player.vectorControls = vectorControls
    }

    onRaf() {
        this._renderer.render(this._scene, this._camera);

        if (this._isLoaded) {
            this._keyboard()

            // Check Collision Items
            this.players.forEach((player, id) => {
                if(this.boxCollision.hit(player.mesh, this.item.mesh)) console.log(id, 'Collision')
            })
        }
    }

    onAddPlayer({playerId}) {
        this.players.set(playerId, new Player());
        console.log(this.players, typeof this.players)
    }

    onMovePlayer({playerId, vector2}) {
        const player = this.players.get(playerId)
        player.vectorControls = vector2
    }

    onDebug() {
        if (!this._debug.active) return;

        // TweakPane
        const folderDebug = this._debug.pane.addFolder({
            title: "World",
            expanded: false,
        });

        const btnAddPlayer = folderDebug.addButton({
            title: 'addPlayer',
        });
        btnAddPlayer.on('click', () => this.onAddPlayer({playerId: 'debug'}));
    }
}
