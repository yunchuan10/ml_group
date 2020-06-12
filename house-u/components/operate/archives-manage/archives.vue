<template>
  <div>
    <section class="m-main f-clearfix" style="height: calc(100% - 35px);box-sizing:border-box;">
      <!--导航-->
      <div class="m-breadcrumb u-bread">
        <div class="f-pull-left f-weight-bold f-size">
          <Y-Breadcrumb title="档案管理" :item="['档案管理']" type="2"></Y-Breadcrumb>
        </div>
        <div class="u-bread-btn-group">
          <button class="u-bread-btn" @click="openPersonModal">归档设置</button>
          <router-link to="/file-manage/add-file-manage">
            <button class="u-bread-btn">上传档案</button>
          </router-link>
        </div>
      </div>
      <div style="height: calc(100% - 61px);display:flex">
        <div class="u-treecontent" style="height: 100%;" v-if="isShowLeftBannel">
          <div class="u-tree-seachbox mokuai-class">
            <span class="">模块名称</span>
            <p @click="openNewModal('1')">+</p>
          </div>
          <div class="u-tree-seachbox">
            <el-input placeholder="请输入模块名称" v-model="filterText">
            </el-input>
          </div>
          <div style="height: calc(100% - 110px);overflow: auto;">

            <!-- 2棵树 -->
            <div class="custom-tree-container">
              <div class="block">
                <el-tree :data="data1" node-key="id" default-expand-all :expand-on-click-node="false" highlight-current>
                </el-tree>
              </div>
              <div class="block">

                <el-tree :data="data" node-key="id" default-expand-all :expand-on-click-node="false" draggable highlight-current>
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span>
                      <el-button type="text" size="mini" @click="() => append(data)">
                        新增
                      </el-button>
                      <el-button type="text" size="mini" @click="() => remove(node, data)">
                        删除
                      </el-button>
                    </span>
                  </span>
                </el-tree>
              </div>
            </div>
          </div>

        </div>
        <div class="u-left" style="height: 100%;overflow: auto;margin: 0;flex: 1;padding-left:20px;">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
      </div>
    </section>
    <!-- 归档设置 -->
    <el-dialog title="归档设置" custom-class="h-dialog-add" :close-on-click-modal="false" :before-close="hanleClose" :visible.sync="dialogPersonVisible" width="400px">
      <div class="block">
        <!-- <el-tree lazy :load="loadNode" class="filter-tree" @node-click="updateCourtyardName" :highlight-current="true" node-key="value" :data="roomNoteList" :props="defaultProps" :accordion="true" :filter-node-method="filterNode" ref="tree2" :render-content="renderContent">
            </el-tree> -->
        <p> 请选择归档模块：</p>

        <el-tree :data="data1" node-key="id" default-expand-all :expand-on-click-node="false" show-checkbox class="tree-class">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUserList" class="u-submit-btn cancel-btn">取消</el-button>
        <el-button class="u-submit-btn submit-btn" @click="confirmBtn">保存</el-button>
      </div>
    </el-dialog>
    <!-- 新增父节点 -->
    <el-dialog title="新增模块" custom-class="h-dialog-add" :close-on-click-modal="false" :before-close="hanleClose" :visible.sync="dedNewVisible" width="530px">
      <el-form :model="ruleForm" label-width="100px">
        <el-form-item label="模块名称" prop="parentNode">
          <el-input :disabled="true" v-model="ruleForm.parentNode">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUserList" class="u-submit-btn cancel-btn">取消</el-button>
        <el-button class="u-submit-btn submit-btn" @click="confirmBtn">保存</el-button>
      </div>
    </el-dialog>
    <!-- 新增树子节点 -->
    <el-dialog title="新增子模块" custom-class="h-dialog-add" :close-on-click-modal="false" :before-close="hanleClose" :visible.sync="dialogNewVisible" width="530px">
      <el-form :model="ruleForm" label-width="100px">
        <el-form-item label="上级模块名称" prop="parentNode">
          <el-input :disabled="true" v-model="ruleForm.parentNode">
          </el-input>
        </el-form-item>
        <el-form-item label="子模块名称" prop="exceedvalue">
          <el-input placeholder="请输入内容" v-model="ruleForm.exceedValue">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUserList" class="u-submit-btn cancel-btn">取消</el-button>
        <el-button class="u-submit-btn submit-btn" @click="confirmBtn">保存</el-button>
      </div>
    </el-dialog>
    <!-- 操作成功提示框 -->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message"></Y-Prompt>
  </div>
</template>

<script>
let id = 1000;
export default {
  data() {
    const data = [{
      id: 1,
      label: '一级 1',
      children: [{
        id: 4,
        label: '二级 1-1',
        children: [{
          id: 9,
          label: '三级 1-1-1'
        }, {
          id: 10,
          label: '三级 1-1-2'
        }]
      }]
    }];
    const data1 = [{
      id: 1,
      label: '一级 1',
      children: [{
        id: 4,
        label: '二级 1-1',
        children: [{
          id: 9,
          label: '三级 1-1-1'
        }, {
          id: 10,
          label: '三级 1-1-2'
        }]
      }]
    }];
    return {
      YPromptShow: false,
      isBol: false,
      message: '',
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      iconShowlist: [true, false, false],
      activeName: 'number',
      filterText: '',
      list: [], //表格列表信息
      roomNoteList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      isShowLeftBannel: true,
      dialogPersonVisible: false, //归档设置
      dedNewVisible: false, //树父新增
      dialogNewVisible: false, //树子新增
      data: JSON.parse(JSON.stringify(data)),
      data1: JSON.parse(JSON.stringify(data1)),
      ruleForm: {
        parentNode: '', // 弹窗换取父节点名称
        exceedValue: '', //弹窗传值子节点名称
      },
      nodeLocation: '', //树节点节点位置
      newName: '', //新建节点名字

    };
  },
  activated() {

  },
  deactivated() {

  },
  mounted() {
  },
  computed: {

  },
  watch: {

  },
  methods: {
    // 关闭弹窗 ++
    hanleClose() {
      this.dialogNewVisible = false;
      this.dialogPersonVisible = false;
      this.dedNewVisible = false,

      this.newName = '';
      this.ruleForm.exceedValue = '';
      this.ruleForm.parentNode = '';
    },
    //取消按钮 ++
    cancelUserList() {
      // this.dialogNewVisible = false;
      // this.dialogPersonVisible = false;
      // this.dedNewVisible = false,
      this.hanleClose()
    },
    openNewModal(value) {
      if (value == '1') {
        this.dedNewVisible = true; //树父新增
      } else {
        this.dialogNewVisible = true;
      }
    },
    //保存按钮 ++
    confirmBtn() {
      if (this.ruleForm.exceedValue) {
        this.newName = this.ruleForm.exceedValue;
        this.append(this.nodeLocation);
      }
      this.hanleClose()
    },
    //2棵树
    append(data) {
      this.ruleForm.parentNode = data.label;
      this.openNewModal();
      if (this.newName) {
        const newChild = { id: id++, label: this.newName, children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);

      } else {
        this.nodeLocation = data;
      }
    },

    PreservationBtn() {
      this.hanleClose()

    },
    openPersonModal() {

      this.dialogPersonVisible = true;
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },


    filterNode(value, data) {
      // if (!value) return true;
      // return data.label.indexOf(value) !== -1;
    },

    loadNode(node, resolve) {
      // let params = {
      //   id: node.data.value,
      //   level: this.areaLevel,
      //   flag: node.data.typeFlag
      // }
      // this.$axiosPost(API.yardSearch_yardTreeList, params).then(res => {
      //   if (res.data) {
      //     resolve(res.data);
      //   } else {
      //     resolve([]);
      //   }
      // })
    },
    updateCourtyardName(data) {
      // if (data.typeFlag === 'organ') {
      //   this.organId = data.value;
      //   this.courtyardName = data.label;
      //   this.getYardata();
      // }
      // if (data.typeFlag === 'storeys') {
      //   if (data.value && this.token && this.areaId) {
      //     window.open(`${LINKPATH.linkPath().floorPlanPath}/mvc/officehouse/courtyardsearch/storeys_include?token=${this.token}&areaId=${this.areaId}&id=${data.value}`)
      //   }
      // }
    }
  },

};
</script>
<style  lang="scss">
.el-tooltip__popper {
  max-width: 400px;
  line-height: 180%;
}
</style>

<style lang="scss" scoped>
.f-size {
  font-size: 16px;
}
.u-bread {
  height: 30px;
  line-height: 30px;
}
.router-link-exact-active {
  color: #2f70ff !important;
  p {
    color: #2f70ff !important;
  }
  .u-grid-content {
    border: 1px solid #2f70ff;
  }
}
.u-grid-content {
  border: 1px solid #e4e7eb;
  box-shadow: 2px 2px 5px #d7d7d7;
  padding: 25px 0;
  .u-grid-tips {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .icon-gantanhao:before {
    color: #c0c4cc;
  }
  .u-query-icons {
    width: 60px;
    height: 64px;
    margin: 5px auto 0;
  }
  .u-query-txt {
    float: left;
  }
  .u-query-h2 {
    font-size: 38px;
  }
}
.u-grid-chart {
  float: left;
  width: 100%;
  height: 400px;
  .u-grid-charttab {
    position: absolute;
    z-index: 5;
    right: 40%;
  }
}
.el-row {
  margin: 20px 0;
  float: left;
  width: 100%;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  a {
    color: #303133;
  }
}
.el-col a p {
  color: #606266;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.mokuai-class {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  position: relative;
  font-size: 14px;
  display: inline-block;
  width: 93%;
  line-height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-bottom: 0px;
  span {
    padding-left: 15px;
  }
  p {
    display: inline-block;
    float: right;
    cursor: pointer;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.tree-class {
  padding-left: 22%;
}
</style>
