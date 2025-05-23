import { createApp } from 'vue'
import './style.css'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import panelHead from './components/panelHead.vue'
import App from './App.vue'

//刷新后动态路由添加
const localData = localStorage.getItem('pz')
if (localData) {
  store.commit('dynamicMenu',JSON.parse(localData).menu.routerList)
  store.state.menu.routerList.forEach(item => {
    router.addRoute('main',item)
  })
}

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('pz_token')
  if (to.path !== '/login' && !token) {
    next('/login')
  }
  else if(to.path === '/login' && token) {
    next('/')
  }
  else {
    next()
  }
})

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router)
app.use(store)
app.use(ElementPlus)
app.component('panelHead', panelHead)
app.mount('#app')
