<template>
  <game-pad />
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
  mounted() {
    this.colyseus.currentRoom.onMessage("getPlayer", (player) => (this.colyseus.player = player));

    this.colyseus.currentRoom.onMessage("joystick", () => {});

    this.colyseus.currentRoom.onMessage("kill", () => {});
  },
  unmounted() {
    this.colyseus.currentRoom?.leave();
  },
};
</script>
