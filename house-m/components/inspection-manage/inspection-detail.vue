<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="800px" :visible.sync="inspectionDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="inspectionDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <div class="h-tab-content">
          <table class="h-table-info">
            <tr>
              <th>发送类型</th>
              <td>{{data.type}}</td>
            </tr>
            <tr>
              <th>标题</th>
              <td>{{data.title}}</td>
            </tr>
            <tr>
              <th>文件编号</th>
              <td>{{data.fileNo}}</td>
            </tr>
            <tr>
              <th>发送对象</th>
              <td>{{data.sendType?data.sendType.join('，'):''}}</td>
            </tr>
            <tr>
              <th>通知正文</th>
              <td>
                <div v-html="data.content"></div>
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
      data: {}, // 详情数据
      inspectionDetailShow: false // 弹出框开关
    };
  },
  methods: {
    // 初始化弹出框
    openModal(data) {
      this.data = data;
      this.inspectionDetailShow = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.h-tab-content {
  margin-top: 0;
}
</style>

