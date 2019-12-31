import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'FrontPage',
    component: () => import( /* webpackChunkName: "FrontPage" */ '../views/FrontPage.vue'),    
  },
  {
    path: '/register',
    name: 'register',
    component: () => import( /* webpackChunkName: "Register" */ '../views/Register.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import( /* webpackChunkName: "Home" */ '../views/Home.vue')
  },
  {
    path: '/jobs',
    name: 'job',
    component: () => import( /* webpackChunkName: "Job" */ '../views/Jobs.vue')
  },
  {
    path: '/mycompany',
    name: 'mycompany',
    component: () => import( /* webpackChunkName: "mycompany" */ '../views/MyCompany.vue'),
    children: [{
      path: ':id',
      name: 'Post',
      component: () => import( /* webpackChunkName: "Post" */ '../components/AddJobForm.vue')
    }]
  },
  {
    path: '/company/update',
    name: 'UpdateCompany',
    component: () => import( /* webpackChunkName: "UpdateCompany" */ '../components/UpdateCompany.vue')
  },
  {
    path: '/jobs/:id',
    name: 'JobDetail',
    component: () => import( /* webpackChunkName: "JobDetail" */ '../components/JobDetail.vue')
  },
  {
    path: '/jobs/update/:id',
    name: 'JobUpdate',
    component: () => import( /* webpackChunkName: "JobUpdate" */ '../components/UpdateJobForm.vue')
  },
  {
    path: '/company/:id',
    name: 'CompanyDetail',
    component: () => import( /* webpackChunkName: "CompanyDetail" */ '../components/CompanyDetail.vue')
  },
  {
    path: '/profile/:id',
    name: 'UserDetail',
    component: () => import( /* webpackChunkName: "UserDetail" */ '../components/UserDetail.vue')

  },
  {
    path: '/profile/update/:id',
    name: 'UserUpdate',
    component: () => import( /* webpackChunkName: "UpdateUserDetail" */ '../components/UpdateUserDetail.vue')
  },
  {
    path: '/applications/:id',
    name: 'UserApplication',
    component: () => import( /* webpackChunkName: "UserApplication" */ '../components/UserApplication.vue')
  },
  {
    path: '/favorites',
    name: 'UserFavorite',
    component: () => import( /* webpackChunkName: "UserFavorite" */ '../components/UserFavorite.vue')
  },
  {
    path: '/company',
    name: 'Company',
    component: () => import( /* webpackChunkName: "Company" */ '../views/Company.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.fullPath == '/register' || to.path == '/') {
    if (!localStorage.getItem('token')) {
      next()
    } else {
      next('/home')
    }
  } else {
    if (localStorage.getItem('token')) {
      next()
    } else {
      next('/register')
    }
  }
})

export default router
