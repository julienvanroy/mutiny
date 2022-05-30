<template>
  <button
    :class="`btn btn-${color} ${disabled ? `disabled` : ''}`"
    :disabled="disabled"
  >
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
    color: {
      type: String,
      required: false,
      default: "light",
      validator(value) {
        return ["light", "dark"].includes(value);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  min-height: 30px;
  border: 1px solid $grey-5;
  border-radius: 36px;
  font-weight: $ft-w-medium;
  font-size: $ft-s-small;
  color: $purple;
  text-align: center;
  letter-spacing: 0.01em;
  a {
    color: $purple;
    text-decoration: none;
  }

  @media (any-hover: hover) {
    &:hover {
      cursor: pointer;
    }
  }
  &-light {
    background-color: $white;
  }
  &-dark {
    background-color: $grey-5;
    color: $white;
    a {
      color: $white;
    }
  }

  &.disabled {
    /* pointer-events: none; */
    opacity: 0.7;
    @media (any-hover: hover) {
      &:hover {
        cursor: not-allowed;
      }
    }
  }
}
</style>
