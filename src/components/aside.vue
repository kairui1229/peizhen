<template>
  <el-menu 
  :style="{width: !isCollapse ? '230px' : '64px'}"
  active-text-color="#ffd04b" 
  background-color="#545c64" 
  class="aside-container" 
  :default-active="$route.path"
  :default-openeds="openedMenus"
  :router="true"
  text-color="#fff" 
  @open="handleOpen" 
  @close="handleClose"
  :collapse="isCollapse"
  :collapse-transition="false"
  >
    <p class="logo-lg">{{ !isCollapse ? '欧阳陪诊' : '欧阳'}}</p>
    <TreeMenu :menuData="menuData"/>
  </el-menu>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import TreeMenu from './treeMenu.vue';

const route = useRoute()
const router = useRouter()
//const menuData = reactive(router.options.routes[0].children);
const menuData = computed(() => store.state.menu.routerList)
const store = useStore()
const isCollapse = computed(() => store.state.menu.isCollapse)

const handleOpen = (key, keyPath) => {
  
}
const handleClose = (key, keyPath) => {
  
}
// 获取需要默认展开的父级菜单路径
const openedMenus = computed(() => {
  return route.matched.slice(0, -1).map(item => item.path);
});
</script>

<style lang="less" scoped>
.aside-container {
  height: 100%;
  background-color: #545c64;
  .logo-lg {
    text-align: center;
    color: #fff;
    font-size: 20px;
    height: 50px;
    line-height: 50px;
    font-weight: 700;
  }
}
</style>