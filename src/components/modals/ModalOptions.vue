<template>
  <ModalContainer
    :title="$t('parameters.options')"
    :btnLabel="$t('modals.modalOptions.btnLabel')"
  >
    <div class="modal__options">
      <div class="modal__options-left">
        <OptionContainer :title="$t('parameters.audio')">
          <TheRanger
            :label="$t('parameters.music')"
            :value="audio.musicVolume.toString()"
            @set-value="setMusicVolume"
          />
          <TheRanger
            :label="$t('parameters.effects')"
            :value="audio.effectVolume.toString()"
            @set-value="setEffectVolume"
          />
        </OptionContainer>
        <OptionContainer :title="$t('parameters.languages')">
          <LangChanger />
        </OptionContainer>
      </div>
      <div class="modal__options-right">
        <OptionContainer :title="$t('parameters.graphics')">
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
    </div>
  </ModalContainer>
</template>

<script>
import ModalContainer from "@/components/modals/ModalContainer";
import OptionContainer from "@/components/parameters/OptionContainer";
import TheRadioer from "@/components/parameters/TheRadioer";
import TheRanger from "@/components/parameters/TheRanger";
import TheSwitcher from "@/components/parameters/TheSwitcher";
import LangChanger from "@/components/parameters/LangChanger";
import useAudioStore from "@/store/audio";

export default {
  name: "ModalOptions",
  setup() {
    const audio = useAudioStore();
    return { audio };
  },
  components: {
    ModalContainer,
    OptionContainer,
    TheRadioer,
    TheRanger,
    TheSwitcher,
    LangChanger,
  },
  props: {
    setFullscreen: { type: Function },
  },
  methods: {
    setMusicVolume(value) {
      this.audio.changeMusicVolume(value);
    },
    setEffectVolume(value) {
      this.audio.changeEffectVolume(value);
    },
  },
};
</script>

<style lang="scss" scoped>
.modal__options {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  padding: 0 50px;
  &-left {
    width: 50%;
  }
  &-right {
    width: 50%;
    margin-left: 30px;
  }
}
</style>
