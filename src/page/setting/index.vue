<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import type {FormInstance} from 'element-plus'
import {getSettingsApi, restartDeviceApi, updateSettingApi} from "@/api/settings";
import {ElMessage, ElMessageBox} from "element-plus";
import {InfoFilled} from '@element-plus/icons-vue'

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  autoDeleteInterval: 1,
  unit: "month",
  isEnable: true
})


onMounted(async () => {
  await getSettings();
})


const getSettings = async () => {
  const result = await getSettingsApi()
  if (result.data) {
    ruleForm.autoDeleteInterval = result.data.autoDeleteInterval
    ruleForm.unit = result.data.unit
    ruleForm.isEnable = result.data.isEnable
  }
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
  try {
    await ElMessageBox.confirm('在重启前请确认保存数据，避免数据丢失，确认重启设备吗？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: "warning",
    })
    await restartDevice()
  } catch {
    ElMessage.warning("取消重启设备")
  }
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
      <el-form-item label="自动删除时间间隔：" prop="deviceName">
        <div style="width: 100%; display: flex">

          <el-tooltip
              class="box-item"
              effect="light"
              placement="right"
              content="最小1最大10"
          >
            <el-input-number
                v-model="ruleForm.autoDeleteInterval"
                class="mx-4"
                :min="1"
                :max="10"
                controls-position="right"
            />
          </el-tooltip>
        </div>
      </el-form-item>
      <el-form-item label="单位：" prop="unit">
        <el-radio-group style="margin-right: 20px;" v-model="ruleForm.unit">
          <el-radio label="hour">时</el-radio>
          <el-radio label="day">日</el-radio>
          <el-radio label="week">周</el-radio>
          <el-radio label="month">月</el-radio>
          <el-radio label="year">年</el-radio>
        </el-radio-group>
        <el-tooltip
            class="box-item"
            effect="light"
            placement="right"
        >
          <template #content>
            选择删除打卡历史数据的时间，比如填报时间为3，单位选择天，那么系统将最多保留三天内的数据
          </template>
          <el-icon color="gray">
            <InfoFilled/>
          </el-icon>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="启用定期删除：" prop="isEnable">
        <el-switch
            v-model="ruleForm.isEnable"
            inline-prompt
            active-text="启用"
            inactive-text="停用"
        />
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