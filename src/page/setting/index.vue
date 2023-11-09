<script setup lang="ts">
import {onMounted, onUnmounted, reactive, ref} from 'vue'
import type {Ref} from 'vue'
import type {FormInstance} from 'element-plus'
import type {SettingFormInterface} from "@/api/interface";
import {getSettingsApi, restartDeviceApi, updateSettingApi} from "@/api/settings";
import {ElMessage, ElMessageBox} from "element-plus";
import {useMediaAddress} from "@/stores/userInfo";


const curDateTime = ref<Date>()
const mediaStore = useMediaAddress()
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<SettingFormInterface>({
  distanceSteel: 0,
  distanceCamera: 0,
  deviceName: "-",
  cameraAddress: "-",
  mediaAddress: "-",
  customParam: "-",
  currentDateTime: new Date(),
  deviceVersion: "-",
  algorithmVersion: "-",
  systemVersion: "-",
})

const timer: Ref<number> = ref(0);
const startTimer = async () => {
  timer.value = window.setInterval(async () => {
    ruleForm.currentDateTime = new Date()
  }, 1000)
}

const stopTimer = async () => {
  await clearInterval(timer.value)
}

onMounted(async () => {
  ruleForm.currentDateTime = new Date()
  await startTimer();
  await getSettings();
})
onUnmounted(async () => {
  await stopTimer()
})

const getSettings = async () => {
  const result = await getSettingsApi()
  if (result.data) {
    ruleForm.distanceSteel = result.data.distanceSteel
    ruleForm.distanceCamera = result.data.distanceCamera
    ruleForm.deviceName = result.data.deviceName
    ruleForm.cameraAddress = result.data.cameraAddress
    ruleForm.mediaAddress = result.data.mediaAddress
    ruleForm.customParam = result.data.customParam
    ruleForm.deviceVersion = result.data.deviceVersion
    ruleForm.algorithmVersion = result.data.algorithmVersion
    ruleForm.systemVersion = result.data.systemVersion
    mediaStore.setMediaAddress({mediaAddress: result.data.mediaAddress})
  }
}

const jumpLink = async () => {
  window.open(ruleForm.cameraAddress, "_blank")
}

const updateSettings = async () => {
  await updateSettingApi(ruleForm)
  await getSettings()
  ElMessage.success("更新成功")
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await updateSettings()
}

const restartDevice = async () => {
  //todo 重启设备
  await restartDeviceApi()
  ElMessage.success("设备已重启，请稍等片刻段继续访问")
}

const open = async () => {
  await ElMessageBox.confirm('在重启前请确认保存数据，避免数据丢失，确认重启设备吗？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: "warning",
  }).then(() => {
    restartDevice()
  }).catch(() => {
    console.log("取消")
  })
}

const modifyDateTime = async () => {
  await stopTimer()
}

</script>
<template>
  <el-card class="content-card">
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        label-width="150px"
        status-icon
    >
      <el-form-item label="设备名称：" prop="deviceName">
        <el-input v-model="ruleForm.deviceName"/>
      </el-form-item>
      <el-form-item label="磁钢-磁钢间距：" prop="distanceSteel">
        <el-input v-model="ruleForm.distanceSteel">
          <template #append>厘米</template>
        </el-input>
      </el-form-item>
      <el-form-item label="磁钢-摄像头间距：" prop="distanceCamera">
        <el-input v-model="ruleForm.distanceCamera">
          <template #append>厘米</template>
        </el-input>
      </el-form-item>
      <el-form-item label="摄像头访问地址：" prop="cameraAddress">
        <div style="width: 100%; display: flex">
          <el-input style="padding-right: 20px" v-model="ruleForm.cameraAddress"/>
          <el-button type="primary" @click="jumpLink">跳转</el-button>
        </div>
      </el-form-item>
      <el-form-item label="拉流地址：" prop="mediaAddress">
        <el-input v-model="ruleForm.mediaAddress"/>
      </el-form-item>
      <el-form-item label="参数因子：" prop="customParam">
        <el-input v-model="ruleForm.customParam"/>
      </el-form-item>
      <el-form-item label="时间设置：" prop="currentDateTime">
        <div>
          <el-date-picker
              v-model="ruleForm.currentDateTime"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              @focus="modifyDateTime"
          />
        </div>
      </el-form-item>
      <el-form-item label="设备版本号：" prop="deviceVersion">
        <el-input v-model="ruleForm.deviceVersion"/>
      </el-form-item>
      <el-form-item label="算法版本：" prop="algorithmVersion">
        <el-input v-model="ruleForm.algorithmVersion"/>
      </el-form-item>
      <el-form-item label="系统版本：" prop="systemVersion">
        <el-input v-model="ruleForm.systemVersion"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          更新配置
        </el-button>
        <el-button type="danger" @click="open">
          重启设备
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<style scoped>
.content-card {
  position: relative;
  width: 60%;
  height: calc(100vh - 52px);
}
</style>