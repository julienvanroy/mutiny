<template>
  <div class="gamepad">
    <div class="gamepad__left">
      <div class="player">
        <div class="player__points">
          <img :src="`/images/players/${color}.png`" />
          <span>{{ points }}</span>
        </div>
        <div class="player__name">
          {{ $t("gamepad.youAre") }}<br />
          <span>{{ name }}</span>
        </div>
      </div>
      <div ref="joystick" class="joystick"></div>
    </div>
    <div class="gamepad__middle" v-if="clues">
      <p>{{ $t("gamepad.clues") }}</p>
      <div class="clues" :style="`background-color: ${clue.color}`" v-for="clue in clues" :key="clue.color">
        {{ clue.tag }}
      </div>
    </div>
    <div class="gamepad__right">
      <button ref="attack" class="attack" @click="colyseus.sendData('kill', true)">
        <img src="/images/pad/button.png" />
        <span>{{ $t("gamepad.attack") }}</span>
      </button>
      <!-- <button ref="power" @click="colyseus.sendData('power', true)">{{$t("gamepad.power")}}</button> -->
    </div>
  </div>
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import nipplejs from "nipplejs";

export default {
  name: "GamePad",
  setup() {
    const colyseus = useColyseusStore();

    return { colyseus };
  },
  data() {
    return {
      joystick: [],
    };
  },
  computed: {
    clues() {
      return this.colyseus.playerTarget.info;
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
  mounted() {
    this.colyseus.getPlayer(this.colyseus.currentRoom.sessionId);

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
  box-sizing: border-box;

  &__left {
    width: 40%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: flex-start;

    .player {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      &__points {
        position: relative;
        img {
          width: 60px;
        }
        span {
          font-weight: $ft-w-bold;
          font-size: $ft-s-medium;
          color: $white;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -60%);
        }
      }
      &__name {
        margin-left: 10px;
        span {
          display: block;
          font-weight: $ft-w-bold;
          font-size: $ft-s-small;
          margin-top: 6px;
        }
      }
    }

    .joystick {
      position: relative;
      width: 250px;
      height: 250px;
      background-color: $grey-1;
      border: 3px solid $grey-2;
      border-radius: 100%;
    }
  }

  &__middle {
    width: 30%;
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
    width: 30%;
    display: flex;
    justify-content: center;
    align-items: center;

    .attack {
      position: relative;
      background-color: transparent;
      border: none;
      transition: transform 0.25s ease;

      &:active {
        transform: scale(0.9);
      }

      img {
        width: 100px;
      }

      span {
        font-weight: $ft-w-bold;
        font-size: $ft-s-medium;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -60%);
      }
    }
  }
}
</style>
