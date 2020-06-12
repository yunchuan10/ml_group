/**
 * 本地检索项
 */
// import baseUtils from '@/utils/baseUtils' // 底层工具包
import Vue from 'vue';
const ls = Vue.prototype.$ls;
// const ls = baseUtils.ls

// 会议看板
// const MEET_BOARD = {
//   "result": "success",
//   "code": 200,
//   "message": "操作成功",
//   "model": {
//     "orderDayMap": {
//       "2020-04-02": {},
//       "2020-04-03": {
//         "0a7bd517-409d-43c0-80d9-bbfb40712419": [
//           {
//             "rangeIndex": 2,
//             "begin": "AFTERNOON",
//             "order": {
//               "orderId": "fb1a9c25-f009-4a2f-ab5d-a22def1a0b63",
//               "orderNo": "d7ae9aca-38d3-4caa-8453-310b806f4321",
//               "applyUserId": "1c6dde09dc2941438527e386ccc3780d",
//               "deptId": "215eaeea50ee48618a036946fa4a1272",
//               "applyRealName": "校长",
//               "applyRealPhone": "13956565856",
//               "participants": "哈哈哈",
//               "useQty": null,
//               "conferenceName": "韩国和密码",
//               "arriveTime": "6点",
//               "beginTime": "2019-07-08 14:00:00.0",
//               "endTime": "2019-07-08 23:00:00.0",
//               "meetingCost": "100.00",
//               "beginTimeDescription": "AFTERNOON",
//               "endTimeDescription": "NIGHT",
//               "meetingRoomType": "MIDDLE",
//               "meetingId": "0a7bd517-409d-43c0-80d9-bbfb40712419",
//               "organId": "5cabcee7002a489aa7d7fd4c860c128e",
//               "toOrganId": "5cabcee7002a489aa7d7fd4c860c128e",
//               "areaId": "0100124",
//               "videoType": "ONE",
//               "meetingLevel": "CITY",
//               "secrecyLevel": "YES",
//               "equuips": "电脑",
//               "orderStatus": "BOOKING",
//               "dispatchUser": null,
//               "dispatchTime": null,
//               "hasEvaluate": "NO",
//               "hasSettlement": "NO",
//               "applyRemark": "的对手多所",
//               "serverUserId": null,
//               "addUserId": "1c6dde09dc2941438527e386ccc3780d",
//               "generalPlatform": "YES",
//               "platformContent": "6666",
//               "year": "2019",
//               "month": "07",
//               "checkUserId": null,
//               "logicDelete": "NO",
//               "dateCreated": "2019-07-08 14:34:37.0",
//               "lastUpdated": "2019-07-08 14:34:37.0"
//             }
//           }
//         ]
//       },
//       "2020-04-05": {
//         "4b416881-480b-4098-a993-05d3154b4e0c": [
//           {
//             "rangeIndex": 2,
//             "begin": "AFTERNOON",
//             "order": {
//               "orderId": "cc8e0423-51f0-4c93-934d-1151b931adf2",
//               "orderNo": "e9974c76-39f1-45fd-b400-9059f9fd8cb9",
//               "applyUserId": "1c6dde09dc2941438527e386ccc3780d",
//               "deptId": "215eaeea50ee48618a036946fa4a1272",
//               "applyRealName": "校长",
//               "applyRealPhone": "13956565856",
//               "participants": "哈哈哈",
//               "useQty": null,
//               "conferenceName": "韩国和密码",
//               "arriveTime": "6点",
//               "beginTime": "2019-07-09 14:00:00.0",
//               "endTime": "2019-07-09 23:00:00.0",
//               "meetingCost": "100.00",
//               "beginTimeDescription": "AFTERNOON",
//               "endTimeDescription": "NIGHT",
//               "meetingRoomType": "MIDDLE",
//               "meetingId": "4b416881-480b-4098-a993-05d3154b4e0c",
//               "organId": "5cabcee7002a489aa7d7fd4c860c128e",
//               "toOrganId": "5cabcee7002a489aa7d7fd4c860c128e",
//               "areaId": "0100124",
//               "videoType": "ONE",
//               "meetingLevel": "CITY",
//               "secrecyLevel": "YES",
//               "equuips": "电脑",
//               "orderStatus": "BOOKING",
//               "dispatchUser": null,
//               "dispatchTime": null,
//               "hasEvaluate": "NO",
//               "hasSettlement": "NO",
//               "applyRemark": "的对手多所",
//               "serverUserId": null,
//               "addUserId": "1c6dde09dc2941438527e386ccc3780d",
//               "generalPlatform": "YES",
//               "platformContent": "6666",
//               "year": "2019",
//               "month": "07",
//               "checkUserId": null,
//               "logicDelete": "NO",
//               "dateCreated": "2019-07-08 14:36:46.0",
//               "lastUpdated": "2019-07-08 14:36:46.0"
//             }
//           }
//         ]
//       },
//       "2020-04-07": {},
//       "2020-04-08": {}
//     },
//     "sysBoardConfig": {
//       "modelId": "5f8cbfc0-c7b2-4abc-b25c-3f82aade18be",
//       "toOrganId": "5cabcee7002a489aa7d7fd4c860c128e",
//       "boardModel": "FIRST",
//       "boardModelDescription": "MORNING_AFTERNOON_NIGHT",
//       "selectBookingTime": "ONE",
//       "dateCreated": "2019-07-08 14:22:41.0",
//       "lastUpdated": "2019-07-08 14:22:41.0"
//     },
//     "roomInfoPageList": {
//       "max": 7,
//       "totalPage": 1,
//       "offset": 0,
//       "totleCount": 3,
//       "list": [
//         {
//           "meetingId": "4b416881-480b-4098-a993-05d3154b4e0c",
//           "address": "地址001",
//           "areaId": "0100124",
//           "attachImg": null,
//           "createUserId": "1c6dde09dc2941438527e386ccc3780d",
//           "dateCreated": "2019-07-08 14:18:49.0",
//           "lastUpdated": "2019-07-08 14:18:49.0",
//           "logicDelete": "NO",
//           "maxPeople": 1,
//           "meetingName": "第一会议室",
//           "meetingRoomArea": 20,
//           "meetingRoomType": "BIG",
//           "equip": "空调,投影仪",
//           "otherEquip": "空调",
//           "organId": "5cabcee7002a489aa7d7fd4c860c128e",
//           "remark": "美丽美丽美丽美丽美丽",
//           "attachmentList": null
//         },
//         {
//           "meetingId": "0a7bd517-409d-43c0-80d9-bbfb40712419",
//           "address": "地址002",
//           "areaId": "0100124",
//           "attachImg": null,
//           "createUserId": "1c6dde09dc2941438527e386ccc3780d",
//           "dateCreated": "2019-07-08 14:18:40.0",
//           "lastUpdated": "2019-07-08 14:18:40.0",
//           "logicDelete": "NO",
//           "maxPeople": 1,
//           "meetingName": "第二会议室",
//           "meetingRoomArea": 20,
//           "meetingRoomType": "BIG",
//           "equip": "空调,投影仪",
//           "otherEquip": "空调",
//           "organId": "5cabcee7002a489aa7d7fd4c860c128e",
//           "remark": "漂亮漂亮漂亮漂亮漂亮漂亮",
//           "attachmentList": null
//         },
//       ]
//     }
//   }
// }

const MEET_BOARD = {
  "status": 200,
  "message": "成功",
  "data": {
    "sysBoardConfig": [
      {
        "id": "1",
        "name": "上午8点到11点半",
        "startTime": "19:30:21",
        "endTime": "23:32:02"
      },
      {
        "id": "2",
        "name": "下午2点到4点半",
        "startTime": "14:00:00",
        "endTime": "16:30:00"
      }
    ],
    "roomInfoPageList": [
      {
        "id": "p2HPBwISifjPG9NaLLD",
        "createdBy": "ff314f9b-a8eb-4ce7-b857-91ec83b0754d",
        "createdAt": "2020-04-10 16:42:35",
        "updatedBy": "ff314f9b-a8eb-4ce7-b857-91ec83b0754d",
        "updatedAt": "2020-04-10 16:42:35",
        "address": "2合肥市经开区紫云路",
        "areaId": "0100124105",
        "attachImg": "http://172.16.8.22:8888/group1/M00/00/0E/rBAIFl2C37qAJ0IWAAFVnTbEdIg367.jpg",
        "maxPeople": 80,
        "meetingName": "三号公有会议室",
        "meetingRoomArea": 200,
        "meetingRoomType": "1",
        "equip": "投影仪,显示屏,空调,耳麦",
        "otherEquip": "签字笔,毛巾",
        "organId": "000000005f571851015f572763770008",
        "remark": "",
        "logicDelete": 0,
        "type": 0
      },
      {
        "id": "jYZz8VqMt6InwzJB1NP",
        "createdBy": "ff314f9b-a8eb-4ce7-b857-91ec83b0754d",
        "createdAt": "2020-04-09 13:51:11",
        "updatedBy": "ff314f9b-a8eb-4ce7-b857-91ec83b0754d",
        "updatedAt": "2020-04-09 13:51:11",
        "address": "合肥市蜀山区诚信大道",
        "areaId": "0100124105",
        "attachImg": "http://172.16.8.22:8888/group1/M00/00/0E/rBAIFl2C37qAJ0IWAAFVnTbEdIg367.jpg",
        "maxPeople": 80,
        "meetingName": "一号公有会议室",
        "meetingRoomArea": 200,
        "meetingRoomType": "1",
        "equip": "投影仪,显示屏,空调,耳麦",
        "otherEquip": "签字笔,毛巾",
        "organId": "000000005f571851015f572763770008",
        "remark": "",
        "logicDelete": 0,
        "type": 0
      }
    ],
    "orderDayMap": [
      {
        "currentDay": "2020-04-18",
        "key": {}
      },
      {
        "currentDay": "2020-04-19",
        "key": {
          "p2HPBwISifjPG9NaLLD": [
            {
              "rangeIndex": 5,
              "applyId": "8m16eh3HUWOyh9ljKOi",
              "begin": "1",
              "roomId": "p2HPBwISifjPG9NaLLD",
              "order": {
                "id": 'p2HPBwISifjPG9NaLLD',
                "applyId": null,
                "meetingName": null,
                "organId": null,
                "organName": '单位',
                "conferenceName": null,
                "applyUserId": null,
                "applyUserName": "申请人",
                "applyUserPhone": '15855556666',
                "type": null,
                "boardDetailId": null,
                "state": 'NEW_APPLY',
                "used": true
              }
            }
          ]
        }
      },
      {
        "currentDay": "2020-04-20",
        "key": {}
      },
      {
        "currentDay": "2020-04-21",
        "key": {}
      },

    ]
  }
}

// 会务中心会议室看板
const MEET_CENTER_BOARD = {
  "result": "success",
  "code": 200,
  "message": "操作成功",
  "model": {
    "orderDayMap": {
      "2020-04-02": {},
      "2020-04-03": {
        "0a7bd517-409d-43c0-80d9-bbfb40712419": [
          {
            "rangeIndex": 2,
            "begin": "AFTERNOON",
            "order": {
              "orderId": "fb1a9c25-f009-4a2f-ab5d-a22def1a0b63",
              "orderNo": "d7ae9aca-38d3-4caa-8453-310b806f4321",
              "applyUserId": "1c6dde09dc2941438527e386ccc3780d",
              "deptId": "215eaeea50ee48618a036946fa4a1272",
              "applyRealName": "校长",
              "applyRealPhone": "13956565856",
              "participants": "哈哈哈",
              "useQty": null,
              "conferenceName": "韩国和密码",
              "arriveTime": "6点",
              "beginTime": "2019-07-08 14:00:00.0",
              "endTime": "2019-07-08 23:00:00.0",
              "meetingCost": "100.00",
              "beginTimeDescription": "AFTERNOON",
              "endTimeDescription": "NIGHT",
              "meetingRoomType": "MIDDLE",
              "meetingId": "0a7bd517-409d-43c0-80d9-bbfb40712419",
              "organId": "5cabcee7002a489aa7d7fd4c860c128e",
              "toOrganId": "5cabcee7002a489aa7d7fd4c860c128e",
              "areaId": "0100124",
              "videoType": "ONE",
              "meetingLevel": "CITY",
              "secrecyLevel": "YES",
              "equuips": "电脑",
              "orderStatus": "BOOKING",
              "dispatchUser": null,
              "dispatchTime": null,
              "hasEvaluate": "NO",
              "hasSettlement": "NO",
              "applyRemark": "的对手多所",
              "serverUserId": null,
              "addUserId": "1c6dde09dc2941438527e386ccc3780d",
              "generalPlatform": "YES",
              "platformContent": "6666",
              "year": "2019",
              "month": "07",
              "checkUserId": null,
              "logicDelete": "NO",
              "dateCreated": "2019-07-08 14:34:37.0",
              "lastUpdated": "2019-07-08 14:34:37.0"
            }
          }
        ]
      },
      "2020-04-04": {
        "4b416881-480b-4098-a993-05d3154b4e0c": [
          {
            "rangeIndex": 2,
            "begin": "AFTERNOON",
            "order": {
              "orderId": "cc8e0423-51f0-4c93-934d-1151b931adf2",
              "orderNo": "e9974c76-39f1-45fd-b400-9059f9fd8cb9",
              "applyUserId": "1c6dde09dc2941438527e386ccc3780d",
              "deptId": "215eaeea50ee48618a036946fa4a1272",
              "applyRealName": "校长",
              "applyRealPhone": "13956565856",
              "participants": "哈哈哈",
              "useQty": null,
              "conferenceName": "韩国和密码",
              "arriveTime": "6点",
              "beginTime": "2019-07-09 14:00:00.0",
              "endTime": "2019-07-09 23:00:00.0",
              "meetingCost": "100.00",
              "beginTimeDescription": "AFTERNOON",
              "endTimeDescription": "NIGHT",
              "meetingRoomType": "MIDDLE",
              "meetingId": "4b416881-480b-4098-a993-05d3154b4e0c",
              "organId": "5cabcee7002a489aa7d7fd4c860c128e",
              "toOrganId": "5cabcee7002a489aa7d7fd4c860c128e",
              "areaId": "0100124",
              "videoType": "ONE",
              "meetingLevel": "CITY",
              "secrecyLevel": "YES",
              "equuips": "电脑",
              "orderStatus": "BOOKING",
              "dispatchUser": null,
              "dispatchTime": null,
              "hasEvaluate": "NO",
              "hasSettlement": "NO",
              "applyRemark": "的对手多所",
              "serverUserId": null,
              "addUserId": "1c6dde09dc2941438527e386ccc3780d",
              "generalPlatform": "YES",
              "platformContent": "6666",
              "year": "2019",
              "month": "07",
              "checkUserId": null,
              "logicDelete": "NO",
              "dateCreated": "2019-07-08 14:36:46.0",
              "lastUpdated": "2019-07-08 14:36:46.0"
            }
          }
        ]
      },
      "2020-04-05": {},
      "2020-04-06": {}
    },
    "sysBoardConfig": {
      "modelId": "5f8cbfc0-c7b2-4abc-b25c-3f82aade18be",
      "toOrganId": "5cabcee7002a489aa7d7fd4c860c128e",
      "boardModel": "SECOND",
      "boardModelDescription": "MORNING_AFTERNOON",
      "selectBookingTime": "ONE",
      "dateCreated": "2019-07-08 14:22:41.0",
      "lastUpdated": "2019-07-08 14:22:41.0"
    },
    "roomInfoPageList": {
      "max": 7,
      "totalPage": 1,
      "offset": 0,
      "totleCount": 3,
      "list": [
        {
          "meetingId": "4b416881-480b-4098-a993-05d3154b4e0c",
          "address": "哈哈哈习友",
          "areaId": "0100124",
          "attachImg": null,
          "createUserId": "1c6dde09dc2941438527e386ccc3780d",
          "dateCreated": "2019-07-08 14:18:49.0",
          "lastUpdated": "2019-07-08 14:18:49.0",
          "logicDelete": "NO",
          "maxPeople": 1,
          "meetingName": "第一会议室",
          "meetingRoomArea": 20,
          "meetingRoomType": "BIG",
          "equip": "空调,投影仪",
          "otherEquip": "空调",
          "organId": "5cabcee7002a489aa7d7fd4c860c128e",
          "remark": "漂亮",
          "attachmentList": null
        },
        {
          "meetingId": "0a7bd517-409d-43c0-80d9-bbfb40712419",
          "address": "哈哈哈习友",
          "areaId": "0100124",
          "attachImg": null,
          "createUserId": "1c6dde09dc2941438527e386ccc3780d",
          "dateCreated": "2019-07-08 14:18:40.0",
          "lastUpdated": "2019-07-08 14:18:40.0",
          "logicDelete": "NO",
          "maxPeople": 1,
          "meetingName": "第二会议室",
          "meetingRoomArea": 20,
          "meetingRoomType": "BIG",
          "equip": "空调,投影仪",
          "otherEquip": "空调",
          "organId": "5cabcee7002a489aa7d7fd4c860c128e",
          "remark": "漂亮",
          "attachmentList": null
        },
      ]
    }
  }
}
// 自有会议室看板
const MEET_OWN_BOARD = {
  "result": "success",
  "code": 200,
  "message": "操作成功",
  "model": {
    "orderDayMap": {
      "00:00": {},
      "01:00": {
        "0a7bd517-409d-43c0-80d9-bbfb40712419": [
          {
            "rangeIndex": 4,
            "begin": "AFTERNOON",
            "order": {
              "orderId": "fb1a9c25-f009-4a2f-ab5d-a22def1a0b63",
              "orderNo": "d7ae9aca-38d3-4caa-8453-310b806f4321",
              "applyUserId": "1c6dde09dc2941438527e386ccc3780d",
              "deptId": "215eaeea50ee48618a036946fa4a1272",
              "applyRealName": "校长",
              "applyRealPhone": "13956565856",
              "participants": "哈哈哈",
              "useQty": null,
              "conferenceName": "韩国和密码",
              "arriveTime": "6点",
              "beginTime": "2019-07-08 14:00:00.0",
              "endTime": "2019-07-08 23:00:00.0",
              "meetingCost": "100.00",
              "beginTimeDescription": "AFTERNOON",
              "endTimeDescription": "NIGHT",
              "meetingRoomType": "MIDDLE",
              "meetingId": "0a7bd517-409d-43c0-80d9-bbfb40712419",
              "organId": "5cabcee7002a489aa7d7fd4c860c128e",
              "toOrganId": "5cabcee7002a489aa7d7fd4c860c128e",
              "areaId": "0100124",
              "videoType": "ONE",
              "meetingLevel": "CITY",
              "secrecyLevel": "YES",
              "equuips": "电脑",
              "orderStatus": "BOOKING",
              "dispatchUser": null,
              "dispatchTime": null,
              "hasEvaluate": "NO",
              "hasSettlement": "NO",
              "applyRemark": "的对手多所",
              "serverUserId": null,
              "addUserId": "1c6dde09dc2941438527e386ccc3780d",
              "generalPlatform": "YES",
              "platformContent": "6666",
              "year": "2019",
              "month": "07",
              "checkUserId": null,
              "logicDelete": "NO",
              "dateCreated": "2019-07-08 14:34:37.0",
              "lastUpdated": "2019-07-08 14:34:37.0"
            }
          }
        ]
      },
      "02:00": {
        "4b416881-480b-4098-a993-05d3154b4e0c": [
          {
            "rangeIndex": 4,
            "begin": "AFTERNOON",
            "order": {
              "orderId": "cc8e0423-51f0-4c93-934d-1151b931adf2",
              "orderNo": "e9974c76-39f1-45fd-b400-9059f9fd8cb9",
              "applyUserId": "1c6dde09dc2941438527e386ccc3780d",
              "deptId": "215eaeea50ee48618a036946fa4a1272",
              "applyRealName": "校长",
              "applyRealPhone": "13956565856",
              "participants": "哈哈哈",
              "useQty": null,
              "conferenceName": "韩国和密码",
              "arriveTime": "6点",
              "beginTime": "2019-07-09 14:00:00.0",
              "endTime": "2019-07-09 23:00:00.0",
              "meetingCost": "100.00",
              "beginTimeDescription": "AFTERNOON",
              "endTimeDescription": "NIGHT",
              "meetingRoomType": "MIDDLE",
              "meetingId": "4b416881-480b-4098-a993-05d3154b4e0c",
              "organId": "5cabcee7002a489aa7d7fd4c860c128e",
              "toOrganId": "5cabcee7002a489aa7d7fd4c860c128e",
              "areaId": "0100124",
              "videoType": "ONE",
              "meetingLevel": "CITY",
              "secrecyLevel": "YES",
              "equuips": "电脑",
              "orderStatus": "BOOKING",
              "dispatchUser": null,
              "dispatchTime": null,
              "hasEvaluate": "NO",
              "hasSettlement": "NO",
              "applyRemark": "的对手多所",
              "serverUserId": null,
              "addUserId": "1c6dde09dc2941438527e386ccc3780d",
              "generalPlatform": "YES",
              "platformContent": "6666",
              "year": "2019",
              "month": "07",
              "checkUserId": null,
              "logicDelete": "NO",
              "dateCreated": "2019-07-08 14:36:46.0",
              "lastUpdated": "2019-07-08 14:36:46.0"
            }
          }
        ]
      },
      "03:00": {},
      "04:00": {},
      "05:00": {},
      "06:00": {},
      "07:00": {},
      "08:00": {},
      "09:00": {},
      "10:00": {},
      "11:00": {},
      "12:00": {},
      "13:00": {},
      "14:00": {},
      "15:00": {},
      "16:00": {},
      "17:00": {},
      "18:00": {},
      "19:00": {},
      "20:00": {},
      "21:00": {},
      "22:00": {},
      "23:00": {},
    },
    "sysBoardConfig": {
      "modelId": "5f8cbfc0-c7b2-4abc-b25c-3f82aade18be",
      "toOrganId": "5cabcee7002a489aa7d7fd4c860c128e",
      "boardModel": "SECOND",
      "boardModelDescription": "MORNING_AFTERNOON",
      "selectBookingTime": "ONE",
      "dateCreated": "2019-07-08 14:22:41.0",
      "lastUpdated": "2019-07-08 14:22:41.0"
    },
    "roomInfoPageList": {
      "max": 7,
      "totalPage": 1,
      "offset": 0,
      "totleCount": 3,
      "list": [
        {
          "meetingId": "4b416881-480b-4098-a993-05d3154b4e0c",
          "address": "哈哈哈习友",
          "areaId": "0100124",
          "attachImg": null,
          "createUserId": "1c6dde09dc2941438527e386ccc3780d",
          "dateCreated": "2019-07-08 14:18:49.0",
          "lastUpdated": "2019-07-08 14:18:49.0",
          "logicDelete": "NO",
          "maxPeople": 1,
          "meetingName": "第一会议室",
          "meetingRoomArea": 20,
          "meetingRoomType": "BIG",
          "equip": "空调,投影仪",
          "otherEquip": "空调",
          "organId": "5cabcee7002a489aa7d7fd4c860c128e",
          "remark": "漂亮",
          "attachmentList": null
        },
        {
          "meetingId": "0a7bd517-409d-43c0-80d9-bbfb40712419",
          "address": "哈哈哈习友",
          "areaId": "0100124",
          "attachImg": null,
          "createUserId": "1c6dde09dc2941438527e386ccc3780d",
          "dateCreated": "2019-07-08 14:18:40.0",
          "lastUpdated": "2019-07-08 14:18:40.0",
          "logicDelete": "NO",
          "maxPeople": 1,
          "meetingName": "第二会议室",
          "meetingRoomArea": 20,
          "meetingRoomType": "BIG",
          "equip": "空调,投影仪",
          "otherEquip": "空调",
          "organId": "5cabcee7002a489aa7d7fd4c860c128e",
          "remark": "漂亮",
          "attachmentList": null
        },
      ]
    }
  }
}
// 申请单详情数据
const APPLY_DATALIST = {
  "orderId": "cc8e0423-51f0-4c93-934d-1151b931adf2",
  "orderNo": "e9974c76-39f1-45fd-b400-9059f9fd8cb9",
  "applyUserId": "1c6dde09dc2941438527e386ccc3780d",
  "deptId": "215eaeea50ee48618a036946fa4a1272",
  "applyRealName": "校长",
  "applyRealPhone": "13956565856",
  "participants": "哈哈哈",
  "useQty": null,
  "conferenceName": "韩国和密码",
  "arriveTime": "6点",
  "beginTime": "2019-07-09 14:00:00.0",
  "endTime": "2019-07-09 23:00:00.0",
  "meetingCost": "100.00",
  "beginTimeDescription": "AFTERNOON",
  "endTimeDescription": "NIGHT",
  "meetingRoomType": "MIDDLE",
  "meetingId": "4b416881-480b-4098-a993-05d3154b4e0c",
  "organId": "5cabcee7002a489aa7d7fd4c860c128e",
  "toOrganId": "5cabcee7002a489aa7d7fd4c860c128e",
  "areaId": "0100124",
  "videoType": "ONE",
  "meetingLevel": "CITY",
  "secrecyLevel": "YES",
  "equuips": "电脑",
  "orderStatus": "BOOKING",
  "dispatchUser": null,
  "dispatchTime": null,
  "hasEvaluate": "NO",
  "hasSettlement": "NO",
  "applyRemark": "的对手多所",
  "serverUserId": null,
  "addUserId": "1c6dde09dc2941438527e386ccc3780d",
  "generalPlatform": "YES",
  "platformContent": "6666",
  "year": "2019",
  "month": "07",
  "checkUserId": null,
  "logicDelete": "NO",
  "dateCreated": "2019-07-08 14:36:46.0",
  "lastUpdated": "2019-07-08 14:36:46.0"
}
//订单列表
const ORDER_LIST = [
  {
    "orderId": "cc8e0423-51f0-4c93-934d-1151b931adf2",
    "orderNo": "e9974c76-39f1-45fd-b400-9059f9fd8cb9",  // 订单编号
    "applyUserId": "1c6dde09dc2941438527e386ccc3780d",  // 申请人id
    "deptId": "215eaeea50ee48618a036946fa4a1272",
    "applyRealName": "校长01",                              // 申请人姓名
    "applyRealPhone": "13956565856",                     //  申请人手机
    "participants": "哈哈哈",                             // 参会人员
    "useQty": null,
    "conferenceName": "韩国和密码",                    // 会议名称
    "arriveTime": "6点",
    "beginTime": "2019-07-09 14:00:00.0",    // 开始时间
    "endTime": "2019-07-09 23:00:00.0",         // 结束时间
    "meetingCost": "100.00",                 // 费用
    "beginTimeDescription": "AFTERNOON",     // 开始时间描述
    "endTimeDescription": "NIGHT",           // 结束时间描述
    "meetingRoomType": "MIDDLE",             // 会议室类型
    "meetingId": "4b416881-480b-4098-a993-05d3154b4e0c", // 会议室id
    "organId": "5cabcee7002a489aa7d7fd4c860c128e",   // 单位id
    "toOrganId": "5cabcee7002a489aa7d7fd4c860c128e", // 客户单位id
    "areaId": "0100124",
    "videoType": "ONE",
    "meetingLevel": "CITY",
    "secrecyLevel": "YES",
    "equuips": "电脑",
    "orderStatus": "BOOKING",
    "dispatchUser": null,
    "dispatchTime": null,
    "hasEvaluate": "NO",
    "hasSettlement": "NO",
    "applyRemark": "的对手多所",
    "serverUserId": null,                            // 客服经理id
    "addUserId": "1c6dde09dc2941438527e386ccc3780d", // 操作人id
    "generalPlatform": "YES",                        // 是否有台型布置
    "platformContent": "6666",                       // 台型布置内容
    "year": "2019",
    "month": "07",
    "checkUserId": null,
    "logicDelete": "NO",
    "dateCreated": "2019-07-08 14:36:46.0",
    "lastUpdated": "2019-07-08 14:36:46.0"
  },
  {
    "orderId": "951854e2-965c-4b41-a530-efe0cd6b8984",
    "orderNo": "f83206ba-7cd6-49d4-b4ef-90a6ae54e4ab",
    "applyUserId": "1c6dde09dc2941438527e386ccc3780d",
    "deptId": "215eaeea50ee48618a036946fa4a1272",
    "applyRealName": "校长02",
    "applyRealPhone": "13956565856",
    "participants": "哈哈哈",
    "useQty": null,
    "conferenceName": "韩国和密码",
    "arriveTime": "6点",
    "beginTime": "2019-07-23 14:00:00.0",
    "endTime": "2019-07-23 23:00:00.0",
    "meetingCost": "100.00",
    "beginTimeDescription": "AFTERNOON",
    "endTimeDescription": "NIGHT",
    "meetingRoomType": "MIDDLE",
    "meetingId": "0a7bd517-409d-43c0-80d9-bbfb40712419",
    "organId": "5cabcee7002a489aa7d7fd4c860c128e",
    "toOrganId": "5cabcee7002a489aa7d7fd4c860c128e",
    "areaId": "0100124",
    "videoType": "ONE",
    "meetingLevel": "CITY",
    "secrecyLevel": "YES",
    "equuips": "电脑",
    "orderStatus": "REJECT",
    "dispatchUser": null,
    "dispatchTime": null,
    "hasEvaluate": "NO",
    "hasSettlement": "NO",
    "applyRemark": "的对手多所",
    "serverUserId": null,
    "addUserId": "1c6dde09dc2941438527e386ccc3780d",
    "generalPlatform": "YES",
    "platformContent": "6666",
    "year": "2019",
    "month": "07",
    "checkUserId": null,
    "logicDelete": "NO",
    "dateCreated": "2019-07-08 14:34:45.0",
    "lastUpdated": "2019-07-09 10:21:03.0"
  },
  {
    "orderId": "fb1a9c25-f009-4a2f-ab5d-a22def1a0b63",
    "orderNo": "d7ae9aca-38d3-4caa-8453-310b806f4321",
    "applyUserId": "1c6dde09dc2941438527e386ccc3780d",
    "deptId": "215eaeea50ee48618a036946fa4a1272",
    "applyRealName": "校长03",
    "applyRealPhone": "13956565856",
    "participants": "哈哈哈",
    "useQty": null,
    "conferenceName": "韩国和密码",
    "arriveTime": "6点",
    "beginTime": "2019-07-08 14:00:00.0",
    "endTime": "2019-07-08 23:00:00.0",
    "meetingCost": "100.00",
    "beginTimeDescription": "AFTERNOON",
    "endTimeDescription": "NIGHT",
    "meetingRoomType": "MIDDLE",
    "meetingId": "0a7bd517-409d-43c0-80d9-bbfb40712419",
    "organId": "5cabcee7002a489aa7d7fd4c860c128e",
    "toOrganId": "5cabcee7002a489aa7d7fd4c860c128e",
    "areaId": "0100124",
    "videoType": "ONE",
    "meetingLevel": "CITY",
    "secrecyLevel": "YES",
    "equuips": "电脑",
    "orderStatus": "BOOKING",
    "dispatchUser": null,
    "dispatchTime": null,
    "hasEvaluate": "NO",
    "hasSettlement": "NO",
    "applyRemark": "的对手多所",
    "serverUserId": null,
    "addUserId": "1c6dde09dc2941438527e386ccc3780d",
    "generalPlatform": "YES",
    "platformContent": "6666",
    "year": "2019",
    "month": "07",
    "checkUserId": null,
    "logicDelete": "NO",
    "dateCreated": "2019-07-08 14:34:37.0",
    "lastUpdated": "2019-07-08 14:34:37.0"
  }
]

const testDataBol = {
  namespaced: true,
  // 唯一数据源
  state: {
    meetBoardTestDate: MEET_BOARD, // 会议看板数据
    meetCenterBoardTestDate: MEET_CENTER_BOARD, // 会务中心会议室看板
    meetOwnTestDate: MEET_OWN_BOARD, // 自有会议室看板
    applyDataList: APPLY_DATALIST, // 申请单详情数据
    orderList: ORDER_LIST, // 订单列表
  },
  // 过滤数据
  getters: {
    // 获取检索项缓存数据
    tableListBol: state => isTableListBol => {
      let tableListBol = ls.get(`${CON.cacheName}listTableListBol`);
      // let tableListBol = JSON.parse(ls.getItem('zkml_searchTableListBol'));
      let data = {};
      try {
        data = tableListBol[isTableListBol];
        if (data) state.tableListBol[isTableListBol] = data;
        else data = state.tableListBol[isTableListBol];
      } catch (e) {
        data = state.tableListBol[isTableListBol];
      }
      return data;
    }
  },
  // 修改数据
  mutations: {
    listTableListBolMutations(state, data) {
      state.tableListBol[data.name] = data.data;
      ls.set(`${CON.cacheName}listTableListBol`, state.tableListBol);
      // ls.setItem('zkml_searchTableListBol', JSON.stringify(state.tableListBol));
    }
  }
};

export default testDataBol;
