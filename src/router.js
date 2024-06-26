import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView";
import GetPseudoView from "@/views/GetPseudoView";
import SetUpView from "@/views/SetUpView";
import GameView from "@/views/GameView";
import WaitingView from "@/views/WaitingView";
import GamepadView from "@/views/GamepadView";
import EndGameView from "@/views/EndGameView";
import NotFound from "@/views/NotFound";
import useColyseusStore from "@/store/colyseus";
import ConnectionView from "@/views/ConnectionView";
import DebugView from "@/views/DebugView";
import useGlobalStore from "@/store/global";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
            meta: { requiresDesktop: true, requiresMobile: true, requiresRoom: false, requiresDebug: false },
        },
        {
            path: "/get-pseudo",
            name: "get-pseudo",
            component: GetPseudoView,
            meta: { requiresDesktop: false, requiresMobile: true, requiresRoom: true, requiresDebug: false },
        },
        {
            path: "/setup",
            name: "setup",
            component: SetUpView,
            meta: { requiresDesktop: true, requiresMobile: false, requiresRoom: true, requiresDebug: false },
        },
        {
            path: "/game",
            name: "game",
            component: GameView,
            meta: { requiresDesktop: true, requiresMobile: false, requiresRoom: true, requiresDebug: false },
        },
        {
            path: "/room/:roomId",
            name: "connection",
            component: ConnectionView,
            meta: { requiresDesktop: false, requiresMobile: true, requiresRoom: false, requiresDebug: false },
        },
        {
            path: "/waiting",
            name: "waiting",
            component: WaitingView,
            meta: { requiresDesktop: false, requiresMobile: true, requiresRoom: true, requiresDebug: false },
        },
        {
            path: "/gamepad",
            name: "gamepad",
            component: GamepadView,
            meta: { requiresDesktop: false, requiresMobile: true, requiresRoom: true, requiresDebug: false },
        },
        {
            path: "/end-game",
            name: "end-game",
            component: EndGameView,
            meta: { requiresDesktop: true, requiresMobile: true, requiresRoom: true, requiresDebug: false },
        },
        {
            path: "/debug",
            name: "debug",
            component: DebugView,
            meta: { requiresDesktop: true, requiresMobile: true, requiresRoom: false, requiresDebug: true },
        },
        {
            path: "/:pathMatch(.*)",
            component: NotFound,
            meta: { requiresDesktop: true, requiresMobile: true, requiresRoom: false, requiresDebug: false },
        },
    ],
});

router.beforeEach((to) => {
    const storeGlobal = useGlobalStore();
    const storeColyseus = useColyseusStore();

    const isDebug = storeGlobal.isDebug;
    const isMobile = storeGlobal.isMobile;
    const hasCurrentRoom = storeColyseus.currentRoom !== null;

    const redirectNotFound = {
        path: "/404",
    };

    if (isMobile) {
        if (!to.meta.requiresMobile) {
            return redirectNotFound;
        }
    } else {
        if (!to.meta.requiresDesktop) {
            return redirectNotFound;
        }
    }

    if (to.meta.requiresRoom && !hasCurrentRoom) {
        return {
            path: "/",
        };
    }

    if (to.meta.requiresDebug && to.meta.requiresDebug !== isDebug) {
        return redirectNotFound;
    }
});

export default router;
