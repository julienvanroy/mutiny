<template>
  <div class="players">
    <p>currentRoom : {{ colyseus.currentRoom.id }}</p>
    <p>mainScreenSessionId : {{ colyseus.currentRoom.sessionId }}</p>
    <ul>
      <li v-for="player in this.players" :key="player.id">{{ player.id }} {{ player.name }} {{ player.points }}</li>
    </ul>
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import bidello from "bidello";

export default {
  name: "GameView",
  setup() {
    const colyseus = useColyseusStore();

    return { colyseus };
  },
  data() {
    return {
      players: [],
    };
  },
  mounted() {
    this.colyseus.currentRoom.onMessage("addPlayer", ({ playerSessionId }) => {
      playerSessionId && bidello.trigger({ name: "addPlayer" }, { playerId: playerSessionId });
      this.colyseus.getAllPlayers();
    });

    this.colyseus.currentRoom.onMessage("getAllPlayers", (players) => {
      delete players[this.colyseus.currentRoom.sessionId];
      this.players = players;
    });

    this.colyseus.currentRoom.onMessage("joystick", ({ playerSessionId, playerPosition }) => {
      bidello.trigger({ name: "movePlayer" }, { playerId: playerSessionId, vector2: playerPosition });
    });

    this.colyseus.currentRoom.onMessage("kill", (message) => {
      console.log(message);
    });

    this.colyseus.currentRoom.onMessage("power", ({ playerSessionId }) => {
      bidello.trigger({ name: "respawn" }, { playerId: playerSessionId });
    });
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
