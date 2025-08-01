const localData = JSON.parse(localStorage.getItem('pz'))

const state = localData ? localData.menu :{
  isCollapse: false,
  // ✅ 优先从本地恢复
  selectMenu: JSON.parse(localStorage.getItem('selectMenu')) || [],
  routerList: [],
  menuActive: '1-1',
}

const mutations = {
  collapseMenu(state) {
    state.isCollapse = !state.isCollapse
  },
  addMenu(state, payload) {
    if (state.selectMenu.findIndex(item => item.path === payload.path) === -1) {
      state.selectMenu.push(payload)
      // ✅ 加入持久化
      localStorage.setItem('selectMenu', JSON.stringify(state.selectMenu))
    }
  },

  closeMenu(state, payload) {
    const index = state.selectMenu.findIndex(item => item.name === payload.name)
    state.selectMenu.splice(index, 1)
    // ✅ 更新持久化
    localStorage.setItem('selectMenu', JSON.stringify(state.selectMenu))
  },

  dynamicMenu(state, payload) {
    //通过glob导入文件
    const moudles = import.meta.glob('/src/views/**/**/*.vue')
    function routerSet(router){
       router.forEach(route => {
         if(!route.children){
           const url = `/src/views${route.meta.path}/index.vue`
           route.component = moudles[url]
         }else{
           routerSet(route.children)
         }
       });
    }
    routerSet(payload)
    state.routerList = payload
  },

  updateMenuActive(state, payload) {
    state.menuActive = payload
  }
}

export default {
    state,  
    mutations
}


