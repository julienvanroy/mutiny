<template>
  <div class="modal">
    <div :class="`modal__container ${!!isPause ? 'pause' : ''}`">
      <div class="modal__container-inner">
        <h2 class="title">{{ this.title }}</h2>
        <div class="content">
          <slot></slot>
        </div>
        <div class="btn-container">
          <!-- todo: btn restart game -->
          <TheButton
            v-if="!!isPause"
            :label="$t('ui.restart')"
            color="secondary"
          />
          <!-- todo: btn close modal OR continue game depending if !!isPause -->
          <TheButton
            :label="btnLabel ? btnLabel : $t('ui.close')"
            color="primary"
            @click="
              () => {
                this.modalShown = null;
                !!this.btnAction && this.btnAction;
              }
            "
          />
          <TheButton
            v-if="!!isPause"
            :label="$t('ui.quit')"
            color="secondary"
            link="/"
          />
        </div>
        <div v-if="!!isPause" class="timer-container">
          <p>{{ $t("ui.timeLeft") }}</p>
          <TheTimer />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import useGlobalStore from "@/store/global";
import TheButton from "@/components/ui/TheButton.vue";
import TheTimer from "@/components/ui/TheTimer";

export default {
  name: "ModalContainer",
  components: { TheButton, TheTimer },
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
      type: Function,
      required: false,
    },
    isPause: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapWritableState(useGlobalStore, ["modalShown"]),
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
      position: relative;
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
        padding-bottom: 80px;
      }
      .btn-container {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .btn + .btn {
          margin-left: 20px;
        }
        .btn-primary {
          height: 72px;
        }
      }
      .timer-container {
        position: absolute;
        top: 100px;
        right: 150px;
        p {
          font-size: $ft-s-xsmall;
        }
        .timer {
          text-align: right;
        }
      }
    }
    &.pause {
      background-image: url("../../assets/modal/background-pause.png");
      .btn-container {
        bottom: 15px;
      }
    }
  }
}
</style>
