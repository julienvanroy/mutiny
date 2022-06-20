<template>
  <div class="option-container">
    <h3>{{ title }}</h3>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "OptionContainer",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.option-container {
  box-shadow: inset 0px 0px 11px rgba(222, 197, 204, 0.7);
  border-radius: 4px;
  padding: 24px 30px 32px 30px;
  h3 {
    font-size: $ft-s-medium;
    font-weight: $ft-w-bold;
    text-align: center;
    margin-bottom: 16px;
  }
  & + .option-container {
    margin-top: 30px;
  }
}
</style>