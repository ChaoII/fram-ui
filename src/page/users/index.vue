<script setup lang="ts">
import {reactive, ref, onMounted} from 'vue'
import {userListApi, userAddApi, userEditApi, userDeleteApi} from "@/api/users"
import {ElMessage, ElMessageBox} from "element-plus";
import type {FormInstance} from 'element-plus'

const queryParams = reactive({
  searchName: "",
  pageSize: 5,
  pageIndex: 1
})

const formAddData = reactive({
  username: "",
  password: "",
  nickname: "",
})

const formEditData = reactive({
  id: "",
  username: "",
  nickname: "",
})

const dialogAddVisible = ref(false);
const dialogEditVisible = ref(false);

const rules = reactive({
  username: [
    {required: true, message: '此项必填', trigger: 'blur'},
    {min: 2, max: 6, message: '长度必须3-10个字符之间', trigger: 'change'},
  ],

  password: [
    {required: true, message: "此项为必填", trigger: "blur"},
    {min: 6, max: 20, message: '长度必须6-20个字符之间', trigger: 'change'},
  ],
})

const userFormAdd = ref<FormInstance>()
const userFormEdit = ref<FormInstance>()
const tableHeight = ref(0); // 默认最大高度为200px
const total = ref(0)
const userList = ref([])
const myElement = ref<HTMLElement | null>(null);
const setTableHeight = async () => {
  const ele = myElement.value as HTMLElement;
  if (ele) {
    tableHeight.value = ele.offsetHeight - 200;
  }
};

onMounted(async () => {
  await setTableHeight();
})

window.addEventListener('resize', setTableHeight);

const searchList = () => {
  userListApi(queryParams).then(res => {
    if (res.data) {
      userList.value = res.data.user
      total.value = res.data.total
    }
  })
}
const addUser = () => {
  dialogAddVisible.value = true
}
// 新增提交
const submitForm = async (formEl: FormInstance | undefined) => {
  // validate
  const validated = formEl?.validate
  if (!validated) {
    return
  }
  // 表单通过请求接口
  const res = await userAddApi(formAddData)
  if (res.data) {
    // 隐藏弹窗
    dialogAddVisible.value = false
    // 清空form
    formAddData.nickname = ""
    formAddData.password = ""
    formAddData.username = ""
    // 重新更新列表
    searchList()
    ElMessage.success("新增用户成功!")
  }
}
// 修改提交
const submitEForm = async (formEl: FormInstance | undefined) => {
  const res = await formEl?.validate
  if (!res) {
    console.log(res)
    return
  }
  // 提交修改
  userEditApi(formEditData).then(res => {
    if (res.data) {
      dialogEditVisible.value = false;
      searchList()
    }
  })
}
// 数据编辑
const editRow = (row: any) => {
  const {id, username, nickname} = row
  // 展示编辑表单
  dialogEditVisible.value = true;
  formEditData.username = username
  formEditData.nickname = nickname
  formEditData.id = id
}


// 删除数据
const deleteRow = (row: any) => {
  ElMessageBox.confirm(
      '确定删除该用户吗？',
      'Warning',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    const data = {"id": row.id}
    // eslint-disable-next-line no-unused-vars
    userDeleteApi(data).then(res => {
      searchList()
      ElMessage.success("用户删除成功")
    })
  }).catch(() => {
        ElMessage.info("取消删除")
      }
  )
}

onMounted(() => {
  searchList();
})

</script>

<template>
  <el-card class="content-card">
    <div style="position: relative; height: calc(100vh - 70px)" ref="myElement">
      <el-card>
        <div class="header_query">
          <div class="input_box">
            <el-input
                v-model="queryParams.searchName"
                placeholder="搜索关键字"
                class="input-with-select"
            >
              <template #append>
                <el-button @click="searchList">
                  <el-icon>
                    <Search/>
                  </el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
          <el-button type="primary" :icon="'CirclePlus'" @click="addUser">新建</el-button>
        </div>
        <el-divider/>
        <el-table :height="tableHeight"
                  :max-height="tableHeight"
                  :data="userList"
                  style="width: 100%"
                  :table-layout="'fixed'"
                  :stripe="true">
          <el-table-column type="index" width="50"/>
          <el-table-column prop="username" label="姓名"/>
          <el-table-column prop="nickname" label="昵称"/>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button type="primary" @click="editRow(scope.row)">编辑</el-button>


                  <el-button type="danger" @click="deleteRow(scope.row)">删除</el-button>


            </template>
          </el-table-column>
          <!-- mg_state 状态 -->
        </el-table>
        <!-- 分页 -->
        <div class="users-page">
          <el-pagination
              v-model:current-page="queryParams.pageIndex"
              v-model:page-size="queryParams.pageSize"
              :page-sizes="[5,10]"
              :small="true"
              layout="total, sizes, prev, pager, next, jumper"
              :background="true"
              :total="total"
              @size-change="searchList"
              @current-change="searchList"
          />
        </div>

        <!-- 新增弹窗 -->
        <el-dialog v-model="dialogAddVisible" title="新建用户">
          <el-form
              ref="userFormAdd"
              :model="formAddData"
              :rules="rules"
              label-width="100px"
              label-position="right"
          >
            <el-form-item label="用户名：" prop="username">
              <el-input v-model="formAddData.username" placeholder="请输入用户名称"/>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <el-input type="password" v-model="formAddData.password" placeholder="请输入密码"/>
            </el-form-item>
            <el-form-item label="昵称：" prop="nickname">
              <el-input v-model="formAddData.nickname" placeholder="请输入昵称"/>
            </el-form-item>
          </el-form>
          <template #footer>
            <div>
              <el-button
                  @click="dialogAddVisible = false;formAddData.username='';formAddData.password='';formAddData.nickname=''">
                取消
              </el-button>
              <el-button type="primary" @click="submitForm(userFormAdd)">确定</el-button>
            </div>
          </template>
        </el-dialog>
        <!-- 编辑弹窗 -->
        <el-dialog v-model="dialogEditVisible" title="编辑用户">
          <el-form
              ref="userFormEdit"
              :model="formEditData"
              :rules="rules"
              label-width="100px"
              label-position="right"
          >
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="formEditData.username" placeholder="请输入用户名称"/>
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="formEditData.nickname" placeholder="请输入昵称"/>
            </el-form-item>
          </el-form>
          <template #footer>
            <div>
              <el-button>取消</el-button>
              <el-button type="primary" @click="submitEForm(userFormEdit)">确定</el-button>
            </div>
          </template>
        </el-dialog>
      </el-card>
    </div>
  </el-card>
</template>

<style scoped>
.content-card {
  width: 60%;
  height: calc(100vh - 52px);
}

.header_query {
  display: flex;
  margin: 0 0 20px 0;
}

.users-page {
  position: absolute;
  right: 20px;
  bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.input_box {
  width: 200px;
  margin-right: 10px;
}
</style>