import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CharacterView from '../views/CharacterView.vue'
import ListView from '../views/ListView.vue'
import characterList from "../components/CharacterList"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/lolicon',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Lolicon'
      }
    },
    {
      path: '/',
      name: 'list',
      component: ListView,
      meta: {
        title: 'Card List'
      }
    },
    {
      path: '/:name',
      name: 'viewer',
      component: CharacterView,
      beforeEnter: (to, from, next) => {
        if (to.params.name in characterList) next()
        else next(import.meta.env.BASE_URL)
      },
      meta: {
        title: route => `${route.params.name.replace('Avatar_', '').replace('Monster_', '')}`
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = typeof to.meta.title === 'function'
    ? to.meta.title(to)
    : to.meta.title
  next()
})

export default router
