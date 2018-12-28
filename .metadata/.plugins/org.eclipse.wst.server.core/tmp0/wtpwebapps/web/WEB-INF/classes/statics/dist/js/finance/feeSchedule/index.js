"use strict";var vm=new Vue({el:"#fee-schedule",data:function(){return{openTime:"",formData:{for1:"",for2:"",for3:"",for4:"1",for5:"",for6:!0,for7:!0,for8:""},feeScheduleVO:{accountPeriods:[],accountCode:"",accountShowFlag:1,showItemFlag:!0,showSumAmountFlag:!0,treeHeight:0,startYear:2018,endYear:2018,startPeriod:8,endPeriod:8},subjectList:[],formDataList:[],accountPeriods:[],visible:!1,base_config:{treeGrid:!0,treeGridModel:"adjacency",ExpandColumn:"subjectCode",scroll:"true",shrinkToFit:!1,mtype:"POST",styleUI:"Bootstrap",url:"",ajaxGridOptions:{contentType:"application/json;charset=utf-8"},datatype:"json",postData:JSON.stringify(this.feeScheduleVO),jsonReader:{root:"data",repeatitems:!1},treeReader:{level_field:"level",parent_id_field:"parentId",leaf_field:"isLeaf",expanded_field:"expanded"},height:$(window).height()-140},colNames1:["编码","名称","本年累计"],colModel:[{name:"subjectCode",width:160,sortable:!1},{name:"subjectName",width:185,sortable:!1},{name:"total",width:130,align:"right",hidden:!1,sortable:!1}],subjectVisable:!1,option:{},echartsLegend:[],echartsDate:[],echartsSeries:[],printInfo:{},printModal:!1,dataList:[],reload:!1,openCharts:!1,isFilterVisible:!1}},methods:{initMethod:function(){this.delTable(),this.initTable()},iconPopup:function(){this.subjectVisable=!0},getSubject:function(e){this.formData.for3=e.subjectCode},modelClick:function(){this.$refs.filter.visible=!0},showSubjectTree:function(){this.subjectVisable=!0},subjectClose:function(){this.subjectVisable=!1},subjectSave:function(e){this.formData.for3=e.subjectCode,this.feeScheduleVO.treeHeight=e.treeHeight,console.log(this.formData.for3,"~~~~~",this.feeScheduleVO.treeHeight)},setColum:function(e,t){if(e&&t){var o,i=Number(e.slice(0,4)),a=Number(e.slice(5,-1));o={name:e,width:130,align:"right",sortable:!1},this.colNames1.splice(this.colNames1.length-1,0,i+"年"+a+"期"),this.colModel.splice(this.colModel.length-1,0,o),this.echartsDate.push(e),this.accountPeriods.push(e),e!==t&&(e=12*i+a,this.setColum(parseInt(e/12)+"年"+(e%12+1)+"期",t))}},scheduleShow:function(){var t=this,o=this,e=this.subjectList.find(function(e){return o.feeScheduleVO.startYear=e.accountingYear,o.feeScheduleVO.startPeriod=e.accountingPeriod,e.accountYearPeriodStr===t.formData.for1}),i=this.subjectList.find(function(e){return o.feeScheduleVO.endYear=e.accountingYear,o.feeScheduleVO.endPeriod=e.accountingPeriod,e.accountYearPeriodStr===t.formData.for2});if(e&&i)return e===i?e.accountYearPeriodStr:e.accountYearPeriodStr+" 至 "+i.accountYearPeriodStr},initTable:function(){this.jqGridInit(this.colNames1,this.colModel,this)},delTable:function(){$("#my_report").empty();var e=$(".jqGrid_wrapper");e.empty(),$("<table id='my_report'></table>").appendTo(e)},jqGridInit:function(e,t,o){var i=this,a=Object.assign({},this.base_config,{colNames:e,colModel:t,loadComplete:function(e){i.dataList=e.data,console.log(i.dataList,"打印");var t=jQuery("#my_report").jqGrid("getGridParam","data");o.echartsLegend=t.map(function(e){return e.name}),t.forEach(function(t){var e={name:t.name,type:"line",stack:"总量",data:o.echartsDate.map(function(e){return t[e]})};o.echartsSeries.push(e)})},gridComplete:function(){o.option=o.getOption(),o.openCharts=!0}});jQuery("#my_report").jqGrid(a)},open:function(e){},save:function(){if(""!==vm.formData.for3){this.colNames1=["编码","名称","本年累计"],this.colModel=[{name:"subjectCode",width:160,sortable:!1},{name:"subjectName",width:185,sortable:!1},{name:"total",width:130,align:"right",hidden:!1,sortable:!1}],this.echartsDate=[],this.echartsSeries=[],this.echartsLegend=[],this.accountPeriods=[],this.setColum(this.formData.for1,this.formData.for2),this.feeScheduleVO.accountPeriods=vm.accountPeriods,this.feeScheduleVO.accountCode=vm.formData.for3,this.feeScheduleVO.accountShowFlag=vm.formData.for4,this.feeScheduleVO.showItemFlag=vm.formData.for5,this.feeScheduleVO.showSumAmountFlag=vm.formData.for6,this.feeScheduleVO.expandedFlag=vm.formData.for7,this.base_config.url=contextPath+"/feeSchedule/getFeeSchedule",this.base_config.postData=JSON.stringify(vm.feeScheduleVO);var e=this.colModel.length;this.formData.for6?this.colModel[e-1].hidden=!1:this.colModel[e-1].hidden=!0,this.initMethod(),this.cancel()}else this.$Message.info("请选择科目")},getOption:function(){return{tooltip:{trigger:"axis"},legend:{data:this.echartsLegend},toolbox:{show:!0,feature:{mark:{show:!0},dataView:{show:!0,readOnly:!1},magicType:{show:!0,type:["line"]},saveAsImage:{show:!0}}},calculable:!0,xAxis:[{type:"category",boundaryGap:!1,data:this.echartsDate}],yAxis:[{type:"value"}],series:this.echartsSeries}},more:function(){this.visible=!0},nomore:function(){this.visible=!1},cancel:function(){this.$refs.filter.visible=!1,this.isFilterVisible=!1},getReload:function(){this.reload=!1,this.openCharts=!1},refresh:function(){this.save()},getFinanceAccounting:function(){var e=contextPath+"/accounting/getFinanceAccounting";$.ajax({type:"post",async:!0,url:e,success:function(e){var t=e.data;null!=t&&(console.log(t),vm.subjectList=t,vm.formData.for1=vm.subjectList[0].accountYearPeriodStr,vm.formData.for2=vm.subjectList[0].accountYearPeriodStr)},error:function(e){console.log(e)}})},printV:function(){var e=this;if(e.dataList&&e.dataList.length){for(var t=[{name:"编码",col:"subjectCode"},{name:"名称",col:"subjectName"}],o=e.feeScheduleVO.accountPeriods,i=0;i<o.length;i++)t[2+i]={name:o[i],col:o[i]};e.feeScheduleVO.showSumAmountFlag&&(t[o.length+2]={name:"本年累计",col:"total"}),console.log(t,"数组");var a={title:"费用明细表",template:1,titleInfo:[],colNames:t,styleCss:"",colMaxLenght:o.length+3,data:e.dataList,totalRow:!1};console.log("点击打印,查看that.dataList: "),console.log(e.dataList),e.printInfo=a,e.printModalShow(!0)}else e.$Message.error({content:"无打印数据!",duration:3})},printModalShow:function(e){this.printModal=e},exportExcel:function(){window.open(rcContextPath+"/feeSchedule/exportExcel")},closeWindow:function(){window.parent.closeCurrentTab({name:"费用明细表",openTime:this.openTime,exit:!0})}},watch:{"formData.for7":function(e,t){vm.save()},"formData.for8":function(e,t){e&&(this.option=this.getOption(),this.reload=!0)}},computed:{showDetail:function(){return!!this.formData.for6}},created:function(){this.getFinanceAccounting()},mounted:function(){this.initMethod(this.colNames,this.colModel,this),this.openTime=window.parent.params&&window.parent.params.openTime}});