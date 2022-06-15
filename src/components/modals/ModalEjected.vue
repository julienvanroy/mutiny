<template>
  <transition name="fade">
    <div>
      <img src="/images/modals/icon-logo-trait.svg" alt="" />
      <p>{{ $t("modals.modalEjected.title") }}</p>
      <the-button :label="$t('modals.modalEjected.cta')" link="/" />
    </div>
  </transition>
</template>

<script>
import TheButton from "../ui/TheButton.vue";
export default {
  components: { TheButton },
  name: "ModalEjected",
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
  font-size: 30px;
  font-weight: $ft-w-bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  padding: 32px 16%;
  text-align: center;

  img {
    display: block;
    width: 240px;
    height: auto;
    margin-bottom: 40px;
  }

  .btn {
    width: 224px;
    margin-bottom: 100px;
  }

  @media (orientation: landscape) {
    .btn {
      margin-bottom: 32px;
    }
  }
}
</style>
