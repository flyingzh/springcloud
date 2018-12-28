"use strict";function _defineProperty(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var ve=new Vue({el:"#cashCountSheet",data:function(){return{tid:"zTreeCashCountSheet",addModal:!1,filterModal:!1,reload:!1,searchModal:!1,subjectVisiable:!1,nodeSelected:!1,isDisabled:!0,subjectEnd:!1,selected:"",selNode:[],subjectcode:"",modifyIsDisabled:!1,isSaveOrUpdata:!1,subjectList:[],openTime:"",lodoPList:[],addTitle:"",leftType:"ltData",filterBody:{sobId:0,timeStart:"",timeEnd:"",type:1},showDataForm:{timeStart:"",timeEnd:""},organizationList:[{value:1,label:"金大祥集团"},{value:2,label:"航天集团"},{value:3,label:"粮食集团"}],currencyList:[],periodDate:{},rightForm:{createName:"",subjectName:"",currencyName:"",dateTime:"",remark:"",sheetMoney:"",cashMoney:"",profitMoney:""},body:{id:"",code:"",incomeCategory:"1",name:"",fullName:"",subjectId:"",subjectCode:"",subjectName:""},formInitData:{id:"",sobId:"",datetime:"",currencyId:"",subjectName:"",subjectCode:"",subjectId:"",remark:"",totalAmount:""},formAdd:{id:"",sobId:"",datetime:"",currencyId:"",subjectName:"",subjectCode:"",subjectId:"",remark:"",totalAmount:""},nodesList:{},nodes:[],parValueStr:["100元","50元","20元","10元","5元","2元","1元","5角","2角","1角","5分","2分","1分"],setting:{callback:{onClick:this.clickEvent}},data_config:{colNames:["代码","名称","全名","科目"],height:"230",colModel:[{name:"code",index:"code",width:200,align:"center"},{name:"name",index:"name asc, invdate",width:200,align:"center"},{name:"fullName",index:"fullName",width:200,align:"center"},{name:"subjectName",index:"subjectName",width:200,align:"center"}]},dataList:[{id:"",cashCheckId:"",sequence:"1",parValueStr:"100元",parValue:100,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"2",parValueStr:"50元",parValue:50,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"3",parValueStr:"20元",parValue:20,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"4",parValueStr:"10元",parValue:10,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"5",parValueStr:"5元",parValue:5,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"6",parValueStr:"2元",parValue:2,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"7",parValueStr:"1元",parValue:1,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"8",parValueStr:"5角",parValue:.5,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"9",parValueStr:"2角",parValue:.2,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"10",parValueStr:"1角",parValue:.1,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"11",parValueStr:"5分",parValue:.05,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"12",parValueStr:"2分",parValue:.02,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"13",parValueStr:"1分",parValue:.01,hundreds:0,twenty:0,tails:0,amount:"0.00"}],dataListInit:[{id:"",cashCheckId:"",sequence:"1",parValueStr:"100元",parValue:100,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"2",parValueStr:"50元",parValue:50,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"3",parValueStr:"20元",parValue:20,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"4",parValueStr:"10元",parValue:10,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"5",parValueStr:"5元",parValue:5,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"6",parValueStr:"2元",parValue:2,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"7",parValueStr:"1元",parValue:1,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"8",parValueStr:"5角",parValue:.5,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"9",parValueStr:"2角",parValue:.2,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"10",parValueStr:"1角",parValue:.1,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"11",parValueStr:"5分",parValue:.05,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"12",parValueStr:"2分",parValue:.02,hundreds:0,twenty:0,tails:0,amount:"0.00"},{id:"",cashCheckId:"",sequence:"13",parValueStr:"1分",parValue:.01,hundreds:0,twenty:0,tails:0,amount:"0.00"}]}},methods:{openFilter:function(){this.filterModal=!0},outHtml:function(){window.parent.closeCurrentTab({name:"现金盘点单",openTime:this.openTime,exit:!0})},printV:function(){var t=this;if(console.log(t.dataList,"=========that.lodoPList"),t.dataList&&t.dataList.length){var e=t.dataList,a="",n="";if('\n                    <tr class=\'thCs\'>\n                        <th rowspan="2" style="width: 6%">票面</th>\n                        <th rowspan="2" style="width: 6%">把(百张)</th>\n                        <th rowspan="2" style="width: 6%">卡(二十张)</th>\n                        <th rowspan="2" style="width: 6%">尾款数(个)</th>\n                        <th rowspan="2" style="width: 6%">金额小计</th>\n                    </tr>\n                ',e.forEach(function(e){a+="\n                        <tr>\n                            <td>"+e.parValueStr+"</td>\n                            <td>"+t._nullData(e.hundreds)+"</td>\n                            <td>"+t._nullData(e.twenty)+"</td>\n                            <td>"+t._nullData(e.tails)+"</td>\n                            <td>"+t.formartMoney(e.amount)+"</td>\n                        </tr>\n                    "}),0===e.length)n='\n                        <tr class="ht-foot">\n                            <td>合计：</td>\n                            '+"<td>/td>".repeat(11)+"\n                        </tr>\n                        ";else{var r=0;e.forEach(function(e){r+=e.amount}),n='\n                        <tr class="ht-foot">\n                            <td>合计：</td>\n                            <td></td>\n                            <td></td>\n                            <td></td>\n                            <td>'+t.formartMoney(r)+"</td>\n                        </tr>\n                        "}var d={title:"现金盘点单",template:12,titleInfo:[{name:"科目",val:t.rightForm.subjectName},{name:"币别",val:t.rightForm.currencyName},{name:"盘点日期",val:t.rightForm.dateTime}],data:[],colMaxLenght:10,tbodyInfo:{theadTX:'\n                    <tr class=\'thCs\'>\n                        <th rowspan="2" style="width: 6%">票面</th>\n                        <th rowspan="2" style="width: 6%">把(百张)</th>\n                        <th rowspan="2" style="width: 6%">卡(二十张)</th>\n                        <th rowspan="2" style="width: 6%">尾款数(个)</th>\n                        <th rowspan="2" style="width: 6%">金额小计</th>\n                    </tr>\n                ',tbodyTX:a,tfootTX:n}};htPrint(d)}else t.$Message.info({content:"无打印数据",duration:3})},_nullData:function(e){return e||""},formartMoney:function(e){return null==e||0==e?"0.00":accounting.formatNumber(e,2,"")},onAsyncSuccess:function(){var t=this,e=$.fn.zTree.getZTreeObj(t.tid),a=e.getNodeByParam("id",t.selected);e.selectNode(a),$.ajax({type:"post",url:contextPath+"/checklist/info",data:{id:t.selected,type:1},success:function(e){console.log(e),"100100"==e.code?(console.log("查看数据"),t._loadTableData(e)):layer.alert(e.msg)}})},modify:function(e){var n=this;if("add"===e)n.addTitle="现金盘点表-新增",n.formAdd=n.formInitData,$.extend(!0,n.dataList,n.dataListInit),n.addModal=!0;else if("update"===e){if(""===this.selected)return void n.$Message.error("修改只能对单条数据进行操作");var t=this.selected;n.addTitle="现金盘点表-修改",$.ajax({type:"post",url:contextPath+"/checklist/info",data:{id:t,type:2},success:function(e){if(console.log(e),"100100"==e.code){console.log("修改数据"),n.dataList=e.data.checkDetail,$.each(n.dataList,function(e,t){var a={parValueStr:n.parValueStr[t.sequence-1]};t.amount=n.formartMoney(t.amount),Object.assign(t,a)});var t=e.data.cashCheck;n.formAdd.id=t.id,n.formAdd.sobId=t.sobId,n.formAdd.datetime=t.datetime,n.formAdd.currencyId=t.currencyId,n.formAdd.subjectName=t.subjectName,n.formAdd.subjectCode=t.subjectCode,n.formAdd.subjectId=t.subjectId,n.formAdd.remark=t.remark,n.formAdd.totalAmount=t.totalAmount,n.addModal=!0}else layer.alert(e.msg)}})}},addClose:function(){this.addModal=!1},_loadTableData:function(e){var n=this;n.dataList=e.data.checkDetail;var a=e.data.cashCheck;n.rightForm.createName=a.createName,n.rightForm.subjectName=n.formInitData.subjectName,$.each(n.currencyList,function(e,t){t.id==a.currencyId&&(n.rightForm.currencyName=t.currencyName)}),n.rightForm.dateTime=new Date(a.datetime).format("yyyy-MM-dd"),$.isEmptyObject(a.remark)?n.rightForm.remark="（无）":n.rightForm.remark=a.remark,n.rightForm.sheetMoney=n.formartMoney(a.totalAmount),n.rightForm.cashMoney=n.formartMoney(e.data.cashMoney),n.rightForm.profitMoney=n.formartMoney(a.totalAmount-e.data.cashMoney),$.each(n.dataList,function(e,t){var a={parValueStr:n.parValueStr[t.sequence-1]};t.amount=n.formartMoney(t.amount),Object.assign(t,a)}),$("#list").jqGrid("setGridParam",{data:n.dataList}).trigger("reloadGrid"),n.reload=!n.reload,n.nodeSelected=!0},clickEvent:function(e,t,a){var n=this;if(null!=a.children)n.isDisabled=!0,n.nodeSelected=!1;else{n.isDisabled=!1;var r=n.$ztree.getSelectedNodes();console.log(r),n.selected=r[0].id,n.selNode=r,$.ajax({type:"post",url:contextPath+"/checklist/info",data:{id:n.selected,type:1},success:function(e){console.log(e),"100100"==e.code?(console.log("查看数据"),n._loadTableData(e)):layer.alert(e.msg)}})}},deleteBatch:function(){var t=this;console.log(t.selNode),$.ajax({type:"post",url:contextPath+"/checklist/deleteCheckList",data:{id:t.selected},success:function(e){console.log(e),"100100"==e.code?(layer.alert("删除成功"),t.initCashCheckTree()):layer.alert(e.msg)}})},saveData:function(){var e=Date.parse(this.filterBody.timeStart)/1e3;Date.parse(this.filterBody.timeEnd)/1e3<e?this.$Message.error("开始日期不能大于结束日期"):this.initCashCheckTree()},cancelData:function(){},refreshData:function(){var n=this;n.init(),n.pageInit(),$.extend(!0,n.dataList,n.dataListInit),$.each(this.dataList,function(e,t){var a={parValueStr:n.parValueStr[t.sequence-1]};Object.assign(t,a)}),$("#list").jqGrid("setGridParam",{data:n.dataList}).trigger("reloadGrid"),n.reload=!n.reload,n.nodeSelected=!1},getColSum:function(e){var t=$("td[aria-describedby='list_"+e+"']"),a=0;return(t=0!==t.children("div.sumCol").length?$("td[aria-describedby='list_"+e+"']").children("div.sumCol"):$("td[aria-describedby='list_"+e+"']:not(:last)")).each(function(e,t){a+=1e3*accounting.unformat($(t).text())}),a/=1e3,a=accounting.formatMoney(a,"",2)},pageInit:function(){var e;jQuery("#list").jqGrid((_defineProperty(e={datatype:"local",data:this.dataList,colNames:["票面","把(百张)","卡(二十张)","尾款数(个)","金额小计"],height:"250",colModel:[{name:"parValueStr",index:"parValueStr",width:100,align:"center"},{name:"hundreds",index:"hundreds",width:100,align:"center"},{name:"twenty",index:"twenty",width:100,align:"center"},{name:"tails",index:"tails",width:100,align:"center"},{name:"amount",index:"amount",width:100,align:"center"}],rowNum:999999999,sortorder:"desc",sortable:!1,styleUI:"Bootstrap"},"height","230"),_defineProperty(e,"viewrecords",!0),_defineProperty(e,"footerrow",!0),_defineProperty(e,"userDataOnFooter",!0),_defineProperty(e,"gridComplete",this.completeMethod),_defineProperty(e,"loadComplete",function(e){console.log(e,"===========xhr=")}),_defineProperty(e,"onCellSelect",function(e){var t=jQuery("#list").jqGrid("getRowData",e);console.log(t,"---------=>")}),_defineProperty(e,"ondblClickRow",function(e){}),e))},completeMethod:function(){$("#list").footerData("set",{parValueStr:"合计",amount:[0]});var e=this.getColSum("amount");$("#list").footerData("set",{parValueStr:"合计",amount:e})},init:function(){var t=this;$.ajax({type:"post",url:contextPath+"/checklist/init",data:null,success:function(e){"100100"==e.code?(t.currencyList=e.data.currencyList,t.subjectList=e.data.subjectList,t.organizationList=e.data.org,t.periodDate=e.data.periodDate,t.filterBody.sobId=e.data.org[0].value,t.filterBody.timeStart=e.data.periodDate.startDate,t.filterBody.timeEnd=e.data.periodDate.endDate,t.showDataForm.timeStart=new Date(e.data.periodDate.startDate).format("yyyy-MM-dd"),t.showDataForm.timeEnd=new Date(e.data.periodDate.endDate).format("yyyy-MM-dd"),t.formInitData.id="",t.formInitData.sobId=e.data.org[0].value,t.formInitData.datetime=e.data.periodDate.endDate,t.formInitData.currencyId=e.data.currencyList[0].id,t.formInitData.subjectName=e.data.subjectList[0].accountName,t.formInitData.subjectCode=e.data.subjectList[0].accountCode,t.formInitData.subjectId=e.data.subjectList[0].accountId,t.formInitData.remark="",t.formInitData.totalAmount="",t.initCashCheckTree()):layer.alert("页面初始化失败")}})},onTreeChange:function(e){this.nodes="ltData"==e?this.nodesList.dateTree:this.nodesList.subjectTree},initCashCheckTree:function(){var t=this,a=this.selected;t.filterBody.timeStart=new Date(t.filterBody.timeStart).format("yyyy-MM-dd"),t.filterBody.timeEnd=new Date(t.filterBody.timeEnd).format("yyyy-MM-dd"),$.ajax({type:"post",url:contextPath+"/checklist/cashCheckList",data:t.filterBody,success:function(e){console.log(e),"100100"==e.code?(t.nodesList=e.data,"ltData"==t.leftType?t.nodes=e.data.dateTree:t.nodes=e.data.subjectTree,null!=a&&""!=a&&t.$nextTick(function(){t.onAsyncSuccess()})):null==e?layer.alert("系统异常"):layer.alert(e.msg)}})}},mounted:function(){this.init(),this.pageInit(),this.openTime=window.parent.params&&window.parent.params.openTime}});