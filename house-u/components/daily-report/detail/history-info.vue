<template>
  <div class="u-daily-report-history">
    <el-timeline>
      <el-timeline-item v-for="(item, index) in allCommontHis" :key="index" :timestamp="returnDataFormat(item.dateCreated)" placement="top">
        <el-card>
          <span class="z-state" :class="item.result == '上报材料'?'s-state-apply':'s-state-prohibited'">{{item.result}}</span>
          <table class="info">
            <tr>
              <th>提交人：</th>
              <td>{{item.userName}}</td>
            </tr>
            <tr class="f-vertical-align-top" v-if="item.result == '上报材料'">
              <th>附&emsp;件：</th>
              <td>
                <ul>
                  <li v-for="(file, fileIndex) in item.fileResponseList" :key="fileIndex">
                    {{fileIndex + 1}}.{{file.name}}
                    <a :href="file.url" download="download" target="_blank" style="margin-left: 20px;">下载</a>
                  </li>
                </ul>
              </td>
            </tr>
            <tr class="f-vertical-align-top" v-else>
              <th>备&emsp;注：</th>
              <td>{{item.remark}}</td>
            </tr>
          </table>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data() {
    return {
      allCommontHis: []
    }
  },
  activated() {
    this.getHistory();
  },
  computed: {
    commonReportOrganId() {
      return this.$store.state.mainData.commonReportOrganId
    }
  },
  methods: {
    // 获取历史详情
    getHistory() {
      let params = {
        id: this.commonReportOrganId
      }
      this.$axiosGet(API.commonReport_listComment, params).then(res => {
        this.allCommontHis = res.data || [];
      })
    },
    // 时间格式处理
    returnDataFormat(value) {
      if (value) {
        return `${value.substr(0, 4)}/${value.substr(5, 2)}/${value.substr(8, 2)}`
      } else {
        return ''
      }
    },
  }
}
</script>

<style lang="scss">
.u-daily-report-history {
  padding: 20px 0;
  width: 60%;
  .info {
    margin-top: 10px;
    th,
    td {
      padding: 5px 0;
      font-weight: bold;
    }
    th {
      width: 60px;
    }
  }
}
</style>
