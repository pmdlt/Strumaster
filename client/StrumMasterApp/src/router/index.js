// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: '/debug',
        name: 'Debug Motors',
        component: () => import('@/views/Debug.vue')
      },
      {
        path: '/play-notes',
        name: 'Play Notes',
        component: () => import('@/views/Notes.vue')
      },
      {
        path: '/play-song',
        name: 'Play Song',
        component: () => import('@/views/Song.vue')
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
