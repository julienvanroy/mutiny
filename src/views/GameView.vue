<template>
  <div class="players">
    <p>currentRoom : {{ colyseus.currentRoom.id }}</p>
    <p>mainScreenSessionId : {{ colyseus.currentRoom.sessionId }}</p>
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";

export default {
  name: "GameView",
  setup() {
    const colyseus = useColyseusStore();

    colyseus.currentRoom.onMessage("joystick", (message) => {
      console.log(message);
    });

    colyseus.currentRoom.onMessage("kill", (message) => {
      console.log(message);
    });

    colyseus.currentRoom.onMessage("power", (message) => {
      console.log(message);
    });

    return { colyseus };
  },
  mounted() {
    console.log(this.colyseus.currentRoom);
  },
};
</script>

<style lang="scss" scoped>
.players {
  position: absolute;
  background-color: darkslategrey;
  color: white;
  padding: 0 20px;
}
</style>
