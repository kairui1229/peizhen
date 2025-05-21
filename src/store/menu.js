const state = {
  isCollapse: false,
  selectMenu: [],
}

const mutations = {
  collapseMenu(state) {
    state.isCollapse = !state.isCollapse
  },
  addMenu(state, payload) {
    //对数据进行去重
    if(state.selectMenu.findIndex(item => item.path === payload.path) === -1){
      state.selectMenu.push(payload)
    }
  },
  closeMenu(state, payload) {
    //找到索引
    const index = state.selectMenu.findIndex(item => item.name === payload.name)
    state.selectMenu.splice(index, 1)
  }
}

export default {
    state,  
    mutations
}