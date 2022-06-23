<template>
  <div class="the-input" :class="{ '--center': center }" :style="cssProps">
    <input
      class="input"
      type="text"
      ref="myinput"
      :value="modelValue"
      :placeholder="placeholder"
      :readonly="readonly"
      :maxlength="maxlength"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="$event.target.select()"
    />
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "TheInput",
  props: {
    width: {
      type: Number,
      default: 200,
    },
    height: {
      type: Number,
      default: 50,
    },
    onFocus: {
      type: Function,
      default: () => {},
    },
    modelValue: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    center: {
      type: Boolean,
      default: false,
    },
    model: {
      type: String,
      default: "",
    },
    maxlength: {
      type: Number,
      required: false,
      default: null
    }
  },
  computed: {
    cssProps() {
      return {
        "--input-width": `${this.width}px`,
        "--input-height": `${this.height}px`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.the-input {
  position: relative;
  background-image: url("../../assets/code/background.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: var(--input-width);
  height: var(--input-height);
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &.--center {
    input {
      text-align: center;
    }
  }
  input {
    width: 100%;
    height: 100%;
    background-color: transparent;
    padding: 0;
    border: 0;
    color: $white;
    font-size: $ft-s-xsmall;
    &:focus {
      outline: none;
    }
    &::placeholder {
      color: rgba($white, .3);
    }
  }
}
</style>
