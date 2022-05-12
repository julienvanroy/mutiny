<template>
  <h1>Fin du jeu</h1>
  <router-link to="/">back to home</router-link>
</template>

<script>
import useColyseusStore from "@/store/colyseus";

export default {
  name: "EndGameView",
  setup() {
    const colyseus = useColyseusStore();

    return { colyseus };
  },
  mounted() {
    console.log(this.colyseus.currentRoom);
  },
};
</script>

<style lang="scss" scoped>
</style>
