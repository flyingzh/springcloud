"use strict";new Vue({el:"#statisticsFixedAssetsQuantity",data:function(){return{currencyType:"",formData:{currencyType:"2",currencyName:"",dateStr:"",dateType:"1",sPeriodYear:"",sPeriodMonth:"",ePeriodYear:"",ePeriodMonth:"",sDate:"",eDate:"",date1:"",date2:"",isStatus:!0,isDetailSubject:!0,isSmallPlan:!1,isTotal:!1,openTime:"",check1:!1,check2:!1,check3:!1,check4:!1,check5:!1,check6:!1},periodYear:[],periodList:[],filterVisible:!0,base_config:{mtype:"POST",styleUI:"Bootstrap",url:contextPath+"/app/cashPositionTable/list",datatype:"json",jsonReader:{root:"data",cell:"list",repeatitems:!1},viewrecords:!0,rowNum:99999,shrinkToFit:!1},colNames:[],colModel:[],tableHeaders:[],organisationList:[{label:"金大祥",value:1},{label:"金大祥1",value:2},{label:"金大祥2",value:3}],baseData:{standardCurrencyId:1},printModal:!1,printInfo:{},dataList:[]}},created:function(){this.openTime=window.parent.params&&window.parent.params.openTime},mounted:function(){this.initData(),this.initMethod()},methods:{getLastDay:function(t,e){var a=new Date(t,e,1),i=new Date(a.getTime()-864e5);return i.getFullYear()+"-"+(Number(i.getMonth())+1)+"-"+i.getDate()},operateDate:function(t){return new Date(t).format("yyyy-MM-dd")},initData:function(){var a=this;$.ajax({type:"post",async:!1,url:contextPath+"/app/cashPositionTable/initData",success:function(t){var e=t.data;null!=e&&(a.periodYear=e.yearList,a.periodList=e.monthList,a.formData.sPeriodYear=e.currentYear,a.formData.sPeriodMonth=e.currentMonth,a.formData.ePeriodYear=e.currentYear,a.formData.ePeriodMonth=e.currentMonth,a.formData.date1=e.currentYear+"-"+e.currentMonth+"-01",a.formData.date2=a.getLastDay(e.currentYear,e.currentMonth))}})},queryParams:function(){var t=this.formData.dateType;if("1"==t){this.formData.sDate=this.formData.sPeriodYear+"-"+this.formData.sPeriodMonth,this.formData.eDate=this.formData.ePeriodYear+"-"+this.formData.ePeriodMonth;var e=this.formData.sPeriodYear,a=this.formData.ePeriodYear,i=this.formData.sPeriodMonth,r=this.formData.ePeriodMonth,o=e+"年"+i+"期至"+a+"年"+r+"期";e==a&&i==r&&(o=e+"年"+i+"期"),this.formData.dateStr=o}if("2"==t){var n=this.operateDate(this.formData.date1),s=this.operateDate(this.formData.date2);o=(this.formData.sDate=n)+"至"+(this.formData.eDate=s);n==s&&(o=n),this.formData.dateStr=o}},initMethod:function(){this.delTable(),this.setTableHeader()},setTableHeader:function(){this.formData.currencyType;this.colNames=["id","类别","使用部门","经济用途","存放地点","变动方式","使用状态","计量单位","数量","原值"],this.colModel=[{name:"id",width:30,hidden:!0,frozen:!0},{name:"accountCode",width:100,frozen:!0},{name:"accountName",width:150,frozen:!0},{name:"currencyName",width:80,frozen:!0},{name:"bankName",width:150},{name:"bankAccount",width:150},{name:"initBalanceFor",width:120},{name:"debitAmountFor",width:120},{name:"creditAmountFor",width:120},{name:"endBalanceFor",width:120}],this.base_config.height=$(window).height()-100,this.tableHeaders=[],this.jqGridInit(this.colNames,this.colModel,this.tableHeaders)},delTable:function(){$("#grid").empty();var t=$(".jqGrid_wrapper");t.empty(),$('<table id="grid"></table><div id="page"></div>').appendTo(t)},jqGridInit:function(t,e,a){var i=this,r=Object.assign({},this.base_config,{colNames:t,colModel:e,loadComplete:function(t){i.dataList=t.data||[],jQuery("#grid").jqGrid("destroyGroupHeader"),jQuery("#grid").jqGrid("setGroupHeaders",{useColSpanStyle:!0,groupHeaders:a})},gridComplete:function(){var t=jQuery("#grid").jqGrid("getRowData"),e=$("#grid").jqGrid("getDataIDs");t.push($("#grid").jqGrid("getRowData",e[e.length-1]));for(var a="",i=0;i<t.length;i++)"小计"==(a=t[i].accountName)&&$("#"+t[i].id).find("td").addClass("xjClass"),"总计"==a&&$("#"+t[i].id).find("td").addClass("totalClass");console.log(t)}});jQuery("#grid").jqGrid(r)},open:function(){this.filterVisible=!0},refresh:function(){$("#grid").jqGrid("setGridParam",{postData:this.formData}).trigger("reloadGrid")},save:function(){this.filterVisible=!1,this.queryParams(),this.base_config.url=contextPath+"/app/cashPositionTable/list",this.base_config.postData=this.formData,this.initMethod()},cancel:function(){this.filterVisible=!1},exportExcel:function(){window.open(contextPath+"/app/cashPositionTable/exportExcel?currencyType="+this.currencyType+"&dateStr="+this.formData.dateStr,"数据引出")},exitPrevent:function(){window.parent.closeCurrentTab({name:"资金头寸表",openTime:this.openTime,exit:!0})},print:function(){var t,e=this;e.dataList&&e.dataList.length?(t={title:"资金头寸表",template:1,titleInfo:[{name:"币别",val:e.formData.currencyName},{name:"期间",val:e.formData.dateStr}],colNames:[{name:"科目代码",col:"accountCode"},{name:"科目名称",col:"accountName"},{name:"币别",col:"currencyName"},{name:"银行名称",col:"bankName"},{name:"银行账号",col:"bankAccount"},{name:"期初余额",col:"initBalanceFor"},{name:"借方发生额",col:"debitAmountFor"},{name:"贷方发生额",col:"creditAmountFor"},{name:"期末余额",col:"endBalanceFor"},{name:"借方笔数",col:"debitNumber"},{name:"贷方笔数",col:"creditNumber"},{name:"启用",col:"statusName"},{name:"科目类别",col:"isCashName"}],styleCss:"",colMaxLenght:13,data:e.dataList,totalRow:!1},e.printInfo=t,e.printModalShow(!0)):e.$Message.info({content:"无打印数据",duration:3})},printModalShow:function(t){this.printModal=t},nullValue:function(t){return null==t||void 0===t||0==t?"":t}}});