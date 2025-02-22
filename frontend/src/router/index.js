import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TaskView from '../views/TaskView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: '首页'
      }
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TaskView,
      meta: {
        title: '任务列表'
      }
    }
  ]
})

// 改进导航守卫
router.beforeEach((to, from, next) => {
  // 设置文档标题
  document.title = to.meta.title ? `${to.meta.title} - 任务管理系统` : '任务管理系统'
  next()
})

export default router 