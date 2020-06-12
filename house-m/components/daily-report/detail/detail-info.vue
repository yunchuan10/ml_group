<template>
  <div class="u-common-reprt">
    <div class="title">{{data.title}}</div>
    <div v-html="data.content"></div>
    <table>
      <tr>
        <th>上报时间：</th>
        <td>{{checkTime(data.startTime)}}至{{checkTime(data.endTime)}}</td>
      </tr>
      <tr>
        <th class="f-vertical-align-top">上报单位：</th>
        <td>{{data.reportOrganName}}</td>
      </tr>
      <tr>
        <th class="f-vertical-align-top">上报模板：</th>
        <td>
          <ul>
            <li v-for="(item, index) in data.fileResponse" :key="index">
              {{item.name}}
              <a style="margin-left:20px;" :href="item.url" target="_blank" download="download">下载</a>
            </li>
          </ul>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  computed: {
    commonReportId() {
      return this.$store.state.mainData.commonReportId;
    }
  },
  data() {
    return {
      data: {
        title: '',
        content: '',
        startTime: '',
        endTime: '',
        organName: '',
        fileResponse: []
      }
    }
  },
  activated() {
    this.getDetail();
  },
  methods: {
    // 时间格式
    checkTime(value) {
      if (value) {
        // return DATEFORMAT.dateReturn(new Date(value))
        return value.substr(0, 10)
      }
    },
    // 获取详情
    getDetail() {
      let params = {
        id: this.commonReportId
      }
      this.$axiosGet(API.commonReport_getSettingDetail, params).then(res => {
        this.data = { ...res.data }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.u-common-reprt {
  padding: 20px 10%;
  div {
    margin-bottom: 10px;
  }
  .title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
  tr {
    th {
      padding-bottom: 10px;
      width: 70px;
    }
    td {
      padding-bottom: 10px;
    }
  }
}
</style>