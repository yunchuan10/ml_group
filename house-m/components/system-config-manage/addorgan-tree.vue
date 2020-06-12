<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb f-clearfix">
        <Y-Breadcrumb title="编辑" :item="['组织树编辑']"></Y-Breadcrumb>
        <div class="u-bread-btn-group">

          <button class="u-bread-btn" @click="newsBack">
            返回
          </button>
        </div>
      </div>

      <div class="h-table" style="display: flex;">
        <div class="m-manage-affairs-wrap" style="width: 400px; overflow:auto; height:760px;margin-right: 10px;">
          <!-- 下拉树 -->
          <div>
            <!-- 树形 -->
            <div>
              <el-tree :data="treeData" node-key="id" default-expand-all :expand-on-click-node="false" draggable :allow-drop="allowDrop">>
                <span slot-scope="{ node, data }">
                  <span class="f-text-ellipsis" style="display:inline-block;">{{ data.label }}</span>
                  <span>
                    <!-- 添加 -->
                    <span @click="addNodeRight(data)"><i class="iconfont icon-posi icon-color icon-tianjia"></i></span>
                    <!-- 移除 -->
                    <span @click="remove(data,'DELETE')"><i class="iconfont icon-posi icon-color icon-shanchu"></i></span>
                    <!-- 编辑 -->
                    <!-- <span @click="editNode(data)"><i class="iconfont icon-posi icon-color icon-bianji1"></i></span> -->
                    <!-- 启用，禁用 -->
                    <!-- <span @click="remove(data,'DISABLED')">
                      <i v-if="data.enable == 'YES'" class="iconfont icon-posi icon-color-green icon-qiyong "><a class="icon-color-red" style="font-size: 16px ">禁用</a></i>
                    </span> -->
                    <!-- <span @click="remove(data,'ENABLE')">
                      <i v-if="data.enable == 'NO'" class="iconfont icon-posi icon-color-red  icon-jinyong"><a class="icon-color-green" style="font-size: 16px">启用</a></i>
                    </span> -->
                  </span>
                </span>
              </el-tree>
            </div>
          </div>
        </div>

      </div>
    </section>
    <!-- 删除弹框 -->
    <Y-Confirm v-model="YConfirmShow" :message="deleteMessage" @click="deleteClick"></Y-Confirm>
    <!-- 信息提示语 -->
    <Y-Prompt v-model="tipShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>

    <!-- 新增弹框 -->

    <addSelection-Tree ref="addSelectionTree" @callback='callbackTree'></addSelection-Tree>

  </div>
</template>

<script>
import addSelectionTree from '@/components/system-config-manage/addselection-tree'
export default {
  components: {
    "addSelection-Tree": addSelectionTree,

  },
  props: ["allNews", "tabSelType"],
  data() {
    return {

      parentId: '',
      queryFlag: '',
      ownerOrganId: '',
      ownerOrganName: '',
      treeDeleteId: '', // 删除节点的id
      deleteMessage: "确定要删除吗",
      YConfirmShow: false,
      deleteId: "", // 要删除的id
      tipShow: false, // 消息弹框提示
      isBol: true,
      message: '', // 消息弹框提示语
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      ruleForm: {
        title: '', // 主题
      },
      rules: {
        title: [
          { required: true, message: '主题不能为空', trigger: 'change' }
        ]
      },
      businessKey: '',
    };
  },

  activated() {
    this.ownerOrganId = this.$route.query.ownerOrganId;
    this.businessKey = this.$route.query.businessKey;
    this.ownerOrganName = this.$route.query.ownerOrganName;
    this.treeDataList();
  },
  methods: {
    allowDrop(draggingNode, dropNode, type) {
      // console.log(draggingNode, dropNode, type)
      if (dropNode.data.label === '二级 3-1') {
        return type !== 'inner';
      } else {
        return true;
      }
    },
    // allowDrag(draggingNode) {
    //   return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
    // },
    //树操作
    deleteClick() {
      let params = {
        id: this.treeDeleteId,
        type: this.treeDeleteType,
      }
      this.$axiosPost(API.organTree_delete, params).then(res => {
        if (res.result == 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        this.tipShow = true;
      })
    },
    // 下拉树
    treeDataList() {
      let params = {
        ownerOrganId: this.ownerOrganId || '',
        ownerOrganName: this.ownerOrganName || '',
        businessKey: this.businessKey || ''
      }
      this.treeNodeJson = [];
      this.$axiosGet(API.organTree_getOrganTree, params).then(res => {
        this.treeData = res.data;
      })


    },
    YPromptClick() {
      if (this.isBol) {
        this.treeDataList();
      }
    },

    callbackTree(data) {
      if (data) {
        this.treeDataList()
      }
    },
    // 返回
    newsBack() {
      this.$router.go(-1);

    },
    // 添加节点
    addNodeRight(val) {
      this.parentId = val.id;
      this.$refs.addSelectionTree.openModal(val, this.ownerOrganId, this.ownerOrganName, this.businessKey);
    },

    // 操作节点
    remove(val, type) {
      this.treeDeleteId = val.value;
      this.treeDeleteType = type;
      this.YConfirmShow = true;
      if (type == 'DELETE') {
        this.deleteMessage = '您确定要删除吗';      }
      else if (type == 'DISABLED') {
        this.deleteMessage = '您确定要禁用吗';
      } else {
        this.deleteMessage = '您确定要启用吗';
      }
    },
  }
};
</script>

<style lang="scss" scoped>
// 左侧下拉树
.m-manage-affairs-wrap {
  width: 22%;
  border-right: 1px #e4e7eb solid;
  .m-affairs-tree {
    width: 97%;
    min-width: 250px;
    .el-input {
      width: 200px;
    }
  }
}
.m-manage-table-wrap {
  padding-top: 20px;
  width: 77%;
}
.m-search.m-tree-search {
  margin-top: 0px;
  border-top: 0px #dcdcdc solid;
}
.icon-color {
  margin-left: 10px;
  margin-right: -5px;
  color: #2f70ff;
}
.icon-color-red {
  margin-left: 10px;
  margin-right: -5px;
  color: #ff0000;
}
.icon-color-green {
  margin-left: 10px;
  margin-right: -5px;
  color: green;
}
.icon-posi {
  position: relative;
  top: -3px;
}
.f-tree-color {
  color: #c0c4cd;
}
.m-manage-down-color {
  a {
    color: #2f70ff;
  }
}
</style>
