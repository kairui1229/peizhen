<template>
  <el-row class="login-container" justify="center" align="middle">
    <el-card style="max-width: 480px;">
      <template #header>
        <div class="card-header">
          <img :src="imgUrl" alt="">
        </div>
      </template>
      <div class="jump-link">
        <el-link type="primary" @click="handleChange">
          {{ formType ? '返回登录' : '立即注册' }}
        </el-link>
      </div>
      <el-form 
      :model="loginForm" 
      style="max-width: 600px" 
      class="demo-ruleForm" 
      :rules="rules"
      ref="loginFormRef"
      >
        <el-form-item prop="userName">
          <el-input v-model="loginForm.userName" placeholder="手机号" prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input v-model="loginForm.passWord" type="password" placeholder="密码" prefix-icon="Lock" />
        </el-form-item>
        <el-form-item v-if="formType" prop="validCode">
          <el-input v-model="loginForm.validCode" placeholder="验证码" prefix-icon="Key">
            <template #append>
              <span @click="countdownChange">{{ countdown.validText }}</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :style="{ width: '100%' }" @click="submitForm(loginFormRef)">
            {{ !formType ? '登录' : '注册' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-row>
</template>

<script setup>
import { reactive, ref,computed,toRaw } from "vue"
import { ElMessage } from 'element-plus'
import { getCode,userAuthentication,userLogin,menuPermissions } from '@/api'
import { useRouter } from "vue-router"
import { useStore } from "vuex"

const imgUrl = new URL('../../../public/login-head.png', import.meta.url).href
const router = useRouter()
const store = useStore()

const loginForm = reactive({
  userName: '',
  passWord: '',
  validCode: ''
})

//账号校验规则
const validateUser = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入手机号'))
  } else {
    const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
    if (!phoneReg.test(value)) {
      callback(new Error('手机号格式不正确'))
    } else {
      callback()
    }
  }
}
//密码校验规则
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    const reg = /^[a-zA-Z0-9_-]{4,16}$/
    if (!reg.test(value)) {
      callback(new Error('密码格式不正确,长度在4到16之间,只能包含字母、数字、下划线、减号'))
    } else {
      callback()
    }
  }
}
const rules = reactive({
  userName: [{ validator: validateUser, trigger: 'blur' }],
  passWord: [{ validator: validatePass, trigger: 'blur' }],
})

//切换表单（0和1）
const formType = ref(0)
//点击切换登录和注册
const handleChange = () => {
  formType.value = formType.value ? 0 : 1
}

//发送短信
const countdown = reactive({
  validText: '获取验证码',
  time: 60
})
let flag = false
const countdownChange = () => {
  //防止重复点击
  if (flag) return
  //判断手机号是否正确
  const phoneReg = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
  if (!loginForm.userName || !phoneReg.test(loginForm.userName)) {
    return ElMessage({
      message: '手机号格式不正确',
      type: 'error',
    })
  }
  const time = setInterval(() => {
    countdown.time--
    countdown.validText = `剩余${countdown.time}s`
    if (countdown.time <= 0) {
      countdown.validText = '重新获取'
      countdown.time = 60
      flag = false
      clearInterval(time)
    }
  }, 1000)
  flag = true
  getCode({ tel: loginForm.userName }).then(({ data }) => {
     if(data.code === 10000){
       ElMessage.success('验证码发送成功')
     }
  })
}

//提交表单
const loginFormRef = ref(null)
const routerList = computed(() =>store.state.menu.routerList)
const submitForm = async(formEl) => {
  if(!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      //注册页面
      if (formType.value) {
         userAuthentication(loginForm).then(({ data }) =>{
           if(data.code === 10000){
             ElMessage.success('注册成功,请登录')      
             formType.value = 0
           }else{
             ElMessage.error(data.message)
           }
         })
      }else{
        //登录页面
        userLogin(loginForm).then(({ data }) =>{
          if(data.code === 10000){
            ElMessage.success('登录成功')
            localStorage.setItem('pz_token',data.data.token)
            localStorage.setItem('pz_userInfo',JSON.stringify(data.data.userInfo))
            menuPermissions().then(({ data }) =>{
              store.commit('dynamicMenu',data.data)
              toRaw(routerList.value).forEach(item => {             
                router.addRoute('main',item)
              })
              router.push('/')
            })
          }else{
            ElMessage.error(data.message)
          }
        })
      }      
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style lang="less" scoped>
:deep(.el-card__header) {
  padding: 0;
}

html,
body,
#app {
  height: 100%;
  margin: 0;
}

.login-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .card-header {
    background-color: #899fe1;

    img {
      width: 430px;
    }
  }

  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}

span {
  cursor: pointer;
  color: #409eff;
}
</style>
