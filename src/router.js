import {createRouter, createWebHistory} from 'vue-router'
import GameView from "@/views/GameView";
import NotFound from "@/views/NotFound";
import HomeView from "@/views/HomeView";


export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/game',
            name: 'game',
            component: GameView
        },
        {
            path: '/:pathMatch(.*)',
            component: NotFound
        }
    ]
})
