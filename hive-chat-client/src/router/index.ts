import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'
import Room from '@/views/Room.vue';
import Route from './Route'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  Route.withPath("/:roomParam?", Home)
    .withName("home")
    .withProps()
    .build(),
  Route.withPath("/room/:roomId/:user", Room)
    .withName("room")
    .withProps()
    .build()
]

const router = new VueRouter({
  routes
})

export default router
