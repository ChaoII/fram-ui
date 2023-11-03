<script setup lang="ts">
import {reactive, ref} from "vue";
import useUserInfo from "@/stores/userInfo";
import router from "@/router";
import {ElMessage} from "element-plus";
import type {FormInstance, FormRules} from "element-plus";
import {modifyPasswordApi} from "@/api/users";
import type {ModifyPasswordInterface} from "@/api/interface";
import {Platform, Histogram, User, Tools} from '@element-plus/icons-vue'

const store = useUserInfo()
const dialogModifyVisible = ref(false)
const passwordModifyForm = ref<FormInstance>()
const formAddData = ref<ModifyPasswordInterface>({
  username: store.$state.username,
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
})
const confirmPasswordValidator = (rule: any, value: any, callback: any) => {
  if (value !== formAddData.value.newPassword) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
}

const rules = reactive<FormRules<ModifyPasswordInterface>>({
  oldPassword: [
    {required: true, message: 'Please input old password', trigger: 'blur'},
    {min: 6, max: 16, message: 'Length should be 6 to 16', trigger: 'blur'},
  ],
  newPassword: [
    {required: true, message: 'Please input old password', trigger: 'blur'},
    {min: 6, max: 16, message: 'Length should be 6 to 16', trigger: 'blur'},
  ],
  confirmPassword: [
    {required: true, message: 'Please input old password', trigger: 'blur'},
    {min: 6, max: 16, message: 'Length should be 6 to 16', trigger: 'blur'},
    {validator: confirmPasswordValidator, trigger: 'blur'},
  ],
})


const modifyPassword = async () => {
  const result = await modifyPasswordApi(formAddData.value)
  console.log(result)
  if (!result.data) return
  dialogModifyVisible.value = false
  // 清空form
  formAddData.value.oldPassword = ""
  formAddData.value.newPassword = ""
  formAddData.value.confirmPassword = ""
  // 重新更新列表
  ElMessage.success("修改密码成功，请重新登录!")
  await logout()
}

const submitForm = async (formEl: FormInstance | undefined) => {
  const isValid = await formEl?.validate()
  if (!isValid) {
    return
  }
  await modifyPassword()
}
const logout = async () => {
  store.removeToken()
  await router.push("/login")
}

</script>

<template>
  <div class="outer">
    <div class="layout_header_container">
      <div class="layout_header_left center">
        <el-text type="primary" style="font-size: 26px; font-weight: bold">火车车厢智能识别系统</el-text>
      </div>
      <div class="layout_header_center center">
        <el-menu class="menu center"
                 :default-active="$route.path"
                 :router="true"
                 mode="horizontal"
                 background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b"
        >
          <el-menu-item index="/index">
            <el-icon>
              <Platform/>
            </el-icon>
            实时展示
          </el-menu-item>
          <el-menu-item index="/users">
            <el-icon>
              <User/>
            </el-icon>
            用户管理
          </el-menu-item>
          <el-menu-item index="/setting">
            <el-icon>
              <Tools/>
            </el-icon>
            参数设置
          </el-menu-item>
        </el-menu>
      </div>
      <div class="layout_header_right center">
        <el-popover placement="bottom" trigger="click" :width="100" popper-style="padding: 0px;"
                    popper-class="customPopper">
          <template #default>
            <div class="center btn-content">
              <div class="popper_btn">
                <el-button type="primary" link icon="Key" @click="dialogModifyVisible=true">修改密码</el-button>
              </div>
              <div class="popper_btn">
                <el-button type="primary" link icon="SwitchButton" @click="logout">退出登录</el-button>
              </div>
            </div>
          </template>
          <template #reference>
            <el-button type="primary" icon="Avatar" link>{{ store.$state.username }}</el-button>
          </template>
        </el-popover>
        <el-dialog v-model="dialogModifyVisible" title="修改密码">
          <el-form
              ref="passwordModifyForm"
              :model="formAddData"
              :rules="rules"
              label-width="180px"
              label-position="right"
          >
            <el-form-item label="旧密码：" prop="oldPassword">
              <el-input type="password" v-model="formAddData.oldPassword" placeholder="请输入旧密码"/>
            </el-form-item>
            <el-form-item label="新密码：" prop="newPassword">
              <el-input type="password" v-model="formAddData.newPassword" placeholder="请输入新密码"/>
            </el-form-item>
            <el-form-item label="确认新密码：" prop="confirmPassword">
              <el-input type="password" v-model="formAddData.confirmPassword" placeholder="请重复新密码"/>
            </el-form-item>
          </el-form>
          <template #footer>
            <div>
              <el-button
                  @click="dialogModifyVisible = false;formAddData.oldPassword='';formAddData.newPassword='';formAddData.confirmPassword=''">
                取消
              </el-button>
              <el-button type="primary" @click="submitForm(passwordModifyForm)">确定</el-button>
            </div>
          </template>
        </el-dialog>
      </div>
    </div>
    <div class="main center">
      <router-view></router-view>
    </div>
  </div>
</template>


<style lang="scss">
body {
  margin: 0;
}

.el-popper.customPopper {
  min-width: 60px !important;
}

.popper_btn {
  padding: 5px 0 5px 0;
}

.btn-content {
  padding: 10px 0 10px 0;
  flex-direction: column;
}

.header {
  background: #545c64;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 100%;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.layout_header_container {
  background: #545c64;
  width: 100%;
  height: 50px;
  display: flex;
}

.layout_header_left {
  width: 20%;
  background: #545c64;
}

.layout_header_center {
  width: 60%;
  background: #545c64;
}

.layout_header_right {
  width: 20%;
  background: #545c64;
}

.outer {
  height: 100vh;
  padding: 0;
  margin: 0;
}

.menu {
  width: 100%;
  height: 52px;
}
</style>