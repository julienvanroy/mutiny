<template>
  <HomeViewMobile v-if="isMobile" />
  <HomeViewDesktop v-if="!isMobile" />
</template>

<script>
import useGlobalStore from "@/store/global";
import HomeViewDesktop from "@/components/HomeViewDesktop";
import HomeViewMobile from "@/components/HomeViewMobile";
import {mapState, mapWritableState} from "pinia";

export default {
  name: "HomeView",
  components: { HomeViewDesktop, HomeViewMobile },
  mounted() {
    this.modalShown = null;
  },
  computed: {
    ...mapState(useGlobalStore, ["isMobile"]),
    ...mapWritableState(useGlobalStore, ["modalShown"]),
  },
};
</script>
