<template>
  <transition name="fade">
    <ul v-if="!!isMounted" class="players">
      <li v-for="player in colyseus.playersArray" :key="player.id">
        <ThePlayer :player="player" />
      </li>
    </ul>
  </transition>
  <router-link to="end-game"
    ><button class="end-btn">END GAME</button></router-link
  >
  <transition name="fade">
    <div v-if="!!isMounted" class="timer-container">
      <TheTimer />
    </div>
  </transition>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import bidello from "bidello";
import TheTimer from "@/components/ui/TheTimer";
import ThePlayer from "@/components/ui/ThePlayer";

export default {
  name: "GameView",
  components: { TheTimer, ThePlayer },
  setup() {
    const colyseus = useColyseusStore();
    return { colyseus };
  },
  data() {
    return {
      players: {},
      isMounted: false,
    };
  },
  mounted() {
    if (!this.colyseus.currentRoom) return;

    this.colyseus.sendData("getAllPlayers");

    this.colyseus.currentRoom.onMessage("endGame", () => this.$router.push("/end-game"));

    this.colyseus.currentRoom.onMessage(
      "joystick",
      ({ playerSessionId, playerPosition }) => {
        bidello.trigger(
          { name: "movePlayer" },
          { playerId: playerSessionId, vector2: playerPosition }
        );
      }
    );

    this.colyseus.currentRoom.onMessage("attack", ({ playerSessionId }) => {
      bidello.trigger({ name: "attack" }, { playerId: playerSessionId });
      this.colyseus.sendData("getAllPlayers");
    });

    this.colyseus.currentRoom.onMessage("kill", () => {});

    this.colyseus.currentRoom.onMessage("getAllPlayers", (players) => {
      this.players = new Map(Object.entries(players));
    });

    this.colyseus.currentRoom.onMessage("updatePlayerTarget", () => {});

    // this.colyseus.currentRoom.onMessage("power", ({ playerSessionId }) => {
    //   bidello.trigger({ name: "respawn" }, { playerId: playerSessionId });
    // });

    this.isMounted = true;
  },
};
</script>

<style lang="scss" scoped>
.players {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  li {
    margin: 0 20px 30px 0;
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
  padding-bottom: 12px;
}
</style>
