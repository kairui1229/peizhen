<template>
  <panelHead :route="route" style="margin-bottom: 20px"></panelHead>
  <div class="form">
    <el-form :model="searchForm" inline>
       <el-form-item prop="out_trade_no">
        <el-input v-model="searchForm.out_trade_no" placeholder="请输入订单号" />
       </el-form-item>
       <el-form-item>
        <el-button type="primary" @click="searchEvent">查询</el-button>
       </el-form-item>
    </el-form>
  </div>
  <el-table :data="tableData.list">
    <el-table-column prop="out_trade_no" label="订单号" width="150" fixed="left"></el-table-column>
    <el-table-column prop="hospital_name" label="就诊医院"></el-table-column>
    <el-table-column prop="service_name" label="陪诊服务"></el-table-column>
    <el-table-column label="陪护师">
      <template #default="scope">
        <el-image style="width:40px; height: 40px" :src="scope.row.companion.avatar" />
      </template>
    </el-table-column>
    <el-table-column label="陪护师手机号" width="120">
      <template #default="scope">
        {{ scope.row.companion.mobile }}
      </template>
    </el-table-column>
    <el-table-column prop="price" label="总价"></el-table-column>
    <el-table-column prop="paidPrice" label="已付"></el-table-column>
    <el-table-column label="下单时间" width="120">
      <template #default="scope">
        {{ dayjs(scope.row.order_start_time).format('YYYY-MM-DD') }}
      </template>
    </el-table-column>
    <el-table-column prop="" label="订单状态">
      <template #default="scope">
        <el-tag :type="statusMap(scope.row.trade_state)">{{ scope.row.trade_state }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="service_state" label="接单状态"></el-table-column>
    <el-table-column prop="tel" label="联系人手机号" width="120"></el-table-column>
    <el-table-column label="操作" width="100" fixed="right">
      <template #default="scope">
        <el-popconfirm 
        v-if="scope.row.trade_state === '待服务'"
        confirm-button-text="确定" 
        cancel-button-text="取消" 
        width="220" 
        :icon="InfoFilled"
        icon-color="#626AEF" 
        title="是否确认完成？" 
        @confirm="confirmEvent(scope.row.out_trade_no)"
        >
          <template #reference>
            <el-button type="primary" link>服务完成</el-button>
          </template>
        </el-popconfirm>
        <el-button v-else type="primary" link disabled>暂无服务</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination v-model:current-page="pageData.pageNum" :page-size="pageData.pageSize" :background="false"
    layout="total, prev, pager, next" :total="tableData.total" @size-change="handleSizeChange"
    @current-change="handleCurrentChange" />
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { adminOrder,orderStatus } from '@/api'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { InfoFilled} from '@element-plus/icons-vue'

const route = useRoute()
console.log(route);

onMounted(() => {
  getListData()
})

const pageData = reactive({
  pageNum: 1,
  pageSize: 10
})
const tableData = reactive({
  list: [],
  total: 0
})

const getListData = (id={}) => {
  adminOrder({...pageData, ...id}).then(({ data: { data } }) => {
    const { list, total } = data
    tableData.list = list
    tableData.total = total
  })
}

const statusMap = (key) => {
  const obj = {
    '已取消': 'info',
    '待支付': 'warning',
    '已完成': 'success',
    '待服务': 'primary'
  }
  return obj[key] || 'danger'
}

const confirmEvent = (id) => {
  orderStatus({id}).then(({data}) => {
    if(data.code === 10000){
      getListData()
    }
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

const searchForm = reactive({
  out_trade_no: '',
})
const searchEvent = () => {
  searchForm.out_trade_no = searchForm.out_trade_no.trim()
  getListData(searchForm)
}
</script>

<style lang="less" scoped>
.form{
  display: flex;
  justify-content: flex-end;
  padding:10px 0 10px 10px;
  background-color: #fff;
}
</style>