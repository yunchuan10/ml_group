<template>
  <div id="m-notice-detail">
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="公告详情"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <button @click="goBack" class="f-pull-right u-bread-btn">返回</button>
        </div>
      </div>
      <div>
        <div class="f-text-center title">{{title}}</div>
        <div class="f-text-center">
          <span v-show="fileNo" class="marginRight5px">文件编号：{{fileNo}}</span>
          <span  class="marginRight5px">时间：{{lastUpdated}}</span>
        </div>
        <div class="content" v-html="content"></div>
        <div>
          <ul>
            <li v-for="(item, index) in noticeInfoFileDTOList" :key="index">
              {{index + 1}}.{{item.name}}
              <a style="margin-left:5px;" :href="item.url" download>下载</a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

export default {
  data() {
    return {
      infoFromId: '',
      title: '',
      fileNo: '',
      content: '',
      lastUpdated: '',
      noticeInfoFileDTOList: []
    }
  },
  activated() {
    this.infoFromId = this.$route.query.infoFromId;
    this.noticeInfoFileDTOList = [];
    this.getDetail();
  },
  methods: {
    getDetail() {
      let params = {
        infoFromId: this.infoFromId
      }
      this.$axiosPost(API.publish_getNoticeDetail, params).then(res => {
        if (res.result == 'success' && res.data.notice) {
          this.title = res.data.notice.noticeInfoFromDTO.title;
          this.fileNo = res.data.notice.noticeInfoFromDTO.fileNo;
          this.content = res.data.notice.noticeInfoFromDTO.contentString;
          this.lastUpdated = DATEFORMAT.dateReturnYMDHMS(new Date(res.data.notice.noticeInfoFromDTO.lastUpdated));
          res.data.notice.noticeInfoFileDTOList.forEach((item) => {
            this.noticeInfoFileDTOList.push({
              name: item.fileName,
              url: item.fileUrl
            })
          })
        }
      })
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
#m-notice-detail {
  .title {
    font-size: 36px;
    margin-top: 30px;
  }
  .content {
    margin: 10px 0 20px;
  }
  .marginRight5px {
    margin-right:5px;
  }
}
</style>
