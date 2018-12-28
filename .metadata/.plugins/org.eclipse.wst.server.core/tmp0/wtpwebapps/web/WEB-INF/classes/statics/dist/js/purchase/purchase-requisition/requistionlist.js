"use strict";function _defineProperty(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}var purchaseOrderList=new Vue({el:"#purchaseOrderList",data:function(){var i=this;return{openTime:"",isSearchHide:!0,isTabulationHide:!0,isShow:!1,isHide:!0,isEdit:!1,reload:!1,selected:[],categoryType:[],empList:[],documentStatusList:[],commodityCategoty:[],dateArr:[],modalTrigger:!1,modalType:"",steplist:[],applyOrder:{orderNo:"",orderStatus:""},orderStatusMap:{1:"暂存",2:"待审核",3:"审核中",4:"已审核",5:"驳回"},body:{goodsGroupPath:"",orderStatus:"",orderNo:"",startTime:"",endTime:""},data_config:{url:contextPath+"/tpurchaseapply/list",colNames:["单据编号","单据状态","商品类型","日期","申请人","申请重量","申请数量","预计采购金额","备注"],colModel:[{name:"orderNo",index:"orderNo",width:240,align:"left",formatter:function(t,e,r,o){return $(document).off("click",".detail"+t).on("click",".detail"+t,function(){i.testOrderDetailClick({value:t,grid:e,rows:r,state:o})}),'<a class="detail'+t+'">'+t+"</a>"},unformat:function(t,e,r){return t.replace(/(<\/?a.*?>)/g,"")}},{name:"orderStatus",index:"orderStatus",align:"left",width:180,formatter:function(t,e,r,o){return purchaseOrderList.orderStatusMap[t]}},{name:"goodsType",index:"goodsType",align:"left",width:180},{name:"createTime",index:"createTime",align:"left",width:180,formatter:function(t,e,r,o){return new Date(t).format("yyyy-MM-dd")}},{name:"applyUserName",index:"applyUserName",align:"left",width:180},{name:"applyWeight",index:"applyWeight",align:"left",width:180},{name:"applyCount",index:"applyCount",align:"left",width:180},{name:"estimatePurchaseMoney",index:"estimatePurchaseMoney",width:180,align:"center"},_defineProperty({name:"remark",index:"remark",width:180,align:"center"},"align","left")]}}},methods:{search:function(){console.log(this.body),0<this.commodityCategoty.length?this.body.goodsGroupPath=this.commodityCategoty[this.commodityCategoty.length-1]:this.body.goodsGroupPath="",0<this.dateArr.length&&this.dateArr[0]&&this.dateArr[1]?(this.body.startTime=this.dateArr[0].format("yyyy-MM-dd")+" 00:00:00",this.body.endTime=this.dateArr[1].format("yyyy-MM-dd")+" 23:00:00"):(this.body.startTime="",this.body.endTime=""),this.reload=!this.reload,this.selected=[]},approval:function(t){var e=this;if(!ht.util.hasValue(this.selected,"array"))return this.$Modal.warning({title:"提示",content:"请先选择一条记录"}),!1;if(1<this.selected.length)return this.$Modal.warning({title:"提示",content:"最多只能选择一条记录"}),!1;var r=this.selected[0];e.applyOrder.orderNo=r.orderNo,e.applyOrder.orderStatus=r.orderStatus,e.modalType="approve",e.modalTrigger=!e.modalTrigger},reject:function(t){var e=this;if(!ht.util.hasValue(this.selected,"array"))return this.$Modal.warning({title:"提示",content:"请先选择一条记录"}),!1;if(1<this.selected.length)return this.$Modal.warning({title:"提示",content:"最多只能选择一条记录"}),!1;var r=this.selected[0];e.applyOrder.orderNo=r.orderNo,e.applyOrder.orderStatus=r.orderStatus,e.modalType="reject",e.modalTrigger=!e.modalTrigger},approvalOrRejectCallBack:function(t){console.log(t);"100100"==t.result.code&&this.search()},testOrderDetailClick:function(t){console.log(t);var e=t.rows.id,r=t.rows;e&&this.queryOrderByOrderNo(e,!0,r)},queryOrderByOrderNo:function(t,e,r){window.parent.activeEvent({name:"采购申请单详情",url:contextPath+"/purchase/purchase-requisition/purchase-requisition.html",params:{code:t,type:"update",basicInfo:r}})},clear:function(){this.commodityCategoty=[],this.dateArr=[],this.body.goodsGroupPath="",this.body.orderStatus="",this.body.orderNo="",this.body.startTime="",this.body.endTime=""},refresh:function(){this.clear(),this.reload=!this.reload},add:function(){window.parent.activeEvent({name:"采购申请单详情",url:contextPath+"/purchase/purchase-requisition/purchase-requisition.html",params:{type:"add"}})},del:function(){var t=this,e=this;if(this.selected.length<1)this.$Modal.warning({title:"提示信息",content:"<p>请先选择至少一条数据！</p>"});else if(1<=this.selected.length){var r=[];this.selected.map(function(t){r.push(t.id)}),this.$Modal.confirm({title:"提示信息",content:"<p>是否删除信息？</p>",onOk:function(){console.log(JSON.stringify(t.selected)),$.ajax({url:contextPath+"/tpurchaseapply/delete",method:"post",dataType:"json",data:JSON.stringify(r),contentType:"application/json;charset=utf-8",success:function(t){"100100"===t.code?setTimeout(function(){e.$Modal.success({title:"提示信息",okText:"确定",content:t.data}),e.selected=[],e.refresh()},300):setTimeout(function(){e.$Modal.error({title:"删除失败！",okText:"确定",content:t.msg})},300)},error:function(t){this.$Modal.error({content:"网络异常,请联系技术人员！"})}})}})}},modify:function(){if(this.selected.length<1)this.$Modal.warning({title:"提示信息",content:"<p>请先选择至少一笔数据！</p>"});else if(1<this.selected.length)this.$Modal.warning({title:"提示信息",content:"<p>只能选择一笔数据进行修改！</p>"});else{var t=this.selected;window.parent.activeEvent({name:"采购订单详情",url:contextPath+"/purchase/purchase-requisition/purchase-requisition.html",params:{code:t[0].id,type:"update"}})}},cancel:function(){window.parent.closeCurrentTab({exit:!0,openTime:this.openTime})},loadProductType:function(){var e=this;$.ajax({type:"post",url:contextPath+"/documentController/getCategory?parentId=0",contentType:"application/json",dataType:"json",success:function(t){"100100"==t.code?e.categoryType=e.initGoodCategory(t.data.cateLists):this.$Modal.error({content:t.msg})},error:function(t){this.$Modal.error({content:"网络异常,请联系技术人员！"})}})},initGoodCategory:function(t){var i=this,a=[];return t.forEach(function(t){var e=t.customCode,r=t.name,o=t.cateLists;o&&(o=i.initGoodCategory(o)),a.push({value:e,label:r,children:o})}),a.forEach(function(t){t.children||delete t.children}),a}},created:function(){this.loadProductType()},watch:{"body.orderStatus":function(t){void 0===t&&(this.body.orderStatus="")}},mounted:function(){this.openTime=window.parent.params.openTime}});