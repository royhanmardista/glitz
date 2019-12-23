import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'FrontPage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "FrontPage" */ '../views/FrontPage.vue'),
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token')) {
        next('/home')
      } else {
        next()
      }
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "Register" */ '../views/Register.vue'),
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token')) {
        next('/home')
      } else {
        next()
      }
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "Home" */ '../views/Home.vue'),
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem('token')) {
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/jobs',
    name: 'job',
    component: () => import(/* webpackChunkName: "Job" */ '../views/Jobs.vue'),
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem('token')) {
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/mycompany',
    name: 'mycompany',
    component: () => import(/* webpackChunkName: "mycompany" */ '../views/MyCompany.vue'),
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem('token')) {
        next('/')
      } else {
        next()
      }
    }
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
