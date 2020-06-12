<template>
  <div class="u-shuttle-frame f-clearfix">
    <div class="u-await-select u-frame" :style="'width: '+ defaultWidth+'px;height:'+defaultHeight+'px;'">
      <div class="title">待选<span class="f-pull-right">{{awaitCheckData.length}}/{{awaitTreeLength}}</span></div>
      <div class="content">
        <el-input class="u-filter-input" placeholder="输入关键字进行过滤" v-model="waitText"></el-input>
        <div class="data">
          <el-tree @check="getAwaitTreeCheckData" :data="defaultAwaitData" show-checkbox default-expand-all node-key="id" ref="awaitTree" :filter-node-method="filterNode"></el-tree>
        </div>
      </div>
    </div>
    <div class="u-select-btn" :style="'height:'+defaultHeight+'px;'">
      <div style="display:inline-block;" :style="'margin-top:calc('+ defaultHeight / 2 +'px - 44px;'">
        <a class="btn" :class="hasCheckData.length > 0 ?'active':''" @click="toHasTreeClick(defaultHasData, defaultAwaitData, hasCheckData, 'TOLEFT')"><i class="el-icon-arrow-left"></i></a>
        <a class="btn" :class="awaitCheckData.length > 0 ?'active':''" @click="toHasTreeClick(defaultAwaitData, defaultHasData, awaitCheckData, 'TORIGHT')"> <i class="el-icon-arrow-right"></i></a>
      </div>
    </div>
    <div class="u-has-select u-frame" :style="'width: '+ defaultWidth+'px;height:'+defaultHeight+'px;'">
      <div class="title">已选<span class="f-pull-right">{{hasCheckData.length}}/{{hasTreeLength}}</span></div>
      <div class="content">
        <el-input class="u-filter-input" placeholder="输入关键字进行过滤" v-model="hasText"></el-input>
        <div class="data">
          <el-tree @check="getHasTreeCheckData" :data="defaultHasData" show-checkbox default-expand-all node-key="id" ref="hasTree" :filter-node-method="filterNode"></el-tree>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*
* 二级级联穿梭框组件，暂只支持二级级联关系
* 作者： 吴维维
* awaitData: 父组件传过来的待选数据
* hasData: 父组件传过来的已选数据
*width: 穿梭框的宽度
* height：穿梭框的高度
*/

export default {
  props: ['width', 'height', 'awaitData', 'hasData'],
  data() {
    return {
      defaultWidth: '',
      defaultHeight: '',
      defaultAwaitData: [],
      defaultHasData: [],
      awaitCheckData: [], // 待选选择的数据
      hasCheckData: [], // 已选选择的数据
      waitText: '',
      hasText: '',
      awaitTreeLength: 0,
      hasTreeLength: 0,
    }
  },
  activated() {
    this.defaultWidth = this.width || '200';
    this.defaultHeight = this.height || '300';
    this.defaultAwaitData = this.awaitData || [];
    this.defaultHasData = this.hasData || [];
    this.setTotal();
  },
  watch: {
    waitText(val) {
      this.$refs.awaitTree.filter(val);
    },
    hasText(val) {
      this.$refs.hasTree.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 清空选择的节点
    clearCheckNode() {
      this.$refs.awaitTree.setCheckedKeys([])
      this.$refs.hasTree.setCheckedKeys([])
    },
    // 获取待选区域的选择的数据
    getAwaitTreeCheckData() {
      this.awaitCheckData = this.$refs.awaitTree.getCheckedNodes(true);
    },
    // 获取已选区域的选择的数据
    getHasTreeCheckData() {
      this.hasCheckData = this.$refs.hasTree.getCheckedNodes(true);
    },
    setTotal() {
      this.awaitTreeLength = 0;
      this.hasTreeLength = 0;
      this.defaultAwaitData.forEach((item) => {
        this.awaitTreeLength += Number(item.children.length);
      })
      this.defaultHasData.forEach((item) => {
        this.hasTreeLength += Number(item.children.length);
      })
    },
    // 点击按钮将数据从左边添加到右边，并删除左侧的数据
    toHasTreeClick(fromData, toData, choseData, flag) {
      choseData.forEach((valueI, indexI) => { // 删除已选子节点
        fromData.forEach((valueJ, indexJ) => {
          valueJ.children.forEach((valueK, indexK) => {
            if (valueI.id === valueK.id) {
              valueJ.children.splice(indexK, 1)
            }
          })
        })
      })
      let datas = fromData;
      //   根据标志位判断清空左侧还是右侧的数据
      if (flag == 'TORIGHT') {
        this.defaultAwaitData = [];
        datas.forEach((valueJ, indexJ) => { // 删除父级节点
          if (valueJ.children.length !== 0) {
            this.defaultAwaitData.push(valueJ)
          }
        })
      } else {
        this.defaultHasData = [];
        datas.forEach((valueJ, indexJ) => { // 删除父级节点
          if (valueJ.children.length !== 0) {
            this.defaultHasData.push(valueJ)
          }
        })
      }

      choseData.forEach((valueI, indexI) => { // 添加未选子节点
        var isHasParentNode = false;
        toData.forEach((valueJ, indexJ) => {
          if (valueI.parentId === valueJ.id) {
            valueJ.children.push({
              label: valueI.label,
              id: valueI.id,
              parentLabel: valueI.parentLabel,
              parentId: valueI.parentId
            });
            isHasParentNode = true;
          }
        })
        if (!isHasParentNode) {
          toData.push({
            id: valueI.parentId,
            label: valueI.parentLabel,
            children: [valueI]
          })
        }
      })
      this.setTotal();
      this.awaitCheckData = [];
      this.hasCheckData = [];
      this.waitText = '';
      this.hasText = '';
      this.clearCheckNode();
      this.$emit('callBack', this.defaultHasData)
    }
  }
}
</script>

<style lang="scss">
.u-shuttle-frame {
  .u-select-btn {
    height: 300px;
    padding: 0 30px;
    width: 36px;
    float: left;
    .btn {
      display: inline-block;
      width: 36px;
      height: 36px;
      border-radius: 100%;
      border: 1px solid #dcdfe6;
      text-align: center;
      line-height: 36px;
      background-color: #f5f7fa;
      &.active {
        background-color: #409eff;
        border-color: #409eff;
        color: #fff;
      }
      &:first-child {
        margin-bottom: 10px;
      }
    }
  }
  .u-frame {
    float: left;
    height: 300px;
    width: 200px;
    border: 1px solid #ebeef5;
    box-sizing: border-box;
    .title {
      height: 40px;
      line-height: 40px;
      background: #f5f7fa;
      padding: 0 20px;
      border-bottom: 1px solid #ebeef5;
      span {
        color: #909399;
        font-size: 12px;
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      height: calc(100% - 40px);
      padding: 10px;
      .u-filter-input {
        margin-bottom: 10px;
        input {
          border-radius: 20px !important;
        }
      }
      .data {
        flex: 1;
        overflow: auto;
      }
    }
  }
}
</style>