<template>
  <div class="player-card">
    <img :src="img" alt="" />
    <p>{{ name }}</p>
  </div>
</template>

<script>
export default {
  name: "PlayerCard",
  props: {
    color: {
      type: String,
      required: true,
      //add validator
    },
    name: {
      type: String,
      required: true,
    },
    large: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    img() {
      switch (this.color) {
        default:
          return "/playerCard/purple.png";
      }
    },
  },
  mounted() {
    console.log(this);
  },
};
</script>

<style lang="scss" scoped>
.player-card {
  position: relative;
  background-image: url("../../assets/playerCard/background.png");
  background-repeat: no-repeat;
  background-size: 90%;
  background-position: 12px 12px;
  overflow: visible;
  width: 240px;
  height: 111px;

  p {
  }
}
</style>
