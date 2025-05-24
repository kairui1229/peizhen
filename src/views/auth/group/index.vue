<template>
  <panelHead/>
  <el-button @click="open(null)" style="margin-bottom: 10px;margin-top: 10px" type="primary">+ 新增</el-button>
  <el-table :data="tableData.list" style="width: 100%;">
    <el-table-column prop="id" label="id"/>
    <el-table-column prop="name" label="昵称"/>
    <el-table-column prop="permissionName" label="菜单权限" width="700"/>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
   <el-pagination
      v-model:current-page="pageData.pageNum"
      :page-size="pageData.pageSize"
      :background="false"
      layout="total, prev, pager, next"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
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
import { ref,reactive,onMounted, nextTick} from 'vue'
import {userGetmenu,userSetMenu,menuList} from '@/api'

const dialogVisible = ref(false)

const form = reactive({
  name: '',
  permissions: '',
  id: ''
})

const tableData = reactive({
  list: [],
  total: 0
})

const open = (row = null) => {
  dialogVisible.value = true
  nextTick(() => {
    if (row) {
      form.id = row.id || ''
      form.name = row.name || ''
      treeRef.value.setCheckedKeys(row.permissions || [])
    } else {
      form.id = ''
      form.name = ''
      treeRef.value.setCheckedKeys([])
    }
  })
}

const pageData = reactive({
  pageNum: 1,
  pageSize: 10
})

const handleSizeChange = (val) => {
  pageData.pageSize = val
  getListData()
}

const handleCurrentChange = (val) => {
  pageData.pageNum = val
  getListData()
}

//请求列表数据
const getListData = async () => {
  const {data:{data}} = await menuList(pageData)
  const {list,total} = data
  tableData.list = list
  tableData.total = total
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
  formRef.value.resetFields()//重置表单
  treeRef.value.setCheckedKeys([])//重置树形菜单
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
  if(!valid.value)return
  await formRef.validate((valid, fields) => {
    if(valid) {
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
      userSetMenu({name:form.name,permissions,id:form.id}).then(({data}) => {
        console.log(data);
        beforeClose()
        getListData()
      })
    }else{
      console.log('error submit!', fields)
    }
  })
}

</script>

<style lang="scss" scoped>

</style>