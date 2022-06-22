<template>
  <game-pad :has-new-target="hasNewTarget" />
  <modal-dead v-show="showModalDead" :player="targetDead" />
  <modal-target-switched v-show="showModalTargetSwitched" />
  <modal-target-stolen v-show="showModalTargetStolen" :player="targetStolen" />
  <modal-lock-gamepad v-if="!isLandscape" />
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import useGlobalStore from "@/store/global";
import { mapState } from "pinia";
import GamePad from "@/components/GamePad.vue";
import ModalDead from "@/components/modals/ModalDead.vue";
import ModalTargetStolen from "@/components/modals/ModalTargetStolen.vue";
import ModalTargetSwitched from "@/components/modals/ModalTargetSwitched.vue";
import ModalLockGamepad from "@/components/modals/ModalLockGamepad.vue";

export default {
  components: { GamePad, ModalDead, ModalTargetStolen, ModalTargetSwitched, ModalLockGamepad },
  name: "GamepadView",
  data() {
    return {
      hasNewTarget: false,
      timeout: null,
      targetDead: "",
      targetStolen: "",
    };
  },
  computed: {
    ...mapState(useGlobalStore, ["isLandscape"]),
    showModalDead() {
      return this.colyseus.player.isKilled;
    },
    showModalTargetSwitched() {
      return !this.colyseus.player.isKilled && this.colyseus.player.targetChanged && !this.showModalTargetStolen;
    },
    showModalTargetStolen() {
      return !this.colyseus.player.isKilled && this.colyseus.player.targetGotStolen;
    },
  },
  watch: {
    showModalDead(newValue) {
      if (newValue && !this.timeout) this.hasNewTarget = true;
      this.timeout = setTimeout(() => {
        this.hasNewTarget = false;
        clearTimeout(this.timeout);
        this.timeout = null;
      }, 4000);
    },
    showModalTargetChanged(newValue) {
      if (newValue && !this.timeout) this.hasNewTarget = true;
      this.timeout = setTimeout(() => {
        this.hasNewTarget = false;
        clearTimeout(this.timeout);
        this.timeout = null;
      }, 4000);
    },
  },
  setup() {
    const colyseus = useColyseusStore();

    return { colyseus };
  },
  mounted() {
    this.colyseus.currentRoom.onMessage("joystick", () => {});

    this.colyseus.currentRoom.onMessage("attack", () => {});

    this.colyseus.currentRoom.onMessage("kill", ({ target }) => {
      this.targetDead = target;
    });

    this.colyseus.currentRoom.onMessage("updatePlayerTarget", ({ player }) => (this.player = player));

    this.colyseus.currentRoom.onMessage("endGame", () => this.$router.push("/end-game"));
  },
};
</script>
