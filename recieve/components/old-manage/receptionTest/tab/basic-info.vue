<template>
  <div>
    <div class="reception-form">
      <div class="form-options" style="align-items: center;margin-top: 20px;">
        <h5 class="text-h5">方案号：{{tableData.planNo}}</h5>
      </div>
      <div class="h-tab-content" style="padding-bottom: 20px;">
        <el-form>
          <!-- <div class="u-left-border-title">基础信息</div> -->
          <table class="h-table-info">
            <tr>
              <th>
                任务名称
              </th>
              <td>{{tableData.name}}</td>
              <th>
                到访时间
              </th>
              <td>
                {{this.$formatDate(tableData.visitTimeStart)}}
                <span style="margin: 0 5px;">-</span>
                {{this.$formatDate(tableData.visitTimeEnd)}}
              </td>
            </tr>
            <tr>
              <th>
                来访类型
              </th>
              <td>
                <div class="f-line-h">{{tableData.visitTypeName}}</div>
              </td>
              <th>
                接待级别
              </th>
              <td>{{tableData.receptLevelName}}</td>
            </tr>
            <tr>
              <th>相关附件</th>
              <td colspan="3">
                <div class="see-file f-line-h">
                  <a
                    v-for="(item, index) in tableData.attachmentList"
                    :key="'attachmentList'+index"
                    :href="fileBeforeUrl+item.fileUrl"
                    target="_blank"
                  >{{item.fileName}}</a>
                </div>
              </td>
            </tr>

            <tr class="many-form-item">
              <th>
                来访单位
              </th>

              <td colspan="3">
                <div
                  class="many-form-flex f-line-h"
                  v-for="(item, index) in tableData.visitUnitList"
                  :key="'visitUnitList'+index"
                >
                  <div>
                    <p>单位名称：</p>
                    <span
                      :title="item.unitName"
                      class="f-text-ellipsis txt-ellipsis"
                    >{{item.unitName}}</span>
                  </div>
                  <div style="margin-left: 45px;">
                    <p>单位联系人：</p>
                    {{item.linkMan}}
                    <span style="margin: 0 10px;"></span>
                    {{item.position}}
                    <span style="margin: 0 10px;"></span>
                    {{item.phoneNo}}
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th>
                主宾信息
              </th>
              <td colspan="3">
                <div
                  class="f-line-h"
                  v-for="(item, index) in tableData.masterList"
                  :key="'masterList'+index"
                >
                  {{item.personName}}
                  <span style="margin: 0 10px;"></span>
                  {{item.unitName}}
                  <span style="margin: 0 10px;"></span>
                  {{item.position}}
                  <span style="margin: 0 10px;"></span>
                  {{item.positionLevel}}
                  <span style="margin: 0 10px;"></span>
                  {{item.sex==1? '女':'男'}}
                  <span style="margin: 0 10px;"></span>
                  {{item.phoneNo}}
                </div>
              </td>
            </tr>

            <tr>
              <th>
                来宾名单
              </th>
              <td colspan="3">
                <div
                  class="f-line-h"
                  v-for="(item, index) in tableData.followList"
                  :key="'followList'+index"
                >
                  {{item.personName}}
                  <span style="margin: 0 10px;"></span>
                  {{item.unitName}}
                  <span style="margin: 0 10px;"></span>
                  {{item.position}}
                  <span style="margin: 0 10px;"></span>
                  {{item.positionLevel}}
                  <span style="margin: 0 10px;"></span>
                  {{item.sex==1? '女':'男'}}
                  <span style="margin: 0 10px;"></span>
                  {{item.phoneNo}}
                </div>
              </td>
            </tr>

            <tr class="many-form-item">
              <th>
                接待单位
              </th>
              <td colspan="3">
                <div
                  class="many-form-flex f-line-h"
                  v-for="(item, index) in tableData.receptUnitList"
                  :key="'receptUnitList'+index"
                >
                  <div>
                    <p>单位名称：</p>
                    <span
                      :title="item.unitName"
                      class="f-text-ellipsis txt-ellipsis"
                    >{{item.unitName}}</span>
                  </div>
                  <div style="margin-left: 45px;">
                    <p>单位联系人：</p>
                    {{item.linkMan}}
                    <span style="margin: 0 10px;"></span>
                    {{item.position}}
                    <span style="margin: 0 10px;"></span>
                    {{item.phoneNo}}
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <th>
                陪同人员名单
              </th>
              <td colspan="3">
                <div v-for="(item, index) in tableData.accompanyList" :key="'accompanyList'+index">
                  {{item.personName}}
                  <!-- <p style="width: 100px;display:inline-block;">{{item.personName}}</p> -->
                  <span style="margin: 0 10px;"></span>
                  {{item.unitName}}
                  <span style="margin: 0 10px;"></span>
                  {{item.position}}
                  <span style="margin: 0 10px;"></span>
                  {{item.positionLevel}}
                  <span style="margin: 0 10px;"></span>
                  {{item.sex==1? '女':'男'}}
                  <span style="margin: 0 10px;"></span>
                  {{item.phoneNo}}
                </div>
              </td>
            </tr>
          </table>
        </el-form>
        <!-- <div class="f-text-center" style="margin-top: 15px;">
          <el-button class="u-submit-btn cancel-btn" @click="">返回</el-button>
          <el-button class="u-submit-btn submit-btn" @click="toSetMoudle">编辑</el-button>
        </div>-->
      </div>
    </div>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      tableData: {},
      id: "", //查询主键
      hasDetail: false,
      unitList: [], //  单位
      dutiesList: [] //职务级别
    };
  },
  activated() {
    this.id = this.$route.query.id;
    this.unitInfoGetList();

    this.sysDicItemGetList(); //获取下拉框
  },
  computed: {
    fileBeforeUrl() {
      return this.$store.state.mainData.fileBeforeUrl;
    }
  },
  methods: {
    getData() {
      this.$axiosGet(API.plans + `/${this.id}`).then(res => {
        if (res && res.data) {
          let data = res.data || {};
          let { masterList = [], followList = [], accompanyList = [] } = data;
          masterList = masterList.map(item => {
            this.dutiesList.forEach(duty => {
              // 级别
              if (duty.value == item.positionLevel) {
                item.positionLevel = duty.name;
              }
            });
            this.unitList.forEach(unit => {
              // 单位
              if (unit.id == item.unitId) {
                item.unitName = unit.name;
              }
            });
            return item;
          });
          followList = followList.map(item => {
            this.dutiesList.forEach(duty => {
              // 级别
              if (duty.value == item.positionLevel) {
                item.positionLevel = duty.name;
              }
            });
            this.unitList.forEach(unit => {
              // 单位
              if (unit.id == item.unitId) {
                item.unitName = unit.name;
              }
            });
            return item;
          });
          accompanyList = accompanyList.map(item => {
            this.dutiesList.forEach(duty => {
              // 级别
              if (duty.value == item.positionLevel) {
                item.positionLevel = duty.name;
              }
            });
            this.unitList.forEach(unit => {
              // 单位
              if (unit.id == item.unitId) {
                item.unitName = unit.name;
              }
            });
            return item;
          });
          data.visitTimeStart = this.$formatDate(
            data.visitTimeStart || ""
          );
          data.visitTimeEnd = this.$formatDate(
            data.visitTimeEnd || ""
          );
          this.tableData = data;
        }
      });
    },
    sysDicItemGetList() {
      let code = "/D15";
      this.$axiosGet(API.sysDicItem_getItemList + code).then(res => {
        // 编辑状态请求详情
        this.hasDetail && this.getData();
        this.hasDetail = true;
        if (res && res.data) {
          this.dutiesList = res.data.D15 || []; //职务级别
        }
      });
    },

    //  获取单位列表
    unitInfoGetList() {
      // this.loading = true;
      this.$axiosGet(API.unitInfo_getList)
        .then(res => {
          // 编辑状态请求详情
          this.hasDetail && this.getData();
          this.hasDetail = true;
          if (res && res.data) {
            this.unitList = res.data || [];
          }
        })
        .finally(() => {
          // this.loading = false;
        });
    }
  }
};
</script>
 

<style lang="scss">
.item-list {
  display: inline-block;
  width: 230px;
  text-align: center;
}

.many-form-item {
  .el-input__inner {
    width: auto;
  }
  .many-form-flex {
    display: flex;
    .many-flex-wrap {
      flex-wrap: wrap;
    }
    & > div {
      display: flex;
      align-items: stretch;

      & > p {
        width: 100px;
      }
    }

    .txt-ellipsis {
      display: inline-block;
      width: 220px;
    }
  }
  .item-add-btn {
    height: 40px;
  }
}
.see-file {
  a {
    margin-right: 30px;
  }
}
.h-table-info {
  td {
    line-height: 30px;
  }
}
</style>