import Environment from "./Environment.js";
import { component } from "bidello";
import Experience from "@/webgl/Experience";
import { Euler, Group, Quaternion } from "three";
import PlayerPirate from "@/webgl/World/Pirate/PlayerPirate";
import { diffArray, sample, shuffle, flatten } from "@/utils/index.js";
import BotPirate from "./Pirate/BotPirate.js";
import MapLevel from "@/webgl/World/MapLevel";
import useColyseusStore from "@/store/colyseus.js";
import Fireflies from "@/webgl/Mesh/Fireflies";
import GerstnerWater from "@/webgl/Mesh/GerstnerWater";
import Fog from "@/webgl/Mesh/Fog";
import SteeringBots from "@/webgl/World/SteeringBots";
import configs from "@/configs/index.js";
import { Color } from "three";

export default class World extends component() {
    init() {
        const experience = new Experience();
        this._debug = experience.debug;
        this._scene = experience.scene;
        this._camera = experience.camera;

        this.group = new Group();
        this._scene.add(this.group);
    }

    onResourcesIsReady() {
        console.log("world is ready");
        this.environment = new Environment();
        this.fog = new Fog(3150, 27, 76, "#0a0042");
        this.fog.mesh.position.y += 1;
        this.gerstnerWater = new GerstnerWater();
        this.fireflies = new Fireflies(325, 29, 21, "#ff4800");
        this.fireflies.mesh.position.y += 5;
        this.mapLevel = new MapLevel(this.group);
        this.players = new Map();

        this.steeringBots = new SteeringBots();

        this.onDebug();
    }

    waveRaf(delta) {
        if (!this.gerstnerWater) return;
        const waveInfo = this.gerstnerWater.getWaveInfo(
            this.group.position.x,
            this.group.position.z,
            this.gerstnerWater.water.material.uniforms.time.value
        );
        this.group.position.y = waveInfo.position.y + 2;
        const quaternion = new Quaternion().setFromEuler(
            new Euler(waveInfo.normal.x, waveInfo.normal.y, waveInfo.normal.z)
        );
        this.group.quaternion.rotateTowards(quaternion, delta * 0.5);
        this.group.updateMatrixWorld();
    }

    onRaf({ delta }) {
        this.waveRaf(delta);
    }

    onAssignTargets() {
        this.assignTargets();
    }

    onAddPlayer({ playerId }) {
        this.players.set(playerId, new PlayerPirate(playerId, this.mapLevel.size));
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

        folderDebug.addInput(configs.character.colors, "noir").on("change", ({ value }) => {
            flatten(this.steeringBots.bots).forEach((bot) => {
                bot.mesh.traverse((child) => {
                    if (child.name.includes("Chapeau")) child.material.color = new Color(value).convertSRGBToLinear();
                });
            });
        });
        folderDebug.addInput(configs.character.colors, "orange").on("change", ({ value }) => {
            flatten(this.steeringBots.bots).forEach((bot) => {
                bot.mesh.traverse((child) => {
                    if (child.name.includes("Chapeau")) child.material.color = new Color(value).convertSRGBToLinear();
                });
            });
        });
        folderDebug.addInput(configs.character.colors, "longueVueBouchon").on("change", ({ value }) => {
            flatten(this.steeringBots.bots).forEach((bot) => {
                bot.mesh.traverse((child) => {
                    if (child.name.includes("Longue_vue_2"))
                        child.material.color = new Color(value).convertSRGBToLinear();
                });
            });
        });
        folderDebug.addInput(configs.character.colors, "longueVueCorps").on("change", ({ value }) => {
            flatten(this.steeringBots.bots).forEach((bot) => {
                bot.mesh.traverse((child) => {
                    if (child.name.includes("Longue_vue_1"))
                        child.material.color = new Color(value).convertSRGBToLinear();
                });
            });
        });
        folderDebug.addInput(configs.character.colors, "bouteilleBouchon").on("change", ({ value }) => {
            flatten(this.steeringBots.bots).forEach((bot) => {
                bot.mesh.traverse((child) => {
                    if (child.name.includes("Bouteille_1"))
                        child.material.color = new Color(value).convertSRGBToLinear();
                });
            });
        });
        folderDebug.addInput(configs.character.colors, "bouteilleCorps").on("change", ({ value }) => {
            flatten(this.steeringBots.bots).forEach((bot) => {
                bot.mesh.traverse((child) => {
                    if (child.name.includes("Bouteille_2"))
                        child.material.color = new Color(value).convertSRGBToLinear();
                });
            });
        });
        folderDebug.addInput(configs.character.colors, "crocher").on("change", ({ value }) => {
            flatten(this.steeringBots.bots).forEach((bot) => {
                bot.mesh.traverse((child) => {
                    if (child.name.includes("Crocher")) child.material.color = new Color(value).convertSRGBToLinear();
                });
            });
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
                bots = flatten(Object.values(singlePlayer._bots)).filter((bot) => !bot.isPlayer);
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
                    console.log(`targets to chose`, [...targetsToChose]);

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

        this.players.forEach((p) => {
            if (p.target instanceof PlayerPirate) p.target.setBot();
            else if (p.target instanceof BotPirate) p.setBot();

            useColyseusStore().updatePlayerTarget(p.id, p.getTargetData(), false, true);

            console.log(`player ${p.id} has target ${p.target.id} ${p.target.bot ? `of bot ${p.target.bot.id}` : ""}`);
        });
    }
}
