<template>
  <el-menu 
  :style="{width: '230px'}"
  active-text-color="#ffd04b" 
  background-color="#545c64" 
  class="aside-container" 
  default-active="2"
  text-color="#fff" 
  @open="handleOpen" 
  @close="handleClose"
  >
    <p class="logo-lg">欧阳陪诊</p>
    <TreeMenu :index="1" :menuData="menuData"/>
  </el-menu>
</template>

<script setup>
import { reactive } from 'vue';
import TreeMenu from './treeMenu.vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const menuData = reactive(router.options.routes[0].children);

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
  }
}
</style>