<template>
  <transition name="fade">
    <ul v-if="!!isMounted" class="players">
      <li v-for="player in colyseus.playersArray" :key="player.id">
        <ThePlayer :player="player" />
      </li>
    </ul>
  </transition>
  <router-link to="end-game"><button class="end-btn">END GAME</button></router-link>
  <transition name="fade">
    <div
      v-if="!!isMounted"
      :class="`timer-container ${!!panickMode ? 'panick-mode' : ''}`"
    >
      <TheTimer />
    </div>
  </transition>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import bidello from "bidello";
import TheTimer from "@/components/ui/TheTimer";
import ThePlayer from "@/components/ui/ThePlayer";
import useTimerStore from "@/store/timer";
import { mapState } from "pinia";
import useAudioStore from "@/store/audio";

export default {
  name: "GameView",
  components: { TheTimer, ThePlayer },
  setup() {
    const colyseus = useColyseusStore();
    const timer = useTimerStore();

    return { colyseus, timer };
  },
  data() {
    return {
      players: {},
      isMounted: false,
      panickMode: false,
    };
  },
  watch: {
    time(newValue) {
      if (10 === newValue) {
        this.panickMode = true;
      }
      if (30 === newValue) {
        this.audios?.musicGame?.rate(1.5);
      }
      if (60 === newValue) {
        this.audios?.musicGame?.rate(1.2);
      }
    },
  },
  computed: {
    ...mapState(useAudioStore, ["audios", "musicVolume"]),
    ...mapState(useTimerStore, ["time"]),
  },
  mounted() {
    if (!this.colyseus.currentRoom) return;

    // Start Game
    bidello.trigger({ name: "start" });
    this.timer.reset();
    this.timer.start();

    this.colyseus.sendData("getAllPlayers");

    this.colyseus.currentRoom.onMessage("endGame", () => {
      this.audios?.musicGame?.fade(this.musicVolume, 0, 2000);
      let timeout = setTimeout(() => {
        this.audios?.musicGame?.stop();
        clearTimeout(timeout);
      }, 2000);
      this.audios?.theme?.play();
      this.audios?.theme?.fade(0, this.musicVolume, 2000);
      this.$router.push("/end-game");
    });

    this.colyseus.currentRoom.onMessage("joystick", ({ playerSessionId, playerPosition }) => {
      bidello.trigger({ name: "movePlayer" }, { playerId: playerSessionId, vector2: playerPosition });
    });

    this.colyseus.currentRoom.onMessage("attack", ({ playerSessionId }) => {
      bidello.trigger({ name: "attack" }, { playerId: playerSessionId });
      this.audios?.attack?.play();
      this.colyseus.sendData("getAllPlayers");
    });

    this.colyseus.currentRoom.onMessage("kill", () => {
      this.audios?.killed?.play();
      let timeout = setTimeout(() => {
        this.audios?.point?.play();
        clearTimeout(timeout);
      }, 1500);
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
  z-index: 30;
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
  &.panick-mode {
    animation: shake 0.5s infinite;
    color: $red-dead;
  }
}

@keyframes shake {
  10%,
  90% {
    transform: translateX(calc(-50% + 0px)) rotate(0deg) scale(1.1);
  }
  20%,
  80% {
    transform: translateX(calc(-50% + -2px)) rotate(-2deg);
  }
  30%,
  50%,
  70% {
    transform: translateX(calc(-50% + 0px)) rotate(0deg);
  }
  40%,
  60% {
    transform: translateX(calc(-50% + 2px)) rotate(2deg);
  }
}
</style>
