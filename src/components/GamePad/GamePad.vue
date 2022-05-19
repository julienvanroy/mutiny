<template>
  <!-- <p>currentRoom : {{ colyseus.currentRoom.id }}</p>
  <p>playerSessionId : {{ colyseus.currentRoom.sessionId }}</p> -->

  <div class="gamepad">
    <div class="left">
      <div class="player">
        <div class="points">
          <img :src="`/images/players/${player.color}.png`" />
          <span>{{ player.points }}</span>
        </div>
        <div class="name">
          you are<br />
          <span>{{ player.name }}</span>
        </div>
      </div>
      <div ref="joystick" class="joystick"></div>
    </div>
    <div class="middle" v-if="this.playerTarget">
      <p>CLUES</p>
      <div class="clue" :style="`background-color: ${clue.color}`" v-for="clue in clues" :key="clue.color">
        {{ clue.tags[0] }}
      </div>
    </div>
    <div class="right">
      <button ref="attack" class="attack" @click="colyseus.sendData('kill', true)">
        <img src="/images/pad/button.png" />
        <span>Attack</span>
      </button>
      <!-- <button ref="power" @click="colyseus.sendData('power', true)">power</button> -->
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
  props: {
    playerTarget: {
      type: Object,
      default: () => {},
    },
    player: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      joystick: [],
    };
  },
  computed: {
    clues() {
      return this.playerTarget?.info;
    },
    playerName() {
      return this.player.name;
    },
    playerPoints() {
      return this.player.points;
    },
    playerColor() {
      return this.player.color;
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
  .left {
    width: 40%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: flex-start;
    .player {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .points {
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
      .name {
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
  .middle {
    width: 30%;
    background-color: $grey-2;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;
    p {
      text-align: center;
      font-weight: $ft-w-bold;
      font-size: $ft-s-medium;
      letter-spacing: 0.01em;
    }
    .clue {
      background: $grey-1;
      border-radius: 8px;
      width: 80px;
      height: 80px;
      color: $white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: $ft-w-bold;
    }
  }
  .right {
    width: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
    .attack {
      position: relative;
      background-color: transparent;
      border: none;
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
