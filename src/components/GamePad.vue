<template>
  <div class="gamepad">
    <div class="gamepad__left">
      <ThePlayer :player="colyseus.player" dont-update-state />
      <div ref="joystick" class="joystick"></div>
    </div>
    <div class="gamepad__middle" :class="{ '--new-target': hasNewTarget }">
      <div class="clues-container">
        <h2>{{ $t("gamepad.clues") }}</h2>
        <p>{{ targetName }}</p>
        <div class="clues">
          <div class="clue" v-for="(clue, indexClue) in clues" :key="indexClue">
            <span v-if="clue.show"><img :src="`/images/clues/${clue.img}.png`" alt="" /></span>
            <span v-else-if="nextClueIndex === indexClue">
              {{ $t("gamepad.clueInterval") }}
              <br />
              <em>{{ `${countdown}''` }}</em>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="gamepad__right">
      <p class="stalkers-counter-container" :class="{ '--state-change': stalkerCountStateChange }">
        {{ $t("gamepad.stalkersCounterLeft") }}
        <br />
        <stalkers-counter :count="stalkerCount" :state-change="stalkerCountStateChange" />
        <span>{{ $t("gamepad.stalkersCounterRight") }}</span>
      </p>
      <button ref="attack" class="attack">
        <btn-attack @click="attack" :attack="isAttack" />
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
import configs from "@/configs";
import BtnAttack from "./svg/BtnAttack.vue";

export default {
  components: { ThePlayer, StalkersCounter, BtnAttack },
  name: "GamePad",
  setup() {
    const colyseus = useColyseusStore();

    return { colyseus };
  },
  props: {
    hasNewTarget: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      joystick: [],
      interval: null,
      nextClueIndex: 1,
      countdown: configs.game.cluesTime[0],
      countdownInterval: null,
      isAttack: false,
      stalkerCountStateChange: false,
      stalkerCountChanges: 0,
    };
  },
  watch: {
    cluesHide(newValue, prevValue) {
      if (JSON.stringify(newValue) !== JSON.stringify(prevValue)) {
        this.resetClues();
      }
    },
    stalkerCount() {
      this.stalkerCountStateChange = true;

      const timeout = setTimeout(
        () => {
          this.stalkerCountStateChange = false;
          clearTimeout(timeout);
        },
        this.stalkerCountChanges === 0 ? 0 : 4800
      );

      this.stalkerCountChanges++;
    },
  },
  computed: {
    targetInfo() {
      return this.colyseus.player.target ? JSON.parse(this.colyseus.player.target) : "";
    },
    clues() {
      return this.targetInfo?.info || [];
    },
    cluesHide() {
      return this.clues?.filter((clue) => !clue.show);
    },
    targetName() {
      return this.colyseus.playersArray.find((p) => p.id === this.targetInfo?.id)?.name || "";
    },
    stalkerCount() {
      return this.colyseus.stalkersCount;
    },
  },
  methods: {
    attack() {
      this.colyseus.sendData("attack");

      this.isAttack = true;

      const timeout2 = setTimeout(() => {
        this.isAttack = false;
        clearTimeout(timeout2);
      }, 600);
    },
    resetClues() {
      this.nextClueIndex = 1;
      this.countdown = configs.game.cluesTime[this.nextClueIndex];
      this.setIntervalClues();
    },
    setIntervalClues() {
      this.countdown = configs.game.cluesTime[this.nextClueIndex];

      if (this.interval) clearInterval(this.interval);
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }
      this.interval = setInterval(this.showOneClue, 1000 * configs.game.cluesTime[this.nextClueIndex]);
      this.countdownInterval = setInterval(() => {
        this.countdown--;
      }, 1000);
    },
    showOneClue() {
      if (!this.interval || this.nextClueIndex === this.clues.length) return;
      if (this.cluesHide.length === 0) {
        clearInterval(this.interval);
        clearInterval(this.countdownInterval);
        return;
      } else {
        this.clues[this.nextClueIndex].show = true;
        this.nextClueIndex++;
        this.countdown = configs.game.cluesTime[this.nextClueIndex];
        // this.setIntervalClues();
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

    this.resetClues();
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

    &.--new-target {
      .clues-container {
        background-image: url("../assets/gamepad/bg-clues-new.png");

        h2 {
          color: $white-beige;
        }

        p {
          background-image: url("../assets/gamepad/bg-pirate-name-w.png");
          color: $purple;

          &::after {
            background-image: url("../assets/gamepad/tag-new.svg");
            background-position: center;
            background-repeat: no-repeat;
            background-size: contain;
            opacity: 1;
          }
        }

        .clue {
          background: $violet-clue-bg;
          box-shadow: inset 0px 0px 5px rgba(222, 197, 204, 0.7);
        }
      }
    }

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
        position: relative;
        width: 160px;
        height: 56px;
        background-image: url("../assets/gamepad/bg-pirate-name.png");
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        font-weight: $ft-w-bold;
        font-size: 15px;
        color: $white-beige;
        text-align: center;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        &::after {
          content: "";
          display: block;
          position: absolute;
          top: -10%;
          right: -10%;
          width: 34px;
          height: 34px;
          opacity: 0;
        }
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

          img {
            width: 72px;
            height: auto;
          }

          em {
            font-size: 18px;
            font-weight: $ft-w-bold;
          }
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
      transition: all 0.6s ease;
      color: $purple;

      &.--state-change {
        background-image: url("../assets/gamepad/bg-stalker-count-r.png");
        color: $white-beige;
      }
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

      svg {
        width: 152px;
        height: 152px;
      }
    }
  }
}
</style>
