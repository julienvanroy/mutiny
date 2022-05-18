import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView";
import ConnectionView from "@/views/ConnectionView";
import SetUpView from "@/views/SetUpView";
import GameView from "@/views/GameView";
import GamepadView from "@/views/GamepadView";
import EndGameView from "@/views/EndGameView";
import CreditsView from "@/views/CreditsView";
import NotFound from "@/views/NotFound";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/connection",
      name: "connection",
      component: ConnectionView,
    },
    {
      path: "/setup",
      name: "setup",
      component: SetUpView,
    },
    {
      path: "/game",
      name: "game",
      component: GameView,
    },
    {
      path: "/room/:roomId",
      name: "gamepad",
      component: GamepadView,
    },
    {
      path: "/end-game",
      name: "end-game",
      component: EndGameView,
    },
    {
      path: "/credits",
      name: "credits",
      component: CreditsView,
    },
    {
      path: "/:pathMatch(.*)",
      component: NotFound,
    },
  ],
});
