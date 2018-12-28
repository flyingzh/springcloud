"use strict";var vm=new Vue({el:"#app",data:{isShow:!1,isEdit:!1,reload:!1,isSearchHide:!0,isTabulationHide:!0,selectBusinessType:[{value:"普通销售",label:"普通销售"},{value:"受托加工销售",label:"受托加工销售"}],body:{ordereNo:"",qualityStatus:"",supplierId:"",businessStatus:2},data_config:{url:contextPath+"/purchasestock/queryPendingStockList",datatype:"json",colNames:["","","","","源单类型","单据编号","质检状态","商品类型","日期","供应商","收料重量","收料数量","合格数量","不合格数量","特别放行数量","业务员"],colModel:[{name:"id",width:210,align:"left",hidden:!0},{name:"supplierId",width:210,align:"left",hidden:!0},{name:"customerId",width:210,align:"left",hidden:!0},{name:"goodsTypePath",width:210,align:"left",hidden:!0},{name:"businessType",width:210,align:"left",formatter:function(e){switch(e){case"P_RECEIPT_01":return"收货单一客户送料";case"P_RECEIPT_02":return"收货单一标准采购收货";case"P_RECEIPT_03":return"收货单一受托加工收货";case"P_RECEIPT_04":return"收货单一供应商退料";default:return""}},unformat:function(e){switch(e){case"收货单一客户送料":return"P_RECEIPT_01";case"收货单一标准采购收货":return"P_RECEIPT_02";case"收货单一受托加工收货":return"P_RECEIPT_03";case"收货单一供应商退料":return"P_RECEIPT_04";default:return""}}},{name:"orderNo",width:210,align:"left",formatter:function(e,t,a,n){return $(document).off("click",".detail"+e).on("click",".detail"+e,function(e){e.preventDefault(),vm.viewCollectGoods(a.orderNo)}),'<a class="detail'+e+'">'+e+"</a>"},unformat:function(e,t,a){return e.replace(/(<\/?a.*?>)/g,"")}},{name:"qualityStatus",width:210,align:"left",formatter:function(e,t,a){if(5==e)return 0<Number(a.releaseQuantityCount)?"放行":"合格";switch(e){case 1:return"待质检";case 2:return"不合格";case 3:return"合格";case 4:return"特别放行";default:return""}}},{name:"categoryName",width:210,align:"left"},{name:"receiptDate",align:"left",width:210},{name:"supplierName",align:"left",width:210},{name:"takeDeliveryWeight",align:"right",width:210},{name:"takeDeliveryCount",align:"right",width:210},{name:"qualifiedCount",align:"right",width:210},{name:"unqualifiedCount",align:"right",width:210},{name:"releaseQuantityCount",align:"right",width:210},{name:"salesmanName",align:"left",width:210}],autoScroll:!0,shrinkToFit:!1},categoryType:[],goodsTypes:[],qualityStatusArr:[{label:"合格",value:3},{label:"特别放行",value:4}],sourceDocTypeArr:[{label:"收货单一客户送料",value:"P_RECEIPT_01"},{label:"收货单一标准采购收货",value:"P_RECEIPT_02"},{label:"收货单一受托加工收货",value:"P_RECEIPT_03"},{label:"收货单一供应商退料",value:"P_RECEIPT_04"}],supplierArr:[],selectDates:[],selected:[],openTime:""},created:function(){this.loadCategories(),this.loadSuppliers(),this.openTime=window.parent.params.openTime},methods:{viewCollectGoods:function(e){var t=this;$.post(contextPath+"/tpurchasecollectgoods/info",{code:e},function(e){"100100"==e.code&&t.goCollectGoods(e.data,4)},"json")},goCollectGoods:function(e,t){window.parent.activeEvent({name:"采购收货单-查看",url:contextPath+"/purchase/purchase-collectgoods/purchase-collectgoods-add.html",params:e,type:t})},exit:function(){window.parent.closeCurrentTab({name:"采购入库列表",openTime:this.openTime,exit:!0})},generateStockDoc:function(){var e=this,t=e.selected;if(t.length<1)return e.$Modal.warning({content:"请先选择要生成的数据!"}),!1;if(1<t.length){var a=t[0].businessType,n="",i=!0,o=t[0].supplierId,r=t[0].customerId,s=t[0].goodsTypePath;if(t.every(function(e){return a!=e.businessType&&(n+="源单类型不同，",i=!1),s!=e.goodsTypePath&&(n+="商品类型不同，",i=!1),o&&o!=e.supplierId&&(n+="供应商不同，",i=!1),r&&r!=e.customerId&&(n+="客户不同，",i=!1),i}),!i)return e.$Modal.warning({content:"选中的单据不能合并生成，因为"+n}),!1;console.log(t.map(function(e){return Object.assign({},{businessType:e.businessType,goodsTypePath:e.goodsTypePath,supplierId:e.supplierId,customerId:e.customerId})})),window.parent.activeEvent({name:"采购入库单-新增",url:contextPath+"/warehouse/purchase-stock-in/purchase-stock-in-info.html",params:{type:"sAdd",ids:JSON.stringify(t.map(function(e){return e.id}))}})}window.parent.activeEvent({name:"采购入库单-新增",url:contextPath+"/warehouse/purchase-stock-in/purchase-stock-in-info.html",params:{type:"sAdd",ids:JSON.stringify(t.map(function(e){return e.id}))}})},changeDate:function(e){e[0]&&e[e.length-1]&&(this.body.startTime=e[0].replace(/\//g,"-")+" 00:00:00",this.body.endTime=e[1].replace(/\//g,"-")+" 23:59:59")},search:function(){this.reload=!this.reload},changeGoodsType:function(e,t){this.body.goodsTypePath="0."+e.join(".")+"."},loadCategories:function(){var t=this;$.ajax({type:"post",url:contextPath+"/purchasestock/queryCategories",data:{parentId:0},dataType:"json",success:function(e){"100100"===e.code&&(t.categoryType=t.initGoodCategory(e.data.cateLists))},error:function(){}})},initGoodCategory:function(e){var i=this,o=[];return e.forEach(function(e){var t=e.id,a=e.name,n=e.cateLists;n&&(n=i.initGoodCategory(n)),o.push({value:t,label:a,children:n})}),o.forEach(function(e){e.children||delete e.children}),o},clear:function(){var e=this;e.selectDates=[],e.body.startTime="",e.body.endTime="",e.body.ordereNo="",e.goodsTypes=[],e.body.goodsTypePath="",e.body.qualityStatus&&(e.$refs.qualityStatus.reset(),e.$nextTick(function(){e.body.qualityStatus=""})),e.body.businessType&&(e.$refs.businessType.reset(),e.$nextTick(function(){e.body.businessType=""})),e.body.supplierId&&(e.$refs.supplier.reset(),e.$nextTick(function(){e.body.supplierId=""}))},refresh:function(){this.clear(),this.reload=!this.reload},loadSuppliers:function(){var t=this;$.ajax({url:contextPath+"/purchasestock/querySuppliers",method:"POST",dataType:"json",data:{},success:function(e){t.supplierArr=[],"100100"===e.code&&0<e.data.length&&e.data.forEach(function(e){t.supplierArr.push(Object.assign({},{label:e.siShortName,value:e.id,code:e.supplierCode}))})}})}}});