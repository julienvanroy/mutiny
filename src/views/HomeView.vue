<template>
  <HomeViewMobile v-if="isMobile" />
  <HomeViewDesktop v-if="!isMobile" />
</template>

<script>
import { mapState } from "pinia/dist/pinia.esm-browser";
import useGlobalStore from "@/store/global";
import HomeViewDesktop from "@/components/HomeViewDesktop";
import HomeViewMobile from "@/components/HomeViewMobile";

export default {
  name: "HomeView",
  components: { HomeViewDesktop, HomeViewMobile },
  computed: {
    ...mapState(useGlobalStore, ["isMobile"]),
  },
};
</script>
