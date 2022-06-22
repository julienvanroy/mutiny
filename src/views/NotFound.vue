<template>
  <div>
    <h1>404</h1>
    <TheButton link="/" :label="$t('ui.back')" color="secondary" />
  </div>
</template>

<script>
import TheButton from "@/components/ui/TheButton";

export default {
  name: 'NotFound',
  components: {
    TheButton
  }
}
</script>

<style lang="scss" scoped>
div {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: $ft-w-bold;

  h1 {
    font-size: 10rem;
  }

  .btn {
    margin: auto;
  }
}
</style>
