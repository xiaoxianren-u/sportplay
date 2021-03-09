import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入login组件
import Login from '../components/Login.vue'
// 导入
import Home from '../components/Home.vue'

import Welcome from '../components/Welcome.vue'
import UserList from '../components/admin/UserList.vue'

// 路由
Vue.use(VueRouter)

  const routes = [
    {
      path:"/",
      redirect:"/login"
    },
    {
      path:"/login",
      component:Login
    },
    {
      path:"/home",
      component:Home,
      redirect:"/welcome",
      children:[
        {path:"/welcome",component:Welcome,},     //都是二级目录
        {path:"/user",component:UserList,}
      ]

    },
    
]

const router = new VueRouter({
  routes
})
// 出现问题的时候使用
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location,onResolve,onReject){
  if(onResolve || onReject){
    return originalPush.call(this,location,onResolve,onReject)
  }
  return originalPush.call(this,location).catch(err =>err)
}



// 挂在路由导航守卫
router.beforeEach((to,from,next)=>{
  // to将要访问
  // from从哪访问
  // next接着干next（url）重定向到url上next（）继续访问to路径

  if(to.path =='/login') return next();
  // 获取user
  const userFlag = window.sessionStorage.getItem("User");//是login.vue中的session ..setItem()   用来提取当前用户信息
  if(!userFlag) return next('/login');//无值，返回登录页面
  next();//符合要求你  放行
})

export default router
