<template>
  <h1>Manette</h1>
  <p>currentRoom : {{ colyseus.currentRoom.id }}</p>
  <p>playerSessionId : {{ colyseus.currentRoom.sessionId }}</p>
  <div id="joystick" class="joystick"></div>
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
      zone: document.getElementById("joystick"),
      size: 50,
      maxNumberOfNipples: 1,
      mode: "dynamic",
    });
    this.joystick.on("move", (e, data) => {
      this.sendData(data.position);
    });
  },
  unmounted() {
    this.joystick.destroy();
  },
  methods: {
    sendData(value) {
      this.colyseus.currentRoom.send("joystickMove", value);
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
