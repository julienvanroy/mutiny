<template>
  <h1>Manette</h1>
  <p>currentRoom : {{ colyseus.currentRoom.id }}</p>
  <p>playerSessionId : {{ colyseus.currentRoom.sessionId }}</p>
  <div ref="joystick" class="joystick"></div>
  <button ref="kill" @click='sendData("kill", true)'>kill</button>
  <button ref="power" @click='sendData("power", true)'>power</button>
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
    };
  },
  mounted() {
    this.joystick = nipplejs.create({
      zone: this.$refs.joystick,
      size: 50,
      maxNumberOfNipples: 1,
      mode: "dynamic",
    });
    this.joystick.on("move", (e, data) => {
      this.sendData("joystick", data.position);
    });
  },
  unmounted() {
    this.joystick.destroy();
  },
  methods: {
    sendData(type, value) {
      this.colyseus.currentRoom.send(type, value);
    },
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
