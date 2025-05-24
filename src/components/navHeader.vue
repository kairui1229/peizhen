<template>
  <div class="header-container">
    <div class="header-left flex-box">
      <el-icon class="icon" size="20" @click="store.commit('collapseMenu')">
        <Fold />
      </el-icon>
      <!-- 页签导航 -->
      <ul class="flex-box">
        <li 
        v-for="(item,index) in selectMenu" 
        :key="item.path" 
        :class="{selected: item.path === route.path}"
        class="tab flex-box"
        >
        <el-icon size="12">
          <component :is="item.icon"></component>
        </el-icon>
        <!-- 页签导航跳转对应路由页面 -->
        <router-link class="text flex-box" :to="item.path">
          {{ item.name }}
        </router-link>
        <el-icon size="12">
          <component class="close" @click="closeTab(item,index)"><Close/></component>
        </el-icon>
        </li>
      </ul>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleCommand">
        <div class="el-dropdown-link flex-box">
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          <p class="user-name">oykr</p>
        </div>
        <template #dropdown>
            <el-dropdown-item command="cancel">退出登录</el-dropdown-item>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import {useStore} from 'vuex'
import {computed} from 'vue'
import {useRoute,useRouter} from 'vue-router'

const store = useStore()
const selectMenu = computed(() => store.state.menu.selectMenu)
const route = useRoute()
const router = useRouter()

const closeTab = (item,index) => {
  store.commit('closeMenu', item)
  //如果关闭的是非当前页
  if(item.path !== route.path){
    return
  }
  //如果关闭的是当前页
  const selectMenuData = selectMenu.value
  //如果删除的是最后一项
  if(index === selectMenuData.length){
    //如果tag只有一个元素
    if(!selectMenuData.length){
      router.push('/')
   }else{
      router.push(selectMenuData[index-1].path)
    }
  }else{
    router.push(selectMenuData[index].path)
  }
}

const handleCommand = (command) => {
  if(command === 'cancel'){
    localStorage.removeItem('pz_token')
    localStorage.removeItem('pz_userInfo')
    window.location.href = window.location.origin
  }
}
</script>

<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
  height: 100%;
}

.header-container {
  display: flex;
  justify-content: space-between;
  height: 100%;
  align-items: center;
  padding-right: 25px;
  background-color: #fff;

  .header-left {
    height: 100%;

    .icon {
      margin-right: 20px;
      width: 45px;
      height: 100%;
    }

    .icon:hover {
      background-color: #f5f5f5;
      cursor: pointer;
    }
    .tab{
      padding: 0 10px;
      height: 100%;
      .text{
        margin: 0 5px;
      }
      .close{
        visibility: hidden;
      }
      &.selected{
        a{
          color: #409eff;
        }
        i{
          color: #409eff;
        }
        background-color: #f5f5f5;
      }
    }
    .tab:hover{
      background-color: #f5f5f5;
      cursor: pointer;
      .close{
        visibility: inherit;
        cursor: pointer;
        color:#000;
      }
    }
  }

  .header-right {
    .user-name {
      margin-left: 10px;
    }
  }
  a{
    height: 100%;
    color: #333;
    font-size: 15px;
  }
}
</style>