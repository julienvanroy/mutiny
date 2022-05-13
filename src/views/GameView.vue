<template>
  <div class="players">
    <p>currentRoom : {{ colyseus.currentRoom.id }}</p>
    <p>mainScreenSessionId : {{ colyseus.currentRoom.sessionId }}</p>
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import useWebglStore from "@/store/webgl";

export default {
  name: "GameView",
  setup() {
    const colyseus = useColyseusStore();
    const webgl = useWebglStore();

    colyseus.currentRoom.onMessage("addPlayer", ({ playerSessionId }) => {
      playerSessionId && webgl.addPlayer(playerSessionId);
    });

    colyseus.currentRoom.onMessage("joystick", (message) => {
      webgl.movePlayer(message.playerSessionId, message.playerPosition);
    });

    colyseus.currentRoom.onMessage("kill", (message) => {
      console.log(message);
    });

    colyseus.currentRoom.onMessage("power", (message) => {
      console.log(message);
    });

    return { colyseus, webgl };
  },
    data() {
    return {
      players: [],
    };
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
