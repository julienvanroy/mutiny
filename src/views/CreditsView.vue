<template>
  <div class="credits">
    <div class="back">
      <router-link to="/"
        ><img src="images/icons/arrow-back.png" />back to home</router-link
      >
    </div>
    <div class="under">
      <img src="images/background.png" />
    </div>
    <div class="over">
      <h1>Crédits</h1>
      <ul>
        <li class="subtitle">Design</li>
        <li>Marie-Liesse</li>
        <li>Vincent</li>
        <li class="subtitle">Développement</li>
        <li>An</li>
        <li>Julien</li>
        <li>Morgane</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreditsView",
};
</script>

<style lang="scss" scoped>
.credits {
  position: relative;
  width: 100%;
  height: 100vh;
  .back {
    position: absolute;
    z-index: 20;
    top: 20px;
    left: 20px;
    a {
      display: flex;
      align-items: center;
    }
  }
  .over {
    position: absolute;
    z-index: 14;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    text-align: center;
    h1 {
      font-size: $ft-s-xlarge;
    }
    ul {
      padding: 0;
      li {
        list-style: none;
        font-weight: $ft-w-medium;
        font-size: $ft-s-small;
        &.subtitle {
          font-weight: $ft-w-bold;
          margin-top: 20px;
        }
      }
    }
  }
  .under {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &:after {
      content: "";
      display: block;
      background-color: rgba($white, 0.6);
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
}
</style>
