<template>
  <transition name="fade">
    <div v-if="isMobile && !isLandscape" class="modal-landscape">
      {{ $t('ui.landscape') }}
    </div>
  </transition>
</template>

<script>
import {mapState} from "pinia";
import useGlobalStore from "@/store/global";

export default {
  name: "ModalLandscape",
  computed: {
    ...mapState(useGlobalStore, ["isMobile", "isLandscape"]),
  }
}
</script>

<style lang="scss" scoped>
.modal-landscape {
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
