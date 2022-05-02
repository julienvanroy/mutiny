import { createRouter, createWebHistory } from "vue-router";
import GameView from "@/views/GameView";
import GamepadView from "@/views/GamepadView";
import NotFound from "@/views/NotFound";
import HomeView from "@/views/HomeView";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
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
      path: "/:pathMatch(.*)",
      component: NotFound,
    },
  ],
});
