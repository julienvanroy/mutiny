<template>
  <transition name="fade">
    <div>
      <img src="/images/modals/icon-dead.svg/" alt="" />
      {{ $t("modals.modalDead", { player }) }}
    </div>
  </transition>
</template>

<script>
export default {
  name: "ModalDead",
  props: {
    player: {
      type: String,
      required: true,
    },
  },
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
  background-color: rgba($red-dead, 0.9);
  color: $white;
  font-weight: $ft-w-bold;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
