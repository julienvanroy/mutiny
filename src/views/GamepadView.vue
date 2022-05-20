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
      playerTarget: {},
    };
  },
  mounted() {
    if (this.colyseus.currentRoom) {
      this.colyseusOnMessage();
    } else {
      this.colyseus.joinRoom(this.$route.params.roomId).then(() => {
        this.colyseusOnMessage();
      });
    }
  },
  unmounted() {
    this.colyseus.currentRoom?.leave();
  },
  methods: {
    colyseusOnMessage() {
      this.colyseus.currentRoom.onMessage("startGame", () => {
        this.showGamePad = true;
      });

      this.colyseus.currentRoom.onMessage("addPlayer", () => {});

      this.colyseus.currentRoom.onMessage("joystick", () => {});

      this.colyseus.currentRoom.onMessage("kill", () => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-waiting {
  position: absolute;
  z-index: 16;
  inset: 0;
  background-color: $black;
  color: $white;
  font-weight: $ft-w-bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
