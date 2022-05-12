<template>
  <h1>paramètres & règles du jeu</h1>
  <router-link to="/game#debug">c'est partiiiii</router-link>
</template>

<script>
import useColyseusStore from "@/store/colyseus";

export default {
  name: "RulesView",
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
button {
  display: block;
  margin: 8px auto;
}
</style>
