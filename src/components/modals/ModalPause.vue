<template>
  <transition name="fade">
    <ModalContainer
      :title="$t('parameters.pause')"
      :btnLabel="$t('ui.continue')"
      :isPause="true"
    >
      <div class="modal__pause">
        <div class="modal__pause-left">
          <OptionContainer :title="$t('parameters.audio')">
            <TheRanger :label="$t('parameters.music')" defaultValue="0.5" />
            <TheRanger :label="$t('parameters.effects')" defaultValue="0.5" />
            <h3>{{ $t("parameters.graphics") }}</h3>
            <TheRadioer
              :subtitle="$t('parameters.quality')"
              label="graphics"
              :values="[
                $t('parameters.low'),
                $t('parameters.medium'),
                $t('parameters.high'),
              ]"
              :defaultValue="$t('parameters.medium')"
            />
            <TheSwitcher v-on:set-fullscreen="setFullscreen" />
          </OptionContainer>
        </div>
        <div class="modal__pause-right">
          <OptionContainer :title="$t('parameters.controls')">
            <img :src="`images/parameters/controls-mode-1-${$i18n.locale}.png`" />
          </OptionContainer>
        </div>
      </div>
    </ModalContainer>
  </transition>
</template>

<script>
import ModalContainer from "@/components/modals/ModalContainer";
import OptionContainer from "@/components/parameters/OptionContainer";
import TheRadioer from "@/components/parameters/TheRadioer";
import TheRanger from "@/components/parameters/TheRanger";
import TheSwitcher from "@/components/parameters/TheSwitcher";

export default {
  name: "ModalPause",
  components: {
    ModalContainer,
    OptionContainer,
    TheRadioer,
    TheRanger,
    TheSwitcher,
  },
  props: {
    setFullscreen: { type: Function },
  },
};
</script>

<style lang="scss" scoped>
.modal__pause {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  padding: 0 50px;
  h3 {
    font-size: $ft-s-medium;
    font-weight: $ft-w-bold;
    text-align: center;
    margin: 20px 0 10px 0;
  }
  &-left {
    width: 50%;
  }
  &-right {
    width: 50%;
    margin-left: 30px;
    img {
      width: 100%;
      max-height: 300px;
      margin-top: 20px;
    }
  }
}
</style>
