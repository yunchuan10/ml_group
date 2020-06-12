<template>
  <div class="wraper" ref="wraper">
    <!-- 头部信息 -->
    <div class="controlPanel">
      <div class="wraper-title">沈阳市人民政府-规划大厦1号楼-3层</div>     
      <div class="contrl-r-box">
        <el-button style="padding:0;margin:0;"  type="text" :class="index_T==Index ? 'active' : ''" class="contro-item" v-for="(item,Index) in toolsArr2" :key="Index" @click="_handleTools(item, Index)">
          <i :class="'iconfont' + item.icon"></i>
        </el-button>
      </div>
    </div>
    <!-- 工具栏 -->
   <div class="tools-box">
      <div class="contrl-m-box">                   
        <el-button style="padding:0;margin:0; position:relative;" :disabled="setDisabled(item.name)" type="text" :class="initIdx==idx ? 'active' : ''" class="contro-item" v-for="(item,idx) in toolsArr" :key="idx" @click="handleTools(item, idx)">
          <el-tooltip class="item" effect="dark" :content="item.content" placement="bottom">  
            <i :class="'iconfont' + item.icon"></i> 
          </el-tooltip>  
           <el-dropdown  size="medium" trigger="click" v-if="item.name ==='bg'"  class="el-drop">
            <span class="el-dropdown-link">
              <i class="iconfont icon-ziyuan2"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="dropdown-tools">
              <el-checkbox-group v-model="checkList">
              </el-checkbox-group>
              <el-dropdown-item> <el-checkbox label="房间号"></el-checkbox></el-dropdown-item>
              <el-dropdown-item><el-checkbox label="复选框 B"></el-checkbox></el-dropdown-item>
              <el-dropdown-item> <el-checkbox label="复选框 C"></el-checkbox></el-dropdown-item>
              <el-dropdown-item> <el-checkbox label="底图"></el-checkbox></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>    
        </el-button>   
        <el-color-picker v-model="drawColor" size="small"></el-color-picker>
      </div>
   </div>
   <!-- 主要内容 -->
  <div class="canvas-wraper f-relative">
      <div class="plane-btn f-absolute" :class="isTree?'btn-off':''" @click="btnClick('isTree')">
        <img :src="isTree?this.$store.state.imgPath.plane_off:this.$store.state.imgPath.plane_on" />
      </div>
      <!-- 左侧树菜单 -->
      <div class="canvas-l-tree"  v-show="!isTree">     
        <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        <el-tree class="filter-tree" :data="data" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree"></el-tree>
      </div>
      <!-- 中间画布 -->
      <div class="canvas-board f-relative" ref="canvasBoard" :style="{width: cavWidth}">
        <canvas id="canvas" ref="canvas"></canvas>
        <div class="canvas-organ-box f-absolute">
          <ul class="organ-item-ul">
            <li><i class="organ-item-col item-col-1"></i><span>机关事务管理局</span></li>
            <li><i class="organ-item-col item-col-1"></i><span>统计局</span></li>
            <li><i class="organ-item-col item-col-1"></i><span>机关事务管理局</span></li>
          </ul>
        </div>
      </div>
        <!-- 右侧收起按钮 -->
      <div class="plane-r-btn f-absolute" :class="isRbox?'btn-off-r':''" @click="btnClick('isRbox')">
        <img :src="isRbox?this.$store.state.imgPath.plane_on: this.$store.state.imgPath.plane_off" />
      </div> 
        <!-- 右侧房间信息列表 -->
      <div class="canvas-r-plane" v-show="!isRbox">
        <div class="plane-box">
          <h2 class="plane-box-title">
            <span class="fl">
              <i class="title-font iconfont"  :class="isShow?'icon-you':'icon-xiangshang'" @click="handleChange('isShow')"></i>房间列表
            </span>
            <ul class="plane-box-ul">
              <li><el-button class="plane-box-item" @click="updateRoom"><i class="iconfont icon-plus-square-fill"></i></el-button></li>
              <li><el-button class="plane-box-item"><i class="iconfont icon-minus-square-fill"></i></el-button></li>
              <li><el-button class="plane-box-item"><i class="iconfont icon-edit"></i></el-button></li>
              <!-- <li><el-button class="plane-box-item" @click='handleSearch'><i class="iconfont icon-search"></i></el-button></li>             -->
            </ul>
          </h2>
          <div class="plane-box-search">
            <el-input   v-show="isSeach" placeholder="请输入内容" v-model="search.roomNo">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <div v-show="!isShow" class="plane-box-info">           
            <ul class="box-info-ul">
              <li>
                <a title="北方3011饿">
                  <span class="info-hidden" >北方3011饿</span>
                </a>
              </li>
              <li>
                <a class="active">
                  <span class="info-hidden">301</span>
                </a>
              </li>
              <li>
                <a class='bind-color'>
                  <span class="info-hidden">301</span>
                </a>
              </li>
              <li>
                <a>
                  <span class="info-hidden">301</span>
                </a>
              </li>
              <li>
                <a>
                  <span class="info-hidden">301</span>
                </a>
              </li>
              <li>
                <a>
                  <span class="info-hidden">301</span>
                </a>
              </li>
              <li>
                <a>
                  <span class="info-hidden">301</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="plane-box f-clearfix">
          <h2 class="plane-box-title"><span class="fl"><i class="title-font iconfont" :class="isDetail?'icon-you':'icon-xiangshang'" @click="handleChange('isDetail')"></i>房间详情</span></h2>
          <div v-show="!isDetail" class="plane-box-info">           
            <table class="box-info-tab">
              <tr><td>房间号</td><td>3030</td></tr>
              <tr><td>建筑面积</td><td>3030</td></tr>
              <tr><td>使用面积</td><td>3030</td></tr>
              <tr><td>照片信息</td><td>3030</td></tr>
            </table>
          </div>
        </div>  

         <div class="plane-box f-clearfix">
          <h2 class="plane-box-title"><span class="fl"><i class="title-font iconfont"  :class="isAssign?'icon-you':'icon-xiangshang'" @click="handleChange('isAssign')"></i>房间分配</span></h2>
          <div v-show="!isAssign" class="plane-box-info">           
              <table class="box-info-tab">
                <tr><td>使用单位</td><td>沈阳市某某单位</td></tr>
                <tr><td>分配时间</td><td>3030</td></tr>
                <tr><td>使用面积</td><td>3030</td></tr>
                <tr><td>使用方式</td><td>借用</td></tr>
              </table>
          </div>
        </div>

      </div>

    </div>    
    <div class="download">
      <img :src="imageBase64" v-show="imageBase64!=''" alt="">
    </div>
     <e-vue-contextmenu ref="ctxshow" id="contextStyle">
       <div class="vue-menu-icon">
         <el-tooltip class="item" effect="dark" content="使用分配" placement="bottom">
            <el-button class="context-btn" @click="relationRoom"><i class="iconfont icon-lianjie"></i></el-button>    
         </el-tooltip>
        <el-tooltip class="item" effect="dark" content="取消分配" placement="bottom">
           <el-button class="context-btn" @click="showtipsRoom('relation')"> <i class="iconfont icon-duankailianjie"></i> </el-button> 
       </el-tooltip>       
        </div>
      <!-- <div @click="contactRoom">关联房间</div>
      <div @click="unContactRoom">取消关联</div> -->
    </e-vue-contextmenu>
        <!-- 分配房间 -->
    <room-allocation ref="roomAllocation"></room-allocation>
     <!-- 关联房间 -->
    <room-relation ref="roomRelation"></room-relation>   
       <!-- 新增房间 -->
    <room-update ref="roomUpdate"></room-update>  
        <!-- 房间操作提示框 -->
    <room-showtips ref="roomShowtips"></room-showtips>    
        <!-- 复制楼层房间操作提示框 -->
    <room-floorcopy ref="roomFloorcopy"></room-floorcopy>  
         <!-- 房间操作提示框 -->
    <room-list ref="roomList"></room-list>    
      <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" @click="YDeleteClick"></Y-Confirm>
  </div>
</template>
<script>
import { fabric } from 'fabric'
import roomAllocation from '@/components/plane/view/room-allocation.vue'; // 分配房间弹出框
import roomRelation from '@/components/plane/view/room-relation.vue'; // 关联房间弹出框
import roomFloorcopy from '@/components/plane/view/room-floorcopy.vue'; // 复制楼层房间弹出框
import roomUpdate from '@/components/plane/view/room-update.vue'; // 新增房间弹出框
import roomShowtips from '@/components/plane/view/room-showTips.vue'; // 房间操作提示框
import roomList from '@/components/plane/view/room-list.vue'; // 房间信息框
import whiteLine from '@/assets/images/white-line.png'

export default{
  components: {
    'room-allocation': roomAllocation,
    'room-relation': roomRelation,
    'room-update':roomUpdate,
    'room-showtips':roomShowtips,
    'room-list':roomList,
    'room-floorcopy':roomFloorcopy
  },
  data() {
    return{
      currentTool: '',
      done: false,
      input4:'',
      isShow:false,
      isDetail:false,
      isAssign:false,
      isTree:false,
      isRbox:false, //右边的盒子
      isSeach:false, //搜索框显示与隐藏
      YConfirmShow: false, // 删除弹出框
      checkList:[],
      search:{
        roomNo:'',
      },
      activeNames: ['1'],
      fabricObj: null,
      initIdx: 0,
      index_T:0, //头部右侧工具
      toolsArr: [
        {
          content:'鼠标选中',
          name: 'stop',
          icon: ' icon-shubiao'
        },        
        {
          content:'画直线',
          name: 'line',
          icon: ' icon-iconfont_zhixian'
        },      
        {
          content:'画矩形',
          name: 'juxing',
          icon: ' icon-iconfont_juxing'
        },
        {
          content:'画圆形',
          name: 'cricle',
          icon: ' icon-iconfont_yuan'
        },
        {
          content:'画椭圆',
          name: 'ellipse',
          icon: ' icon-iconfont_tuoyuan'
        },       
        {
          content:'画弧形',
          name: 'curve',
          icon: ' icon-iconfont_yuanjiao'
        },
        {
          content:'启动多边形',
          name: 'customize',
          icon: ' icon-duobianxing'
        },        
        {
          content:'拖动',
          name: 'dragger',
          icon: ' icon-iconfont_xuanzeyidong'
        },
        {
          content:'删除',
          name: 'remove',
          icon: ' icon-iconfont_shanchu'
        },
        {
          content:'上一步',
          name: 'undo',
          icon: ' icon-iconfont_shangyibu'
        },
        {
          content:'下一步',
          name: 'redo',
          icon: ' icon-xiayibu'
        },
        // {
        //   content:'清空',
        //   name: 'reset',
        //   icon: ' icon-xiangpica'
        // },
        // {
        //   content: '锁定',
        //   name: 'lock',
        //   icon: ' icon-suo1'
        // },
        {
          content:'显示或隐藏操作',
          name: 'bg',
          icon: ' icon-yanjing'
        }
      ],
      toolsArr2:[      
        {
          name: 'copy',
          icon: ' icon-copy-fill'
        },
        {
          name: 'group',
          icon: ' icon-layergroup-fill'
        },
        {
          name: 'print',
          icon: ' icon-print'
        }
      ],
      filterText: '',
      data: [{
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
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      mouseFrom:{},
      mouseTo:{},
      moveCount: 1,
      doDrawing: false,
      fabricHistoryJson: [],
      mods: 0,
      drawingObject: null, //绘制对象
      drawColor: 'red',
      drawWidth: 2,
      imageBase64: '',
      zoom: 1,
      selectionObject: [],
      fabricObjectList: [],
      isCustomize: false,
      customizePath: '',
      W:580,
      isFirst: false,
      left: '0',
      top: '0',
      fabricObjectDragger: null,
      panning: false
    }
  },
  mounted() {
    window.oncontextmenu=function(e){
      e.preventDefault();  //去掉默认的contextmenu事件，否则会和右键事件同时出现。
    }
    //初始化canvas 
    this.initCanvas();    
    this.$nextTick(()=>{   
      document.addEventListener('keyup',(e)=>{
        if(e.keyCode==27 && this.isCustomize){
          if (this.fabricObjectList.length > 0) {
            this.drawCustomize();
          }
          this.isCustomize = false;
          this.handleTools(this.toolsArr[0], 0)
        }
      })
      // window.onresize = e => {
      //   let height = window.innerHeight - 115;
      //   this.fabricObj.setHeight(height);
      //   this.fabricObj.renderAll();
      // }
    })    
  },
  computed:{
    cavWidth(){
      return window.innerWidth - this.W;
    },
    cavHeight(){
      return window.innerHeight - 90;
    }
  },
  watch: {
    currentTool: {
      handler(newValue, oldValue) {
        if (oldValue == 'customize' && (newValue == 'line' || newValue == 'curve')) {
          this.isFirst = true;
        } else {
          this.isFirst = false;
        }
      }
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods:{
    //搜索框显示与隐藏
    handleSearch(){
      this.isSeach = !this.isSeach;
    },
    handleChange(val) {
      if(val === 'isShow'){
        this.isShow = !this.isShow;  
      }else if( val === 'isDetail'){
        this.isDetail = !this.isDetail;
      }else if(val === 'isAssign'){
        this.isAssign = !this.isAssign;
      }      
    },
    btnClick(value){
      if(value ==='isTree'){
        this.isTree = !this.isTree;
        if(this.isTree === true && this.isRbox === false){
          this.W = 320;
        }else if(this.isTree === false && this.isRbox === true){
          this.W = 260;
        }else if(this.isTree === true && this.isRbox === true){
          this.W = 0;
        }else if(this.isTree === false && this.isRbox === false){
          this.W = 580;
        }
        this.fabricObj.setWidth(this.cavWidth)
      }else if(value ==='isRbox'){
        this.isRbox = !this.isRbox;
        if(this.isRbox === true && this.isTree === true){
          this.W = 0;
        }else if(this.isRbox === true && this.isTree === false){
          this.W = 260;
        }else if(this.isRbox === false && this.isTree === false){
          this.W = 580;
        }else if(this.isRbox === true && this.isTree === false){
          this.W = 320;
        }
        this.fabricObj.setWidth(this.cavWidth)
      }    
    },

    _handleTools(tools,index){
      this.index_T = index;
      if(tools.name ==='group'){
        this.listRoom()
      }else if(tools.name ==='copy'){
        this.floorcopyRoom()
      }
    },

    //分配房间
    allocationRoom() {
      this.$refs.roomAllocation.openModal();
    },
    //关联房间
    relationRoom() {
      this.$refs.roomRelation.openModal();
    },
    //新增房间
    updateRoom() {
      this.$refs.roomUpdate.openModal();
    },
    //房间操作提示
    showtipsRoom(type) {
      this.$refs.roomShowtips.openModal(type);
    },
    //房间列表信息
    listRoom() {
      this.$refs.roomList.openModal();
    },
    //复制楼层房间信息
    floorcopyRoom(){
      this.$refs.roomFloorcopy.openModal();
    },
    //删除信息
    YDeleteClick(){},

    //树型菜单
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    setDisabled(name) {
      if (this.isCustomize) {
        if (name == 'line' || name == 'curve' || name == 'stop' || name == 'dragger' || name == 'undo') {
          return false; 
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
    initCanvas() {
      let _this = this
      this.fabricObj = new fabric.Canvas('canvas',{
        isDrawingMode: false,
        selectable: false,
        selection: false,
        devicePixelRatio:true, //Retina 高清屏 屏幕支持
      })
      this.fabricObj.freeDrawingBrush.color = '#E34F51'
      this.fabricObj.freeDrawingBrush.width = 2
      // 设置画布大小
      this.fabricObj.setWidth(this.cavWidth)
      this.fabricObj.setHeight(this.cavHeight)
      //绑定画板事件
      this.fabricObjAddEvent()
      this.upperCanvas = document.getElementsByClassName('upper-canvas')[0];
      this.upperCanvas.oncontextmenu = (event) => {
        let pointer = this.fabricObj.getPointer(event.originalEvent); // 获取当前鼠标点击的点
        console.log(pointer)
        let objects = this.fabricObj.getObjects();
        for (let i = objects.length - 1; i >= 0; i--) {
          let object = objects[i];
          //判断该对象是否在鼠标点击处
          if (this.fabricObj.containsPoint(event, object)) {
            //显示菜单
            this.$refs.ctxshow.showMenu(event, object);
            continue;
          }
        }
      }
    },
    contactRoom() {
      alert('关联房间')
      this.$refs.ctxshow.hideMenu(); // 隐藏菜单
    },
    unContactRoom() {
      alert('取消关联')
      this.$refs.ctxshow.hideMenu(); // 隐藏菜单
    },

    //时间监听
    fabricObjAddEvent() {
      this.fabricObj.on({
        'contextmenu': () => {
        },
        'mouse:down': (o)=> {
          // 判断是否按下alt建   拖动画布
          if(o.e.altKey) {
            this.panning = true;
            this.fabricObj.selection = false;
          }
          if (this.isCustomize) {
            if (this.isFirst) {
              this.mouseFrom.x = o.absolutePointer.x;
              this.mouseFrom.y = o.absolutePointer.y;
              this.isFirst = false;
            } else {
              if (this.fabricObjectList.length > 0) {
                if (this.fabricObjectList[this.fabricObjectList.length - 1].path[1][0] == 'L') {
                  this.mouseFrom.x = this.fabricObjectList[this.fabricObjectList.length - 1].path[1][1];
                  this.mouseFrom.y = this.fabricObjectList[this.fabricObjectList.length - 1].path[1][2];
                } else {
                  this.mouseFrom.x = this.fabricObjectList[this.fabricObjectList.length - 1].path[1][3];
                  this.mouseFrom.y = this.fabricObjectList[this.fabricObjectList.length - 1].path[1][4];
                }
              }
            }
          } else {
            this.mouseFrom.x = o.absolutePointer.x;
            this.mouseFrom.y = o.absolutePointer.y;
          }
          this.doDrawing = true;
          if(this.currentTool=='text') {
            this.drawText()
          }
        },
        'mouse:up': (o)=> {
          // 判断是否可以结束拖动画布
          if(o.e.altKey) {
            this.panning = false;
            this.fabricObj.selection = true;
          }
          this.mouseTo.x = o.absolutePointer.x;
          this.mouseTo.y = o.absolutePointer.y;
          if (this.isCustomize && (this.currentTool == 'line' || this.currentTool == 'curve') && this.drawingObject) {
            this.fabricObjectList.push(this.drawingObject);
          }
          if (this.currentTool == 'curve') {
            this.fabricObjectDragger = this.makeCurvePoint(this.left, this.top, null, this.drawingObject, null);
            if (this.isCustomize) {
              this.fabricObjectDragger.name = 'customizeP1'
            } else {
              this.fabricObjectDragger.name = 'curveP1'
            }
            this.fabricObj.add(this.fabricObjectDragger);
          }
          this.drawingObject = null;
          this.moveCount = 1;
          this.doDrawing = false;
          this.updateModifications(true);
        },
        'mouse:wheel': o => {
          this.zoom = (event.deltaY > 0 ? -0.1 : 0.1) + this.fabricObj.getZoom();
          this.zoom = Math.max(0.1, this.zoom); //最小为原来的1/10
          this.zoom = Math.min(3, this.zoom); //最大是原来的3倍
          let zoomPoint = new fabric.Point(event.pageX, event.pageY);
          this.fabricObj.zoomToPoint(zoomPoint, this.zoom);
        },
        'mouse:move': (o)=> {
          if (this.panning && o && o.e) {
            var delta = new fabric.Point(o.e.movementX, o.e.movementY);
            this.fabricObj.relativePan(delta);
          }
          if (this.moveCount % 2 && !this.doDrawing) {
            //减少绘制频率
            return;
          }
          this.moveCount++;
          this.mouseTo.x = o.absolutePointer.x;
          this.mouseTo.y = o.absolutePointer.y;;
          this.drawing();
        },
        // 鼠标双击
        'mouse:dblclick': e => {
          if (this.currentTool=='merge') {
            let group = new fabric.Group(this.selectionObject, {
              left: 150,
              top: 100,
              angle: 0
            })
            this.selectionObject.forEach(item => {
              this.fabricObj.remove(item);
            })
            this.fabricObj.add(group);
          }
          if (this.isCustomize) {
            this.drawCustomize();
            this.isCustomize = false;
            this.handleTools(this.toolsArr[0], 0)
          }
        },
        //增加对象
        'object:added': (e)=>{
          // debugger
        },
        'object:modified':(e)=> {
          e.target.opacity = 1;
          let object = e.target;
          this.updateModifications(true)
        },
        'selection:created': (e)=>{
          this.onObjectSelected(e);
          this.selectionObject = e.selected;
          let selectablePointer = [];
          this.selectionObject.forEach(item => {
            selectablePointer.push({
              from: [item.x1, item.y1],
              to: [item.x2, item.y2]
            })
          })
          if (this.currentTool == 'remove') {
            if (e.target._objects) {
              //多选删除
              let etCount = e.target._objects.length;
              for (let etindex = 0; etindex < etCount; etindex++) {
                this.fabricObj.remove(e.target._objects[etindex]);
              }
            } else {
              //单选删除
              this.fabricObj.remove(e.target);
            }
            this.fabricObj.discardActiveObject(); //清楚选中框
            this.updateModifications(true) 
          }
        },
        'object:moving': e => {
          this.onObjectMoving(e)
        },
        'before:selection:cleared': e => {
          this.onBeforeSelectionCleared(e);
        }
      });
    },
    // 获取多边形
    drawCustomize() {
      let pathString = '';
      let leftPointerList = [];
      let topPointerList = [];
      this.fabricObjectList.forEach((item, index) => {
        if (item) {
          if (index == 0) {
            pathString += `${item.path[0][0]} ${item.path[0][1]} ${item.path[0][2]} `
          }
          if (item.path[1][0] == 'L') {
            pathString += `${item.path[1][0]} ${item.path[1][1]} ${item.path[1][2]} `
          } else {
            pathString += `${item.path[1][0]} ${item.path[1][1]} ${item.path[1][2]}, ${item.path[1][3]} ${item.path[1][4]} `
          }
        }
        leftPointerList.push(item.path[0][1]);
        topPointerList.push(item.path[0][2]);
      })
      pathString += `L ${this.fabricObjectList[0].path[0][1]} ${this.fabricObjectList[0].path[0][2]} z`;
      let pathStringObj = new fabric.Path(pathString, { 
        top: Math.min.apply(Math, topPointerList), 
        left: Math.min.apply(Math, leftPointerList),  
        stroke: this.drawColor,
        fill: "red",
        strokeWidth: this.drawWidth
      })
      this.fabricObjectList.forEach(item => {
        this.fabricObj.remove(item);
      })
      this.fabricObjectList = [];
      this.fabricObj.add(pathStringObj);
      let customizePointerObj = this.fabricObj._objects.filter(item => item.name == 'customizeP1')
      customizePointerObj.forEach(item => {
        this.fabricObj.remove(item)
      })
        
    },
    //储存历史记录
    updateModifications(savehistory) {
      if(savehistory==true) {
        this.fabricHistoryJson.push(JSON.stringify(this.fabricObj))
      }
      console.log(this.fabricObj)
    },
    //canvas 历史后退
    undo() {
      this.fabricObjectList.splice(this.fabricObjectList.length-1, 1)
      let state = this.fabricHistoryJson
      if(this.mods < state.length) {
        this.fabricObj.clear().renderAll();
        this.fabricObj.loadFromJSON(state[state.length - 1 - this.mods - 1]);
        this.fabricObj.renderAll();
        this.mods += 1;
      }
    },
    //前进
    redo() {
      let state = this.fabricHistoryJson
      if (this.mods > 0) {
        this.fabricObj.clear().renderAll();
        this.fabricObj.loadFromJSON(state[state.length - 1 - this.mods + 1]);
        this.fabricObj.renderAll();
        this.mods -= 1;
      }
    },
    transformMouse(mouseX, mouseY) {
      return { x: mouseX / this.zoom, y: mouseY / this.zoom };
    },
    resetObj() {
      this.fabricObj.selectable = false
      this.fabricObj.selection = false
      this.fabricObj.skipTargetFind = true
      //清除文字对象
      if(this.textboxObj) {
        this.textboxObj.exitEditing();
        this.textboxObj = null;
      }
    },
    handleTools(tools, idx) {
      this.initIdx = idx;
      this.currentTool = tools.name;
      this.fabricObj.isDrawingMode = false;
      this.resetObj()
      switch(tools.name) {
      case 'pencil':
        this.fabricObj.isDrawingMode = true;
        break;
      case 'remove':
        this.fabricObj.selection = true
        this.fabricObj.skipTargetFind = false
        this.fabricObj.selectable = true
        break;
      case 'reset':
        this.fabricObj.clear();
        break;
      case 'redo':
        this.redo();
        break;
      case 'undo':
        this.undo();
        break;
      case "dragger":
        this.fabricObj.skipTargetFind = false;
        this.fabricObj.selectable = true;
        this.fabricObj.selection = true;
        break;
      case "merge":
        this.fabricObj.skipTargetFind = false;
        this.fabricObj.selectable = true;
        this.fabricObj.selection = true;
        break;
      case 'line':
        break;
      case 'curve':
        break;
      case 'customize':
        this.isCustomize = true;
        break;
      case 'bg':
        // this.downLoadImage();
        break;
      default:
        break; 
      }
    },
    //绘制文字对象
    drawText() {
      this.textboxObj = new fabric.Textbox(" ", {
        left: this.mouseFrom.x,
        top: this.mouseFrom.y,
        width: 220,
        fontSize: 18,
        fill: this.drawColor,
        hasControls: true
      });
      this.fabricObj.add(this.textboxObj);
      this.textboxObj.enterEditing();
      this.textboxObj.hiddenTextarea.focus();
      this.updateModifications(true)
    },
    drawing() {
      let _this = this;
      if(this.drawingObject) {
        this.fabricObj.remove(this.drawingObject)
      }
      let fabricObject = null
        
      switch (this.currentTool) {
      case 'pencil':
        this.fabricObj.isDrawingMode = true
        break;
      case 'line':
        fabricObject = new fabric.Path(`M ${this.mouseFrom.x} ${this.mouseFrom.y} L ${this.mouseTo.x} ${this.mouseTo.y}`, {
          stroke: this.drawColor,
          fill: "rgba(255, 255, 255, 0)",
          strokeWidth: this.drawWidth,
        })
        break;
      case 'arrow':
        fabricObject = new fabric.Path(this.drawArrow(this.mouseFrom.x, this.mouseFrom.y, this.mouseTo.x, this.mouseTo.y, 17.5, 17.5), {
          stroke: this.drawColor,
          fill: "rgba(255,255,255,0)",
          strokeWidth: this.drawWidth
        });
        break;
      case 'xuxian': //doshed line
        fabricObject = new fabric.Line([this.mouseFrom.x, this.mouseFrom.y, this.mouseTo.x, this.mouseTo.y],{
          strokeDashArray: [10, 3],
          stroke: this.drawColor,
          strokeWidth: this.drawWidth
        })
        break;
      case 'juxing': //矩形
        fabricObject = new fabric.Rect({
          left: this.mouseFrom.x,
          top: this.mouseFrom.y,
          stroke: this.drawColor,
          strokeWidth: this.drawWidth,
          width: this.mouseTo.x - this.mouseFrom.x,
          height: this.mouseTo.y - this.mouseFrom.y,
          fill: "rgba(255, 255, 255, 0)"
        });
        break;
      // eslint-disable-next-line no-case-declarations
      case "cricle": //正圆
        let radius = Math.sqrt((this.mouseTo.x - this.mouseFrom.x) * (this.mouseTo.x - this.mouseFrom.x) + (this.mouseTo.y - this.mouseFrom.y) * (this.mouseTo.y - this.mouseFrom.y)) / 2;
        fabricObject = new fabric.Circle({
          left: this.mouseFrom.x,
          top: this.mouseFrom.y,
          stroke: this.drawColor,
          fill: "rgba(255, 255, 255, 0)",
          radius: radius,
          strokeWidth: this.drawWidth
        });
        break;
      // eslint-disable-next-line no-case-declarations
      case "ellipse": //椭圆
        let left = this.mouseFrom.x;
        let top = this.mouseFrom.y;
        let ellipse = Math.sqrt((this.mouseTo.x - left) * (this.mouseTo.x - left) + (this.mouseTo.y - top) * (this.mouseTo.y - top)) / 2;
        fabricObject = new fabric.Ellipse({
          left: left,
          top: top,
          stroke: this.drawColor,
          fill: "rgba(255, 255, 255, 0)",
          originX: "center",
          originY: "center",
          rx: Math.abs(left - this.mouseTo.x),
          ry: Math.abs(top - this.mouseTo.y),
          strokeWidth: this.drawWidth
        });
        break;
      // eslint-disable-next-line no-case-declarations
      case "equilateral": //等边三角形
        let height = this.mouseTo.y - this.mouseFrom.y;
        fabricObject = new fabric.Triangle({
          top: this.mouseFrom.y,
          left: this.mouseFrom.x,
          width: Math.sqrt(Math.pow(height, 2) + Math.pow(height / 2.0, 2)),
          height: height,
          stroke: this.drawColor,
          strokeWidth: this.drawWidth,
          fill: "rgba(255,255,255,0)"
        });
        break;
      // eslint-disable-next-line no-case-declarations
      case 'curve':
        let path = `M ${this.mouseFrom.x} ${this.mouseFrom.y} Q ${(this.mouseFrom.x + this.mouseTo.x) / 2}  ${(this.mouseFrom.y + this.mouseTo.y) / 2 + 100}, ${this.mouseTo.x} ${this.mouseTo.y}`
        fabricObject = new fabric.Path(path, {
          stroke: this.drawColor,
          fill: "rgba(255, 255, 255, 0)",
          strokeWidth: this.drawWidth,
          objectCaching: false 
        })
        // this.fabricObjectDragger = new fabric.Circle({
        //   left: (this.mouseFrom.x + this.mouseTo.x) / 2,
        //   top: (this.mouseFrom.y + this.mouseTo.y) / 2 + 100,
        //   stroke: "red",
        //   fill: "red",
        //   radius: "5",
        //   strokeWidth: this.drawWidth
        // });
        this.top = (this.mouseFrom.y + this.mouseTo.y) / 2 + 100;
        this.left = (this.mouseFrom.x + this.mouseTo.x) / 2;
        break;
      case 'remove':
        break;   
      default:
        break;
      }
      if(fabricObject) {
        this.fabricObj.add(fabricObject);
        this.drawingObject = fabricObject;
      }
    }, 
    //书写箭头的方法
    drawArrow(fromX, fromY, toX, toY, theta, headlen) {
      theta = typeof theta != "undefined" ? theta : 30;
      headlen = typeof theta != "undefined" ? headlen : 10;
      // 计算各角度和对应的P2,P3坐标
      let angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
        angle1 = (angle + theta) * Math.PI / 180,
        angle2 = (angle - theta) * Math.PI / 180,
        topX = headlen * Math.cos(angle1),
        topY = headlen * Math.sin(angle1),
        botX = headlen * Math.cos(angle2),
        botY = headlen * Math.sin(angle2);
      let arrowX = fromX - topX,
        arrowY = fromY - topY;
      let path = " M " + fromX + " " + fromY;
      path += " L " + toX + " " + toY;
      arrowX = toX + topX;
      arrowY = toY + topY;
      path += " M " + arrowX + " " + arrowY;
      path += " L " + toX + " " + toY;
      arrowX = toX + botX;
      arrowY = toY + botY;
      path += " L " + arrowX + " " + arrowY;
      return path;
    },
    downLoadImage() {
      this.done = true
      //生成双倍像素比的图片
      setTimeout(() => {
        let base64URl = this.fabricObj.toDataURL({
          formart: 'png',
          multiplier: 1
        })
        this.imageBase64 = base64URl
        this.done = false
      }, 0)
    },
    onObjectSelected(e) {
      let activeObject = e.target;
      if (activeObject.name == "p0" || activeObject.name == "p2") {
        activeObject.line2.animate('opacity', '1', {
          duration: 200,
          onChange: this.fabricObj.renderAll.bind(this.fabricObj),
        });
        activeObject.line2.selectable = true;
      }
    },
    onBeforeSelectionCleared(e) {
      let activeObject = e.target;
      if (activeObject.name && activeObject.name.indexOf("P1") > -1) {
        activeObject.animate('opacity', '0', {
          duration: 200,
          onChange: this.fabricObj.renderAll.bind(this.fabricObj),
        });
        activeObject.selectable = false;
      }
    },
    makeCurvePoint(left, top, line1, line2, line3) {
      let c = new fabric.Circle({
        left: left,
        top: top,
        strokeWidth: 8,
        radius: 14,
        fill: '#fff',
        stroke: '#666'
      });
      c.hasBorders = c.hasControls = false;
      c.line1 = line1;
      c.line2 = line2;
      c.line3 = line3;
      return c;
    },
    onObjectMoving(e) {
      if (e.target.name && e.target.name.indexOf("P1") > -1) {
        let p = e.target;
        if (p.line2) {
          p.line2.path[1][1] = p.left;
          p.line2.path[1][2] = p.top;
        }
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.fl{float: left;}
.wraper{
  position: relative;
  width: 100%;
  height: 100%;
 .title-font{ padding:0 8px;}
 .canvas-wraper{
    width: 100%;
    display:flex;
    height: calc(100% - 75px);
    overflow: auto;
    background: url(../../assets/images/white-bg.jpg) #eff0f2; 
    .plane-btn{
      left:260px;
      z-index: 2;
      bottom:calc(100%/2 - 25px)
    }
    .plane-r-btn{
      right:320px;
      z-index: 2;
      bottom:calc(100%/2 - 25px)
    }
    .btn-off{
      left:0;
      }
    .btn-off-r{
      right: 0;
      }
    .canvas-l-tree{
      width:260px;
      height:calc(100% - 15px);
      padding:20px 15px;
      background:#fff;
      box-sizing:border-box;
      border-radius:8px;   
      box-shadow: 5px 5px 5px #DCDFE6;   
     }
    .canvas-r-plane{
        width:320px;
        height:calc(100% - 15px); 
        box-sizing:border-box; 
        background:#fff; 
        box-shadow: 5px 5px 5px #DCDFE6;
    
    .plane-box{
      .plane-box-title{
        width:100%;
        height: 50px;
        line-height: 50px;
        background: #fafafa;
        border-bottom: 1px solid #E4E7ED;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        color: #303133;
        span{ font-size: 16px;
           padding-left:5px;
        }
        .plane-box-ul{
          float: right;
          li{ display: inline-block;
           .plane-box-item{
              border: none;
              background: transparent;
              padding:0 8px;
           }
          }  
      }
      }
      .plane-box-search{  padding:5px 15px;}
      .plane-box-info{ 
        width:100%;
        // min-height:300px;
        padding:10px 15px;
        box-sizing:border-box;
        font-size: 14px;
        overflow-y:auto;
        .box-info-ul{
            display:flex;
            flex-wrap: wrap;
            box-sizing: border-box;
          li:nth-child(3n) {
              padding-right: 0;}
          li {  
              padding: 0 10px 10px 0;
              flex: none;
              width:33%;
              box-sizing: border-box;
            a{     
              display: flex;             
              justify-content: center;
              width: 100%;            
              padding:5px 8px; 
              box-sizing: border-box; 
               border:1px solid #E4E7ED;  
               border-radius:2px; 
              .info-hidden{
                  min-width:0;           
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
              }
            }
              .active{
                background:#2f70ff;
                border:none;
                color:#fff;
              }
              .bind-color{border-left:4px solid #ffdb49}
          }
        }
      }
      .box-info-tab tr td{
        padding:10px 5px;
      }
    }   
    
     }
    .canvas-board{ 
       overflow-x: auto;
       .canvas-organ-box {
           bottom: 5px;
           left: 10px;
          .organ-item-ul{ 
             display: flex;
             flex-wrap: wrap;
           li{
             padding: 0 25px 10px 0;
            flex: none;
             .organ-item-col{ 
                display:inline-block;
                width:12px;
                height:12px;
                margin-right:10px;
                border-radius: 2px;
                vertical-align: middle;
              }
         .item-col-1{ background: #2f70ff;}
           }
           }
       }
    }  
    }   
    .controlPanel{
        width: 100%;
        height: 35px;
        background: #fff;
        display: flex;
        border-bottom:1px solid #E4E7ED;  
        box-sizing: border-box;
        justify-content:space-between;
        align-items: center;
        .wraper-title{
            font-size:16px;
            color:#303133;
            flex:1;   
            padding-left:15px;
            box-sizing: border-box;    
        }
      .contrl-r-box{ flex:1;
          display:flex;
          justify-content:flex-end;
          .contro-item{       
              flex-basis: 40px;
            i{
              color: #606266;
              font-size: 16px;
              line-height: 35px;
              flex-basis: 40px;
            }
            &.active{
              font-size: 16px;
                   background: #ececec;
              i{
                color: #2f70ff;
                font-size: 16px;
              }
            }
          }        
      } 
    
    }

    .tools-box{
        width: 100%;
        height: 40px;
        background: #f8f8f8;
        box-sizing: border-box;
        display: flex;
    justify-content:space-between;
      align-items: center;
          .contrl-m-box{  
            flex:2;  
            display:flex;  
            justify-content: center;  
             .contro-item{
                flex-basis: 60px;
                text-align: center;
                cursor: pointer;
                i{
                    font-size: 20px;
                    font-weight: 700;
                    line-height: 40px;
                }
                 .icon-ziyuan2{font-size: 8px} 
            &.active{
                background: #ececec;      
                border-radius: 3px;
              i{
                color: #2f70ff;
                font-size: 20px;
              }
               .icon-ziyuan2{font-size: 8px} 
            }
          }
                
             }
        .el-drop{  
          position: absolute !important;
          bottom: -14px;
          right: -6px;
      }
      .dropdown-tools { 
        top:62px !important;
      }
           }
   
    .download{
      img{
        width: 100%;
      }
    }
    .ctx-menu-container{
       padding:0;
      .vue-menu-icon{
          width:200px;
          display:flex;
          box-sizing:border-box;
          background:#33373c;
          .context-btn{
            padding: 12px 10px;
            justify-content:center;
            background:transparent;
            flex:1;
            border:none;
            margin-left:0;
            i{ 
                color:#d2d3d4;
                font-size:20px;
            }
          }
        }
    }
         
  }

</style>