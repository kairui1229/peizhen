<template>
  <panelHead :route="route"></panelHead>
  <div class="btns">
    <el-button @click="open(null)" style="margin-bottom: 10px;margin-top: 10px" type="primary">+ 新增</el-button>
     <el-popconfirm
    confirm-button-text="确定"
    cancel-button-text="取消"
    width="220"
    :icon="InfoFilled"
    icon-color="#626AEF"
    title="是否确认删除？"
    @confirm="confirmEvent"
  >
    <template #reference>
      <el-button type="danger">删除</el-button>
    </template>
  </el-popconfirm>
  </div>
  <el-dialog
  v-model="dialogVisible"
  :before-close="beforeClose"
  title="添加陪护师"
  width="500px"
  >
  <el-form
    ref="formRef"
    label-width="100px"
    label-position="left"
    :model="form"
    :rules="rules">

    <el-form-item v-show="false" prop="id">
      <el-input v-model="form.id"></el-input>
    </el-form-item>
    <el-form-item label="昵称" prop="name">
      <el-input v-model="form.name" placeholder="请输入昵称"></el-input>
    </el-form-item>
    <el-form-item label="头像" prop="avatar">
      <el-button v-if="!form.avatar" type="primary" @click="dialogImgVisible = true">点击上传</el-button>
      <el-image v-else :src="form.avatar" style="width: 100px; height: 100px;"></el-image>
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-select v-model="form.sex" placeholder="请选择">
        <el-option label="男" value="1"></el-option>
        <el-option label="女" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="年龄" prop="age">
      <el-input-number v-model="form.age" :min="18" :max="60"></el-input-number>
    </el-form-item>
    <el-form-item label="手机号" prop="mobile">
      <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
    </el-form-item>
    <el-form-item label="是否生效" prop="active">
      <el-radio-group v-model="form.active">
        <el-radio :value="0">失效</el-radio>
        <el-radio :value="1">生效</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
  <template #footer>
    <div class="dialog-footer">
      <el-button type="primary" @click="confirm(formRef)">确认</el-button>
    </div>
  </template>
  </el-dialog>
  <el-table :data="tableData.list" style="width: 100%;" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="id" label="ID" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="avatar" label="头像" >
      <template #default="scope">
        <el-image :src="scope.row.avatar" style="width: 50px; height: 50px;"></el-image>
      </template>
    </el-table-column>
    <el-table-column prop="sex" label="性别"  >
      <template #default="scope">
        {{ scope.row.sex === 1 ? '男' : '女' }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号" />
    <el-table-column prop="active" label="状态"  >
      <template #default="scope">
        <el-tag :type="scope.row.active === 1 ? 'success' : 'danger'">
          {{ scope.row.active === 1 ? '生效' : '失效' }}
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

  <el-dialog
  v-model="dialogImgVisible"
  :before-close="beforeClose"
  title="选择头像"
  width="680px"
  >
  <div class="image-list">
    <div 
    v-for="(item,index) in fileList" 
    :key="item.name" 
    class="img-box" 
    @click="selectIndex = index"
    >
      <div v-if="selectIndex === index" class="select">
        <el-icon coloe="#fff"><Check /></el-icon>
      </div>
      <el-image style="width: 148x; height: 148px;" :src="item.url"></el-image>
    </div>
  </div>
  <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogImgVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmImage">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref,onMounted, nextTick} from 'vue'
import {photoList,companion,companionList,deleteCompanion} from '@/api'
import { Check, InfoFilled} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import {useRoute} from 'vue-router'

const route = useRoute()

onMounted(() => {
  photoList().then(({data}) => {
    fileList.value = data.data
  })
  getListData()
})

const fileList = ref([])
const selectIndex = ref(0)
const dialogVisible = ref(false)
const dialogImgVisible = ref(false)
const beforeClose = () => {
  dialogVisible.value = false
  formRef.value.resetFields()
}
const formRef = ref(null)
const form = reactive({
  "id": "",
  "mobile": "",
  "active": 1,
  "age": 28,
  "avatar": "",
  "name": "",
  "sex": ""
})
const rules = reactive({
  name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  avatar: [{ required: true, message: '请选择头像'}],
  sex: [{ required: true, message: '请选择性别'}],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
})

const confirm = async (formRef) => {
  if (!formRef) return
  await formRef.validate((valid) => {
    if (valid) {
      companion(form).then(({data}) => {
        if(data.code === 10000){
          ElMessage.success('创建成功')
          beforeClose()
          getListData()
        }else{
          ElMessage.error(data.message)
        }
      })
    }
  })
}
const confirmImage = () => {
  form.avatar = fileList.value[selectIndex.value].url
  dialogImgVisible.value = false
}

const open = (row = {}) => {
  dialogVisible.value = true
  nextTick(() => {
    if (row) {
      Object.assign(form, row)
    }
  })
}

const pageData = reactive({
  pageNum: 1,
  pageSize: 10
})

const tableData = reactive({
  list: [],
  total: 0
})

const getListData = () => {
  companionList(pageData).then(({data}) => {
    const {list,total} = data.data
    list.forEach(el => {
    el.create_time = dayjs(el.create_time).format('YYYY-MM-DD')
     })
    tableData.list = list
    tableData.total = total
  })
}

const handleSizeChange = (val) => {
  pageData.pageSize = val
  getListData()
}

const handleCurrentChange = (val) => {
  pageData.pageNum = val
  getListData()
}

const selectTableData = ref([])
const handleSelectionChange= (val) => {
  selectTableData.value = val.map(el =>({id: el.id }))
}

const confirmEvent = () => {
  if(!selectTableData.value.length){
    ElMessage.warning('请至少选择一个数据')
    return
  }else{
    deleteCompanion({id: selectTableData.value}).then(({data}) => {
      if(data.code === 10000){
        ElMessage.success('删除成功')
        getListData()
      }else{
        ElMessage.error(data.message)
      }
    })
  }
}
</script>

<style lang="less" scoped>
.btns {
    padding: 10px 0 10px 10px;
    background-color: #fff;
}
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>