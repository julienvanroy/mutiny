<template>
  <em class="stalkers-counter">
    <span>{{ count }}</span>
  </em>
</template>

<script>
export default {
  name: "StalkersCounter",
  props: {
    count: {
      count: Number,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.stalkers-counter {
  width: 32px;
  height: 32px;
  background-image: url("../../assets/gamepad/bg-stalker-nb.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  display: inline-block;

  span {
    position: absolute;
    top: 50%;
    left: 50%;
    font-weight: $ft-w-bold;
    font-size: 14px;
    letter-spacing: 0.01em;
    color: $white-beige;
    text-shadow: 1.53336px 1.15002px 0.766678px rgba(77, 8, 28, 0.2);
    transform: translate(-60%, -52%) rotate(12.35deg);
  }
}
</style>
