"use strict";var vm=new Vue({el:"#customer-order-list",data:function(){var i=this;return{saleOrderNo:"",status:"",modalTrigger:!1,modalType:"",stepList:[],approvalTableData:[],isHideSearch:!0,isHideList:!0,selected:[],reload:!1,urgencyList:[],openTime:"",body:{custNo:"",businessType:"",startTime:"",endTime:"",businessStatus:"",saleOrderNo:"",remark:"",isOrderDate:"Y"},businessStatusMap:{5:"待设置定金",10:"待收定金",15:"待采购入库",20:"待拣货确认",25:"待调拨检验",30:"待调拨",35:"待发货检验",40:"待发货",45:"已发货"},statusMap:{1:"暂存",2:"待审核",3:"审核中",4:"已审核",5:"驳回"},typeMap:{S_CUST_ORDER_01:"普通销售",S_CUST_ORDER_02:"受托加工销售"},tempDate:[],businessStatusLabel:[{label:"待设置定金",value:"5"},{label:"待收定金",value:"10"},{label:"待采购入库",value:"15"},{label:"待拣货确认",value:"20"},{label:"待调拨检验",value:"25"},{label:"待调拨",value:"30"},{label:"待发货检验",value:"35"},{label:"待发货",value:"40"},{label:"已发货",value:"45"}],data_config:{url:contextPath+"/tsalecustorder/list",colNames:["id","下单日期","单据编号","紧急程度","单据状态","业务状态","业务类型","客户","货源性质","商品类型","总件数","订单备注"],colModel:[{name:"id",hidden:!0},{name:"orderDate",index:"orderDate",width:200,align:"left",sortable:!1,formatter:function(e,t,a,s){return new Date(e).format("yyyy-MM-dd")}},{name:"saleOrderNo",index:"saleOrderNo",width:200,align:"left",formatter:function(e,t,a,s){return $(document).off("click",".detail"+e).on("click",".detail"+e,function(){i.detailClick({value:e,grid:t,rows:a,state:s})}),'<a class="detail'+e+'">'+e+"</a>"}},{name:"urgency",index:"urgency",width:150,align:"left",formatter:function(e,t,a,s){var i="";for(var o in vm.urgencyList)vm.urgencyList[o].value==e&&(i=vm.urgencyList[o].name);return i}},{name:"status",index:"status",width:180,align:"left",sortable:!1,formatter:function(e,t,a,s){return void 0===vm.statusMap[e]?"":vm.statusMap[e]}},{name:"businessStatus",index:"businessStatus",width:180,align:"left",sortable:!1,formatter:function(e,t,a,s){return void 0===vm.businessStatusMap[e]?"":vm.businessStatusMap[e]}},{name:"businessType",index:"businessType",width:180,align:"left",formatter:function(e,t,a,s){return void 0===vm.typeMap[e]?"":vm.typeMap[e]}},{name:"custName",index:"custName",width:180,align:"left"},{name:"sourceNature",index:"sourceNature",width:180,sortable:!1,align:"left",formatter:function(e,t,a,s){return 1==e?"现货":"非现货"}},{name:"goodsTypeName",index:"goodsTypeName",width:180,sortable:!1,align:"left"},{name:"goodsNum",index:"goodsNum",width:180,sortable:!1,align:"left"},{name:"remark",index:"remark",width:180,sortable:!1,align:"left"}],multiselect:!0,multiboxonly:!0}}},methods:{refresh:function(){this.reload=!this.reload},detailClick:function(e){var t=e.rows.saleOrderNo;window.parent.activeEvent({name:"客户订单",url:contextPath+"/sale/customer-order/customer-order-add.html",params:{type:"view",saleOrderNo:t}})},hideSearch:function(){this.isSearchHide=!this.isSearchHide,$(".chevron").css("top","")},changeDate:function(e){this.body.startTime=""==e[0]?"":e[0].replace(/\//g,"-")+" 00:00:00",this.body.endTime=""==e[1]?"":e[1].replace(/\//g,"-")+" 23:59:59"},search:function(){this.reload=!this.reload},clear:function(){this.$refs.operationType.reset(),this.$refs.operationStatus.reset(),this.$nextTick(function(){this.body.businessType="",this.body.businessStatus=""}),this.tempDate=[],this.body={businessType:"",startTime:"",endTime:"",businessStatus:"",saleOrderNo:"",remark:"",custNo:"",isOrderDate:"Y"}},add:function(){window.parent.activeEvent({name:"新增客户订单",url:contextPath+"/sale/customer-order/customer-order-add.html",params:{type:"add",saleOrderNo:""}})},del:function(){if(0!==this.selected.length){for(var e=this.selected,t=[],a=0;a<e.length;a++){if(1!==e[a].status)return void vm.$Modal.info({title:"提示",content:"已提交的订单不能删除!",okText:"确定"});t.push(e[a].id)}$.ajax({type:"post",url:contextPath+"/tsalecustorder/delete",contentType:"application/json",data:JSON.stringify(t),dataType:"json",success:function(e){"100100"===e.code?vm.$Modal.info({title:"提示",content:"删除成功!",okText:"确定",onOk:function(){vm.reload=!vm.reload}}):vm.$Modal.info({title:"提示",content:"删除!",okText:"确定"})},error:function(e){console.log("服务器出错")}})}else this.$Modal.info({title:"提示",okText:"确定",content:"请选中行!"})},update:function(){if(1===this.selected.length){var e=this.selected[0].saleOrderNo;window.parent.activeEvent({name:"修改客户订单",url:contextPath+"/sale/customer-order/customer-order-add.html",params:{type:"update",saleOrderNo:e}})}else this.$Modal.info({title:"提示",okText:"确定",content:"只能对单条数据操作!"})},submit:function(){if(1===this.selected.length){var e=this.selected[0];1===e.status?"N"!==e.isCheck?$.ajax({type:"post",url:contextPath+"/tsalecustorder/submit",contentType:"application/json",data:JSON.stringify({saleOrderNo:e.saleOrderNo}),dataType:"json",success:function(e){"100100"===e.code?vm.$Modal.info({title:"提示",content:"提交成功!",okText:"确定",onOk:function(){vm.reload=!vm.reload}}):this.$Modal.info({title:"提示",content:"提交失败!",okText:"确定"})},error:function(e){console.log("服务器出错")}}):this.$Modal.info({title:"提示",okText:"确定",content:"订单信息不完整,请修改!"}):this.$Modal.info({title:"提示",okText:"确定",content:"单据已提交!"})}else this.$Modal.info({title:"提示",okText:"确定",content:"只能对单条数据操作!"})},approval:function(e){if(1===this.selected.length){this.saleOrderNo=this.selected[0].saleOrderNo,this.status=this.selected[0].status;this.modalType="approve",this.modalTrigger=!this.modalTrigger}else this.$Modal.info({title:"提示",okText:"确定",content:"只能对单条数据操作!"})},reject:function(e){if(1===this.selected.length){this.saleOrderNo=this.selected[0].saleOrderNo,this.status=this.selected[0].status;this.modalType="reject",this.modalTrigger=!this.modalTrigger}else this.$Modal.info({title:"提示",okText:"确定",content:"只能对单条数据操作!"})},approvalOrRejectCallBack:function(e){"100100"===e.result.code?this.reload=!this.reload:this.$Modal.warning({content:e.result.msg,title:"警告"})},exit:function(){window.parent.closeCurrentTab({exit:!0,openTime:this.openTime})}},mounted:function(){this.urgencyList=getCodeList("jxc_khdd_khdd_jjcd"),this.openTime=window.parent.params.openTime}});