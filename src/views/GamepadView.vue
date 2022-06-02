<template>
  <game-pad v-if="!!showGamePad" />
  <ModalWaiting v-if="!showGamePad" />
</template>

<script>
import GamePad from "@/components/GamePad.vue";
import useColyseusStore from "@/store/colyseus";
import ModalWaiting from "@/components/ModalWaiting";

export default {
  components: {ModalWaiting, GamePad },
  name: "GamepadView",
  setup() {
    const colyseus = useColyseusStore();

    return { colyseus };
  },
  data() {
    return {
      showGamePad: false
    };
  },
  mounted() {
    this.colyseus.currentRoom.onMessage("startGame", () => {
      this.showGamePad = true;
    });

    this.colyseus.currentRoom.onMessage(
        "getPlayer",
        (player) => (this.colyseus.player = player)
    );

    this.colyseus.currentRoom.onMessage("joystick", () => {});

    this.colyseus.currentRoom.onMessage("kill", () => {});
  },
  unmounted() {
    this.colyseus.currentRoom?.leave();
  },
};
</script>
