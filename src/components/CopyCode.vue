<template>
  <div class="copy-code">
    <input
      class="input"
      type="text"
      v-on:focus="$event.target.select()"
      ref="myinput"
      readonly
      :value="this.code"
    />
    <button @click="copy"></button>
  </div>
</template>

<script>
export default {
  name: "CopyCode",
  props: {
    code: {
      type: String,
      required: true,
    },
  },
  methods: {
    copy() {
      this.$refs.myinput.focus();
      document.execCommand("copy");
    },
  },
};
</script>

<style lang="scss" scoped>
.copy-code {
  position: relative;
  background-image: url("../assets/code/background.png");
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
    background-image: url("../assets/code/copy.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border: none;
    background-color: transparent;
    width: 52px;
    height: 100%;
    @media (any-hover: hover) {
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
