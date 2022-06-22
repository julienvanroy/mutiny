<template>
  <end-view-desktop v-if="!isMobile" />
  <end-view-mobile v-if="isMobile" />
</template>

<script>
import { mapState } from "pinia/dist/pinia.esm-browser";
import useGlobalStore from "@/store/global";
import EndViewDesktop from "@/components/EndViewDesktop.vue";
import EndViewMobile from "@/components/EndViewMobile.vue";
import bidello from "bidello";

export default {
  components: { EndViewDesktop, EndViewMobile },
  name: "EndGameView",
  mounted() {
    bidello.trigger({ name: "pause" });
  },
  computed: {
    ...mapState(useGlobalStore, ["isMobile"]),
  },
};
</script>

<style lang="scss" scoped></style>
