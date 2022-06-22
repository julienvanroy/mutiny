<template>
  <button :class="`btn btn-${color} ${disabled ? `disabled` : ''}`" :disabled="disabled">
    <img v-if="icon" :src="icon" alt="" />
    <router-link v-if="this.link" :to="link">
      {{ this.label }}
    </router-link>
    <span v-if="!this.link">{{ this.label }}</span>
  </button>
</template>

<script>
export default {
  name: "TheButton",
  props: {
    label: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    icon: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      required: false,
      default: "primary",
      validator(value) {
        return ["primary", "secondary", "tertiary", "back"].includes(value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  padding: 10px 30px;
  min-height: 56px;
  border: none;
  background-color: transparent;
  color: $white;
  text-align: center;
  transition: 0.3s all ease-in-out;
  img {
    z-index: 2;
    display: inline-block;
    margin-right: 8px;
  }
  a,
  span {
    z-index: 2;
    color: $purple;
    text-decoration: none;
    font-weight: $ft-w-bold;
    font-size: $ft-s-small;
    letter-spacing: 0.01em;
  }
  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    transition: 0.2s all ease-in-out;
  }
  &:before {
    z-index: 1;
  }
  &:after {
    z-index: 0;
    opacity: 0;
  }

  &-primary {
    color: $white;
    &:before {
      background-image: url("../../assets/buttons/primary.png");
    }
    &:after {
      background-image: url("../../assets/buttons/primary-shadow.png");
    }
    a,
    span {
      color: $white;
    }
  }
  &-secondary {
    &:before {
      background-image: url("../../assets/buttons/secondary.png");
    }
    &:after {
      background-image: url("../../assets/buttons/secondary-shadow.png");
    }
  }
  &-tertiary {
    min-height: 30px;
    padding: 10px 20px;
    a,
    span {
      font-size: $ft-s-xsmall;
    }
    &:before {
      background-image: url("../../assets/buttons/tertiary.png");
    }
    &:after {
      background-image: url("../../assets/buttons/tertiary-shadow.png");
    }
  }
  &-back {
    min-height: 30px;
    padding: 10px 20px 10px 40px;
    a,
    span {
      font-size: $ft-s-xsmall;
    }
    &:before {
      background-image: url("../../assets/buttons/back.png");
    }
    &:after {
      background-image: url("../../assets/buttons/back-shadow.png");
    }
  }

  @media (any-hover: hover) {
    &:hover {
      cursor: pointer;
      transform: rotate(-1deg);
      transition: 0.2s all ease-in-out;
      &:after {
        transform: translate(-6px, 6px);
        opacity: 0.3;
        transition: 0.2s all ease-in-out;
      }
    }
  }

  &.disabled {
    pointer-events: none;
    &:before {
      opacity: 0.2;
      mix-blend-mode: darken;
    }
    &:after {
      background-image: none;
    }
    span {
      opacity: 0.2;
      color: $disabled;
    }
    @media (any-hover: hover) {
      &:hover {
        cursor: not-allowed;
      }
    }
  }
}
</style>
