<template>
  <transition name="fade">
    <div>
      <img src="/images/modals/icon-lock-gamepad.svg" alt="" />
      <p>{{ $t("modals.modalLockGamepad") }}</p>
    </div>
  </transition>
</template>

<script>
export default {
  name: "ModalLockGamepad",
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
  background-color: $white-beige;
  color: $purple;
  font-size: 20px;
  font-weight: $ft-w-bold;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 12%;
  text-align: center;

  img {
    display: block;
    width: 180px;
    height: auto;
    margin-bottom: 40px;
  }
}
</style>
