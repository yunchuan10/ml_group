<template>
  <div class="wraper" ref="wraper">
    <!-- 头部信息 -->
    <div class="controlPanel">
      <div class="wraper-title">{{currentAddress}}</div>     
      <div class="contrl-r-box">
        <el-button style="padding:0;margin:0;"  type="text" :class="index_T==Index ? 'active' : ''" class="contro-item" v-for="(item,Index) in toolsArr2" :key="Index" @click="_handleTools(item, Index)">
          <i :title="item.content" :class="'iconfont' + item.icon"></i>
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
           <!-- <el-dropdown  size="medium" trigger="click" v-if="item.name ==='bg'"  class="el-drop">
            <span class="el-dropdown-link">
              <i class="iconfont icon-ziyuan2"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="dropdown-tools">
              <el-checkbox-group v-model="checkList">
                <el-dropdown-item>
                  <el-checkbox label="roomNo">房间号</el-checkbox>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-checkbox label="useArea">使用面积</el-checkbox>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-checkbox label="useOrganName">使用单位</el-checkbox>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-checkbox label="bg">底图</el-checkbox>
                </el-dropdown-item>
              </el-checkbox-group>
            </el-dropdown-menu>
          </el-dropdown>     -->
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
        <el-input placeholder="请输入楼层" v-model="filterText"></el-input>
        <el-tree class="filter-tree" :data="roomNoteList" @node-click="updateCourtyardName"  :default-expanded-keys="expandedKeys" :highlight-current="true" node-key="value" :props="defaultProps" :filter-node-method="filterNode" ref="tree"></el-tree>
      </div>
      <!-- 中间画布 -->
      <div class="canvas-board f-relative" ref="canvasBoard" :style="{width: cavWidth}">
        <canvas id="canvas" ref="canvas"></canvas>
        <div class="canvas-organ-box f-absolute">
          <ul class="organ-item-ul">
            <li v-for="(item,index) in organColorList" :key="index"><i class="organ-item-col" :style="{background: item.colourValue}"></i><span>{{item.useOrganName}}</span></li>
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
              <li><el-button class="plane-box-item" @click="updateRoom('',storeysId,storeysName,'add')"><i title="新增房间" class="iconfont icon-plus-square-fill"></i></el-button></li>
              <li><el-button class="plane-box-item" @click="deleteClick(roomID)" :disabled ="isDelete?isDelete:false"><i title="删除房间" class="iconfont icon-minus-square-fill"></i></el-button></li>
              <li><el-button class="plane-box-item" @click="updateRoom(roomID,storeysId,storeysName,'edit')" :disabled ="isAble?isAble:false"><i title="修改房间" class="iconfont icon-edit"></i></el-button></li>
              <!-- <li><el-button class="plane-box-item" @click='handleSearch'><i title="查询房间" class="iconfont icon-search"></i></el-button></li>             -->
            </ul>
          </h2>
          <div class="plane-box-search" @keydown="$keydown($event, getDataRequest)">
            <el-input v-show="isSeach" placeholder="请输入房间号" v-model="search.roomNo" clearable>
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
          <div v-show="!isShow" class="plane-box-info">           
            <ul class="box-info-ul">
              <li v-for ="(item,index) in list" :key="index">
                <a  @click="getDetailClick(index, item.id)" :class="[index_R === index?'active':'',item.points?'bind-color':'']"  :title="item.roomNo.length > 4?item.roomNo:''">
                  <span class="info-hidden" >{{item.roomNo}}</span>
                </a>
              </li>                      
            </ul>
              <span class="defalut-tips" v-show="list ==''">当前楼层暂无房间</span>  
          </div>
        </div>
        <div class="plane-box f-clearfix">
          <h2 class="plane-box-title"><span class="fl"><i class="title-font iconfont" :class="isDetail?'icon-you':'icon-xiangshang'" @click="handleChange('isDetail')"></i>房间详情</span></h2>
          <div v-show="!isDetail" class="plane-box-info">           
            <table class="box-info-tab">
              <tr><td style="width:90px;">房间号</td><td class="td-color">{{roomData.roomNo}}</td></tr>
              <tr><td>建筑面积</td><td class="td-color">{{roomData.buildArea ? roomData.buildArea+'㎡': ''}}</td></tr>
              <tr><td>使用面积</td><td class="td-color">{{roomData.useArea ? roomData.useArea+'㎡': ''}}</td></tr>
              <tr><td>照片信息</td><td > 
                <img :src ="firstImg" style="width: 90px;height: 90px;,margin: 5px" v-show="firstImg" />               
                </td></tr>
            </table>
          </div>
        </div>  
        <div class="plane-box f-clearfix">
          <h2 class="plane-box-title"><span class="fl"><i class="title-font iconfont"  :class="isAssign?'icon-you':'icon-xiangshang'" @click="handleChange('isAssign')"></i>房间分配</span></h2>
          <div v-show="!isAssign" class="plane-box-info">           
              <table class="box-info-tab">
                <tr><td  style="width:90px;">使用单位</td><td class="td-color">{{roomData.useOrganName}}</td></tr>
                <tr><td>分配时间</td><td class="td-color">{{roomData.dataAssign?roomData.dataAssign.substr(0, 10):''}}</td></tr>
                <tr><td>退房时间</td><td class="td-color">{{roomData.dateCheckOut?roomData.dateCheckOut.substr(0, 10):''}}</td></tr>
                <tr><td>使用方式</td><td class="td-color">{{roomData.userModeName}}</td></tr>
              </table>
          </div>
        </div>
      </div>
    </div>    
  <!-- 画布右键出现的按钮 -->
    <e-vue-contextmenu ref="ctxshow" id="contextStyle">
      <div class="vue-menu-icon">
        <el-tooltip class="item" effect="dark" content="关联房间" placement="bottom">
          <el-button class="context-btn" :disabled="isRelative"  @click="relationRoom"><i class="iconfont icon-lianjie"></i></el-button>    
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="取消关联" placement="bottom">
          <el-button class="context-btn" :disabled="!isRelative" @click="showtipsRoom"> <i class="iconfont icon-duankailianjie"></i> </el-button> 
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="分配房间" placement="bottom">
          <el-button class="context-btn" @click="allocationRoom" :disabled="isCancel"> <i class="iconfont icon-fenpei1"></i> </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="取消分配" placement="bottom">
          <el-button class="context-btn" :disabled="!isRelative || !isCancel" @click="cancelAllocateRoom"> <i class="iconfont icon-quxiaofenpei"></i> </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="置于底层" placement="bottom">
          <el-button class="context-btn" @click="goLayer('BOTTOM')"> <i class="iconfont icon-zhiyudiceng"></i> </el-button>
        </el-tooltip>
         <el-tooltip class="item" effect="dark" content="置于顶层" placement="bottom">
          <el-button class="context-btn" @click="goLayer('TOP')"> <i class="iconfont icon-zhiyudingceng"></i> </el-button>
        </el-tooltip>
      </div>
    </e-vue-contextmenu>
    <!-- 分配房间 -->
    <room-allocation ref="roomAllocation" @allocationData="initCanvasBg(true)"></room-allocation>
    <!-- 关联房间 -->
    <room-relation ref="roomRelation" @relativeData ="relativeDataCallBack"></room-relation>   
    <!-- 新增房间 -->
    <room-update ref="roomUpdate" @requestData="initCanvasBg(true)"></room-update>  
    <!-- 取消关联房间操作提示框 -->
    <room-showtips ref="roomShowtips" @cancelRelaData ="cancelRelaData"></room-showtips>    
    <!-- 取消分配作提示框 -->
    <room-norelation ref="roomNorelation" @cancelAllocation ="cancelAllocation"></room-norelation>    
    <!-- 复制楼层房间操作提示框 -->
    <room-floorcopy ref="roomFloorcopy" @copyStoreysData="copyStoreysData"></room-floorcopy>  
        <!-- 打印平面图操作提示框 -->
    <room-planeprint ref="planeprint" ></room-planeprint>  
          <!-- 打印平面图操作说明 -->
    <room-planeremark ref="roomRemark" ></room-planeremark>  
    <!-- 房间操作提示框 --> 
    <room-list ref="roomList"></room-list>    
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" @click="YDeleteClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>
<script>
import { fabric } from 'fabric'
import roomRemark from '@/components/plane/view/room-shortcut.vue'; // 快捷方式说明
import roomAllocation from '@/components/plane/view/room-allocation.vue'; // 分配房间弹出框
import roomRelation from '@/components/plane/view/room-relation.vue'; // 关联房间弹出框
import roomFloorcopy from '@/components/plane/view/room-floorcopy.vue'; // 复制楼层房间弹出框
import roomUpdate from '@/components/plane/view/room-update.vue'; // 新增房间弹出框
import roomShowtips from '@/components/plane/view/room-showTips.vue'; // 房间操作提示框
import roomNorelation from '@/components/plane/view/room-noallocation.vue'; // 取消分配房间操作提示框
import roomList from '@/components/plane/view/room-list.vue'; // 房间信息框
import planeprint from '@/components/plane/view/plane-print.vue'; // 平面图打印
import whiteLine from '@/assets/images/white-line.png'

export default{
  components: {
    'room-allocation': roomAllocation,
    'room-planeremark':roomRemark,
    'room-relation': roomRelation,
    'room-update':roomUpdate,
    'room-showtips':roomShowtips,
    'room-norelation':roomNorelation,
    'room-list':roomList,
    'room-planeprint':planeprint,
    'room-floorcopy':roomFloorcopy
  },
  data() {
    return{
      currentTool: '',
      isShow:false,
      message:'',  //提示框返回信息
      YPromptShow:false, 
      isBol:false,
      isDetail:false,
      isAssign:false,
      isTree:false,
      isRelative:false, //关联按钮是否可用
      isCancel:false, //取消关联是否可用
      isRbox:false, //右边的盒子
      isSeach:false, //搜索框显示与隐藏
      YConfirmShow: false, // 删除弹出框
      isAble:true,//修改房间按钮是否可用
      isDelete: true, //删除房间按钮
      currentAddress:'', //当前地址
      expandedKeys:[],//当前树节点选中的id
      checkList:[],
      search:{
        roomNo:'',
      },
      fabricObj: null,
      initIdx: 0,
      index_T:0, //头部右侧工具
      index_R:0, //右侧房间号
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
        // {
        //   content:'下一步',
        //   name: 'redo',
        //   icon: ' icon-xiayibu'
        // },
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
        // {
        //   content:'显示或隐藏操作',
        //   name: 'bg',
        //   icon: ' icon-yanjing'
        // }
      ],
      toolsArr2:[   
        {
          name:'shortcut',
          content:'快捷键使用说明',
          icon: ' icon-gantanhao'
        },   
        // {
        //   name: 'copy',
        //   content:'复制',
        //   icon: ' icon-copy-fill'
        // },
        {
          name: 'group',
          content:'房间列表',
          icon: ' icon-layergroup-fill'
        },
        {
          name: 'print',
          content:'打印',
          icon: ' icon-print'
        }
      ],
      filterText: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      list:[], //房间列表
      organColorList:[], //单位图例
      courtyardId:'', //院落id
      copyStoreysId:'', //复制的楼层id
      storeysId:'', //楼层id
      storeysName:'', //楼层名称
      roomNoteList:[],//树型菜单
      floorId:'',
      floorID:'',
      roomData:{},
      firstImg:'', //详情默认显示第一个图片
      defaultRoomId:'', //默认房间id
      roomID:'', //房间id
      deleteYardId:'', //取消房间id
      mouseFrom:{},
      mouseTo:{},
      moveCount: 1,
      doDrawing: false,
      fabricHistoryJson: [],
      mods: 0,
      drawingObject: null, //绘制对象
      drawColor: '#000',
      drawWidth: 2,
      imageBase64: '',
      zoom: 1,
      selectionObject: [],
      fabricObjectList: [],
      firstImgData:'', 
      isCustomize: false,
      customizePath: '',
      page:1,
      W:580,
      isFirst: false,
      left: '0',
      top: '0',
      fabricObjectDragger: null,
      panning: false,
      selectOneObj: null,
      floorPlanImg: '',
      roomId:'',
      roomNo:'', //分配房间的房间号
      nCopyTime: 1, // 复制次数
      oWiatCopyCanvasObject: null, // 选中的未绑定的图形对象，用来复制，粘贴，复制的转换变量，
      oCopyCanvasObject: null // 复制的对象
    }
  },
  activated() {
    if(this.$route.query.courtyardId){
      this.courtyardId = this.$route.query.courtyardId
    }
    this.getTree()
    // if(this.$route.query.storeyId){
    //   this.storeyId = this.$route.query.storeyId;    
    //   this.getFloor()             
    // }else{
    //   this.storeyId = ''
    // }   
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
        // ctrl + c 复制
        if(e.ctrlKey && e.keyCode == 67) { 
          this.oCopyCanvasObject = this.oWiatCopyCanvasObject;
          this.nCopyTime = 1;
        }
        // ctrl + v 粘贴
        if(e.ctrlKey && e.keyCode == 86 && this.oCopyCanvasObject !== null) { 
          let _oCopyCanvasObject = this.handlerCopyCanvasObject(this.oCopyCanvasObject, {colorCode: 'rgba(255, 255, 255, 0)'});
          this.$set(_oCopyCanvasObject, 'left', _oCopyCanvasObject.left + 10 * this.nCopyTime);
          this.$set(_oCopyCanvasObject, 'top', _oCopyCanvasObject.top + 10 * this.nCopyTime);
          this.nCopyTime++;
          this.fabricObj.add(_oCopyCanvasObject)
        }
      })
      document.addEventListener('keydown',(event)=>{
        if(event.ctrlKey && event.keyCode == 83 && this.fabricObj !== null) {
          event.preventDefault(); // 或者 return false;
          this.handleSaveCanvasObject()
        }
      })
    })    
  },
  computed:{
    cavWidth(){
      return window.innerWidth - this.W;
    },
    cavHeight(){
      return window.innerHeight - 90;
    },
    storeysIds(){
      return this.$store.state.mainData.storeysId}
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
    /***
     * 绘制图像
     * @return {fabricObject} 返回一个图像对象
     * @params {cavInfo} 图形数据
     * @params {roomInfo} 房间相关信息
     */
    handlerCopyCanvasObject(cavInfo, roomInfo) {
      let fabricObject = null;
      if (cavInfo.type == 'rect') {
        fabricObject = new fabric.Rect({
          left: cavInfo.left,
          top: cavInfo.top,
          stroke: cavInfo.stroke,
          strokeWidth: cavInfo.strokeWidth,
          width: cavInfo.width,
          height: cavInfo.height,
          fill: roomInfo.colorCode,
          scaleX: cavInfo.scaleX,
          scaleY: cavInfo.scaleY,
          angle: cavInfo.angle
        });
      } else if (cavInfo.type == 'circle') {
        fabricObject = new fabric.Circle({
          left: cavInfo.left,
          top: cavInfo.top,
          stroke: cavInfo.stroke,
          fill: roomInfo.colorCode,
          radius: cavInfo.radius,
          strokeWidth: cavInfo.strokeWidth,
          scaleX: cavInfo.scaleX,
          scaleY: cavInfo.scaleY,
          angle: cavInfo.angle
        });
      } else if (cavInfo.type == 'ellipse') {
        fabricObject = new fabric.Ellipse({
          left: cavInfo.left,
          top: cavInfo.top,
          stroke: cavInfo.stroke,
          fill: roomInfo.colorCode,
          originX: cavInfo.originX,
          originY: cavInfo.originY,
          rx: cavInfo.rx,
          ry: cavInfo.ry,
          strokeWidth: cavInfo.strokeWidth,
          scaleX: cavInfo.scaleX,
          scaleY: cavInfo.scaleY,
          angle: cavInfo.angle
        });
      } else if (cavInfo.type == 'path') {
        let pathString = '';
        cavInfo.path.forEach((item, index) => {
          if (item[0] == 'M' || item[0] == 'L') {
            pathString += `${item[0]} ${item[1]} ${item[2]} `
          } else if (item[0] == 'Q') {
            pathString += `${item[0]} ${item[1]} ${item[2]}, ${item[3]} ${item[4]} `
          } else {
            pathString += `${item[0]}`
          }
        }) 
        fabricObject = new fabric.Path(pathString, { 
          top: cavInfo.top, 
          left: cavInfo.left,  
          stroke: cavInfo.stroke,
          fill: roomInfo.colorCode,
          strokeWidth: cavInfo.strokeWidth,
          scaleX: cavInfo.scaleX,
          scaleY: cavInfo.scaleY,
          angle: cavInfo.angle
        })
      }
      return fabricObject
    },
    /***
     * 编写文字
     * @return {roomNo} 返回一个文字对象
     * @params {data} 图形数据
     * @params {roomInfo} 房间相关信息
     */
    handleCanvasTextObject(data, canvas) {
      let oneLineFontLength = Math.floor(((canvas.width - this.drawWidth * 2 - 10) * canvas.scaleX) / 14) || 1;
      // 对字段进行拆分，目前字体统一设置14px;如后期需改变字体大小可以将字体大小设置为变量
      let fontArray = [];
      let spliceFont = data.roomNo || '';
      for (let i = 0, j = Math.ceil(data.roomNo.length / oneLineFontLength ); i < j; i++) {
        if (j == 1) {
          fontArray = [data.roomNo]
        } else {
          if (i == j - 1) {
            fontArray.push(spliceFont)
          } else {
            fontArray.push(spliceFont.substr(0, oneLineFontLength))
            spliceFont = spliceFont.substr(oneLineFontLength)
          }
        }
      }
      // 文本拼接
      let textString = '';
      fontArray.forEach(item => {
        textString += `${item}\n`
      })
      let roomNo = new fabric.Textbox(`${textString}(${data.useArea?data.useArea:'0'}㎡)`, {
        left: canvas.type == 'ellipse'? canvas.left - canvas.rx + 10 : canvas.left + 5,
        top: canvas.type == 'ellipse'? canvas.top - ((fontArray.length + 1) * 14 / 2) - 10 : canvas.height * canvas.scaleY/2 + canvas.top - ((fontArray.length + 1) * 14 / 2), 
        width: (canvas.width - this.drawWidth * 2) * canvas.scaleX,
        fontSize: 14,
        fill: this.drawColor,
        hasControls: false,
        name: 'roomNo'
      });
      return roomNo;
    },
    /**
     * 处理ctrl + s 保存整个图形
     * @params {e} 事件对象
     */
    handleSaveCanvasObject(e) {
      let aCanvasObject = this.fabricObj._objects;
      let aHasRoom = [], aNoRoom = [];
      aCanvasObject.forEach(item => {
        if (item.type == 'group') {
          aHasRoom.push({
            id: item.id,
            points: JSON.stringify(item)
          })
        } else {
          aNoRoom.push(item)
        }
      })
      let params = {
        storeysId: this.storeysId,
        emptyPoints: JSON.stringify(aNoRoom),
        roomRequestList: aHasRoom
      }
      this.$axiosJsonPost(API.plan_bindEmptyPoint, params).then(res => {
        this.$message({
          message: res.message,
          type: res.result === 'success'?'success':'warning',
          duration:1000
        })
      })
    },
    //按院落查询-从楼层跳转过来树节点默认显示高亮
    getFloor() {
      let params = {
        storeysId: this.storeyId
      };
      this.$axiosPost(API.storeys_queryDetail, params).then(res => {
        let courtyardName,floorName,storeysName,floorImg = '';
        this.currentAddress ='';
        this.floorID = res.data.floorId; 
        courtyardName = res.data.courtyardName;
        floorName = res.data.floorName;
        storeysName = res.data.storeysName;
        if(res.data.fileResponse){
          floorImg = res.data.fileResponse[0].url || '';
        }else{
          floorImg =''
        }     
        this.expandedKeys =[];
        this.expandedKeys.push(this.courtyardId,this.floorID,this.storeyId)
        if(this.expandedKeys){    
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.storeyId);
            })   
          }, 0);                      
        }
        this.currentAddress = `${courtyardName} - ${floorName} - ${storeysName}`;
        this.storeysId = this.storeyId;        
        this.getDataRequest(true)
        if (floorImg) {
          let params = {
            url: floorImg
          }
          this.$axiosPost(API.plan_toBase64, params).then(res => {
            this.floorPlanImg = 'data:image/jpeg;base64,' + res.data;
            this.fabricObj.setBackgroundImage(this.floorPlanImg, this.fabricObj.renderAll.bind(this.fabricObj), {
              repeat:'no-repeat',
              originX: 'left',
              originY: 'top',
            });
          })
        }
        this.fabricObj.clear();
        this.fabricHistoryJson = [];
      });    
    },
    //关联房间
    relativeDataCallBack(data) {
      console.log(data)
      this.$set(this.selectOneObj, 'fill', data.colorCode);
      let roomNo = this.handleCanvasTextObject(data, this.selectOneObj)
      let group = new fabric.Group([this.selectOneObj, roomNo], {
        left: this.selectOneObj.type == 'ellipse'?this.selectOneObj.left - this.selectOneObj.rx : this.selectOneObj.left,
        top: this.selectOneObj.type == 'ellipse'?this.selectOneObj.top - this.selectOneObj.ry : this.selectOneObj.top,
        id: data.id,
        roomNo: data.roomNo,
        useStatus:data.useStatus,
        angle: 0
      })
      this.fabricObj.remove(this.selectOneObj);
      this.fabricObj.add(group);
      this.handleSaveCanvasObject();
      this.getDataRequest();
    },
    //取消关联
    cancelRelaData(){
      let fabricObjone = this.selectOneObj._objects[0];
      let fabricObject = null;
      if (fabricObjone.type == 'rect') {
        fabricObject = new fabric.Rect({
          left: this.selectOneObj.left,
          top: this.selectOneObj.top,
          stroke: fabricObjone.stroke,
          strokeWidth: fabricObjone.strokeWidth,
          width: fabricObjone.width,
          height: fabricObjone.height,
          fill: 'rgba(255, 255, 255, 0)',
          scaleX: fabricObjone.scaleX,
          scaleY: fabricObjone.scaleY,
          angle: fabricObjone.angle
        });
      } else if (fabricObjone.type == 'circle') {
        fabricObject = new fabric.Circle({
          left: this.selectOneObj.left,
          top: this.selectOneObj.top,
          stroke: fabricObjone.stroke,
          fill: 'rgba(255, 255, 255, 0)',
          radius: fabricObjone.radius,
          strokeWidth: fabricObjone.strokeWidth,
          scaleX: this.selectOneObj.scaleX,
          scaleY: this.selectOneObj.scaleY,
          angle: this.selectOneObj.angle
        });
      } else if (fabricObjone.type == 'ellipse') {
        fabricObject = new fabric.Ellipse({
          left: this.selectOneObj.left + fabricObjone.rx,
          top: this.selectOneObj.top + fabricObjone.ry,
          stroke: fabricObjone.stroke,
          fill: 'rgba(255, 255, 255, 0)',
          originX: fabricObjone.originX,
          originY: fabricObjone.originY,
          rx: fabricObjone.rx,
          ry: fabricObjone.ry,
          strokeWidth: fabricObjone.strokeWidth,
          scaleX: fabricObjone.scaleX,
          scaleY: fabricObjone.scaleY,
          angle: fabricObjone.angle
        });
      } else if (fabricObjone.type == 'path') {
        let pathString = '';
        fabricObjone.path.forEach((item, index) => {
          if (item[0] == 'M' || item[0] == 'L') {
            pathString += `${item[0]} ${item[1]} ${item[2]} `
          } else if (item[0] == 'Q') {
            pathString += `${item[0]} ${item[1]} ${item[2]}, ${item[3]} ${item[4]} `
          } else {
            pathString += `${item[0]}`
          }
        }) 
        fabricObject = new fabric.Path(pathString, { 
          top: this.selectOneObj.top, 
          left: this.selectOneObj.left,  
          stroke: fabricObjone.stroke,
          fill: 'rgba(255, 255, 255, 0)',
          strokeWidth: fabricObjone.strokeWidth,
          scaleX: fabricObjone.scaleX,
          scaleY: fabricObjone.scaleY,
          angle: fabricObjone.angle
        })
      }
      this.fabricObj.remove(this.selectOneObj)
      this.fabricObj.add(fabricObject)
      this.handleSaveCanvasObject();
      this.getDataRequest()
    },
    //取消分配
    cancelAllocation(){
      this.initCanvasBg(true)
    },
    //复制楼层回调函数
    copyStoreysData(data){
      this.copyStoreysId = data;
      let params = {
        storeysId: this.storeysId
      }
      this.$axiosPost(API.plan_cancelRoomWithPoints, params).then(res => {
        if (res.result == 'success') {
          this.getCopyFloorInfo();
          this.initCanvasBg()
        }
      })
    },
    // 获取被拷贝楼层图形
    getCopyFloorInfo() {
      let params = {
        roomNo:'',
        storeysId:  this.copyStoreysId
      };
      this.$axiosGet(API.plan_listRoom, params).then(res => {
        if (res.result == 'success' && res.data) {
          // 处理未绑定的图形
          if (res.data.emptyPoints && res.data.emptyPoints.points) {
            let aNoRoomPoints = JSON.parse(res.data.emptyPoints.points);
            aNoRoomPoints.forEach(item => {
              let fabricObject = this.handlerCopyCanvasObject(item, {color: 'rgba(255, 255, 255, 0)'});
              this.fabricObj.add(fabricObject);
            })
          }
          res.data.roomList.data.forEach(item => {
            if (item.points) {
              let cavObj = JSON.parse(item.points);
              let cavOneObj = cavObj.objects[0]
              // 设置坐标值
              this.$set(cavOneObj, 'left', cavObj.left);
              this.$set(cavOneObj, 'top', cavObj.top);
              this.$set(cavOneObj, 'scaleX', cavObj.scaleX);
              this.$set(cavOneObj, 'scaleY', cavObj.scaleY);
              this.$set(cavOneObj, 'angle', cavObj.angle);
              if (cavOneObj.type == 'rect') {
                this.$set(cavOneObj, 'width', cavObj.width);
                this.$set(cavOneObj, 'width', cavObj.width);
              } else if (cavOneObj.type == 'ellipse') {
                this.$set(cavOneObj, 'left', cavObj.left + cavOneObj.rx);
                this.$set(cavOneObj, 'top', cavObj.top + cavOneObj.ry);
              }
              let fabricObject = this.handlerCopyCanvasObject(cavOneObj,  {color: 'rgba(255, 255, 255, 0)'});
              this.fabricObj.add(fabricObject);
            }
          })
        }
      })

    },
    // 左侧树型菜单
    getTree(){
      let params ={
        courtyardId: this.courtyardId
      }
      this.$axiosGet(API.plan_getCourtyardTree,params).then( res=>{
        if(res.data){
          this.roomNoteList = res.data;
          let pIds =[];
          let parentId = '';
          let parentId2 = '';
          let parentId3 = '';
          let courtyardName = '';
          let floorName ='';
          let storeysName,floorImg = '';

          let courtyardInfo, floorInfo, storeysInfo = null;
          if(res.data[0].typeFlag ==='courtyard'){
            parentId = res.data[0].value;
            courtyardName = res.data[0].label;
            courtyardInfo = res.data[0];
          }
          if(courtyardInfo && courtyardInfo.children && courtyardInfo.children[0].typeFlag ==='floor'){
            floorInfo = courtyardInfo.children[0];
            parentId2 = floorInfo.value;
            floorName = floorInfo.label;
          }
          if (floorInfo && floorInfo.children && floorInfo.children[0].typeFlag === 'storeys'){
            storeysInfo = floorInfo.children[0]
            parentId3 = storeysInfo.value;
            this.storeysName = storeysInfo.label;
            floorImg = storeysInfo.fileUrl || '';
            this.floorPlanImg = floorImg;
          }        
          pIds.push(parentId,parentId2,parentId3)
          // if(this.storeyId == ''){
          this.currentAddress = `${courtyardName} - ${floorName} - ${this.storeysName}`;
          this.expandedKeys = pIds;
          this.storeysId = parentId3;
          if(this.expandedKeys){      
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.storeysId);
            })               
          }
          // }         
          this.getDataRequest(true)
          if (floorImg) {
            let params = {
              url: floorImg
            }
            this.$axiosPost(API.plan_toBase64, params).then(res => {
              this.floorPlanImg = 'data:image/jpeg;base64,' + res.data;
              this.fabricObj.setBackgroundImage(this.floorPlanImg, this.fabricObj.renderAll.bind(this.fabricObj), {
                repeat:'no-repeat',
                originX: 'left',
                originY: 'top',
              });
            })
          } else {
            this.floorPlanImg = '';
            this.fabricObj.setBackgroundImage(this.floorPlanImg, this.fabricObj.renderAll.bind(this.fabricObj), {
              repeat:'no-repeat',
              originX: 'left',
              originY: 'top',
            });
          }
        }else{
          this.roomNoteList =[]
          this.currentAddress =''
        }    
      })
    },
    //点击树型菜单数据的变化
    updateCourtyardName(data){
      let courtyardName,floorName,storeysName ='';
      if(data.typeFlag === 'courtyard'){
        courtyardName  = data.label;
        this.currentAddress = `${courtyardName}`
      }
      if(data.typeFlag === 'floor'){
        this.floorId = data.value;
        floorName  = data.label;
        this.currentAddress = `${floorName}`
      }
      if(data.typeFlag ==='storeys'){
        this.storeysId = data.value;
        this.storeysName = data.label;
        this.$store.dispatch('storeysIdActions', this.storeysId);
        this.getDataRequest(true); 
        // 设置画布的背景图，也就是当前业务的楼层平面图
        if (data.fileUrl) {
          let params = {
            url: data.fileUrl
          }
          this.$axiosPost(API.plan_toBase64, params).then(res => {
            this.floorPlanImg = 'data:image/jpeg;base64,' + res.data;
            this.fabricObj.setBackgroundImage(this.floorPlanImg, this.fabricObj.renderAll.bind(this.fabricObj), {
              repeat:'no-repeat',
              originX: 'left',
              originY: 'top',
            });
          })
        } else {
          this.floorPlanImg = '';
          this.fabricObj.setBackgroundImage(this.floorPlanImg, this.fabricObj.renderAll.bind(this.fabricObj), {
            repeat:'no-repeat',
            originX: 'left',
            originY: 'top',
          });
        }
        // this.initCanvas()
        this.fabricObj.clear();
        this.fabricHistoryJson = [];
        this.currentAddress = `${this.storeysName}`
      }
    },
    // 重新加载canvas背景图，清空canvas色块图
    initCanvasBg(isNeedGetData) {
      this.fabricObj.clear();
      this.fabricObj.setBackgroundImage(this.floorPlanImg, this.fabricObj.renderAll.bind(this.fabricObj), {
        repeat:'no-repeat',
        originX: 'left',
        originY: 'top',
      });
      if (isNeedGetData) {
        this.getDataRequest(true); 
      }
    },
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
    //展开收起事件
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
        this.listRoom(this.list)
      }else if(tools.name ==='copy'){
        this.floorcopyRoom()
      }else if(tools.name==='print'){
        if(this.fabricObj !== null){   
          this.planePrint()        
          // let routes = this.$router.resolve({ name:'print', query: { image: this.imageBase64 } });
          // window.open(`/plane/plane-print?image=${this.imageBase64}`, "_blank"); 
          // this.$router.push({path:'/plane/plane-print',query: { image: this.imageBase64 }})
        }      
      }else if(tools.name==='shortcut'){
        this.remarkRoom()
      }
    }, 
    //房间列表信息
    planePrint() {
      this.downLoadImage()
      this.$refs.planeprint.openModal(this.imageBase64);
    },
    downLoadImage() {
      //生成双倍像素比的图片
      this.imageBase64 = this.fabricObj.toDataURL({
        formart: 'png',
        multiplier: 1
      })
    },   
    //房间详情
    getDetailClick(index, roomid) {
      this.index_R = index;  
      this.roomID = roomid  
      let params = {
        id: roomid
      }
      this.$axiosGet(API.room_queryDetail, params).then(res => {
        if(res.data){
          this.roomData = res.data;     
          if(this.roomID){
            this.isAble =false;
            this.isDelete = false;
          }else{
            this.isAble =true;
            this.isDelete = true;
          }
          if(this.roomData.points && this.roomData.useStatus!=='IDLE' && this.roomID){
            this.isDelete = true;
          }else{
            this.isDelete = false;
          }
        
        }else{
          this.roomData = {}
        }
        if(res.data && res.data.fileResponseList){
          this.firstImg = res.data.fileResponseList[0]?res.data.fileResponseList[0].url:'';
        }else{
          this.firstImg = ''
        }     
      })
    },
    deleteClick(id) { // 存储删除参数
      this.deleteYardId = id;
      this.YConfirmShow = true;
    },
    // 删除房间
    YDeleteClick() {
      let params =[];
      params.push(this.deleteYardId);
      this.$axiosJsonPost(API.room_delete, params).then(res => {
        this.YConfirmShow = false;
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;         
        } else {
          this.isBol = false;          
        }
        this.message = res.message;
      })
    },
    //删除弹框确定按钮
    YPromptClick() {
      if (this.isBol) {
        this.initCanvasBg(true);
      }
    },
    //获取列表信息
    getDataRequest(isNeedInitCav) {
      let params = {
        roomNo: this.search.roomNo || '',
        storeysId:  this.storeysId
      };
      this.$axiosGet(API.plan_listRoom, params).then(res => {
        let list = [];
        if(res.data){
          if(res.data.roomList.data){
            list = res.data.roomList.data;
          }
          if(res.data.roomList.data == ''){
            this.firstImg = ''
          }
          if (list.length > 0) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          if(res.data.organColor){
            this.organColorList = res.data.organColor;
          }else{
            this.organColorList = []
          }
          // 处理未绑定的图形
          if (res.data.emptyPoints && res.data.emptyPoints.points && isNeedInitCav) {
            let aNoRoomPoints = JSON.parse(res.data.emptyPoints.points);
            this.fabricObj._objects.forEach(item => {
              if (item.type !== 'group') {
                this.fabricObj.remove(item)
              }
            })
            aNoRoomPoints.forEach(item => {
              let fabricObject = this.handlerCopyCanvasObject(item, {color: 'rgba(255, 255, 255, 0)'});
              this.fabricObj.add(fabricObject);
            })
          } 
        }else{
          list = []
        }
        this.list = list;
        if(this.list){
          let firstData = this.list[0];
          if(this.list[0]){
            this.defaultRoomId = firstData.id;
            this.getDetailClick(0,this.defaultRoomId)
          }else{
            this.roomData = {}
          }       
          this.list.forEach((item,index) =>{
            if (isNeedInitCav && item.points !== '') {
              let cavObj = JSON.parse(item.points);
              this.initCavObj(item, cavObj)
            }     
          })
        }else{
          this.list =''
        }      
      });
    },
    // 初始化页面绑定的房间图形
    initCavObj(roomInfo, cavInfo) {
      if (cavInfo) {
        let fabricObject = this.handlerCopyCanvasObject(cavInfo.type == 'group'?cavInfo.objects[0]:cavInfo, roomInfo);
        let roomNo = this.handleCanvasTextObject(roomInfo, cavInfo.type == 'group'?cavInfo.objects[0]:cavInfo);
        let group = new fabric.Group([fabricObject, roomNo], {
          left: cavInfo.type == 'ellipse'?cavInfo.left - cavInfo.rx : cavInfo.left,
          top: cavInfo.type == 'ellipse'?cavInfo.top - cavInfo.ry : cavInfo.top,
          id: roomInfo.id,
          roomNo: roomInfo.roomNo,
          useStatus:roomInfo.useStatus,
          angle: 0
        })
        this.fabricObj.add(group);
      }
    },
    //分配房间
    allocationRoom() {
      this.$refs.roomAllocation.openModal(this.roomId,this.roomNo);
    },
    //快捷方式说明
    remarkRoom() {
      this.$refs.roomRemark.openModal();
    },
    //关联房间
    relationRoom() {
      this.$refs.roomRelation.openModal(this.list, this.selectOneObj);
    },
    //新增房间
    updateRoom(roomId,id,name,type) {
      this.$refs.roomUpdate.openModal(roomId,id,name,type);
    },
    //取消房间操作提示
    showtipsRoom() {
      this.$refs.roomShowtips.openModal(this.selectOneObj.id, 'relation');
    },
    //取消分配房间操作提示
    cancelAllocateRoom() {
      this.$refs.roomNorelation.openModal(this.selectOneObj.id,'relation');
    },
    //房间操作提示
    cancelRoom() {
      this.$refs.roomShowtips.openModal(this.selectOneObj.id,'relation');
    },
    //房间列表信息
    listRoom(list) {
      this.$refs.roomList.openModal(list);
    },  
    //复制楼层房间信息
    floorcopyRoom(){
      this.$refs.roomFloorcopy.openModal(this.storeysId);
    },
    //树型菜单搜索
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //画图工具栏禁用与开启
    setDisabled(name) {
      if (this.isCustomize) {
        if (name == 'line' || name == 'curve' || name == 'stop' || name == 'dragger' || name == 'undo') {
          return false; 
        } else {
          return true;
        }
      } else {
        if (name == 'undo' || name == 'line' || name == 'curve') {
          return true; 
        } else {
          return false;
        }
      }    
    },
    // canvas初始化
    initCanvas() {
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
      this.handleTools(this.toolsArr[0], 0)
      // if(this.relativeData){
      //   this.relativeData.forEach((item,index) => {
      //     this.fabricObj.add(JSON.parse(item.points))
      //     this.fabricObj.setActiveObject(item.points);
      //   })
      //   	 this.fabricObj.requestRenderAll();
      // }
      //绑定画板事件
      this.fabricObjAddEvent()
      this.upperCanvas = document.getElementsByClassName('upper-canvas')[0];
      this.upperCanvas.oncontextmenu = (event) => {
        let pointer = this.fabricObj.getPointer(event.originalEvent); // 获取当前鼠标点击的点
        let objects = this.fabricObj.getObjects();   
        for (let i = objects.length - 1; i >= 0; i--) {
          let object = objects[i];
          //判断该对象是否在鼠标点击处
          if (this.fabricObj.containsPoint(event, object)) {            //显示菜单      
            this.selectOneObj = object; 
            this.roomId = this.selectOneObj.id;
            this.roomNo = this.selectOneObj.roomNo;
            if(this.selectOneObj.id){
              this.isRelative = true;
            }else{
              this.isRelative = false;
            }
            if(this.selectOneObj.useStatus ==='IDLE'){
              this.isCancel = false;
            }else{
              this.isCancel = true;
            }
            this.$refs.ctxshow.showMenu(event, object);
            continue;
          }
        }
      }
    },
    //时间监听
    fabricObjAddEvent() {
      this.fabricObj.on({
        'mouse:down': (o)=> {
          // 判断是否按下alt建   拖动画布
          this.panning = true;
          this.fabricObj.selection = false;
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
          this.panning = false;
          this.fabricObj.selection = true;
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

          let objects = this.fabricObj.getObjects();
          for (let i = objects.length - 1; i >= 0; i--) {
            let object = objects[i];
            //判断该对象是否在鼠标点击处
            if (this.fabricObj.containsPoint(event, object)) {
              if (object.id) {
                //显示菜单 
                let cavItem = this.list.find(item => item.id == object.id);
                let index = this.list.indexOf(cavItem);
                this.getDetailClick(index, cavItem.id)
                break
              } else {
                this.oWiatCopyCanvasObject = object;
              }
            }
          }
        },
        'mouse:wheel': o => {
          this.zoom = (event.deltaY > 0 ? -0.1 : 0.1) + this.fabricObj.getZoom();
          this.zoom = Math.max(0.1, this.zoom); //最小为原来的1/10
          this.zoom = Math.min(3, this.zoom); //最大是原来的3倍
          let zoomPoint = new fabric.Point(event.pageX, event.pageY);
          this.fabricObj.zoomToPoint(zoomPoint, this.zoom);
        },
        'mouse:move': (o)=> {
          if (this.panning && o && o.e.altKey) {
            let delta = new fabric.Point(o.e.movementX, o.e.movementY);
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
              // for (let etindex = 0; etindex < etCount; etindex++) {
              // if (!e.target._objects.id) {
              //   this.fabricObj.remove(e.target._objects[etindex]);
              // }else{
              //   this.$message({
              //     message: '删除',
              //     type: 'warning',
              //     duration:1000
              //   })
              // }
              if (e.target.id) {             
                this.$message({
                  message: '已关联房间无法删除，请取消关联后再操作。',
                  type: 'warning',
                  duration:1000
                })
              }
              // }
            } else {
              console.log(e.target)
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
        fill: "rgba(255, 255, 255, 0)",
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
        this.initCanvasBg(true)
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
        // this.fabricObj.hasControls = true
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
          fill: "rgba(255, 255, 255, 0)",
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
          fill: "rgba(255, 255, 255, 0)"
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
    },
    /*
    * 置于底层或顶层操作，通过改变绘图对象的LIST位置，改变图像置于底层操作
    * @params {type} BOTTOM: 置于底层 TOP：置于顶层
    */
    goLayer(type) {
      let _objects = [];
      this.fabricObj._objects.forEach(item => {
        if (item != this.selectOneObj) {
          _objects.push(item)
        }
      })
      if (type == 'BOTTOM') {
        this.fabricObj._objects = [this.selectOneObj, ..._objects]
      } else {
        this.fabricObj._objects = [..._objects, this.selectOneObj]
      }
      this.fabricObj.renderAll();
      this.$refs.ctxshow.hideMenu();
    }
  }
}
</script>

<style lang="scss" scoped>
.fl{float: left;}
.wraper{
  position: relative;
  width: 100%;
  height: 100%;
 .title-font{ padding:0 8px; font-size: 14px;}
 .canvas-wraper{
    width: 100%;
    display:flex;
    height: calc(100% - 75px);
    overflow: auto;
    background: url(../../assets/images/white-bg.png) repeat #eff0f2; 
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
      height: 100%;
      overflow-y:auto;
      padding:20px 15px;
      background:#fff;
      box-sizing:border-box;
      border-right:1px solid #E4E7ED;
      border-radius:8px;   
      box-shadow: 5px 5px 5px #DCDFE6;   
     }
    .canvas-r-plane{
      width:320px;
      height: 100%;
      box-sizing:border-box; 
      background:#fff; 
      border-radius:8px;   
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
          span{ font-size: 14px;
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
      .plane-box-search{  
        padding:5px 15px;
      }
      .plane-box-info{ 
        width:100%;
        max-height:300px;
        padding:10px 15px;
        box-sizing:border-box;
        font-size: 14px;
        overflow-y:auto;
        .box-info-ul{
          display:flex;
          flex-wrap: wrap;
          box-sizing: border-box;
          li:nth-child(3n) {
            padding-right: 0;
          }
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
              .bind-color{border-left:4px solid #b0d3ff}
          }          
        }
        .defalut-tips{ 
            display: block;
            text-align: center;
            color:#666;
           }
      }
      .box-info-tab {
        tr{
            td{
            padding:10px 5px;       
            }
          .td-color{ 
            color:#606266
            }
        }
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
             font-size: 14px;
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
          width:300px;
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