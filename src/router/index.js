import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
const Login = () => import('../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = () => import('../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import('../components/Welcome.vue')
// import Users from '../components/user/Users.vue'
const Users = () => import('../components/user/Users.vue')
// import Rights from '../components/power/Rights.vue'
const Rights = () => import('../components/power/Rights.vue')
// import Roles from '../components/power/Roles.vue'
const Roles = () => import('../components/power/Roles.vue')
// import Cate from '../components/goods/Cate.vue'
const Cate = () => import('../components/goods/Cate.vue')
// import Params from '../components/goods/Params.vue'
const Params = () => import('../components/goods/Params.vue')
// import List from '../components/goods/List.vue'
const List = () => import('../components/goods/List.vue')
// import Add from '../components/goods/Addgood.vue'
const Add = () => import('../components/goods/Addgood.vue')
// import Order from '../components/order/Order'
const Order = () => import('../components/order/Order')
// import Report from '../components/report/Report'
const Report = () => import('../components/report/Report')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/welcome',
    children: [
      {path: '/welcome', component: Welcome}, 
      {path: '/users', component: Users},
      {path: '/rights', component: Rights},
      {path: '/roles', component: Roles},
      {path: '/categories', component: Cate},
      {path: '/params', component: Params},
      {path: '/goods', component: List},
      {path: '/goods/add', component: Add},
      {path: '/orders', component: Order},
      {path: '/reports', component: Report},
    ]
  },
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to,from,next) => {

  if(to.path === '/login') return next();
  const tokenStr =  window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router
