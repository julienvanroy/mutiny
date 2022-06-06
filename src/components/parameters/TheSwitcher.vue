<template>
  <div class="switcher">
    <span class="label">{{ $t("parameters.fullscreen") }}</span>
    <label :class="`switch ${!isFullscreen ? 'off' : ''}`">
      <input
        type="checkbox"
        :checked="isFullscreen"
        @click="$emit('setFullscreen')"
      />
      <span class="slider"></span>
    </label>
  </div>
</template>

<script>
import useGlobalStore from "@/store/global";
import { mapState } from "pinia";

export default {
  name: "TheSwitcher",
  computed: {
    ...mapState(useGlobalStore, ["isFullscreen"]),
  },
};
</script>

<style lang="scss" scoped>
.switcher {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  .label {
    font-size: $ft-s-small;
  }
  .switch {
    position: relative;
    display: inline-block;
    width: 80px;
    height: 24px;
    background-image: url("../../assets/parameters/switcher.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    transition: 0.3s all ease-in-out;
    &.off {
      background-image: url("../../assets/parameters/switcher-off.png");
      transition: 0.3s all ease-in-out;
    }
    &::before,
    &::after {
      position: absolute;
      font-size: $ft-s-xxsmall;
      font-weight: $ft-w-bold;
      color: $white;
      z-index: 1;
    }
    &:before {
      content: "On";
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
    }
    &:after {
      content: "Off";
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
    }
    .slider {
      position: absolute;
      z-index: 2;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      -webkit-transition: 0.4s;
      transition: 0.4s;
      &:before {
        position: absolute;
        content: "";
        height: 40px;
        width: 40px;
        top: 0;
        left: 0;
        -webkit-transition: 0.4s;
        transition: 0.4s;
        background-image: url("../../assets/parameters/button.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        transform: translate(0%, -12%);
      }
    }
    input {
      opacity: 0;
      width: 0;
      height: 0;
      &:checked + .slider:before {
        -webkit-transform: translate(90%, -12%);
        -ms-transform: translate(90%, -12%);
        transform: translate(90%, -12%);
      }
    }
  }
}
</style>