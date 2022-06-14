<template>
  <game-pad :has-new-target="hasNewTarget" />
  <transition>
    <modal-dead v-show="showModalDead" />
  </transition>
  <transition>
    <modal-target-changed v-show="showModalTargetChanged" />
  </transition>
  <modal-lock-gamepad v-if="!isLandscape" />
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import useGlobalStore from "@/store/global";
import { mapWritableState } from "pinia";
import GamePad from "@/components/GamePad.vue";
import ModalDead from "@/components/modals/ModalDead.vue";
import ModalTargetChanged from "@/components/modals/ModalTargetChanged.vue";
import ModalLockGamepad from "@/components/modals/ModalLockGamepad.vue";

export default {
  components: { GamePad, ModalDead, ModalTargetChanged, ModalLockGamepad },
  name: "GamepadView",
  data() {
    return {
      hasNewTarget: false,
      timeout: null,
    };
  },
  computed: {
    ...mapWritableState(useGlobalStore, ["isLandscape"]),
    showModalDead() {
      return this.colyseus.player.isKilled;
    },
    showModalTargetChanged() {
      return !this.colyseus.player.isKilled && this.colyseus.player.targetChanged;
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
    this.resize();
    window.addEventListener("resize", this.resize, false);

    this.colyseus.currentRoom.onMessage("joystick", () => {});

    this.colyseus.currentRoom.onMessage("attack", () => {});

    this.colyseus.currentRoom.onMessage("kill", () => {});

    this.colyseus.currentRoom.onMessage("updatePlayerTarget", () => {});

    this.colyseus.currentRoom.onMessage("endGame", () => this.$router.push("/end-game"));
  },
  unmounted() {
    this.colyseus.currentRoom?.leave();
    window.removeEventListener("resize", this.resize, false);
  },
  methods: {
    resize() {
      this.isLandscape = window.innerWidth > window.innerHeight;
    },
  },
};
</script>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.64s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
