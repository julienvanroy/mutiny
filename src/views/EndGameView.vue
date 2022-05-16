<template>
  <div class="end-game">
    <div class="under">
      <img src="images/background.jpg" />
    </div>
    <div class="over">
      <h1>The End</h1>
      <div class="end-container">
        <ul>
          <!-- TODO: replace image, points & name with real players datas -->
          <li class="winner">
            <div class="points">
              <img src="images/players/green-win.png" />
              <span>12</span>
            </div>
            <span class="name">Joueur n°1</span>
          </li>
          <li>
            <div class="points">
              <img src="images/players/blue.png" />
              <span>12</span>
            </div>
            <span class="name">Joueur n°2</span>
          </li>
          <li>
            <div class="points">
              <img src="images/players/red.png" />
              <span>12</span>
            </div>
            <span class="name">Joueur n°3</span>
          </li>
          <li>
            <div class="points">
              <img src="images/players/yellow.png" />
              <span>12</span>
            </div>
            <span class="name">Joueur n°4</span>
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
          .points {
            position: relative;
            img {
              width: 60px;
              margin: 0 30px;
            }
            span {
              font-weight: $ft-bold;
              font-size: 20px;
              color: $white;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -60%);
            }
          }
          .name {
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

          &.winner {
            .points {
              span {
                transform: translate(-20%, -30%);
              }
            }
            .name {
              margin-left: 30px;
            }
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
