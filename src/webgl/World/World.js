import Environment from "./Environment.js";
import {component} from "bidello";
import Experience from "@/webgl/Experience";
import {GridHelper, Vector2, Vector3} from "three";
import Player from "@/webgl/World/Player";
//import Item from "@/webgl/World/Item";
//import BoxCollision from "@/webgl/Collision/BoxCollision";
import {Pathfinding} from "three-pathfinding";
import {sample, shuffle, uuid} from "@/utils/index.js";
import Bot from "./Bot.js";
import MapLevel from "@/webgl/World/MapLevel";
import configs from "@/configs";
import useColyseusStore from "@/store/colyseus.js";


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
        this.environment = new Environment();
        this.mapLevel = new MapLevel();

        this.players = new Map();
        /*
        TODO: For Colllision Items
        this.item = new Item();
        this.boxCollision = new BoxCollision();
        */
        this._initPathfinding();
        this._initBots();

        const grid = new GridHelper(20, 20);
        this._scene.add(grid);

        this.onDebug()
        this._isLoaded = true;
    }

    _initPathfinding() {
        this.pathfinding = new Pathfinding();
        this.pathfinding.zone = "map";
        this.pathfinding.setZoneData(
            this.pathfinding.zone,
            Pathfinding.createZone(this.mapLevel.navMesh.geometry)
        );
    }

    _initBots() {
        this.bots = {};
        const initialPositions = [];

        for (let i = 0; i < configs.tempCharacter.count; i++) {
            let position = this.pathfinding.getRandomNode(
                this.pathfinding.zone,
                0,
                new Vector3(),
                64
            );

            while (
                initialPositions.some(
                    (pos) =>
                        pos.distanceTo(position) < configs.tempCharacter.sizes.radius * 3.2
                )
                ) {
                position = this.pathfinding.getRandomNode(
                    this.pathfinding.zone,
                    0,
                    new Vector3(),
                    64
                );
            }

            initialPositions.push(position);

            const botId = uuid();
            this.bots[botId] = new Bot(botId, position);
        }
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

            /*
            TODO: Collision Items
                // Check Collision Items
                this.players.forEach((player, id) => {
                    if (this.boxCollision.hit(player.mesh, this.item.mesh)) console.log(id, 'Collision')
                })
            */
        }
    }

    onAddPlayer({playerId}) {
        this.players.set(playerId, new Player(playerId, this.mapLevel.collider));
        this.assignTargets();
        const colyseus = useColyseusStore();
        colyseus.sendData("updatePlayerTarget", {playerId: playerId, playerTarget: this.players.get(playerId)._getTargetData()});
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

    assignTargets() {
        let singlePlayer,
            bots,
            players,
            unassignedPlayers = [],
            tempPlayers = new Map();

        switch (this.players.size) {
            case 0:
                break;

            case 1:
                singlePlayer = this.players.values().next().value;
                bots = Object.values(singlePlayer._botsPool).filter(
                    (bot) => !bot.isPlayer
                );
                singlePlayer.target = sample(bots);
                break;

            default:
                players = shuffle(this.players);
                unassignedPlayers = players.map((keyValue) => keyValue[1]);

                players.forEach(([playerId, player]) => {
                    player.target = sample(
                        unassignedPlayers.filter((p) => p.id !== playerId)
                    );

                    unassignedPlayers = unassignedPlayers.filter(
                        (p) => p.id !== player.target.id
                    );

                    tempPlayers.set(playerId, player);

                    console.log(playerId, player.target.id);
                });
                this.players = tempPlayers;
                break;
        }

        console.log(this.players);
    }
}
