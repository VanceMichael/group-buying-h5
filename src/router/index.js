import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import GroupDetail from '../views/GroupDetail.vue'
import MyGroups from '../views/MyGroups.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '拼团活动' }
  },
  {
    path: '/group/:id',
    name: 'GroupDetail',
    component: GroupDetail,
    meta: { title: '拼团详情' }
  },
  {
    path: '/my-groups',
    name: 'MyGroups',
    component: MyGroups,
    meta: { title: '我的拼团' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '拼团活动'
  next()
})

export default router
