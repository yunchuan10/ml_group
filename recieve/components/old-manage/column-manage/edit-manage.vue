<template>
  <div>
    <section class="m-main edit-manage-wrap">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="栏目管理" :item="['栏目管理','编辑栏目',`${tabTitle}`]"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <div class="f-pull-right u-bread-btn" style="border-color:#E6E6EE;" @click="back">
            <a style="color:#000;">返回</a>
          </div>
        </div>
      </div>

      <div class="tab-wrap">
        <ul class="house-nav-tab">
          <li v-for="(item, index) in tabList" :key="index" :class="item.columnName == tabTitle?'active':''" @click="columnTabClick(item.columnId, index, item.columnName)">
            <a>{{item.columnName}}</a>
          </li>
        </ul>

        <div class="edit-manage-add f-pull-right" v-if="tabType !== 'defaultTable'" @click="contentAddClick">
          <i class="iconfont icon-jia" style="font-size:14px;"></i>新增
        </div>
      </div>

      <div v-if="tabType == 'defaultTable'" class="f-clearfix">
        <div class="f-pull-left">
          <ul style="margin-top:10px;">
            <li v-for="(item, index) in childColumnLi" :key="index" class="f-inline-block default-child-column" :class="item.childColumnName == childColumnTab?'default-active':''" @click="childColumnClick(item, index)">{{item.childColumnName}}</li>
            <!-- <li class="f-inline-block default-child-column" :class="'default-active'">子栏目一</li>
            <li class="f-inline-block default-child-column">子栏目二</li> -->
          </ul>
        </div>
        <div class="edit-manage-column-add f-pull-right" @click="contentAddClick">
          <i class="iconfont icon-jia" style="font-size:14px;"></i>新增
        </div>
      </div>

      <div class="resource-wrap">
        <!-- 查询条件部分 -->
        <div class="m-search" v-if="tabType == 'img'">
          <table>
            <tr>
              <td>
                <ul class="f-clearfix">
                  <li>
                    <span>名称</span>
                    <el-input clearable v-model="name" placeholder="请输入"></el-input>
                  </li>

                  <li>
                    <span>地区</span>
                    <el-select v-model="areaName" filterable clearable placeholder="全部">
                      <el-option label="全部" :value="''"></el-option>
                      <el-option v-for="item in areaNameList" :key="item.areaId" :label="item.areaName" :value="item.areaId">
                      </el-option>
                    </el-select>
                  </li>
                </ul>
              </td>

              <!--搜索按钮-->
              <td class="u-search-but">
                <el-button class="f-search-but" @click="getDataRequest">查询</el-button>
              </td>
            </tr>
          </table>
        </div>

        <!-- 图表内容展示 -->
        <div class="content-wrap">
          <el-tabs v-if="tabType == 'img'">
            <table-info :reception="tabData" :eventList="eventList" @onEvent="onEvent"></table-info>
          </el-tabs>

          <!-- 自然地理 -->
          <div v-if="tabType == 'table'">
            <div class="h-table f-relative">
              <el-table :data="list" style="width: 100%">
                <el-table-column label="地域名称" width="200">
                  <template slot-scope="scope">{{scope.row.geographyName}}</template>
                </el-table-column>

                <el-table-column label="行政级别" width="150">
                  <template slot-scope="scope">{{scope.row.geographyLevel}}</template>
                </el-table-column>

                <el-table-column label="内容简介">
                  <template slot-scope="scope">{{scope.row.geographyBrief}}</template>
                </el-table-column>

                <el-table-column label="操作" width="180">
                  <template slot-scope="scope">
                    <a @click="tableDetail(scope.row.geographyId, tabTitle)">详情</a>
                    <a @click="tableEdit(scope.row.geographyId, tabTitle)">编辑</a>
                    <a @click="tableDelete(scope.row.geographyId)">删除</a>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <!-- 新增的子栏目 -->
          <div v-if="tabType == 'defaultTable'">
            <div class="h-table f-relative">
              <el-table :data="defaultList" style="width: 100%">
                <el-table-column fixed="left" label="序号" width="60" type="index">
                  <template></template>
                  <!-- <template slot-scope="scope">{{$serialUtils(pageSize, page, scope.row.num)}}</template> -->
                </el-table-column>

                <el-table-column label="内容名称" width="200">
                  <template slot-scope="scope">{{scope.row.childColumnDetailName}}</template>
                </el-table-column>

                <el-table-column label="内容简介">
                  <template slot-scope="scope">{{scope.row.childColumnDetail}}</template>
                </el-table-column>

                <el-table-column label="操作" width="180">
                  <template slot-scope="scope">
                    <a @click="tableDetail(scope.row.childColumnDetailId, tabTitle)">详情</a>
                    <a @click="tableEdit(scope.row.childColumnDetailId, tabTitle)">编辑</a>
                    <a @click="tableDelete(scope.row.childColumnDetailId)">删除</a>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <div class="h-table-bottom f-clearfix">
            <div class="h-table-pages f-pull-right">
              <div class="block">
                <el-pagination v-if="tabType == 'img'" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[12, 24, 36]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
                <el-pagination v-if="tabType == 'defaultTable'" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 详情弹出框 -->
    <column-detail ref="columnDetail"></column-detail>
    <!-- 信息提示语 -->
    <Y-Prompt v-model="tipShow" :isBol="isBol" :message="message" @click="YTipClick"></Y-Prompt>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" :title='YConfirmTitle' :message="message" @click="YDeleteClick"></Y-Confirm>
  </div>
</template>

<script>
import columnDetail from "@/components/column-manage/column-detail" // 详情信息页
import tableInfo from "@/components/resource-manage/resource-info/table-info" // 图片表格信息

export default {
  components: {
    'column-detail': columnDetail,
    "table-info": tableInfo
  },
  data() {
    return {
      areaId: '0100102',
      defaultList: [],
      columnId: '', // 栏目id
      rowId: '',  //单条记录id
      childColumnId: '',//子栏目id
      tipShow: false, // 消息弹框提示
      isBol: true,
      message: '', // 消息弹框提示语
      YConfirmShow: false, // 删除弹出框
      YConfirmTitle: '', // 弹出框标题
      tabList: [],
      tabType: '', // tab类型
      tabIndex: 0,
      tabTitle: '',
      name: '',
      areaName: '', // 地区
      areaNameList: [],
      eventList: [ // 图片列表的操作事件
        {
          name: 'detail',
          title: '详情'
        }, {
          name: 'edit',
          title: '编辑'
        }, {
          name: 'delete',
          title: '删除'
        }
      ],
      tabData: [],
      list: [],
      total: 0, // 数据总数
      pageSize: 12, // 数据最大值
      page: 1, // 当前页
      childColumnLi: [], // 子栏目数据
      childColumnTab: '', // 子栏目名称
      childColumnTabId: '', // 子栏目id
    };
  },
  activated() {
    this.tabTitle = this.$route.query.title;
    this.columnId = this.$route.query.columnId;
    this.childColumnId = this.$route.query.id;
    this.getDataDuty();
    this.getAreaFacade();
    this.tabTypeData(this.columnId)
    // if (this.tabTitle == '视察点' || this.tabTitle == '山水风光' || this.tabTitle == '风味美食' || this.tabTitle == '自然地理') {
    //   this.tabTypeData(this.columnId);
    //   // this.getDataRequest();
    // } else {
    //   this.columnTabClick(this.columnId, 0, this.tabTitle);
    // }

  },
  methods: {
    // 返回
    back() {
      this.$router.go(-1);
    },
    // tab类型（选中的栏目）
    tabTypeData(id) {
      if (this.tabTitle == '视察点' || this.tabTitle == '山水风光' || this.tabTitle == '风味美食') {
        this.tabType = 'img';
      } else if (this.tabTitle == '自然地理') {
        this.tabType = 'table';
      } else {
        this.tabType = 'defaultTable';
      }
      this.getDataRequest(id);
    },
    // 子栏目点击
    childColumnClick(item, index) {
      // console.log(item);
      this.childColumnTab = item.childColumnName;
      this.childColumnTabId = item.childColumnId;
      this.getChildColumnData(item.childColumnId);
    },
    // tab点击
    columnTabClick(id, index, title) {
      this.columnId = id;
      this.name = '';
      this.areaName = '';
      this.tabIndex = index;
      this.tabTitle = title;
      this.tabTypeData(id);
    },
    // 删除(自然地理，非固定的新增栏目)
    tableDelete(id) {
      this.YConfirmShow = true;
      this.YConfirmTitle = "删除";
      this.message = "你确定要删除吗";
      this.rowId = id;
    },
    // 编辑(自然地理，非固定的新增栏目)
    tableEdit(id, title) {
      this.$router.push({ path: '/column-manage/manage-add/edit', query: { columnId: this.columnId, title: this.tabTitle, rowId: id, childColumnId: this.childColumnTabId } });
    },
    // 详情(自然地理，非固定的新增栏目)
    tableDetail(id, title) {
      this.$refs.columnDetail.openModal(id, 'type', title);
    },
    onEvent(data) {
      console.log(data);
      let type = '';
      if (data.eventName === 'detail') {
        this.$refs.columnDetail.openModal(data.id, type, this.tabTitle);
      } else if (data.eventName === 'edit') {
        this.$router.push({ path: '/column-manage/manage-add/edit', query: { columnId: this.columnId, title: this.tabTitle, rowId: data.id } });
      } else if (data.eventName === 'delete') {
        this.rowId = data.id;
        this.YConfirmShow = true;
      }
    },
    // 新增
    contentAddClick() {
      this.$router.push({ path: '/column-manage/manage-add/add', query: { title: this.tabTitle, columnId: this.columnId, childColumnId: this.childColumnTabId } });
    },
    // 操作成功的回调方法
    YTipClick() {
      if (this.isBol) {
        // this.backClick();
      }
    },
    // 删除
    YDeleteClick() {
      let url = '';
      let params = {
        belongColumnId: this.columnId,
        logicDelete: 'YES',
        flag: 'DELETE'
      };
      if (this.tabTitle === '自然地理') {
        this.$set(params, 'geographyId', this.rowId);
        url = API.columnManageFacade_geographyModify;
      } else if (this.tabTitle === '视察点') {
        this.$set(params, 'inspectionPointInfoId', this.rowId);
        url = API.resourceManageFacade_pointModify;
      } else if (this.tabTitle === '风味美食') {
        this.$set(params, 'columnFoodId', this.rowId);
        url = API.columnManageFacade_foodModify;
      } else if (this.tabTitle === '山水风光') {
        this.$set(params, 'columnLandscapeId', this.rowId);
        url = API.columnManageFacade_landscapeModify;
      } else {
        this.$set(params, 'belongChildColumnId', this.childColumnTabId);
        this.$set(params, 'childColumnDetailId', this.rowId);
        url = API.columnManageFacade_childColumnDetailModify;
      }
      this.$axiosJsonPost(url, params).then(res => {
        if (res.result == 'success') {
          this.isBol = true;
          this.getDataRequest(this.columnId);
        } else {
          this.isBol = false;
        }
        this.message = res.message;
      })
    },
    getAreaFacade() { //查询省会下所有地级市信息接口
      let params = {
        areaId: this.areaId
      }
      this.$axiosGet(API.sysAreaFacade_findAreaById, params).then(res => {
        this.areaNameList = res.model.list;
      })
    },
    // 查询
    getDataRequest(id) {
      if (this.tabTitle == '视察点') { // 视察点信息
        let params = {
          type: 'POINT',
          name: this.name,
          areaId: this.areaName,
          max: this.pageSize,
          offset: (this.page - 1) * this.pageSize
        };
        this.$axiosGet(API.resourceManageFacade_findWithPage, params).then(res => {
          if (res.result == 'success') {
            this.tabData = res.model.list;
            this.total = res.model.totleCount;
            console.log(this.tabData);
          } else {
            this.tabData = [];
          }
        })
      } else if (this.tabTitle == '自然地理' && id) { // 自然地理信息
        let params = {
          areaId: this.areaName,
          flag: this.tabTitle,
          id: id,
          // max: this.pageSize,
          name: this.name,
          // offset: (this.page - 1) * this.pageSize
        };
        this.$axiosGet(API.columnManageFacade_findWithPage, params).then(res => {
          if (res.result == 'success') {
            this.list = res.model.list;
          } else {
            this.list = [];
          }
        })
      } else if (this.tabTitle == '风味美食' || this.tabTitle == '山水风光' && id) { // 风味美食,山水风光信息
        let params = {
          areaId: this.areaName,
          flag: this.tabTitle,
          id: id,
          max: this.pageSize,
          name: this.name,
          offset: (this.page - 1) * this.pageSize
        };
        this.$axiosGet(API.columnManageFacade_findWithPage, params).then(res => {
          if (res.result == 'success') {
            this.tabData = res.model.list;
            console.log(this.tabData);
            this.total = res.model.totleCount;
          } else {
            this.tabData = [];
          }
        })
      } else {
        /**
         * 先查询栏目下的子栏目，然后根据子栏目查询列表数据
         */
        let params = {
          columnId: this.columnId
        }
        // 获取子栏目
        this.$axiosGet(API.columnManageFacade_findAllByColumnId, params).then(res => {
          if (res.result == 'success') {
            // console.log(res);
            console.log(res.model.model.childColumnList);
            if (res.model.model.childColumnList.length > 0) {
              let index = 0;
              if (this.childColumnId != '') {
                for (let i = 0; i < res.model.model.childColumnList.length; i++) {
                  if (this.childColumnId == res.model.model.childColumnList[i].childColumnId) {
                    this.tabIndex = i;
                    index = i;
                  }
                }
              }
              this.childColumnLi = res.model.model.childColumnList;
              this.childColumnTab = res.model.model.childColumnList[index].childColumnName;
              this.childColumnTabId = res.model.model.childColumnList[index].childColumnId;
              // 子栏目列表
              this.getChildColumnData(res.model.model.childColumnList[index].childColumnId);
            } else {
              this.childColumnLi = [];
              childColumnTab = '';
              childColumnTabId = '';
            }

          } else {
            this.childColumnLi = [];
          }
        })

      }
    },
    // 子栏目列表
    getChildColumnData(id) {
      let params = {
        id: id,
        max: this.pageSize,
        offset: (this.page - 1) * this.pageSize
      };
      this.$axiosGet(API.columnManageFacade_findDetailWithPage, params).then(res => {
        // console.log(res);
        if (res.result == 'success') {
          this.defaultList = res.model.list;
          this.total = res.model.totleCount;
        } else {
          this.defaultList = [];
        }
      })
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      if (this.tabTitle == '视察点' || this.tabTitle == '山水风光' || this.tabTitle == '风味美食' || this.tabTitle == '自然地理') {
        this.getDataRequest();
      } else {
        this.getChildColumnData(this.childColumnTabId);
      }
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      if (this.tabTitle == '视察点' || this.tabTitle == '山水风光' || this.tabTitle == '风味美食' || this.tabTitle == '自然地理') {
        this.getDataRequest();
      } else {
        this.getChildColumnData(this.childColumnTabId);
      }
    },
    // 获取栏目
    getDataDuty() {
      this.$axiosGet(API.columnManageFacade_findTitleAndColumn).then(res => {
        if (res.model.length > 0) {
          let inspection = {
            columnName: '视察点',
            titleName: '视察点',
            columnId: ''
          }
          res.model[0].columnBOList.unshift(inspection);
          this.tabList = res.model[0].columnBOList;
        } else {
          this.list = [];
        }
      })
    },
  }
};
</script>

<style lang="scss" scoped>
.main-default .g-content .g-main .m-main .m-search {
  padding: 10px 0;
  border-bottom: 1px #dcdcdc solid;
}
.edit-manage-wrap {
  .house-nav-tab {
    margin-bottom: 0;
    li a {
      width: auto;
      padding: 0 20px;
    }
  }
  .edit-manage-add,
  .edit-manage-column-add {
    display: inline-block;
    margin-top: -42px;
    cursor: pointer;
    color: #2f72ff;
    border: 1px #2f70fe solid;
    padding: 4px 10px;
    border-radius: 2px;
  }
  .edit-manage-column-add {
    margin-top: 10px;
  }
  .default-child-column {
    height: 30px;
    border: 0px #3975fe solid;
    line-height: 30px;
    padding: 0 30px;
    cursor: pointer;
  }
  .default-active {
    border: 1px #3975fe solid;
    color: #3975fe;
  }
}
</style>

