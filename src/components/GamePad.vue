<template>
  <div class="gamepad">
    <div class="gamepad__left">
      <player-card :name="name" :color="color" :points="points" />
      <div ref="joystick" class="joystick"></div>
    </div>
    <div class="gamepad__middle" v-if="clues">
      <p>{{ $t("gamepad.clues") }}</p>
      <div
        class="clues"
        :style="`background-color: ${clue.show ? clue.color : 'black'}`"
        v-for="(clue, indexClue) in clues"
        :key="indexClue"
      >
        {{ clue.show ? clue.tag : "?" }}
      </div>
    </div>
    <div class="gamepad__right">
      <p class="stalkers-counter-container">
        {{ $t("gamepad.stalkersCounterLeft") }}
        <br />
        <stalkers-counter :count="stalkersCount" />
        <span>{{ $t("gamepad.stalkersCounterRight") }}</span>
      </p>
      <button ref="attack" class="attack" @click="colyseus.sendData('kill', true)">
        <img src="/images/gamepad/btn-attack.png" />
      </button>
      <!-- <button ref="power" @click="colyseus.sendData('power', true)">{{$t("gamepad.power")}}</button> -->
    </div>
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import nipplejs from "nipplejs";
import { sample } from "@/utils";
import PlayerCard from "./ui/PlayerCard.vue";
import StalkersCounter from "./ui/StalkersCounter.vue";

export default {
  components: { PlayerCard, StalkersCounter },
  name: "GamePad",
  setup() {
    const colyseus = useColyseusStore();

    return { colyseus };
  },
  data() {
    return {
      joystick: [],
      interval: null,
      stalkersCount: 0,
    };
  },
  watch: {
    cluesHide(newValue) {
      if (newValue.length === 4) {
        this.showOneClue();
        this.setIntervalClues();
      }
    },
  },
  computed: {
    clues() {
      return this.colyseus.playerTarget?.info;
    },
    cluesHide() {
      return this.clues?.filter((clue) => !clue.show);
    },
    points() {
      return this.colyseus.playerPoints;
    },
    color() {
      return this.colyseus.playerColor;
    },
    name() {
      return this.colyseus.playerName;
    },
  },
  methods: {
    setIntervalClues() {
      if (this.interval) clearInterval(this.interval);
      this.interval = setInterval(this.showOneClue, 10000);
    },
    showOneClue() {
      if (!this.interval) return;
      if (this.cluesHide.length === 0) {
        clearInterval(this.interval);
        return;
      } else {
        sample(this.cluesHide).show = true;
      }
    },
  },
  mounted() {
    this.joystick = nipplejs.create({
      zone: this.$refs.joystick,
      size: 50,
      maxNumberOfNipples: 1,
      position: { left: "50%", top: "50%" },
      mode: "static",
      color: "#5D5D5D",
    });
    this.joystick.on("move", (e, data) => {
      this.colyseus.sendData("joystick", data.vector);
    });
    this.joystick.on("end", () => {
      this.colyseus.sendData("joystick", { x: 0, y: 0 });
    });

    this.setIntervalClues();
  },
  unmounted() {
    this.joystick.destroy();
  },
};
</script>

<style lang="scss" scoped>
.gamepad {
  height: 100vh;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  background-color: $white-beige;

  &__left {
    width: 32%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;

    .joystick {
      position: relative;
      width: 250px;
      height: 250px;
      background-image: url("../assets/gamepad/outer-ring.png");
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;

      &::after {
        position: absolute;
        content: "";
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        background-image: url("../assets/gamepad/d-pad.png");
        background-size: 72%;
        background-position: center;
        background-repeat: no-repeat;
      }
    }
  }

  &__middle {
    flex: 1;
    background-color: $grey-2;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;

    p {
      text-transform: uppercase;
      text-align: center;
      font-weight: $ft-w-bold;
      font-size: $ft-s-medium;
      letter-spacing: 0.01em;
    }

    .clues {
      background: $grey-1;
      border-radius: 8px;
      width: 80px;
      height: 80px;
      color: $white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: $ft-w-bold;
      margin: 3.2px 0;
    }
  }

  &__right {
    width: 32%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;

    .stalkers-counter-container {
      position: relative;
      width: 164px;
      height: 57px;
      background-image: url("../assets/gamepad/bg-stalker-count.png");
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
      font-size: 11px;
      font-weight: $ft-w-bold;
      text-align: center;
      padding-top: 11px;
    }

    .stalkers-counter {
      position: absolute;
      top: 50%;
      left: 18%;
      transform: translateY(-20%);

      + span {
        display: inline-block;
        margin-left: 16px;
      }
    }

    .attack {
      flex: 1;
      position: relative;
      background-color: transparent;
      border: none;
      transition: transform 0.25s ease;

      &:active {
        transform: scale(0.9);
      }

      img {
        width: 152px;
        height: auto;
      }
    }
  }
}
</style>
