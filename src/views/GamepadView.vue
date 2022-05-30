<template>
  <game-pad v-if="!!showGamePad" />
  <div v-if="!showGamePad" class="modal-waiting">WAITING...</div>
</template>

<script>
import GamePad from "@/components/GamePad.vue";
import useColyseusStore from "@/store/colyseus";

export default {
  components: { GamePad },
  name: "GamepadView",
  setup() {
    const colyseus = useColyseusStore();

    return { colyseus };
  },
  data() {
    return {
      showGamePad: false,
      playerTarget: {},
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

<style lang="scss" scoped>
.modal-waiting {
  position: absolute;
  z-index: 16;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $purple;
  color: $white;
  font-weight: $ft-w-bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
