<template>
  <game-pad v-if="!!showGamePad" />
  <div v-if="!showGamePad" class="modal-waiting">WAITING...</div>
</template>

<script>
import GamePad from "@/components/GamePad/GamePad.vue";
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
    };
  },
  mounted() {
    this.colyseus.currentRoom.onMessage("startGame", () => {
      this.showGamePad = true;
    });
  },
  unmounted() {
    this.colyseus.currentRoom?.leave();
  },
};
</script>

<style lang="scss" scoped>
.modal-waiting {
  position: absolute;
  z-index: 12;
  inset: 0;
  background-color: $black;
  color: $white;
  font-weight: $ft-w-bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
