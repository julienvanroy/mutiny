<template>
  <ul class="players">
    <li
      v-for="player in colyseus.players"
      :key="player.id"
      :class="`player ${player.color}`"
    >
      <div class="points">
        <img src="/images/players/points.png" />
        <span>{{ player.points }}</span>
      </div>
      <span class="name">{{ player.name }}</span>
    </li>
  </ul>
  <router-link to="end-game"
    ><button class="end-btn">END GAME</button></router-link
  >
  <div class="timer-container">
    <TheTimer />
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import bidello from "bidello";
import TheTimer from "@/components/ui/TheTimer";

export default {
  name: "GameView",
  components: { TheTimer },
  setup() {
    const colyseus = useColyseusStore();

    return { colyseus };
  },
  mounted() {
    if (!this.colyseus.currentRoom) return;

    this.colyseus.currentRoom.onMessage("updatePlayerTarget", () => {});

    this.colyseus.currentRoom.onMessage("startGame", () => {});

    this.colyseus.currentRoom.onMessage("getPlayer", () => {});

    this.colyseus.currentRoom.onMessage(
      "joystick",
      ({ playerSessionId, playerPosition }) => {
        bidello.trigger(
          { name: "movePlayer" },
          { playerId: playerSessionId, vector2: playerPosition }
        );
      }
    );

    this.colyseus.currentRoom.onMessage("kill", ({ playerSessionId }) => {
      bidello.trigger({ name: "kill" }, { playerId: playerSessionId });
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
      position: relative;
      img {
        width: 30px;
      }
      span {
        font-weight: $ft-w-bold;
        font-size: $ft-s-xsmall;
        color: $purple;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -60%);
      }
    }
    .name {
      font-weight: $ft-w-bold;
      font-size: $ft-s-xsmall;
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

.timer-container {
  position: absolute;
  bottom: 20px;
  left: 50%;
  z-index: 10;
  transform: translateX(-50%);
  background-image: url("../assets/timer/timer.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 126px;
  height: 80px;
  padding-bottom: 12px
}
</style>
