<script setup lang="ts">
import {onMounted, onUnmounted, reactive, ref} from 'vue'
import type {Ref} from 'vue'
import type {FormInstance} from 'element-plus'
import type {GetFaceInfosInterface, SettingFormInterface} from "@/api/interface";
import {faceDeleteApi, getFaceInfosApi, getSettingsApi, restartDeviceApi, updateSettingApi} from "@/api/settings";
import {ElMessage, ElMessageBox} from "element-plus";
import {useMediaAddress} from "@/stores/userInfo";
import type {FaceInfoInterface, QueryParamInterface} from "@/page/settings/interface";
import {Search} from "@element-plus/icons-vue";
import {host} from "@/utils/service";


// const faceInfo = ref<FaceInfoInterface>({
//   name: "",
//   uid: "",
//   pic_url: "",
//   register_time: ""
// });
const totalPage = ref(0)
const queryParams = ref<GetFaceInfosInterface>({
  query_name: "",
  pageSize: 5,
  pageIndex: 1
})

const faceInfos: Ref<FaceInfoInterface[]> = ref([])

const deleteFace = async (uid: string) => {

  try {
    await ElMessageBox.confirm(
        '确定删除该用户吗？',
        'Warning',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
    )
    const data = {"uid": uid}
    // eslint-disable-next-line no-unused-vars
    const res = await faceDeleteApi(data)
    if (res) {
      await getFaceInfos()
      ElMessage.success("用户删除成功")
    }
  } catch (e) {
    ElMessage.success("取消删除")
  }
}

onMounted(async () => {
  await getFaceInfos()
})

const getFaceInfos = async () => {
  const res = await getFaceInfosApi(queryParams.value)
  if (res.data.face_infos) {
    faceInfos.value = res.data.face_infos
    totalPage.value = res.data.total
  }
}

</script>
<template>
  <el-card class="content-card">
    <div style="position: relative; height: calc(100vh - 70px)" ref="myElement">
      <el-card>
        <div style="display: flex;justify-content: space-between;">
          <div style=" display: flex;">
            <div>
              <el-input placeholder="请输入姓名" v-model="queryParams.query_name" clearable></el-input>
            </div>
            <div style="margin-left: 10px">
              <el-button type="primary" :icon="'Search'" @click="getFaceInfos">搜索</el-button>
            </div>
          </div>
        </div>
        <el-divider/>
        <div style=" display: flex; flex-wrap: wrap;overflow-y:auto;max-height: calc(100vh - 260px)">
          <div style="margin: 5px; width: calc(20% - 10px)" v-for="(faceInfo,k) in faceInfos" :key="k">
            <el-card :body-style="{ padding: '8px' }">
              <el-image :src="host + '/' + faceInfo.pic_url" style="height: 200px;width: 100%">
              </el-image>
              <el-form
                  :label-position="'right'"
                  label-width="40px"
                  :model="faceInfo"
                  style="max-width: 460px"
                  :size="'small'"
                  disabled
              >
                <el-form-item label="姓名:">
                  <el-input v-model="faceInfo.name"/>
                </el-form-item>
                <el-form-item label="工号:">
                  <el-input v-model="faceInfo.uid"/>
                </el-form-item>
                <el-form-item label="时间:">
                  <el-input v-model="faceInfo.register_time"/>
                </el-form-item>
              </el-form>
              <el-button :size="'small'" type="danger" :icon="'Delete'" @click="deleteFace(faceInfo.uid)">删除
              </el-button>
            </el-card>
          </div>
        </div>
        <div style="position: absolute; right: 20px; bottom: 20px; display: flex;justify-content:flex-end">
          <el-pagination
              v-model:current-page="queryParams.pageIndex"
              v-model:page-size="queryParams.pageSize"
              :page-sizes="[5,10,15]"
              :small="true"
              layout="total, sizes, prev, pager, next, jumper"
              :background="true"
              :total="totalPage"
              @size-change="getFaceInfos"
              @current-change="getFaceInfos"
          />
        </div>
      </el-card>
    </div>
  </el-card>
</template>
<style scoped>

.content-card {
  position: relative;
  width: 60%;
  height: calc(100vh - 52px);
}

.el-form-item {
  margin: 5px;
}
</style>

