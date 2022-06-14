<template>
  <end-view-desktop v-if="!isMobile" />
  <end-view-mobile v-if="isMobile" />
</template>

<script>
import { mapState } from "pinia/dist/pinia.esm-browser";
import useGlobalStore from "@/store/global";
import EndViewDesktop from "@/components/EndViewDesktop.vue";
import EndViewMobile from "@/components/EndViewMobile.vue";

export default {
  components: { EndViewDesktop, EndViewMobile },
  name: "EndGameView",
  computed: {
    ...mapState(useGlobalStore, ["isMobile"]),
  },
};
</script>

<style lang="scss" scoped></style>
