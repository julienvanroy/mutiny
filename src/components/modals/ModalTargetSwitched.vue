<template>
  <transition name="fade">
    <div>
      <img src="/images/modals/icon-new-target.svg/" alt="" />
      {{ $t("modals.modalTargetSwitched") }}
    </div>
  </transition>
</template>

<script>
export default {
  name: "ModalTargetSwitched",
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
  background-color: rgba($orange-target, 0.9);
  color: $white;
  font-weight: $ft-w-bold;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
