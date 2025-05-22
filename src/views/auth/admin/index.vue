<template>
  <div>
admin
  </div>
</template>

<script setup>
import { authAdmin } from '@/api'
import { reactive,onMounted } from 'vue';

const pageData = reactive({
  pageNum: 1,
  pageSize: 10
})
onMounted(() => {
  authAdmin(pageData).then(({data}) => {
    console.log(data,111)
  })
})
</script>

<style lang="scss" scoped>

</style>