<template>
  <div :class="`ranger ${label}`">
    <label :for="label">{{ label }}</label>
    <input
      type="range"
      ref="input"
      :id="label"
      :name="label"
      min="0"
      max="1"
      step="0.1"
      :value="value"
      @input="handleInputChange"
      :style="{backgroundSize: `${((value - min) * 100) / (max - min)}% 100%`}"
    />
  </div>
</template>

<script>
export default {
  name: "TheRanger",
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    min: {
      type: Number,
      required: false,
      default: 0
    },
    max: {
      type: Number,
      required: false,
      default: 1
    }
  },
  methods: {
    handleInputChange(e) {
      const val = e.target.value;
      this.$emit('set-value', val)
    },
  },
};
</script>

<style lang="scss" scoped>
.ranger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  label {
    font-size: $ft-s-small;
  }
  input[type="range"] {
    -webkit-appearance: none;
    width: 180px;
    height: 8px;
    background: $orange;
    border-radius: 3px;
    background-image: linear-gradient($purple, $purple);
    background-size: 50% 100%;
    background-repeat: no-repeat;
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 32px;
      width: 28px;
      background-image: url("../../assets/parameters/radio-checked.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
    }
    &::-webkit-slider-runnable-track {
      -webkit-appearance: none;
      box-shadow: none;
      border: none;
      background: transparent;
    }
  }
  & + .ranger {
    margin-top: 10px;
  }
}
</style>
