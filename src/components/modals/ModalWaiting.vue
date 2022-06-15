<template>
  <transition name="fade">
    <div>
      {{ $t("modals.modalWaiting") }}
    </div>
  </transition>
</template>

<script>
export default {
  name: "ModalWaiting",
};
</script>

<style lang="scss" scoped>
div {
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
