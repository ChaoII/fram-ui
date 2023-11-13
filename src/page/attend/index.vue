<script setup lang="ts">

import type {Ref} from 'vue'
import {onMounted, reactive, ref} from 'vue'
import {getAttendInfosApi} from "@/api/attend";
import type {TableDataInterface, PageInterface} from "@/page/attend/interface";
import {host} from "@/utils/service";
import {InfoFilled} from "@element-plus/icons-vue";


const totalPage = ref(0)
const dateTimeStart = ref<Date>()
const dateTimeEnd = ref<Date>()

const attend_name = ref("")
const myElement = ref<HTMLElement | null>(null);
const tableHeight = ref(0); // 默认最大高度为200px
const is_show_image = ref(true)

// 动态设置表格最大高度
const setTableHeight = async () => {
  const ele = myElement.value as HTMLElement;
  if (ele) {
    tableHeight.value = ele.offsetHeight - 200;
  }
};

const queryParams: PageInterface = reactive({
  pageSize: 5,
  pageIndex: 1
});
const getAttendInfos = async () => {
  const res = await getAttendInfosApi({

    start_time: dateTimeStart.value,
    end_time: dateTimeEnd.value,
    attend_name: attend_name.value,
    pageSize: queryParams.pageSize,
    pageIndex: queryParams.pageIndex
  })
  if (res.data.attend_infos) {
    console.log(res.data.attend_infos)
    tableData.value = res.data.attend_infos;
    tableData.value.map((obj) => {
      let imgUrl_ = obj.pic_url.replace(/\\/g, '/')
      obj.pic_url = host + '/' + imgUrl_
    })
    totalPage.value = res.data.total
  } else {
    tableData.value = []
  }
}

const previewImage = (row: any) => {
  window.open(row.pic_url, "_blank")
}

const tableData: Ref<TableDataInterface[]> = ref([])
onMounted(async () => {
  await getAttendInfos()
  await setTableHeight()
})

window.addEventListener('resize', setTableHeight);


</script>
<template>
  <el-card class="content-card">
    <div style="position: relative; height: calc(100vh - 70px)" ref="myElement">
      <el-card>
        <div style="display: flex;justify-content: space-between;">
          <div style="   display: flex;">
            <div style="width: 400px; display: flex; padding-right: 10px;">
              <el-date-picker
                  v-model="dateTimeStart"
                  type="datetime"
                  placeholder="请选择开始时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DDTHH:mm:ss"
              />
              <el-text style="padding: 0 5px 0 5px">到</el-text>
              <el-date-picker
                  v-model="dateTimeEnd"
                  type="datetime"
                  placeholder="请选择结束时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DDTHH:mm:ss"
              />
            </div>
            <div>
              <el-input placeholder="请输入姓名" v-model="attend_name" clearable></el-input>
            </div>
            <div style="margin-left: 10px">
              <el-button type="primary" :icon="'Search'" @click="getAttendInfos">搜索</el-button>
            </div>
            <div style="margin-left: 10px">
              <el-checkbox v-model="is_show_image" label="显示图片" size="default" border/>
            </div>
            <div style="margin-left: 10px;  display: flex;align-items: center;">
              <el-tooltip class="box-item" placement="bottom">
                <template #content>
                  当开始时间和结束时间为空时，默认为当天0时到后一天0时，姓名为空默认搜索所有人
                </template>
                <el-icon color="rgb(64,158,255)">
                  <InfoFilled/>
                </el-icon>
              </el-tooltip>
            </div>
          </div>
        </div>
        <el-divider/>
        <el-table
            :height="tableHeight"
            :max-height="tableHeight"
            :stripe="true"
            :data="tableData"
            style="width: 100%"
        >
          <el-table-column type="index" width="50"/>
          <el-table-column prop="uid" label="工号" width="180"/>
          <el-table-column prop="name" label="姓名" width="100"/>
          <el-table-column prop="attend_time" label="打卡时间"/>
          <el-table-column prop="imgUrl" label="图片" width="90">

            <template #default="scope">
              <div v-if="is_show_image">
                <el-image :src="scope.row.pic_url" style="height: 100px;width: 100%">查看</el-image>
              </div>
              <div v-else>
                <el-button type="primary" text @click="previewImage(scope.row)">查看</el-button>
              </div>
            </template>


          </el-table-column>
        </el-table>
        <div style="position: absolute; right: 20px; bottom: 20px; display: flex;justify-content:flex-end">
          <el-pagination
              v-model:current-page="queryParams.pageIndex"
              v-model:page-size="queryParams.pageSize"
              :page-sizes="[5,10,15]"
              :small="true"
              layout="total, sizes, prev, pager, next, jumper"
              :background="true"
              :total="totalPage"
              @size-change="getAttendInfos"
              @current-change="getAttendInfos"
          />
        </div>
      </el-card>
    </div>
  </el-card>
</template>
<style scoped>

body {
  margin: 0;
}

.pre_btn_container {
  position: absolute;
  z-index: 4;
  left: 10px;
  width: 5%;
  height: 100%;
}

.next_btn_container {

  position: absolute;
  height: 100%;
  width: 5%;
  right: 5px;
  z-index: 4;
}

.text_pre_next_container {
  position: absolute;
  width: 95%;
  left: 5px;
  top: 5px;
  z-index: 4;
  display: flex;
  justify-content: space-between
}

.text_container {
  color: #ffffff;
}

.el-col_text {
  height: 30px;
  text-align: center;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-card {
  width: 60%;
  height: calc(100vh - 52px);
}

</style>

