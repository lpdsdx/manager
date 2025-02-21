import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TaskView from '../views/TaskView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TaskView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router 