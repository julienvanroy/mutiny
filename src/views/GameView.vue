<template>
  <ul class="players">
    <li v-for="player in this.players" :key="player.id" :class="`player ${player.color}`">
      <div class="points">{{ player.points }}</div>
      <span>{{ player.name }}</span>
    </li>
  </ul>
  <router-link to="end-game"><button class="end-btn">END GAME</button></router-link>
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
    this.colyseus.getAllPlayers();
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

    this.colyseus.currentRoom.onMessage("kill", ({ playerSessionId }) => {
      bidello.trigger({ name: "kill" }, { playerId: playerSessionId, sendData: this.colyseus.sendData });
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
  top: 20px;
  left: 20px;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .player {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 12px;
    border-radius: 14px;
    &.green {
      background-color: $player-green;
    }
    &.blue {
      background-color: $player-blue;
    }
    &.red {
      background-color: $player-red;
    }
    &.yellow {
      background-color: $player-yellow;
    }
    .points {
    }
    span {
      font-weight: $ft-bold;
      font-size: 16px;
      letter-spacing: 0.01em;
      margin-left: 5px;
    }
    & + .player {
      margin-left: 10px;
    }
  }
}

.end-btn {
  position: absolute;
  top: 80px;
  right: 20px;
}
</style>
