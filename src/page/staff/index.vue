<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import type {GetFaceInfosInterface} from "@/api/interface";
import {addFaceApi, faceDeleteApi, getFaceInfosApi} from "@/api/staff";
import {ElMessage, ElMessageBox} from "element-plus";
import type {FaceInfoInterface} from "@/page/staff/interface";
import {host} from "@/utils/service";


const dialogFormVisible = ref(false)
const totalPage = ref(0)
const faceInfos = ref<FaceInfoInterface[]>()
const queryParams = ref<GetFaceInfosInterface>({
  query_name: "",
  pageSize: 5,
  pageIndex: 1
})

const addFaceInfo = reactive({
  faceFile: "",
  name: "",
  uid: "",
  pic_url: ""
})


const deleteFace = async (index_id: string) => {
  try {
    await ElMessageBox.confirm(
        '确定删除该用户吗？',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
    )
    const data = {"index_id": index_id}
    // eslint-disable-next-line no-unused-vars
    const res: any = await faceDeleteApi(data)
    if (res.code == 0) {
      await getFaceInfos()
      ElMessage.success("删除人脸成功")
    } else {
      ElMessage.error("删除人脸超时失败")
    }
  } catch (e) {
    ElMessage.success("取消删除")
  }
}

onMounted(async () => {
  await getFaceInfos()
})

const getFaceInfos = async () => {
  const res: any = await getFaceInfosApi(queryParams.value)
  console.log(res)
  if (res.code == 0) {
    faceInfos.value = res.data.face_infos
    totalPage.value = res.data.total
  }
}

const openAddDialog = async () => {
  dialogFormVisible.value = true;
}
const cancelAddFace = async () => {
  dialogFormVisible.value = false
}


const beforeUpload = (rawFile: any) => {
  addFaceInfo.faceFile = rawFile.raw
  addFaceInfo.pic_url = URL.createObjectURL(rawFile.raw)
}

const submitAdd = async () => {
  let formData = new FormData()
  console.log(addFaceInfo.faceFile)
  formData.append('file', addFaceInfo.faceFile)
  formData.append("name", addFaceInfo.name)
  formData.append("uid", addFaceInfo.uid)
  const res = await addFaceApi(formData, {"Content-Type": "multipart/form-data"})
  if (res.data) {
    dialogFormVisible.value = false;
    await getFaceInfos();
  } else {
    dialogFormVisible.value = false;
    ElMessage.error("添加人脸失败")
  }
}

const clearAddFaceInfo = async () => {
  addFaceInfo.uid = ""
  addFaceInfo.name = ""
  addFaceInfo.pic_url = ""
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
              <el-button :size="'small'" type="danger" :icon="'Delete'" @click="deleteFace(faceInfo.index_id)">删除
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
          <el-image v-if="addFaceInfo.pic_url" :src="addFaceInfo.pic_url" class="avatar"/>
          <el-icon v-else class="avatar-uploader-icon">
            <Plus/>
          </el-icon>
        </el-upload>
      </div>

      <div class="faceInfo">
        <el-form
            :label-position="'top'"
            label-width="100px"
            :model="addFaceInfo"
            style="width: 300px;"
        >
          <el-form-item label="姓名：">
            <el-input v-model="addFaceInfo.name" placeholder="请输入用户名"/>
          </el-form-item>
          <el-form-item label="工号：">
            <el-input v-model="addFaceInfo.uid" placeholder="请输入工号"/>
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

