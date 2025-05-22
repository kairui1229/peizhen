const state = {
  isCollapse: false,
  // ✅ 优先从本地恢复
  selectMenu: JSON.parse(localStorage.getItem('selectMenu')) || []
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
  }
}

export default {
    state,  
    mutations
}