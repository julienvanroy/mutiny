<template>
  <h1>Manette</h1>
  <p>currentRoom : {{ colyseus.currentRoom.id }}</p>
  <p>playerSessionId : {{ colyseus.currentRoom.sessionId }}</p>
  <p>playerName : {{ this.playerName }}</p>
  <p>playerPoints : {{ this.playerPoints }}</p>
  <div ref="joystick" class="joystick"></div>
  <button ref="kill" @click="colyseus.sendData('kill', true)">kill</button>
  <button ref="power" @click="colyseus.sendData('power', true)">power</button>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import nipplejs from "nipplejs";

export default {
  name: "GamePad",
  setup() {
    const colyseus = useColyseusStore();
    return { colyseus };
  },
  data() {
    return {
      joystick: [],
      playerName: null,
      playerPoints: null,
    };
  },
  mounted() {
    this.colyseus.getPlayer(this.colyseus.currentRoom.sessionId);
    this.colyseus.currentRoom.onMessage("getPlayer", (player) => {
      this.playerName = player.name;
      this.playerPoints = player.points;
    });

    this.joystick = nipplejs.create({
      zone: this.$refs.joystick,
      size: 50,
      maxNumberOfNipples: 1,
      mode: "dynamic",
    });
    this.joystick.on("move", (e, data) => {
      this.colyseus.sendData("joystick", data.vector);
    });
    this.joystick.on("end", () => {
      this.colyseus.sendData("joystick", { x: 0, y: 0 });
    });
  },
  unmounted() {
    this.joystick.destroy();
  },
};
</script>

<style lang="scss" scoped>
.joystick {
  position: relative;
  width: 200px;
  height: 200px;
  background-color: lightblue;
}
</style>
