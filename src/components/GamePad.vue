<template>
  <div class="gamepad">
    <div class="gamepad__left">
      <ThePlayer :player="colyseus.player" dont-update-state />
      <div ref="joystick" class="joystick"></div>
    </div>
    <div class="gamepad__middle">
      <div class="clues-container">
        <h2>{{ $t("gamepad.clues") }}</h2>
        <p>{{ targetName }}</p>
        <div class="clues">
          <div class="clue" v-for="(clue, indexClue) in clues" :key="indexClue">
            <span v-if="clue.show">{{ clue.tag }}</span>
            <span v-else-if="nextClueIndex === indexClue">{{ $t("gamepad.clueInterval") }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="gamepad__right">
      <p class="stalkers-counter-container">
        {{ $t("gamepad.stalkersCounterLeft") }}
        <br />
        <stalkers-counter :count="stalkersCount" />
        <span>{{ $t("gamepad.stalkersCounterRight") }}</span>
      </p>
      <button ref="attack" class="attack" @click="colyseus.sendData('attack')">
        <img src="/images/gamepad/btn-attack.png" />
      </button>
      <!-- <button ref="power" @click="colyseus.sendData('power', true)">{{$t("gamepad.power")}}</button> -->
    </div>
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import nipplejs from "nipplejs";
import ThePlayer from "./ui/ThePlayer";
import StalkersCounter from "./ui/StalkersCounter";
import { uuid } from "@/utils";

export default {
  components: { ThePlayer, StalkersCounter },
  name: "GamePad",
  setup() {
    const colyseus = useColyseusStore();

    return { colyseus };
  },
  data() {
    return {
      joystick: [],
      interval: null,
      stalkersCount: 1,
      targetName: "Captain Blue",
      nextClueIndex: 0,
      thePlayerKey: uuid(),
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
      return [
        {
          tag: "hat",
          color: "#1E1D22",
          show: false,
        },
        {
          tag: "beard",
          color: "#F86F43",
          show: false,
        },
        {
          tag: "barrel",
          color: "#6B8CDB",
          show: false,
        },
        {
          tag: "weapon",
          color: "#FFF",
          show: false,
        },
      ]; //this.colyseus.playerTarget?.info;
    },
    cluesHide() {
      return this.clues?.filter((clue) => !clue.show);
    },
  },
  methods: {
    setIntervalClues() {
      if (this.interval) clearInterval(this.interval);
      this.interval = setInterval(this.showOneClue, 10000);
    },
    showOneClue() {
      if (!this.interval || this.nextClueIndex === this.clues.length) return;
      if (this.cluesHide.length === 0) {
        clearInterval(this.interval);
        return;
      } else {
        this.clues[this.nextClueIndex].show = true;
        this.nextClueIndex++;
      }
    },
    forceRerender() {
      this.thePlayerKey = uuid();
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
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;

    .clues-container {
      width: 100%;
      height: 100%;
      background-image: url("../assets/gamepad/bg-clues.png");
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 32px;

      h2 {
        text-align: center;
        font-weight: $ft-w-bold;
        font-size: 12px;
        letter-spacing: 0.01em;
      }

      p {
        width: 160px;
        height: 56px;
        padding-top: 14px;
        background-image: url("../assets/gamepad/bg-pirate-name.png");
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        font-weight: $ft-w-bold;
        font-size: 15px;
        color: $white-beige;
        text-align: center;
      }

      .clues {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;

        .clue {
          width: 80px;
          height: 80px;
          margin: 2%;
          box-shadow: inset 0px 0px 4px rgba(222, 197, 204, 0.7);
          border-radius: 2px;
          color: $violet-clue;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          font-weight: $ft-w-regular;
          font-size: 12px;
        }
      }
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
