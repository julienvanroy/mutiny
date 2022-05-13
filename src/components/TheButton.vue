<template>
  <button :class="`btn btn-${color} ${disabled ? `disabled` : ''}`" :disabled="disabled">
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
  border: 1px solid #434242;
  border-radius: 8px;
  font-family: "Montserrat";
  font-weight: $ft-medium;
  font-size: 16px;
  text-align: center;
  letter-spacing: 0.01em;
  a {
    color: $black;
    text-decoration: none;
  }

  @media (any-hover: hover) {
    &:hover {
      cursor: pointer;
    }
  }
  &-light {
    background-color: $white;
    color: $black;
  }
  &-dark {
    background-color: $grey;
    color: $black;
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.6;
    @media (any-hover: hover) {
      &:hover {
        cursor: cursor;
      }
    }
  }
}
</style>
