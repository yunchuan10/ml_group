<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="800px" :visible.sync="detailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="detailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <div class="h-tab-content f-cancel-margin-top">
          <table class="h-table-info" v-for="(item, index) in useList" :key="index">
            <tr>
              <td colspan="4" class="f-cancel-border f-cancel-padding-left">
                <h2 class="h-table-subtitle">
                  <span></span>当前使用情况</h2>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">姓名</th>
              <td style="width: 200px;">{{item.realName}}</td>
              <th class="f-text-right">所在部门</th>
              <td style="word-break:break-all">{{item.deptName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">职务级别</th>
              <td style="width: 200px;">{{item.dutiesLevelName}}</td>
              <th class="f-text-right">职务名称</th>
              <td style="word-break:break-all">{{item.dutyName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">编制情况</th>
              <td style="width: 200px;">{{item.established}}</td>
              <th class="f-text-right">标准面积</th>
              <td style="word-break:break-all">{{item.standardArea ? item.standardArea+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">房间号</th>
              <td style="width: 200px;">{{item.roomNo}}</td>
              <th class="f-text-right">房间位置</th>
              <td style="word-break:break-all">{{item.roomAddress}}</td>
            </tr>
            <tr>
              <th class="f-text-right">实际分摊面积</th>
              <td style="width: 200px;">{{item.realShareArea ? item.realShareArea+'㎡': ''}}</td>
              <th class="f-text-right">超标面积</th>
              <td style="word-break:break-all">{{item.excessiveArea ? item.excessiveArea+'㎡': ''}}</td>
            </tr>
          </table>
          <table class="h-table-info" v-for="(item, index) in historrUseList" :key="index">
            <tr v-if="index == '0'">
              <td colspan="4" class="f-cancel-border f-cancel-padding-left">
                <h2 class="h-table-subtitle">
                  <span></span>历史超标情况</h2>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">姓名</th>
              <td style="width: 200px;">{{item.realName}}</td>
              <th class="f-text-right">所在部门</th>
              <td style="word-break:break-all">{{item.deptName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">职务级别</th>
              <td style="width: 200px;">{{item.dutiesLevelName}}</td>
              <th class="f-text-right">职务名称</th>
              <td style="word-break:break-all">{{item.dutyName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">编制情况</th>
              <td style="width: 200px;">{{item.established}}</td>
              <th class="f-text-right">标准面积</th>
              <td style="word-break:break-all">{{item.standardArea ? item.standardArea+'㎡': ''}}</td>
            </tr>
            <tr>
              <th class="f-text-right">房间号</th>
              <td style="width: 200px;">{{item.roomNo}}</td>
              <th class="f-text-right">房间位置</th>
              <td style="word-break:break-all">{{item.roomAddress}}</td>
            </tr>
            <tr>
              <th class="f-text-right">实际分摊面积</th>
              <td style="width: 200px;">{{item.realShareArea ? item.realShareArea+'㎡': ''}}</td>
              <th class="f-text-right">超标面积</th>
              <td style="word-break:break-all">{{item.excessiveArea ? item.excessiveArea+'㎡': ''}}</td>
            </tr>
          </table>
          <table class="h-table-info">
            <tr>
              <td colspan="4" class="f-cancel-border f-cancel-padding-left">
                <h2 class="h-table-subtitle">
                  <span></span>备案信息</h2>
              </td>
            </tr>
            <tr>
              <th>超标原因</th>
              <th>备案时间</th>
              <th>附件</th>
            </tr>
            <tr v-for="(item, index) in historyList" :key="index">
              <td class="f-text-center">{{item.excessiveReason}}</td>
              <td class="f-text-center">{{checkTime(item.dateCreated)}}</td>
              <td class="f-text-center">
                <ul class="u-file">
                  <li v-for=" (flie, fileIndex) in item.fileResponse" :key="fileIndex" style="display:block;">
                    <a class="ahover" download :href="flie.url">{{fileIndex+1}}、{{flie.name}}</a>
                  </li>
                </ul>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detailShow: false, // 弹出框开关
      useList: [],
      historrUseList: [],
      historyList: []
    };
  },
  methods: {
    checkTime(time) {
      if (time) {
        return time.substr(0,10);
      } else {
        return '';
      }
    },
    openModal(userId) {
      this.detailShow = true;
      this.getDetail(userId);
    },
    getDetail(userId) {
      let params = {
        userId: userId
      }
      this.$axiosPost(API.warning_detail, params).then(res => {
        if (res.result == 'success') {
          if (res.data.his.length > 1) {
            this.historrUseList = res.data.his.slice(0, res.data.his.length - 1);
            this.useList = res.data.his.slice(res.data.his.length - 1, res.data.his.length);
          } else {
            this.historrUseList = [];
            this.useList = res.data.his;
          }
          this.historyList = res.data.back || []
        }
      })
    }
  }
};
</script>

<style lang="scss">
</style>

