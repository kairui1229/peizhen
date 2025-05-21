<template>
  <el-menu 
  :style="{width: !isCollapse ? '230px' : '64px'}"
  active-text-color="#ffd04b" 
  background-color="#545c64" 
  class="aside-container" 
  :default-active="activeMenu"
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
import { reactive } from 'vue';
import TreeMenu from './treeMenu.vue';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const route = useRoute();
const activeMenu = computed(() => route.path); 

const router = useRouter()
const menuData = reactive(router.options.routes[0].children);
const store = useStore()
const isCollapse = computed(() => store.state.menu.isCollapse)

const handleOpen = (key, keyPath) => {
  
}
const handleClose = (key, keyPath) => {
  
}
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