import Environment from "./Environment.js";
import { component } from "bidello";
import Experience from "@/webgl/Experience";
import { Euler, Group, Quaternion, Vector3 } from "three";
import PlayerPirate from "@/webgl/World/Pirate/PlayerPirate";
//import Item from "@/webgl/World/Item";
//import BoxCollision from "@/webgl/Collision/BoxCollision";
import { Pathfinding } from "three-pathfinding";
import { diffArray, randomIntegerInRange, sample, shuffle, uuid } from "@/utils/index.js";
import BotPirate from "./Pirate/BotPirate.js";
import MapLevel from "@/webgl/World/MapLevel";
import configs from "@/configs";
import useColyseusStore from "@/store/colyseus.js";
import Fireflies from "@/webgl/Mesh/Fireflies";
import GerstnerWater from "@/webgl/Mesh/GerstnerWater";
import MapCollider from "@/webgl/World/MapCollider";
import Fog from "@/webgl/Mesh/Fog";

export default class World extends component() {
    init() {
        const experience = new Experience();
        this._debug = experience.debug;
        this._renderer = experience.renderer;
        this._scene = experience.scene;
        this._camera = experience.camera;
        this.group = new Group();

        this._isLoaded = false;
    }

    onResourcesIsReady() {
        console.log("world is ready");
        this.environment = new Environment();
        this.fog = new Fog(100);
        this.gerstnerWater = new GerstnerWater();
        this.fireflies = new Fireflies(100);
        this.mapLevel = new MapLevel(this.group);
        this.mapCollider = new MapCollider(this.group);

        this.players = new Map();
        /*
        TODO: For Colllision Items
        this.item = new Item();
        this.boxCollision = new BoxCollision();
        */
        if (this.mapLevel.navMesh) {
            this._initPathfinding();
            this._initCharacters();
            this._initBots();
        }

        this._scene.add(this.group);
        this.onDebug();
        this._isLoaded = true;
    }

    _initPathfinding() {
        this.pathfinding = new Pathfinding();
        this.pathfinding.zone = "map";
        this.pathfinding.setZoneData(
            this.pathfinding.zone,
            Pathfinding.createZone(this.mapLevel.navMesh.geometry, Number.EPSILON)
        );

        let tempGroups = [];
        this.pathfinding.zones.map.groups.forEach((group) => group.length >= 64 && tempGroups.push(group));
        this.pathfinding.zones.map.groups = tempGroups;
    }

    _initBots() {
        this.bots = {};
        const initialPositions = [];
        const zonesCount = this.pathfinding.zones.map.groups.length - 1;

        for (let i = 0; i < configs.character.count; i++) {
            let position = this.pathfinding.getRandomNode(
                this.pathfinding.zone,
                randomIntegerInRange(0, zonesCount),
                new Vector3(),
                configs.map.nearRange
            );

            while (
                !initialPositions.every((pos) => pos.distanceTo(position) > configs.character.range) &&
                !this.mapLevel.decors.every((mesh) => mesh.position.distanceTo(position) < configs.character.range * 2)
            ) {
                position = this.pathfinding.getRandomNode(
                    this.pathfinding.zone,
                    randomIntegerInRange(0, zonesCount),
                    new Vector3(),
                    32
                );
            }

            initialPositions.push(position);

            const botId = uuid();
            this.bots[botId] = new BotPirate(botId, new Vector3(), this.characters[i], this.group);
        }
    }

    // Generative chara
    _initCharacters() {
        this.characters = [];

        for (let i = 0; i < configs.character.count; i++) {
            let body = {};
            for (const [key, value] of Object.entries(configs.character.body)) {
                body[key] = {
                    tag: key,

                    alphaTexture: value.alphaTexture,
                    shuffleMesh: value.shuffleMesh,
                    addColor: value.addColor,
                    meshes: value.meshes,
                    mesh: value.shuffleMesh
                        ? sample(
                              value.meshes.map(({ name, texture, color: colors }) => ({
                                  name,
                                  texture,
                                  color: colors ? sample(colors) : undefined,
                              }))
                          )
                        : undefined,
                };
            }

            let duplicataCount = 0;
            while (this.characters.find((charaBody) => JSON.stringify(charaBody) === JSON.stringify(body))) {
                duplicataCount++;
                body = {};
                for (const [key, value] of Object.entries(configs.character.body)) {
                    body[key] = {
                        tag: key,

                        alphaTexture: value.alphaTexture,
                        shuffleMesh: value.shuffleMesh,
                        addColor: value.addColor,
                        meshes: value.meshes,
                        mesh: value.shuffleMesh
                            ? sample(
                                  value.meshes.map(({ name, texture, color: colors }) => ({
                                      name,
                                      texture,
                                      color: colors ? sample(colors) : undefined,
                                  }))
                              )
                            : undefined,
                    };
                }
            }

            console.log(`Generative characters ${i + 1}: ${duplicataCount} duplicata times`);
            this.characters.push(body);
        }

        this.characters = shuffle(this.characters);
    }

    waveRaf(delta) {
        const waveInfo = this.gerstnerWater.getWaveInfo(
            this.group.position.x,
            this.group.position.z,
            this.gerstnerWater.mesh.material.uniforms.time.value
        );
        this.group.position.y = waveInfo.position.y + 2;
        const quaternion = new Quaternion().setFromEuler(
            new Euler(waveInfo.normal.x, waveInfo.normal.y, waveInfo.normal.z)
        );
        this.group.quaternion.rotateTowards(quaternion, delta * 0.5);
        this.group.updateMatrixWorld();
    }

    onRaf({ delta }) {
        this._renderer.render(this._scene, this._camera);

        if (this._isLoaded) {
            this.waveRaf(delta);

            /*
            TODO: Collision Items
                // Check Collision Items
                this.players.forEach((player, id) => {
                    if (this.boxCollision.hit(player.mesh, this.item.mesh)) console.log(id, 'Collision')
                })
            */
        }
    }

    onAssignTargets() {
        this.assignTargets();
    }

    onAddPlayer({ playerId }) {
        this.players.set(playerId, new PlayerPirate(playerId, this.mapCollider.collider));
        console.log(`player ${playerId} added`, this.players.get(playerId));
    }

    onMovePlayer({ playerId, vector2 }) {
        const player = this.players.get(playerId);
        player.vectorControls = vector2;
    }

    onDebug() {
        if (!this._debug.active) return;

        // TweakPane
        const folderDebug = this._debug.pane.addFolder({
            title: "World",
            expanded: false,
        });

        const btnAddPlayer = folderDebug.addButton({
            title: "addPlayer",
        });
        btnAddPlayer.on("click", () => {
            this.onAddPlayer({ playerId: "debug" });
            btnAddPlayer.dispose();
        });
    }

    assignTargets() {
        let singlePlayer,
            bots,
            players,
            targetsToChose = [],
            chosenAsTargets = [],
            playersIds,
            playerTarget;

        this.players.forEach((p) => delete p.target);

        switch (this.players.size) {
            case 0:
                break;

            case 1:
                singlePlayer = this.players.values().next().value;
                bots = Object.values(singlePlayer._bots).filter((bot) => !bot.isPlayer);
                singlePlayer.target = sample(bots);
                break;

            default:
                players = shuffle(this.players);
                playersIds = players.map((keyValue) => keyValue[0]);

                players.forEach(([playerId, player]) => {
                    console.log("__________________________");
                    console.log(`player ${playerId}`);

                    console.log(`chosen as targets`, [...chosenAsTargets]);

                    targetsToChose = playersIds.filter((pId) => pId !== playerId);
                    console.log(`targets to chode`, [...targetsToChose]);

                    playerTarget = sample(diffArray(targetsToChose, chosenAsTargets));

                    console.log(`target ${playerTarget}`);
                    console.log("__________________________");

                    if (!playerTarget) this.assignTargets();
                    else {
                        chosenAsTargets.push(playerTarget);

                        player.target = this.players.get(playerTarget);
                    }
                });
                break;
        }

        console.log(this.players);
        this.players.forEach((p) => {
            if (p.target instanceof PlayerPirate) p.target._setBot();
            else if (p.target instanceof BotPirate) p._setBot();

            useColyseusStore().updatePlayerTarget(p.id, p._getTargetData(), true);

            console.log(`player ${p.id} has target ${p.target.id} ${p.target.bot ? `of bot ${p.target.bot.id}` : ""}`);
        });
    }
}
