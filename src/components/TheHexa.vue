<template>
  <div class="hexagon">
    <span class="top" :style="styleTop"></span>
    <span class="middle" :style="styleMiddle"></span>
    <span class="bottom" :style="styleBottom"></span>
  </div>
</template>

<script>
export default {
  name: "TheHexa",
  props: {
    color: {
      type: String,
      required: true,
    },
  },
  computed: {
    styleMiddle() {
      return "background-color: " + this.color;
    },
    styleTop() {
      return "border-bottom: 8.66px solid " + this.color;
    },
    styleBottom() {
      return "border-top: 8.66px solid " + this.color;
    },
  },
};
</script>

<style lang="scss" scoped>
.hexagon {
  position: relative;
  display: block;
  width: 30px;
  .top,
  .bottom {
    display: block;
    position: absolute;
    width: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
  }
  .top {
    bottom: 75%;
  }
  .middle {
    display: block;
    width: 30px;
    height: 17.32px;
    margin: 8.66px 0;
  }
  .bottom {
    top: 75%;
    width: 0;
  }
}
</style>
