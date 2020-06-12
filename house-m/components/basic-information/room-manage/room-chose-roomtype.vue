<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="950px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>选择房间类型</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <div style="margin-bottom: 20px;">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        </div>
        <el-tree @check="getCheckNode" class="filter-tree" :data="roomTypes" node-key="value" show-checkbox default-expand-all :filter-node-method="filterNode" ref="roomTypeTree">
        </el-tree>
        <div style="color: red;font-size: 12px;" v-show="!isCanChose">附属用房与技术业务用房只能单选</div>
      </div>
      <div class="el-dialog__footer">
        <el-button class="u-submit-btn cancel-btn" @click="carDetailShow = false">取消</el-button>
        <el-button class="u-submit-btn submit-btn" @click="saveRoom">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isCanChose: true,
      roomCheckList: [], // 选择后的节点
      roomTypes: [], // 房间类型列表集合
      filterText: '',
      carDetailShow: false, // 弹出框开关
    };
  },
  watch: {
    'filterText': function (val) {
      this.$refs.roomTypeTree.filter(val);
    }
  },
  methods: {
    // 初始化弹出框
    openModal(roomTypeList) {
      this.filterText = '';
      this.carDetailShow = true;
      let roomValueList = []
      roomTypeList.forEach((item, index) => {
        roomValueList.push(item.value)
      })
      this.getSearchDate();
      // if (roomTypeList.length > 0) {
      setTimeout(() => {
        this.setCheckedNodes(roomValueList);
      }, 500)
      // }
    },
    setCheckedNodes(roomValueList) {
      this.$refs.roomTypeTree.setCheckedKeys(roomValueList)
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getSearchDate() {
      this.$axiosPost(API.room_getSelect, {}).then(res => {
        this.roomTypes = res.data.roomTypes;
      })
    },
    getCheckNode() {
      let firstNode = [];
      this.$refs.roomTypeTree.getCheckedNodes(false, true).forEach((item, index) => {
        if (item.typeFlag === 'FITST') {
          firstNode.push(item.label);
        }
      })
      this.isCanChose = true;
      if (firstNode.length > 1) {
        firstNode.forEach((item, index) => {
          if (item === '附属用房' || item === '技术业务用房') {
            this.isCanChose = false;
          }
        })
      }
      if (this.isCanChose) {
        this.roomCheckList = this.$refs.roomTypeTree.getCheckedNodes(false, true);
      }
    },
    saveRoom() {
      if (this.isCanChose) {
        this.carDetailShow = false;
        this.$emit('getNode', this.roomCheckList)
      }
    }
  }
};
</script>
<style lang="scss">
</style>

