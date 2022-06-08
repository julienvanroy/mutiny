<template>
  <game-pad />
  <modal-dead v-show="showModalDead" />
  <modal-steal-target v-show="showModalStealTarget" />
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import GamePad from "@/components/GamePad.vue";
import ModalDead from "@/components/modals/ModalDead.vue";
import ModalStealTarget from "@/components/modals/ModalStealTarget.vue";

export default {
  components: { GamePad, ModalDead, ModalStealTarget },
  name: "GamepadView",
  data() {
    return {
      showModalDead: false,
      showModalStealTarget: false,
    };
  },
  setup() {
    const colyseus = useColyseusStore();

    return { colyseus };
  },
  mounted() {
    this.colyseus.currentRoom.onMessage("joystick", () => {});

    this.colyseus.currentRoom.onMessage("kill", () => {});
  },
  unmounted() {
    this.colyseus.currentRoom?.leave();
  },
};
</script>
