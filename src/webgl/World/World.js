import Environment from "./Environment.js";
// import Floor from './Floor.js'
// import Fox from './Fox.js'
import Prison from "./Prison.js";
import { component } from "bidello";
import Experience from "@/webgl/Experience";
import { GridHelper } from "three";
import Player from "@/webgl/World/Player";

export default class World extends component() {
  init() {
    const experience = new Experience();
    this._renderer = experience.renderer;
    this._scene = experience.scene;
    this._camera = experience.camera;
  }

  onResourcesIsReady() {
    console.log("world is ready");
    this.prison = new Prison();
    this.environment = new Environment();
    this.players = [];
    const grid = new GridHelper(20, 20);
    this._scene.add(grid);
  }

  onRaf() {
    this._renderer.render(this._scene, this._camera);
  }

  addPlayer(playerId) {
    this.players.push(new Player(playerId));
    console.log(this.players);
  }
}
