<template>
  <div class="end-game">
    <div class="under">
      <img src="images/background.jpg" />
    </div>
    <div class="over">
      <h1>The End</h1>
      <div class="end-container">
        <ul>
          <li><img src="images/players/win.png" /><span>Joueur n°1</span></li>
          <li>
            <img src="images/players/player.png" /><span>Joueur n°2</span>
          </li>
          <li>
            <img src="images/players/player.png" /><span>Joueur n°3</span>
          </li>
          <li>
            <img src="images/players/player.png" /><span>Joueur n°4</span>
          </li>
        </ul>
        <div class="links">
          <TheButton label="Replay" color="dark" link="/setup" />
          <TheButton label="Home" color="light" link="/" />
          <TheButton label="Credits" color="light" link="/credits" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TheButton from "@/components/TheButton.vue";

export default {
  name: "EndGameView",
  components: { TheButton },
};
</script>

<style lang="scss" scoped>
.end-game {
  position: relative;
  width: 100%;
  height: 100vh;
  .over {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    h1 {
      font-size: 50px;
    }
    .end-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-width: 680px;
      ul {
        li {
          list-style: none;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          img {
            width: 40px;
            margin: 0 30px;
          }
          span {
            font-weight: $ft-bold;
            margin-left: 10px;
            font-size: 20px;
          }
          &:first-of-type {
            img {
              width: 100px;
              margin: 0;
            }
            span {
              font-size: 30px;
            }
          }
          & + li {
            margin-top: 20px;
          }
        }
      }
      .links {
        .btn + .btn {
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
