<template>
  <panelHead :route="route"></panelHead>
</template>

<script setup>
import {reactive, onMounted} from 'vue'
import {adminOrder} from '@/api'
import {useRoute} from 'vue-router'

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

const getListData = () => {
  adminOrder(pageData).then(({data:{data}}) => {
    const {list,total} = data
    tableData.list = list
    tableData.total = total
  })
}

</script>

<style lang="scss" scoped>

</style>