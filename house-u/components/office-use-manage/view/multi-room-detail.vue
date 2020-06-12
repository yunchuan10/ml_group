<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="1000px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <ul class="house-nav-tab">
          <li @click="pageSelect = 'basic'" :class="{'active':pageSelect=='basic'}">
            <a>基本信息</a>
          </li>
          <li @click="pageSelect = 'property'" :class="{'active':pageSelect=='property'}">
            <a>备案信息</a>
          </li>
        </ul>
        <div class="h-tab-content" v-show="pageSelect=='basic'">
          <table class="h-table-info">
            <tr>
              <td colspan="4" class="f-cancel-border f-cancel-padding-left padding0">
                <h2 class="h-table-subtitle" style="padding-top: 10px">
                  <span></span>基本详情</h2>
              </td>
            </tr>
          </table>
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">姓名</th>
              <td style="width: 200px;">{{list.realName}}</td>
              <th class="f-text-right">所属部门</th>
              <td style="word-break:break-all">{{list.deptName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">编制情况</th>
              <td>{{checkEstablish(list.establishStatusName) }}</td>
              <th class="f-text-right">办公室数量</th>
              <td>{{list.officeCount}}</td>
            </tr>
            <tr>
              <!-- <th class="f-text-right">性别</th>
              <td>{{list.sex}}</td> -->
              <th class="f-text-right">手机号</th>
              <td colspan="3">{{list.phoneNo}}</td>
            </tr>
            <tr>
              <th class="f-text-right">职务级别</th>
              <td colspan="3">{{list.dutiesLevelName || ''}}</td>
            </tr>
          </table>
          <table class="h-table-info">
            <tr>
              <td colspan="4" class="f-cancel-border f-cancel-padding-left padding0">
                <h2 class="h-table-subtitle">
                  <span></span>当前使用人员明细</h2>
              </td>
            </tr>
          </table>
          <el-table :data="roomData" stripe style="width: 100%">
            <el-table-column type="index" fixed="left" label="序号" width="50">
            </el-table-column>
            <el-table-column prop="roomNo" label="房间号">
            </el-table-column>
            <el-table-column prop="roomAddress" label="所在位置">
            </el-table-column>
            <el-table-column prop="roomTypeNameString" label="房间类型">
            </el-table-column>
            <el-table-column prop="roomName" label="房间名称">
            </el-table-column>
            <el-table-column prop="useArea" label="使用面积(m²)">
            </el-table-column>
            <el-table-column prop="userNum" label="使用人数">
            </el-table-column>
            <el-table-column prop="realName" label="当前使用人">
              <template slot-scope="scope">
                <span v-for='(item,index) in scope.row.excessivePersonResponseList' :key="index">
                  <span v-show="index > 0">，</span>{{ item.realName }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="u-detail-dialog-content" v-show="pageSelect=='property'">
          <!-- <table class="h-table-info">
            <tr>
              <td colspan="4" class="f-cancel-border f-cancel-padding-left padding0">
                <h2 class="h-table-subtitle" style="padding-top: 10px">
                  <span></span>备案情况</h2>
              </td>
            </tr>
          </table> -->
          <div class="h-tab-content" style="padding-top: 15px">
            <table class="h-table-info">
              <tr>
                <th class="f-text-right" width='100px'>情况说明</th>
                <td>{{recordList.situationDescription || ''}}</td>
              </tr>
              <tr>
                <th class="f-text-right">附件</th>
                <td>
                  <ul class="u-file">
                    <li v-for=" (item, index) in recordList.sysAttachmentInfoList" :key="index" style="idisplay:block;">{{index+1}}、{{item.name}}
                      <a class="ahover" target="_block" :href="item.url" download>下载</a>

                    </li>
                  </ul>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageSelect: '',
      roomData: [], // 房间详情数据
      handleType: '',
      list: {},
      recordList: {}, //备案集合
      userId: '', //人员id
      organId: '', //单位id
      carDetailShow: false, // 弹出框开关
      isCompany: false
    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id, gid) {
      this.carDetailShow = true;
      this.pageSelect = 'basic';
      this.userId = id;
      console.log(this.userId)
      this.organId = gid;
      this.getDetail();
    },
    getDetail() {
      let params = {
        staffId: this.userId,
      }
      this.$axiosGet(API.useManage_userDetail, params).then(res => {
        this.roomData = res.data.roomSearchResponseList;
        this.list = res.data.useUserResponse;
        if (res.data.userRecordResponse) {
          this.recordList = res.data.userRecordResponse;
        } else {
          this.recordList = {}
        }
      })
    },
    checkStatus(value) {
      if (value === 'YES') {
        return 's-state-prohibited'
      } else {
        return 's-state-success'
      }
    },
    checkStatusName(value) {
      if (value === 'YES') {
        return '超标'
      } else {
        return '不超标'
      }
    },
    checkEstablish(value) {
      if (value == 'YES') {
        return '已编制'
      } else {
        return '编制'
      }
    },

  }
};
</script>

<style lang="scss" scoped>
.h-tab-content {
  margin-top: 0;
}
</style>

