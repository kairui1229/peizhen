<template>
  <el-button @click="dialogVisible = true">打开</el-button>
  <el-dialog
  v-model="dialogVisible"
  :before-close="beforeClose"
  title="添加权限"
  width="500px"
  >
    <el-form
    ref="formRef"
    label-width="100px"
    label-position="left"
    :model="form"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写权限名称"></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="permissions">
        <el-tree 
         ref="treeRef"
         style="max-width: 600px"
         :data="treeData"
         show-checkbox
         node-key="id"
         :default-checked-keys="defaultKeys"
        />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref,reactive,onMounted } from 'vue'
import {userGetmenu} from '@/api'

const dialogVisible = ref(false)

const form = reactive({
  name: '',
  permissions: '',
})

//树形菜单数据
const treeData = ref([])
onMounted(async() => {
  const {data:{data}} = await userGetmenu()
  treeData.value = data
})

const beforeClose = () => {
  dialogVisible.value = false
}

//默认选中权限
const defaultKeys = ref([4,5])

const treeRef = ref(null)

</script>

<style lang="scss" scoped>

</style>