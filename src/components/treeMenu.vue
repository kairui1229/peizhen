<template>
  <template v-for="(item, index) in props.menuData">
     <el-menu-item v-if="!item.children" 
     :index="`${props.index}-${item.meta.id}`"
     :key="`${props.index}-${item.meta.id}`"
     @click="handleClick(item,`${props.index}-${item.meta.id}`)"
     >
       <el-icon size="20">
         <component :is="item.meta.icon"></component>
       </el-icon>
       <span>{{ item.meta.name }}</span>
     </el-menu-item>

     <el-sub-menu v-else :index="`${props.index}-${item.meta.id}`">
       <template #title>
         <el-icon size="20">
           <component :is="item.meta.icon"></component>
         </el-icon>
         <span>{{ item.meta.name }}</span>
       </template>
       <tree-menu :menuData="item.children" :index="`${props.index}-${item.meta.id}`" />
     </el-sub-menu>
  </template>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps(["menuData", "index"])

const handleClick = (item, active) => {
  router.push(item.meta.path)
}

</script>

<style lang="less" scoped></style>