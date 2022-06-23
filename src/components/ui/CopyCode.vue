<template>
  <TheInput class="copy-code" ref="input" :model-value="code" readonly>
    <button @click="copy"></button>
  </TheInput>
</template>

<script>
import TheInput from "./TheInput.vue";
export default {
  components: { TheInput },
  name: "CopyCode",
  props: {
    code: {
      type: String,
      required: true,
    },
  },
  methods: {
    copy() {
      this.$refs.input.$refs.myinput.focus();
      document.execCommand("copy");
    },
  },
};
</script>

<style lang="scss" scoped>
.copy-code {
  position: relative;
  background-image: url("../../assets/code/background.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 200px;
  height: 50px;
  padding: 0 0 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  input {
    width: calc(100% - 52px);
    height: 100%;
    background-color: transparent;
    padding: 0;
    border: 0;
    color: $white;
    font-size: $ft-s-xsmall;
    &:focus {
      outline: none;
    }
  }
  button {
    background-image: url("../../assets/code/copy.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border: none;
    background-color: transparent;
    width: 64px;
    height: 100%;
    @media (any-hover: hover) {
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
