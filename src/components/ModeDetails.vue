<template>
  <!-- <transition name="slide"> -->
  <div class="details">
    <div class="details__inner">
      <img class="flag" src="images/setup/flag.png" />
      <p class="uptitle">Mode</p>
      <h3>{{ $t(this.mode.name) }}</h3>
      <p class="description">{{ $t(this.mode.description) }}</p>
      <div class="parameters">
        <div class="parameters__left">
          <OptionContainer :title="$t('parameters.difficulty')">
            <TheRadioer
              label="difficulty"
              :values="[
                $t('parameters.easy'),
                $t('parameters.normal'),
                $t('parameters.hard'),
              ]"
              :defaultValue="$t('parameters.normal')"
            />
          </OptionContainer>
          <OptionContainer :title="$t('parameters.duration')">
            <TheRadioer
              label="duration"
              :values="[
                $t('parameters.easy'),
                $t('parameters.normal'),
                $t('parameters.hard'),
              ]"
              :defaultValue="$t('parameters.normal')"
            />
          </OptionContainer>
        </div>
        <div class="parameters__right">
          <OptionContainer :title="$t('parameters.controls')">
            <img src="images/parameters/controls-mode-1.png" />
          </OptionContainer>
        </div>
      </div>
      <div class="actions">
        <TheButton
          :label="$t('ui.back')"
          color="back"
          @click="() => $emit('setSelected', null)"
        />
        <TheButton
          :label="$t(this.mode.btnGo)"
          color="primary"
          @click="startGame()"
        />
        <TheButton
          :label="$t('ui.tutorial')"
          color="secondary"
          :disabled="true"
        />
      </div>
    </div>
  </div>
  <!-- </transition> -->
</template>

<script>
import useColyseusStore from "@/store/colyseus";
import router from "@/router";
import bidello from "bidello";
import TheButton from "@/components/ui/TheButton.vue";
import OptionContainer from "@/components/parameters/OptionContainer.vue";
import TheRadioer from "@/components/parameters/TheRadioer.vue";

export default {
  name: "ModeDetails",
  components: { TheButton, OptionContainer, TheRadioer },
  setup() {
    const colyseus = useColyseusStore();
    return { colyseus };
  },
  props: {
    mode: {
      required: true,
    },
  },
  methods: {
    startGame() {
      bidello.trigger({ name: "assignTargets" });
      this.colyseus.sendData("startGame");
      router.push("/game");
    },
  },
};
</script>

<style lang="scss" scoped>
.details {
  position: absolute;
  z-index: 18;
  top: 0;
  bottom: 0;
  right: 0;
  width: calc(100% - 580px);
  background-image: url("../assets/setup/mode-details.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  &__inner {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    padding: 0 30px;
    .flag {
      width: 70px;
      margin-bottom: 8px;
    }
    .uptitle {
      position: relative;
      font-style: italic;
      font-size: $ft-s-xsmall;
      &::before,
      &::after {
        content: "";
        width: 40px;
        height: 2px;
        background-color: rgba($purple, 0.2);
        position: absolute;
        top: 50%;
      }
      &:before {
        left: -80px;
      }
      &:after {
        right: -80px;
      }
    }
    h3 {
      margin: 0;
      font-size: $ft-s-xlarge;
      font-weight: $ft-w-bold;
      text-align: center;
    }
    .description {
      font-size: $ft-s-small;
      font-weight: $ft-w-bold;
      text-align: center;
      margin-top: 16px;
      max-width: 600px;
    }
    .parameters {
      display: flex;
      justify-content: space-between;
      align-items: stretch;
      margin: 32px 0;
      &__left {
        width: 50%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: center;
      }
      &__right {
        width: 50%;
        margin-left: 20px;
        img {
          width: 100%;
          max-height: 300px;
          margin-top: 20px;
        }
      }
    }
  }
  .actions {
    display: flex;
    justify-content: center;
    align-items: center;
    .btn + .btn {
      margin-left: 20px;
    }
  }
}
</style>
