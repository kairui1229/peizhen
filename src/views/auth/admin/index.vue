<template>
  <panelHead :route="route" />

  <el-table :data="tableData.list" style="width: 100%;">
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="permissions_id" label="所属组别">
      <template #default="scope">
        {{ permissionName(scope.row.permissions_id) }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号" />
    <el-table-column prop="active" label="状态">
      <template #default="{ row }">
        <el-tag :type="row?.active ? 'success' : 'danger'">
          {{ row?.active ? '正常' : '失效' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="创建时间">
      <template #default="scope">
        <div class="flex-box">
          <el-icon>
            <Clock />
          </el-icon>
          <span style="margin-left: 10px;">{{ scope.row.create_time }}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination v-model:current-page="pageData.pageNum" :page-size="pageData.pageSize" :background="false"
    layout="total, prev, pager, next" :total="tableData.total" @size-change="handleSizeChange"
    @current-change="handleCurrentChange" />

  <el-dialog v-model="dialogVisible" :before-close="beforeClose" title="添加权限" width="500px">
    <el-form ref="formRef" label-width="100px" label-position="left" :model="form" :rules="rules">
    <el-form-item label="手机号" prop="mobile">
      <el-input v-model="form.mobile" disabled></el-input>
    </el-form-item>
    <el-form-item label="昵称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="菜单权限" prop="permissions_id">
      <el-select v-model="form.permissions_id" placeholder="请选择菜单权限" style="width: 240px">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
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
import { authAdmin, menuSelectList,updateUser } from '@/api'
import { reactive, onMounted, ref } from 'vue';
import dayjs from 'dayjs'
import { Clock } from '@element-plus/icons-vue'
import {useRoute} from 'vue-router'

const route = useRoute()

const pageData = reactive({
  pageNum: 1,
  pageSize: 10
})

const tableData = reactive({
  list: [],
  total: 0
})

const options = ref([])
const authAdminData = async () => {
  const { data: { data } } = await authAdmin(pageData)
  const { list, total } = data
  list.forEach(el => {
    el.create_time = dayjs(el.create_time).format('YYYY-MM-DD')
  })
  tableData.list = list
  tableData.total = total
}
onMounted(async () => {
  authAdminData()
  menuSelectList().then(({ data }) => {
    options.value = data.data
  })
})

const permissionName = (id) => {
  const data = options.value.find(el => el.id === id)
  return data ? data.name : "超级管理员"
}

const handleSizeChange = (val) => {
  pageData.pageSize = val
  authAdminData()
}

const handleCurrentChange = (val) => {
  pageData.pageNum = val
  authAdminData()
}

//弹窗
const dialogVisible = ref(false)
const beforeClose = () => {
  dialogVisible.value = false
}
const open = (row) => {
  dialogVisible.value = true
  form.name = row.name
  form.mobile = row.mobile
  form.permissions_id = row.permissions_id
}

//表单
const formRef = ref(null)
const form = reactive({
  name: '',
  mobile: '',
  permissions_id: ''
})
const rules = reactive({
  name: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
  ],
  permissions_id: [
    { required: true, message: '请选择菜单权限', trigger: 'blur' },
  ],
})

const confirm = async (formRef) => {
  if (!formRef) return
  await formRef.validate((valid, fields) => {
    if (valid) {
      const {name, permissions_id} = form
      updateUser({name, permissions_id}).then(({data}) =>{
        if(data.code === 10000){
          dialogVisible.value = false
          authAdminData()
        } else {
          ElMessage.error(data.msg)
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style lang="less" scoped>
.flex-box {
  display: flex;
  align-items: center;
}
</style>