<template>
  <transition name="fade">
    <div class="modal">
      <div class="modal__container">
        <div class="modal__container-inner">
          <h2 class="title">{{ this.title }}</h2>
          <div class="content">
            <slot></slot>
          </div>
          <div class="btn-container">
            <TheButton
              :label="btnLabel ? btnLabel : $t('close')"
              color="primary"
              @click="this.btnAction"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import TheButton from "@/components/ui/TheButton.vue";

export default {
  name: "ModalContainer",
  components: { TheButton },
  props: {
    title: {
      type: String,
      required: true,
    },
    btnLabel: {
      type: String,
      required: false,
    },
    btnAction: {
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  position: absolute;
  z-index: 22;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba($purple, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);
  &__container {
    position: relative;
    background-image: url("../../assets/modal/background.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 1024px;
    height: 720px;
    &-inner {
      width: 100%;
      height: 100%;
      padding: 100px 100px 80px 100px;
      .title {
        font-size: $ft-s-xlarge;
        font-weight: $ft-w-bold;
        text-align: center;
      }
      .content {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 60px;
      }
      .btn-container {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
</style>
