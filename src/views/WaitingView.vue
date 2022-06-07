<template>
  <div class="waiting">
    <header class="get-pseudo__header">
      <img src="../assets/mobile/header-w-logo.svg" alt="" />
    </header>
    <h2>{{ $t("getPseudo.title") }}</h2>
    <the-button @click="$router.push('gamepad')" />
    <footer class="get-pseudo__header">
      <img src="../assets/mobile/header.svg" alt="" />
    </footer>
  </div>
</template>

<script>
import TheButton from "@/components/ui/TheButton.vue";

export default {
  components: { TheButton },
  name: "WaitingView",
};
</script>

<style lang="scss" scoped>
.waiting {
}
</style>
