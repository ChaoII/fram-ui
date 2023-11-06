<script setup lang="ts">
import {onMounted, onUnmounted, reactive, ref} from 'vue'
import type {Ref} from 'vue'
import type {FormInstance, UploadRawFile} from 'element-plus'
import type {GetFaceInfosInterface, SettingFormInterface} from "@/api/interface";
import {
  addFaceApi,
  faceDeleteApi,
  getFaceInfosApi,
  getSettingsApi,
  restartDeviceApi,
  updateSettingApi
} from "@/api/settings";
import {ElMessage, ElMessageBox} from "element-plus";
import {useMediaAddress} from "@/stores/userInfo";
import type {FaceInfoInterface, QueryParamInterface} from "@/page/settings/interface";
import {Search} from "@element-plus/icons-vue";
import {host} from "@/utils/service";


const faceInfo = reactive({"name": "", "uid": "", "faceFile": "", "pic_url": ""})


const dialogFormVisible = ref(false)
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

const openAddDialog = async () => {
  dialogFormVisible.value = true;
}
const cancelAddFace = async () => {
  dialogFormVisible.value = false
  await clearAddFaceInfo()
}


const beforeUpload = (rawFile) => {
  console.log(rawFile)
  faceInfo.faceFile = rawFile.raw
  faceInfo.pic_url = URL.createObjectURL(rawFile.raw)
}

const submitAdd = async () => {
  let formData = new FormData()
  console.log(faceInfo.faceFile)
  formData.append('file', faceInfo.faceFile)
  formData.append("name", faceInfo.name)
  formData.append("uid", faceInfo.uid)
  const res = await addFaceApi(formData, {"Content-Type": "multipart/form-data"})
  if (res.data) {
    dialogFormVisible.value = false;
    await getFaceInfos();
  }
}

const clearAddFaceInfo = async () => {
  faceInfo.faceFile = ""
  faceInfo.uid = ""
  faceInfo.name = ""
  faceInfo.pic_url = ""
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
            <div style="margin-left: 10px">
              <el-button type="primary" :icon="'Plus'" @click="openAddDialog">新增</el-button>
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


  <el-dialog v-model="dialogFormVisible" destroy-on-close @close="clearAddFaceInfo" title="新增人脸" width="550px">
    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
      <div style="border: 1px dashed  #ccc;">
        <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            @change="beforeUpload"
            :auto-upload="false"
        >
          <el-image v-if="faceInfo.pic_url" :src="faceInfo.pic_url" class="avatar"/>
          <el-icon v-else class="avatar-uploader-icon">
            <Plus/>
          </el-icon>
        </el-upload>
      </div>

      <div class="faceInfo">
        <el-form
            :label-position="'top'"
            label-width="100px"
            :model="faceInfo"
            style="width: 300px;"
        >
          <el-form-item label="姓名：">
            <el-input v-model="faceInfo.name" placeholder="请输入用户名"/>
          </el-form-item>
          <el-form-item label="工号：">
            <el-input v-model="faceInfo.uid" placeholder="请输入工号"/>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template #footer>
      <div class="">
        <el-button @click="cancelAddFace">取消
        </el-button>
        <el-button type="primary" @click="submitAdd">确定</el-button>
      </div>
    </template>
  </el-dialog>

</template>
<style scoped>

.content-card {
  position: relative;
  width: 60%;
  height: calc(100vh - 52px);
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.el-form-item {
  margin: 5px;
}
</style>

