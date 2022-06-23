<template>
  <transition name="fade">
    <div :class="`loader ${ended ? 'ended' : ''}`" v-if="show">
      <img src="images/loader/logo.png" />
      <!-- <p>{{ Math.round(progress) * 100 }}%</p> -->
      <div class="skulls">
        <img class="skull" src="images/loader/skull.png" />
        <img class="skull" src="images/loader/skull.png" />
        <img class="skull" src="images/loader/skull.png" />
      </div>
      <!-- <div class="loader-bar" :style="{transform : !ended ? `scaleX(${progress})` : ''}"/> -->
    </div>
  </transition>
</template>

<script>
import { mapState } from "pinia";
import useWebglStore from "@/store/webgl";

export default {
  name: "TheLoader",
  data() {
    return {
      show: true,
    };
  },
  computed: {
    ...mapState(useWebglStore, { progress: "progressLoading" }),
    ended() {
      return this.progress === 1;
    },
  },
  watch: {
    ended(newValue) {
      if (newValue) {
        setTimeout(() => {
          this.show = false;
        }, 1000);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: $purple;
  color: $loader;
  z-index: 20;
  opacity: 1;
  transition: 0.5s opacity ease;

  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  img {
    width: 380px;
    @media #{$mq-small} {
      width: 520px;
    }
  }
  /* p {
    font-weight: $ft-w-bold;
    font-size: 5rem;
    margin: 80px 0 40px;
  } */
  .skulls {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 80px;
    .skull {
      animation: pulse 1.6s infinite linear;
      width: 36px;
      height: auto;
      &:nth-child(2) {
        animation-delay: 0.3s;
      }
      &:nth-child(3) {
        animation-delay: 0.6s;
      }
      & + .skull {
        margin-left: 40px;
      }
    }
  }

  @keyframes pulse {
    0% {
      transform: translateY(-10px) scale(0);
    }
    30% {
      transform: translateY(-10px) scale(1);
    }
    60%,
    100% {
      transform: translateY(-10px) scale(0);
    }
  }
  /* &-bar {
    position: absolute;
    top: 50%;
    width: 100%;
    height: 2px;
    background: $white;
    transform: scaleX(0);
    transform-origin: top left;
    transition: transform 0.5s ease;
  } */

  &.ended {
    opacity: 0;
    .loader-bar {
      transform: scaleX(0);
      transform-origin: 100% 0;
      transition: transform 1.5s ease-in-out;
    }
  }
}
</style>
