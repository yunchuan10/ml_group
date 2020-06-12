<template>
  <div>
    <section class="m-main column-manage-wrap">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="子栏目管理" :item="['栏目管理','子栏目管理']"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <div class="f-pull-right u-bread-btn" style="border-color:#E6E6EE;" @click="back">
            <a style="color:#000;">返回</a>
          </div>
        </div>
      </div>
      <!-- 新增子栏目 -->
      <div class="u-bread-btn-group f-clearfix" style="margin:10px 0;">
        <div class="f-pull-right u-bread-btn" @click="carDetailShow = true">
          <a>新增子栏目</a>
        </div>
      </div>

      <div class="h-table f-relative">
        <el-table :data="list" style="width: 100%;" align="center" border :span-method="objectSpanMethod">
          <el-table-column label="栏目名称" align="center">
            <template slot-scope="scope">
              <!-- 编辑栏目 -->
              <div v-if="columnFlag">
                <span>{{columnName}}</span>
                <i v-if="columnFlag" class="iconfont icon-bianji1 column-table-i" @click="columnEditIcon(scope.row.id)"></i>
              </div>
              <!-- 确认修改栏目 -->
              <div v-if="columnFlag == false">
                <el-input ref="columnChild" size="small" style="width:120px;" maxlength="6" v-model="columnName"></el-input>
                <i class="iconfont icon-dui4 column-table-i" @click="columnSureIcon()"></i>
              </div>

            </template>
          </el-table-column>

          <el-table-column label="子栏目名称" align="center">
            <template slot-scope="scope" v-if="isNull">
              <div>
                <!-- 子栏目编辑 -->
                <div v-if="scope.$index !== scopeChildIndex">
                  <span>{{scope.row.childColumnName}}</span>
                  <i class=" iconfont icon-bianji1 column-table-i" @click="columnEditClick(scope.$index)"></i>
                </div>
                <!-- 子栏目确定修改 -->
                <div v-else-if="scope.$index == scopeChildIndex">
                  <el-input size="small" ref="columnChildName" style="width:120px;" maxlength="6" v-model="scope.row.childColumnName"></el-input>
                  <i class="iconfont icon-dui4 column-table-i" @click="columnSureClick(scope.row.childColumnId, scope.row.childColumnName)"></i>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="180px" align="center">
            <template slot-scope="scope" v-if="isNull">
              <a @click="columnChildEdit(scope.row)">编辑内容</a>
              <a @click="columnChildDelete(scope.row.childColumnId)">删除</a>
            </template>
          </el-table-column>

        </el-table>

      </div>
    </section>

    <!-- 新增子栏目弹框 -->
    <el-dialog custom-class="m-detail-dialog m-car-detail column-dia-wrap" append-to-body :show-close="false" width="600px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>新增子栏目</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close"></i>
        </div>
      </div>

      <div class="u-detail-dialog-content">
        <el-form style="margin-top: 10px;" :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="160px" class="demo-ruleForm">
          <el-form-item label="子栏目名称" prop="name">
            <el-input class="" style="width: 300px;" v-model="ruleForm.name" maxlength="6" placeholder="请输入栏目名称"></el-input>
          </el-form-item>

          <el-form-item label="所属栏目">
            <span>{{columnName}}</span>
          </el-form-item>
        </el-form>
      </div>

      <div class="column-btn">
        <span @click="columnCancel">取消</span>
        <span @click="columnSure">确定</span>
      </div>
    </el-dialog>

    <!-- 信息提示语 -->
    <Y-Prompt v-model="tipShow" :isBol="isBol" :message="message" @click="YTipClick"></Y-Prompt>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" :title='YConfirmTitle' :message="message" @click="YDeleteClick"></Y-Confirm>
  </div>
</template>

<script>
import { isNull } from 'util';
export default {
  data() {
    return {
      isNull: false,
      scopeChildIndex: '', // 当前点击列
      columnFlag: true,
      list: [],
      columnId: '',
      columnName: '',
      childColumnId: '',
      carDetailShow: false, // 弹出框开关
      tipShow: false, // 消息弹框提示
      isBol: true,
      message: '', // 消息弹框提示语
      YConfirmShow: false, // 删除弹出框
      YConfirmTitle: '', // 弹出框标题
      ruleForm: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: "请输入栏目名称", trigger: "change" }
        ]
      },
    };
  },
  activated() {
    this.columnId = this.$route.query.id;
    this.columnName = this.$route.query.title;
    this.scopeChildIndex = '';
    this.columnFlag = true;
    this.ruleForm.name = '';
    this.getDataChild();
  },
  methods: {
    // 返回
    back() {
      this.$router.go(-1);
    },
    // 栏目编辑
    columnEditIcon(id) {
      this.columnFlag = false;
    },
    // 栏目确认修改
    columnSureIcon() {
      if (this.$refs.columnChild.value) {
        let params = {
          columnId: this.columnId,
          columnName: this.columnName
        };
        this.$axiosJsonPost(API.columnManageFacade_updateColumn, params).then(res => {
          if (res.result == 'success') {
            this.isBol = true;
          } else {
            this.isBol = false;
          }
          this.message = res.message;
        })
      }
      this.columnFlag = true;
      this.getDataChild();
    },
    // 点击栏目编辑
    columnEditClick(index) {
      this.scopeChildIndex = index;
    },
    // 点击栏目确定图标
    columnSureClick(id, name) {
      if (this.$refs.columnChildName.value) {
        let params = {
          belongColumnId: this.columnId,
          childColumnId: id,
          childColumnName: name,
          flag: 'UPDATE',
          logicDelete: 'NO'
        };
        this.$axiosJsonPost(API.columnManageFacade_childColumnModify, params).then(res => {
          if (res.result == 'success') {
            this.isBol = true;
          } else {
            this.isBol = false;
          }
          this.message = res.message;
        });
      }
      // this.columnFlag = true;
      this.scopeChildIndex = '';
      this.getDataChild();
    },
    // 表格合并单元格处理
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % this.list.length === 0) {
          return {
            rowspan: this.list.length,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    // 点击编辑内容
    columnChildEdit(row) {
      // console.log(row);
      this.$router.push({ path: '/column-manage/edit-manage', query: { columnId: this.columnId, id: row.childColumnId, title: this.$route.query.title } });
    },
    // 表格点击删除
    columnChildDelete(id) {
      this.childColumnId = id;
      this.YConfirmShow = true;
    },
    // 表格数据
    getDataChild() {
      let params = {
        columnId: this.columnId,
      };
      this.$axiosGet(API.columnManageFacade_findAllByColumnId, params).then(res => {
        if (res.result == 'success') {
          if (res.model.model.childColumnList != '') {
            this.list = res.model.model.childColumnList;
            this.isNull = true;
          } else {
            this.list = [""];
            this.isNull = false;
          }
        } else {
          this.list = [];
        }
      });
    },
    // 取消
    columnCancel() {
      this.ruleForm.name = '';
      this.carDetailShow = false;
    },
    // 确定
    columnSure() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            childColumnId: '',
            dateCreated: '',
            lastUpdated: '',
            belongColumnId: this.columnId,
            childColumnName: this.ruleForm.name,
            flag: 'CREATE',
            logicDelete: 'NO'
          };
          this.$axiosJsonPost(API.columnManageFacade_childColumnModify, params).then(res => {
            if (res.result == 'success') {
              this.isBol = true;
              this.getDataChild();
            } else {
              this.isBol = false;
            }
            this.message = res.message;
          });
          this.carDetailShow = false;
        }
      })
    },
    // 操作成功的回调方法
    YTipClick() {
      if (this.isBol) {
        // this.backClick();
      }
    },
    // 删除
    YDeleteClick() {
      let params = {
        belongColumnId: this.columnId,
        childColumnId: this.childColumnId,
        logicDelete: 'YES',
        flag: 'DELETE'
      };
      this.$axiosJsonPost(API.columnManageFacade_childColumnModify, params).then(res => {
        if (res.result == 'success') {
          this.isBol = true;
          this.getDataChild();
        } else {
          this.isBol = false;
        }
        this.message = res.message;
      });
    }
  }
};
</script>

<style lang="scss">
.column-manage-wrap {
  .column-table-i {
    margin-left: 5px;
    color: #306fff;
    cursor: pointer;
  }
}
.main-default .g-content .g-main .m-main .h-table .el-table thead th .cell {
  border-left: 0px;
}

// 弹框
.column-dia-wrap {
  margin: auto !important;
  margin-top: 15vh !important;
  left: 0;
  height: 330px;
  border-radius: 4px !important;
  .column-btn {
    height: 54px;
    line-height: 54px;
    text-align: right;
    border-top: 1px #e4e8eb solid;
    span {
      margin-right: 20px;
      border: 1px #e4e8eb solid;
      background-color: #fff;
      border-radius: 2px;
      display: inline;
      padding: 7px 20px;
      cursor: pointer;
      &:last-child {
        background-color: #2f70ff;
        border-color: #2f70ff;
        color: #fff;
      }
    }
  }
}
</style>