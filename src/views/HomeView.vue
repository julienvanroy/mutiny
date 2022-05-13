<template>
  <div class="homepage">
    <div class="credits">
      <TheButton label="Crédits" color="light" link="/credits" />
    </div>

    <div class="under">
      <img src="images/homepage/homepage-back.jpg" />
    </div>
    <div class="over">
      <div class="container">
        <h1 class="logo">Titre provisoire</h1>
        <div class="btn-container">
          <TheButton label="Créer une partie" color="light" link="/connection" />
          <TheButton label="Streamer une partie" color="dark" :disabled="true" />
        </div>
        <div class="how-to-play">
          <img src="images/homepage/how-to-play.png" />
          <div class="explanations">
            <h2>Comment jouer ?</h2>
            <p>Des joueurs autour d’un ordi, chaun avec leurs téléphones.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TheButton from "@/components/TheButton.vue";

export default {
  name: "App",
  components: { TheButton },
}
</script>

<style lang="scss" scoped>
.homepage {
  position: relative;
  width: 100%;
  height: 100vh;
  .over {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .logo {
      color: $white;
      text-align: center;
    }
    .btn-container {
      display: flex;
      justify-content: center;
      align-items: center;
      .btn + .btn {
        margin-left: 20px;
      }
    }
    .how-to-play {
      display: flex;
      justify-content: center;
      align-items: center;
      .explanations {
        max-width: 300px;
        h2 {
          font-weight: $ft-bold;
          font-size: 30px;
          letter-spacing: 0.01em;
        }
        p {
          font-size: 18px;
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
      background-color: rgba($white, 0.5);
      position: absolute;
      inset: 0;
    }
  }
  .credits {
    position: absolute;
    z-index: 10;
    top: 20px;
    left: 20px;
  }
}
</style>
