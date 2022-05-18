<template>
  <div class="credits">
    <div class="back">
      <router-link to="/"
        ><img src="images/icons/arrow-back.png" />back to home</router-link
      >
    </div>
    <div class="under">
      <img src="images/background.jpg" />
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

<style lang="scss" scoped>
.credits {
  position: relative;
  width: 100%;
  height: 100vh;
  .back {
    position: absolute;
    z-index: 10;
    top: 20px;
    left: 20px;
    a {
      display: flex;
      align-items: center;
    }
  }
  .over {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    text-align: center;
    h1 {
      font-size: 50px;
    }
    ul {
      padding: 0;
      li {
        list-style: none;
        font-weight: $ft-medium;
        font-size: 18px;
        &.subtitle {
          font-weight: $ft-bold;
          margin-top: 20px;
        }
      }
    }
  }
  .under {
    position: relative;
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
      inset: 0;
    }
  }
}
</style>
