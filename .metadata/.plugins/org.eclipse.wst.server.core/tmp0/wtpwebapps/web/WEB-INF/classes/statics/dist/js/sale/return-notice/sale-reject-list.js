"use strict";var saleReturn=new Vue({el:"#sale-reject-list",data:function(){var i=this;return{isShow:!1,isEdit:!1,reload:!1,myTable:"myTable",openTime:"",isHideSearch:!0,isHideList:!0,isHide:!0,modalTrigger:!1,modalType:"",stepList:[],selected:[],confirmConfig:{showConfirm:!1,title:"提示",content:"请点击确认",onlySure:!0,success:!0},dataValue:[],operationFlag:{yes:0,no:1},jumpFlag:{query:"query",update:"update",add:"add"},businessTypeList:[{value:null,label:"全部"},{value:"S_CUST_ORDER_01",label:"普通销售"},{value:"S_CUST_ORDER_02",label:"受托加工销售"}],body:{businessType:"",documentNo:"",custNo:"",startTime:"",endTime:"",isDel:1},addBody:{id:"",documentNo:"",goodList:[],documentStatus:"",businessStatus:""},data_config:{url:contextPath+"/tSaleReturnNotice/list",colNames:["id","日期","单据编号","单据状态","业务状态","业务类型","退货客户","退货原因","总数量","总重量"],colModel:[{name:"id",index:"id",hidden:!0},{name:"returnDate",index:"returnDate",width:200,align:"left",formatter:function(t,e,n,o){return new Date(t).format("yyyy-MM-dd")}},{name:"documentNo",index:"documentNo",width:280,align:"left",formatter:function(t,e,n,o){var a=".detail"+t;return $(document).off("click",a).on("click",a,function(){i.detailClick({value:t,grid:e,rows:n,state:o})}),'<a class="detail'+t+'">'+t+"</a>"}},{name:"documentStatus",index:"documentStatus",width:200,align:"left",formatter:function(t,e,n,o){return console.log(t),1===t?"暂存":2===t?"待审核":3===t?"审核中":4===t?"已审核":"驳回"}},{name:"businessStatus",index:"businessStatus",width:200,align:"left",formatter:function(t,e,n,o){return console.log(t),1===t?"待质检判定":2===t?"已质检判定":""}},{name:"businessType",index:"businessType",width:200,align:"left",formatter:function(t,e,n,o){return console.log(t),"S_CUST_ORDER_01"===t?"普通销售":"S_CUST_ORDER_02"===t?"受托加工销售":""}},{name:"custName",index:"custName",align:"left",width:200},{name:"reason",index:"reason",align:"left",width:240},{name:"totalNum",index:"totalNum",align:"right",width:200,formatter:function(t,e,n,o){var a="";return t&&(a=t.toFixed(0)),a}},{name:"totalWeight",index:"totalWeight",align:"right",width:200,formatter:function(t,e,n,o){var a="";return t&&(a=t.toFixed(2)),a}}]}}},methods:{inquire:function(t,e){var n=this;console.log("这是查询。。。"),$.ajax({type:"POST",url:contextPath+"/tSaleReturnNotice/info",data:{documentNo:t},dataType:"json",success:function(t){"100100"==t.code?n.jump(t.data,e):n.$Modal.warning({content:t.msg})}})},changeDate:function(t){this.body.startTime=""==t[0]?"":t[0].replace(/\//g,"-")+" 00:00:00",this.body.endTime=""==t[1]?"":t[1].replace(/\//g,"-")+" 23:59:59"},search:function(){this.reload=!this.reload},detailClick:function(t){var e=t.rows.documentNo;console.log(e),this.inquire(t.value,this.jumpFlag.query)},clear:function(){this.$refs.mType.reset(),this.$nextTick(function(){this.body.businessType=""}),this.dataValue=[],this.body={businessType:"",documentNo:"",custNo:"",startTime:"",endTime:"",isDel:1},console.log(this.body)},refresh:function(){this.clear(),this.reload=!this.reload},jump:function(t,e){console.log("跳转..."),console.log(t),console.log(e),window.parent.activeEvent({name:"销售退货通知单新增",url:contextPath+"/sale/return-notice/sale-reject-add.html",params:{type:e,data:t}})},add:function(){console.log("这是新增。。。"),this.jump(this.operationFlag.no,this.jumpFlag.add)},deleteData:function(){var e=this;if(0!==e.selected.length){console.log(this.selected);for(var t=0;t<this.selected.length;t++){var n=$("#myTable").jqGrid("getRowData",this.selected[t]);if(1!=e.transdocstatus(n.documentStatus))return void e.$Modal.warning({title:"提示",content:"单据不是暂存状态,不能删除!"})}console.log(n),$.ajax({type:"POST",url:contextPath+"/tSaleReturnNotice/deleteBatch",data:JSON.stringify(e.selected),dataType:"json",contentType:"application/json; charset=utf-8",success:function(t){console.log(t.data),e.$Modal.success({title:"提示",content:"删除成功"}),e.reload=!e.reload},error:function(t){e.$Modal.error({title:"提示",content:"服务器出错"})}})}else this.$Modal.warning({title:"提示",content:"请至少选择一条记录进行删除"})},modify:function(){if(!ht.util.hasValue(this.selected,"array"))return this.$Modal.warning({title:"提示",content:"请先选择一条记录"}),!1;if(1<this.selected.length)return this.$Modal.warning({title:"提示",content:"最多只能选择一条记录"}),!1;var t=$("#myTable").jqGrid("getRowData",this.selected);console.log(t);var e=t.documentNo;if(1!=this.transdocstatus(t.documentStatus))return this.$Modal.warning({title:"提示",content:"该单据不能修改"}),!1;e=e.split(">")[1].split("<")[0],$.isEmptyObject(e)||null==e||(console.log(e),this.inquire(e,this.jumpFlag.update))},submit:function(){console.log(this.selected);if(!ht.util.hasValue(this.selected,"array"))return this.$Modal.warning({title:"提示",content:"请先选择一条记录"}),!1;if(1<this.selected.length)return this.$Modal.warning({title:"提示",content:"最多只能选择一条记录"}),!1;var t=$("#myTable").jqGrid("getRowData",this.selected);if(console.log(t),"暂存"!==t.documentStatus)return this.$Modal.warning({title:"提示",content:"该单据之前已经提交过了,不能再提交!"}),!1;var e=t.documentNo.split(">");t.documentNo=e[1].split("<")[0],console.log(t.documentNo),this.sendAjax(t.documentNo)},sendAjax:function(t){var a=this;$.ajax({type:"POST",url:contextPath+"/tSaleReturnNotice/info",data:{documentNo:t},dataType:"json",success:function(t){if(console.log(t),"100100"==t.code){var e=t.data,n=!1;if(""==e.documentNo||""==e.organizationId||""==e.businessType||""==e.custNo||""==e.returnDate||0==e.goodList.length)return a.$Modal.warning({content:"提交失败,请输入必填项!"}),!1;if(0<e.goodList.length&&e.goodList.map(function(t){""!=t.reProcessMethod&&null!=t.reProcessMethod||(n=!0)}),n)return a.$Modal.warning({content:"请输入完退货处理方式!"}),!1;a.addBody.goodList=t.data.goodList;var o=!1;0<e.goodList.length&&(e.goodList.map(function(t,e){""!=t.qualityResult&&null!=t.qualityResult||(o=!0)}),t.data.businessStatus=o?1:2),t.data.documentStatus=2,console.log(t.data),a.updateData(t.data,"提交成功!")}}})},transdocstatus:function(t){return"暂存"===t?1:"待审核"===t?2:"审核中"===t?3:"已审核"===t?4:5},approval:function(t){var e=this;if(!ht.util.hasValue(this.selected,"array"))return this.$Modal.warning({title:"提示",content:"请先选择一条记录"}),!1;if(1<this.selected.length)return this.$Modal.warning({title:"提示",content:"最多只能选择一条记录"}),!1;var n=$("#myTable").jqGrid("getRowData",this.selected);if(console.log(n),"已质检判定"!=n.businessStatus)e.$Modal.info({content:"请完成质检判定后再审核单据！"});else{var o=n.documentNo.split(">");n.documentNo=o[1].split("<")[0],e.addBody.id=n.id,console.log(e.addBody.id),e.addBody.documentNo=n.documentNo,e.addBody.documentStatus=e.transdocstatus(n.documentStatus),e.modalType="approve",e.modalTrigger=!e.modalTrigger}},reject:function(t){var e=this;if(!ht.util.hasValue(this.selected,"array"))return this.$Modal.warning({title:"提示",content:"请先选择一条记录"}),!1;if(1<this.selected.length)return this.$Modal.warning({title:"提示",content:"最多只能选择一条记录"}),!1;var n=$("#myTable").jqGrid("getRowData",this.selected),o=n.documentNo.split(">");n.documentNo=o[1].split("<")[0],e.addBody.id=n.id,e.addBody.documentNo=n.documentNo,e.addBody.documentStatus=e.transdocstatus(n.documentStatus),e.modalType="reject",e.modalTrigger=!e.modalTrigger},approvalOrRejectCallBack:function(t){console.log(t);var e=this;"100515"==t.result.code&&("approve"==e.modalType&&e.ajaxUpdateDocStatusById(e.addBody.id,4),"reject"==e.modalType&&e.ajaxUpdateDocStatusById(e.addBody.id,1)),this.reload=!this.reload},ajaxUpdateDocStatusById:function(t,e){var n=this;$.ajax({url:contextPath+"/tSaleReturnNotice/update",method:"POST",dataType:"json",contentType:"application/json;charset=utf-8",data:JSON.stringify({id:t,documentStatus:e}),success:function(t){"100100"==t.code&&(n.addBody.documentStatus=e)}})},cancel:function(){window.parent.closeCurrentTab({exit:!0,openTime:this.openTime})},updateData:function(t,e){var n=this;$.ajax({type:"POST",url:contextPath+"/tSaleReturnNotice/update",contentType:"application/json",data:JSON.stringify(t),dataType:"json",success:function(t){n.reload=!n.reload,n.$Modal.success({title:"提示",content:e})},error:function(t){n.$Modal.warning({title:"提示",content:"服务器出错"})}})}},mounted:function(){this.openTime=window.parent.params.openTime}});