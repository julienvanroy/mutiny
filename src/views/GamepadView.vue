<template>
  <game-pad />
</template>

<script>
import GamePad from "@/components/GamePad/GamePad.vue";
import useColyseusStore from "@/store/colyseus";

export default {
  components: { GamePad },
  name: "GamepadView",
  setup() {
    const colyseus = useColyseusStore();

    colyseus.currentRoom.onMessage("updatePlayerTarget", (message) => {
      console.log(message);
    });

    return { colyseus };
  },
  unmounted() {
    this.colyseus.currentRoom?.leave();
  },
};
</script>
