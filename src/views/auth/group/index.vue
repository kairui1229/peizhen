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
    :rules="rules"
    >
      <el-form-item v-show="false" prop="id">
        <el-input v-model="form.id"></el-input>
      </el-form-item>
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
         default-expand-all="true"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(formRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref,reactive,onMounted } from 'vue'
import {userGetmenu,userSetMenu,menuList} from '@/api'

const dialogVisible = ref(false)

const form = reactive({
  name: '',
  permissions: '',
  id: ''
})

const pageData = reactive({
  pageNum: 1,
  pageSize: 10
})
//请求列表数据
const getListData = async () => {
  const {data:{data}} = await menuList(pageData)
  console.log(data);
}

//树形菜单数据
const treeData = ref([])
onMounted(async() => {
  const {data:{data}} = await userGetmenu()
  treeData.value = data
  getListData()
})

const beforeClose = () => {
  dialogVisible.value = false
}

//默认选中权限
const defaultKeys = ref([4,5])

const treeRef = ref(null)
const formRef = ref(null)

const rules = {
  name: [
    { required: true, message: '请填写权限名称', trigger: 'blur' },
  ],
}

const valid = ref(true)
const confirm = async (formRef) => {
  if(!valid)return
  await formRef.validate((valid, fields) => {
    if(valid) {
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
      userSetMenu({name:form.name,permissions,id:form.id}).then(({data}) => {
        console.log(data);
      })
      dialogVisible.value = false
    }else{
      console.log('error submit!', fields)
    }
  })
}

</script>

<style lang="scss" scoped>

</style>