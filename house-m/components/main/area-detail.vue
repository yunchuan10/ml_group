<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="800px" :visible.sync="carDetailShow" @close="clearForm">
      <div class="u-detail-dialog-header" slot="title">
        <span>地区切换</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close "></i>
        </div>
      </div>
      <div class="u-detail-dialog-content">
        <div style="margin-bottom: 20px;">
          <el-input class="filter-tree" placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        </div>
        <el-tree :accordion="true" lazy @node-click="getAreaId" :load="loadNode" :highlight-current="true" :data="areaList" :props="{label: 'areaName', value: 'areaId'}" :filter-node-method="filterNode" ref="areaDetail"></el-tree>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      filterText: '',
      areaList: [], // 地区LIST集合
      carDetailShow: false, // 弹出框开关
    };
  },
  watch: {
    filterText(val) {
      this.$refs.areaDetail.filter(val);
    }
  },
  methods: {
    loadNode(node, resolve) {
      if (node.data.level == 3) {
        resolve([]);
      } else {
        let params = {
          areaId: node.data.areaId
        }
        this.$axiosPost(API.yardSearch_headerArea, params).then(res => {
          resolve(res.data);
        })
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.areaName.indexOf(value) !== -1;
    },
    getAreaId(data) {
      // if (data.children.length === 0) {
      this.$store.dispatch('areaIdActions', data.areaId);
      this.$store.commit('areaNameMutations', data.areaName);
      this.$store.commit('areaLevelMutations', data.level);
      this.carDetailShow = false;
      // }
    },
    clearForm() {
      this.filterText = '';
    },
    // 初始化弹出框
    openModal() {
      this.carDetailShow = true;
      this.getTreeData();
    },
    getTreeData() {
      this.$axiosPost(API.yardSearch_headerArea, {}).then(res => {
        res.data.forEach((item, index) => {
          this.$set(item, 'children', [{
            areaId: item.areaId + 1,
            areaName: item.areaName
          }])
        })
        this.areaList = res.data;
      })
    }
  }
};
</script>

<style lang="scss">
</style>

