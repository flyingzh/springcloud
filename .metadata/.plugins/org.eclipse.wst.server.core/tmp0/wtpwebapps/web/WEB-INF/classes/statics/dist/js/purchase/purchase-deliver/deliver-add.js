"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};function _defineProperty(t,e,o){return e in t?Object.defineProperty(t,e,{value:o,enumerable:!0,configurable:!0,writable:!0}):t[e]=o,t}var deliverOrder=new Vue({el:"#purchaseGoodDeliver",data:function(){var t;return _defineProperty(t={productDetailModal:{showModal:!1,dataSourceType:!1,dataSource:null,ids:{goodsId:"",commodityId:"",documentType:"P_APPLY_ORDER"},specialAttr:{stone:{},gold:{},part:{}}},openTime:"",isHint:!0,isSearchHide:!0,isTabulationHide:!0,isHide:!0,selected:[],needReload:!1,categoryType:[],commodityCategoty:[],commodityList:[],employees:{},barCodeTab:!1,isGoodsBarcode:!1,isGenerate:!1,count:0,weight:0,documentType2:"",saveSuccess:!1,deliver:{id:"",orderNo:"",orderStatus:1,businessType:"",supplierId:"",supplierName:"",supplierCode:"",goodsTypeName:"",goodsTypePath:"",deliverWeight:0,deliverCount:0,dataSource:"",deliveryDate:null,businessStatus:"",business_type:"",salesmanId:"",salesmanName:"",organizationId:"",orgName:"",logisticsMode:"",goodList:[],delDeliver:[]},params:{},unitMap:{},productDetailList:[{goodsEntities:[]}],productDetailList2:[{goodsEntities:[]}],productDetailListTemp:{goodsEntities:[]},selectedIndex:0,selectSupplier:"",showSupplier:!1,storageList:[],wareHouse:[],modalTrigger:!1,productTypeList:[],modalType:"",steplist:[],approvalTableData:[],boeType:"P_APPLY_DELIVER",tabVal:"name1",selectedIndex1:0,selectTab:!0,showAll:!1,showBody:!1,showProductType:!1,showProduct:!1,selectLogisticMode:[]},"productDetailModal",{showModal:!1,ids:{goodsId:"",commodityId:"",documentType:"W_STOCK_IN"}}),_defineProperty(t,"productDetailModal2",{showModal:!1,ids:{goodsId:"",commodityId:"",documentType:"W_STOCK_IN"}}),_defineProperty(t,"locationMap",[]),t},created:function(){this.loadProductType(),this.loadData(),this.loadProductType(),this.loadPosition(),this.initUnit(),this.getLogisticMode()},methods:{typeInit:function(t,e,o){for(var i=0;i<t.length;i++){if(t[i].value==o)return e.push(t[i].value),!0;if(t[i].children&&0<t[i].children.length&&this.typeInit(t[i].children,e,o))return e.push(t[i].value),!0}},loadPosition:function(){var o=this;$.ajax({url:contextPath+"/tpurchasecollectgoods/findByAllPosition",method:"POST",dataType:"json",contentType:"application/json;charset=utf-8",success:function(t){if("100100"==t.code){var e={};t.data.map(function(t){null==e[t.groupId]&&(e[t.groupId]=[]),e[t.groupId].push(t)}),o.locationMap=e}}})},isEdit:function(t,e){eventHub.$emit("isEdit",t)},saveAccess:function(t,e,o){eventHub.$emit("saveFile",t,e)},getAccess:function(t,e,o){eventHub.$emit("queryFile",t,e)},approvalOrRejectCallBack:function(t){var e=this;if("100515"==t.result.code&&("approve"==e.modalType&&e.ajaxUpdateDocStatusById(e.deliver.id,4),"reject"==e.modalType&&e.ajaxUpdateDocStatusById(e.deliver.id,1)),"100100"==t.result.code){var o=t.result.data;this.deliver.orderStatus=o.orderStatus,this.deliver.auditor=o.auditor,this.deliver.auditorId=o.auditorId,this.deliver.auditTime=o.auditTime,1!=this.deliver.orderStatus&&this.isEdit("N")}},openSupplier:function(){1==this.deliver.orderStatus&&(this.showSupplier=!0)},closeSupplier:function(){this.showSupplier=!1;this.deliver.supplierId=this.selectSupplier.id,this.deliver.supplierName=this.selectSupplier.supplierName},loadData:function(t){var e=this;$.ajax({type:"post",url:contextPath+"/purchaseDeliverController/data",dataType:"json",success:function(t){e.wareHouse=t.data.wareHouse,e.employees=t.data.employees},error:function(){console.log("服务器出错啦")}})},initUnit:function(){var i=this;$.ajax({type:"post",url:contextPath+"/tbaseunit/list",contentType:"application/json",dataType:"json",async:!1,success:function(t){"100100"===t.code?(t.data.map(function(t){var e=t.id,o=t.name;i.unitMap[e]=o}),console.log(i.unitMap)):layer.alert("服务器异常,请联系技术人员！",{icon:0})},error:function(t){layer.alert("网络异常,请联系技术人员！",{icon:0})}})},changeEmp:function(t){this.deliver.salesmanId=t.value,this.deliver.salesmanName=t.label.substr(t.label.lastIndexOf("-")+1,t.label.length)},modalCancel:function(t){this.productDetailModal2.showModal=!1,this.productDetailModal.showModal=!1},getGoodsBarcodeValue:function(t,e){var o=this,i={goodsBarcode:t,commodityId:o.productDetailList[o.selectedIndex].commodityId,isInStock:1,nature:1,warehouseId:o.productDetailList[o.selectedIndex].warehouseId,limit:""};$.ajax({type:"post",url:contextPath+"/goodsController/queryGoodsDetail",data:JSON.stringify(i),contentType:"application/json",dataType:"json",success:function(t){"100100"===t.code&&(o.productDetailListTemp.goodsEntities[e].goodsEntity.options=t.data.map(function(t){return $.extend(!0,{},{code:t.goodsBarcode,name:t.goodsName,id:t.id})}),o.$forceUpdate())},error:function(){layer.alert("服务器出错啦")}})},initGoodsBarcodeValue:function(){var i=this,t={commodityId:i.productDetailList[i.selectedIndex].commodityId,isInStock:1,nature:1,warehouseId:i.productDetailList[i.selectedIndex].warehouseId,limit:20};$.ajax({type:"post",url:contextPath+"/goodsController/queryGoodsDetail",data:JSON.stringify(t),contentType:"application/json",dataType:"json",async:!1,success:function(t){if("100100"===t.code){for(var e=t.data.map(function(t){return $.extend(!0,{},{code:t.goodsBarcode,name:t.goodsName,id:t.id})}),o=0;o<i.productDetailList[i.selectedIndex].goodsEntities.length;o++)i.productDetailList[i.selectedIndex].goodsEntities[o].goodsEntity.options=e;i.$forceUpdate()}},error:function(){layer.alert("服务器出错啦")}})},showProductDetail:function(t){var e=this;if(this.selectedIndex=t,!this.productDetailListTemp.goodsEntities[t].goodsBarcodeId)return this.$Modal.error({content:"还未选择商品，请先选择商品，再选择明细！"}),!1;var o={goodsId:this.productDetailListTemp.goodsEntities[t].goodsBarcodeId,documentType:"W_STOCK_IN"};Object.assign(this.productDetailModal,{showModal:!0,ids:o}),this.$nextTick(function(){e.$refs.modalRef.getProductDetail()})},showProductDetail2:function(t){var e=this;if(this.selectedIndex=t,!this.productDetailList[t].commodityId)return this.$Modal.error({content:"还未选择商品，请先选择商品，再选择明细！"}),!1;console.log("this.productDetailList[index].goodsId",this.productDetailList[t].goodsId),console.log("this.documentType2",this.documentType2);var o=void 0;o="generate"==this.documentType2&&0==this.saveSuccess?{goodsId:this.productDetailList[t].goodsId,commodityId:this.productDetailList[t].commodityId,documentType:"W_REQUISITION"}:{goodsId:this.productDetailList[t].goodsId,commodityId:this.productDetailList[t].commodityId,documentType:"P_APPLY_DELIVER"},Object.assign(this.productDetailModal2,{showModal:!0,ids:o}),this.$nextTick(function(){e.$refs.modalRef2.getProductDetail()})},modalSure:function(t){this.productDetailModalClick(t)},modalSure2:function(t){this.productDetailModalClick2(t)},productDetailModalClick:function(t){"attr_ranges_goods"===this.productDetailListTemp.goodsEntities[this.selectedIndex1].goodsEntity.goodsMainType?Object.assign(this.productDetailListTemp.goodsEntities[this.selectedIndex1].goodsEntity,{tBaseBomEntity:t,assistAttrs:null,overEdit:!0}):Object.assign(this.productDetailListTemp.goodsEntities[this.selectedIndex1].goodsEntity,{assistAttrs:t,tBaseBomEntity:null,overEdit:!0}),this.productDetailModal.showModal=!1},productDetailModalClick2:function(t){console.log(t),"attr_ranges_goods"===this.productDetailList[this.selectedIndex].goodsMainType?Object.assign(this.productDetailList[this.selectedIndex],{tBaseBomEntity:t,assistAttrs:null,overEdit:!0}):Object.assign(this.productDetailList[this.selectedIndex],{assistAttrs:t,tBaseBomEntity:null,overEdit:!0}),this.productDetailModal2.showModal=!1},handlerDataToPost:function(){var o=this,t={goodsId:"",commodityId:"",sourceId:"",sourceGoodsId:"",sourceType:"",sourceNo:"",custStyleCode:"",countingUnit:"",weightUnit:"",deliverGoodsWeight:"",deliverGoodsCount:"",certificateType:"",goldColor:"",stoneColor:"",stoneClarity:"",mainStoneWeight:"",goldWeight:"",stoneSection:"",goodsLineNo:"",goodsMainType:"",goodsName:"",goodsCode:"",goodsSpecifications:"",goodsTypeName:"",goodsTypePath:"",orderStatus:"",pictureUrl:"",price:"",pricingMethod:"",remark:null,warehouseId:"",reservoirPositionId:"",orderNo:"",orderId:"",goodsBarcode:"",goodsEntities:[],goodsPartList:[],updateId:null,updateName:null,updateTime:null,viceStoneWeight:null,alreadyCollectWeight:0,alreadyCollectCount:0,stonesParts:[],materialParts:[],partParts:[],goldParts:[]},i=this.deliver;return 0<this.productDetailList.length&&(i.goodList=[JSON.parse(JSON.stringify(t))]),htHandlerProductDetail(this.productDetailList,i,t,2==this.deliver.dataSource),this.productDetailList.map(function(t,e){i.goodList[e]||(i.goodList[e]={}),1==o.deliver.dataSource&&Object.assign(i.goodList[e],{goodsId:t.goodsId,commodityId:t.commodityId,sourceId:t.sourceId,sourceGoodsId:t.sourceGoodsId,sourceType:t.sourceType,sourceNo:t.sourceNo,custStyleCode:t.custStyleCode,countingUnit:t.countingUnit,weightUnit:t.weightUnit,deliverGoodsWeight:t.deliverGoodsWeight,deliverGoodsCount:t.deliverGoodsCount,certificateType:t.certificateType,goldColor:t.goldColor,stoneColor:t.stoneColor,stoneClarity:t.stoneClarity,mainStoneWeight:t.mainStoneWeight,goldWeight:t.goldWeight,stoneSection:t.stoneSection,goodsLineNo:t.goodsLineNo,goodsMainType:t.goodsMainType,goodsName:t.goodsName,goodsCode:t.goodsCode,goodsSpecifications:t.goodsSpecifications,goodsTypeName:t.goodsTypeName,goodsTypePath:t.goodsTypePath,orderStatus:t.orderStatus,pictureUrl:t.pictureUrl,pricingMethod:t.pricingMethod,remark:t.remark,warehouseId:t.warehouseId,reservoirPositionId:t.reservoirPositionId,orderNo:t.orderNo,orderId:t.orderId,goodsBarcode:t.goodsBarcode,goodsEntities:t.goodsEntities}),2==o.deliver.dataSource&&Object.assign(i.goodList[e],{goodsId:t.goodsId,commodityId:t.commodityId,sourceId:t.sourceId,sourceGoodsId:t.sourceGoodsId,sourceType:t.sourceType,sourceNo:t.sourceNo,custStyleCode:t.custStyleCode,countingUnit:t.countingUnit,weightUnit:t.weightUnit,deliverGoodsWeight:t.deliverGoodsWeight,deliverGoodsCount:t.deliverGoodsCount,certificateType:t.certificateType,goldColor:t.goldColor,stoneColor:t.stoneColor,stoneClarity:t.stoneClarity,mainStoneWeight:t.mainStoneWeight,goldWeight:t.goldWeight,stoneSection:t.stoneSection,goodsLineNo:t.goodsLineNo,goodsMainType:t.goodsMainType,goodsName:t.goodsName,goodsCode:t.goodsCode,goodsSpecifications:t.goodsSpecifications,goodsTypeName:t.goodsTypeName,goodsTypePath:t.goodsTypePath,orderStatus:t.orderStatus,pictureUrl:t.pictureUrl,pricingMethod:t.pricingMethod,remark:t.remark,warehouseId:t.warehouseId,reservoirPositionId:t.reservoirPositionId,orderNo:t.orderNo,orderId:t.orderId,goodsBarcode:t.goodsBarcode,goodsEntities:t.goodsEntities,stonesParts:t.stonesParts,materialParts:t.materialParts,partParts:t.partParts,goldParts:t.goldParts,goodsPartList:t.materialParts})}),i},validateProduct:function(){var o=!0,i=this;return $.each(i.productDetailList,function(t,e){return!!e.goodsId||("attr_ranges_gold"!=e.goodsMainType||e.assistAttrs?void 0:(o=!1,i.$Modal.error({content:"第"+(t+1)+"行商品明细未选择，请先选择商品明细！"}),!1))}),o},getLogisticMode:function(){this.selectLogisticMode=getCodeList("jxc_jxc_wlfs")},detailAction:function(t){if(this.productDetailList[t].goodsCode)if(this.productDetailList[t].deliverGoodsCount)if(this.productDetailList[t].warehouseId){this.selectedIndex=t,this.tabVal="name2","handworkAdd"!=this.params.activeType&&"generate"!=this.params.type&&"detail"!=this.params.type||(1==this.deliver.orderStatus&&0==this.productDetailList[this.selectedIndex].goodsEntities[0].goodsEntity.options.length&&this.initGoodsBarcodeValue(),this.productDetailListTemp=JSON.parse(JSON.stringify(this.productDetailList[t])))}else this.$Message.info("请先选择仓库！");else this.$Message.info("请先输入数量！");else this.$Message.info("请先选择商品编码！")},crolMark:function(t){this.tabVal=t},getGoodsItem:function(t,e){for(var o=this,i=0;i<o.productDetailListTemp.goodsEntities.length;i++)if(o.productDetailListTemp.goodsEntities[i].goodsEntity.goodsBarcode==t.code)return void o.$Modal.warning({content:"条码明细中已存在条码为【"+t.code+"】的条码信息！"});var s={id:t.id};$.ajax({type:"post",url:contextPath+"/goodsController/queryGoodsDetail",data:JSON.stringify(s),contentType:"application/json",dataType:"json",success:function(t){console.log("明细",t.data),"100100"===t.code&&(Object.assign(o.productDetailListTemp.goodsEntities[e],{goodsName:t.data[0].goodsName,goodsBarcode:t.data[0].goodsBarcode,goodsBarcodeId:t.data[0].id,goodsEntity:Object.assign({},t.data[0],{options:o.productDetailListTemp.goodsEntities[e].goodsEntity.options})}),o.productDetailList[o.selectedIndex].goodsEntities[e].goodsEntity=o.productDetailListTemp.goodsEntities[e].goodsEntity,o.$forceUpdate())},error:function(){layer.alert("服务器出错啦")}})},initGoodCategory:function(t){var d=this,r=[];return t.forEach(function(t){var e=t.customCode,o=t.name,i=t.cateLists,s=t.code;i&&(i=d.initGoodCategory(i)),r.push({value:e,label:o,children:i,code:s})}),r.forEach(function(t){t.children||delete t.children}),r},isHintShow:function(t){var e=this;t&&this.typeValue&&this.isHint&&this.productDetailList&&0<this.productDetailList.length&&this.$Modal.warning({content:"温馨提示：改变商品类型将删除所有商品信息!",onOk:function(){e.isHint=!1,console.log("温馨提示：改变商品类型将删除所有商品信息！")}})},getCommodityList:function(){var e=this,t={categoryCustomCode:e.deliver.goodsTypePath,field:"",limit:""};$.ajax({type:"post",url:contextPath+"/tbasecommodity/findByType",data:t,dataType:"json",success:function(t){if("100100"!=t.code)return this.$Modal.error({content:t.msg}),void(e.commodityList=[]);e.commodityList=t.data},error:function(){this.$Modal.error({content:"网络异常,请联系技术人员！"})}})},changeProductType:function(t,e){var o=this;if(t==this.typeValue)return!1;this.deliver.id&&this.productDetailList.map(function(t){t.goodsId&&o.deliver.delDeliver.push(t.goodsId)}),this.productDetailList=[];var i=e[e.length-1];this.deliver.goodsTypeName=i.label,this.deliver.goodsTypePath=i.value,this.deliver.deliverCount=0,this.deliver.deliverWeight=0,this.getCommodityList()},getSelectedItem:function(t,o){var i=this;$.ajax({type:"post",url:contextPath+"/tbasecommodity/getBriefById/"+t.id,dataType:"json",success:function(t){i.order=t.data;var e=t.data;e.countUnitId=i.unitMap[e.countUnitId],e.weightUnitId=i.unitMap[e.weightUnitId],console.log(e),Object.assign(i.productDetailList[o],{goodsCode:e.code,goodsName:e.name,commodityId:e.id,pictureUrl:e.frontPic&&e.frontPic.fdUrl,goodsTypeName:e.categoryName,goodsTypePath:e.categoryCustomCode,custStyleCode:e.styleCustomCode,goodsMainType:e.mainType,goodsNorm:e.specification,countingUnit:e.countUnitId,weightUnit:e.weightUnitId,pricingMethod:e.pricingType}),null!=i.productDetailList[o].goodsEntities&&null!=i.productDetailList[o].goodsEntities||(i.productDetailList[o].goodsEntities=[]),"attr_ranges_gold"===e.mainType&&(i.productDetailList[o].goldColor=e.certificateType,i.productDetailList[o].deliverCount=null),i.$forceUpdate()},error:function(){layer.alert("服务器异常，请稍后再试！",{icon:0})}})},loadProductType:function(){var e=this;$.ajax({type:"post",url:contextPath+"/tbasecommoditycategory/listByAll?parentId=0",dataType:"json",success:function(t){e.productTypeList=e.initGoodCategory(t.data.cateLists)},error:function(){layer.alert("服务器异常，请稍后再试！",{icon:0})}})},getInputValue:function(t,e){var o=this;if(null!=o.deliver.goodsTypePath&&""!=o.deliver.goodsTypePath){var i={categoryCustomCode:o.deliver.goodsTypePath,field:t,limit:""};$.ajax({type:"post",url:contextPath+"/tbasecommodity/findByType",data:i,dataType:"json",success:function(t){Object.assign(o.productDetailList[e],{options:t.data}),o.$forceUpdate()},error:function(){layer.alert("服务器异常，请稍后再试！",{icon:0})}})}else layer.alert("请选择商品类型！",{icon:0})},selectProductDetail:function(t){this.selectedIndex=t},selectProductDetail2:function(t){this.selectedIndex1=t},locatorChange:function(t,e){var o=t;"object"===(void 0===t?"undefined":_typeof(t))&&(o=t.target.value);for(var i="",s=0;s<this.wareHouse.length;s++)if(o==this.wareHouse[s].id){i=this.wareHouse[s].groupId;break}this.$set(this.storageList,e,this.locationMap[i])},saveClick:function(t){var e=this,o="";if("submit"==t){if(null==e.deliver.supplierId||""==e.deliver.supplierId)return void e.$Modal.warning({content:"请选择供应商"});if(null==e.deliver.goodsTypePath||""==e.deliver.goodsTypePath)return void e.$Modal.warning({content:"请选择商品类型"});if(null==e.deliver.logisticsMode||""==e.deliver.logisticsMode)return void e.$Modal.warning({content:"请选择物流方式"});if(2==this.deliver.orderStatus)return void layer.alert("该单据已提交！",{icon:0});if(4==this.deliver.orderStatus)return void layer.alert("该单据已审批完成！",{icon:0});if(null==this.productDetailList||0==e.productDetailList.length)return void layer.alert("商品信息不能为空！",{icon:0});for(var i=!0,s=!0,d=!0,r=!0,a=0;a<this.productDetailList.length;a++){if("attr_ranges_gold"!=this.productDetailList[a].goodsMainType&&null===this.productDetailList[a].deliverGoodsCount||""===this.productDetailList[a].deliverGoodsCount){console.log("this.productDetailList[i].goodsMainType",this.productDetailList[a].goodsMainType),console.log("this.productDetailList[i].deliverGoodsCount",this.productDetailList[a].deliverGoodsCount),i=!1;break}if("attr_ranges_gold"!=this.productDetailList[a].goodsMainType&&null===this.productDetailList[a].deliverGoodsWeight||""===this.productDetailList[a].deliverGoodsWeight){i=!1;break}if("attr_ranges_gold"===this.productDetailList[a].goodsMainType&&(null===this.productDetailList[a].deliverGoodsWeight||""===this.productDetailList[a].deliverGoodsWeight||null==this.productDetailList[a].deliverGoodsWeight||this.productDetailList[a].deliverGoodsWeight<=0)){s=!1;break}if(null===this.productDetailList[a].warehouseId||""===this.productDetailList[a].warehouseId||null==this.productDetailList[a].warehouseId){d=!1;break}if("attr_ranges_gold"===this.productDetailList[a].goodsMainType&&null===this.productDetailList[a].deliverGoodsWeight||""===this.productDetailList[a].deliverGoodsWeight){r=!1;break}}if(!i)return void e.$Modal.warning({content:"请检查重量和数量是否输入！"});if(!s)return void e.$Modal.warning({content:"请检查金料的数量是否输入正确！"});if(!r)return void e.$Modal.warning({content:"请检查重量是否输入！"});if(!d)return void e.$Modal.warning({content:"请检查仓库是否输入！"});if(2==e.deliver.dataSource)for(var n=0;n<e.productDetailList2.length;n++)for(var l=e.productDetailList2[n].sourceGoodsId,c=0;c<e.productDetailList.length;c++){if(l==e.productDetailList[c].sourceGoodsId){if(e.productDetailList[c].deliverGoodsCount>e.productDetailList2[n].deliverGoodsCount)return e.productDetailList[c].deliverGoodsCount=e.productDetailList2[n].deliverGoodsCount,void layer.alert("第"+(c+1)+"行送料数量不能大于调拨单原始数量！！");if(e.productDetailList[c].deliverGoodsWeight>e.productDetailList2[n].deliverGoodsWeight)return layer.alert("第"+(c+1)+"行送料重量不能大于调拨单原始重量！！"),void(e.productDetailList[c].deliverGoodsWeight=e.productDetailList2[n].deliverGoodsWeight)}}o=contextPath+"/purchaseDeliverController/submit"}else"save"==t&&(o=contextPath+"/purchaseDeliverController/save");var u=!0,p="";t:for(a=0;a<this.productDetailList.length;a++)if("attr_ranges_gold"!=this.productDetailList[a].goodsMainType)for(var g=0;g<this.productDetailList[a].goodsEntities.length;g++){if(this.productDetailList[a].goodsEntities[g].goodsEntity&&null==this.productDetailList[a].goodsEntities[g].goodsEntity.id){p="第"+(a+1)+"行的条码信息未输入！",u=!1;break t}if(!this.productDetailList[a].goodsEntities[g].goodsEntity){p="第"+(a+1)+"行的条码信息未输入！",u=!1;break t}}if(u){if(this.validateProduct()){e.deliver.goodList=e.productDetailList,e.deliver=this.handlerDataToPost(),e.deliver.businessType="P_APPLY_DELIVER";var h=!0;for(a=0;a<e.deliver.goodList.length;a++){if("submit"==t&&null===e.deliver.goodList[a].warehouseId||""===e.deliver.goodList[a].warehouseId||null==e.deliver.goodList[a].warehouseId){h=!1;break}e.deliver.goodList[a]&&(e.deliver.goodList[a].goodsTypeName=e.deliver.goodsTypeName),e.deliver.goodList[a].goodsTypePath=e.deliver.goodsTypePath,"attr_ranges_gold"==e.deliver.goodList[a].goodsMainType?(e.deliver.goodList[a].pricingMethod=1,e.deliver.goodList[a].deliverGoodsCount=0):e.deliver.goodList[a].pricingMethod=2}h?(window.top.home.loading("show"),$.ajax({url:o,method:"post",dataType:"json",data:JSON.stringify(e.deliver),contentType:"application/json;charset=utf-8",success:function(t){window.top.home.loading("hide"),"100100"==t.code?(e.$Modal.success({title:"提示信息",content:t.msg}),e.productDetailList=[{goodsEntities:[]}],e.deliver={},e.deliver=t.data,e.productDetailList=e.deliver.goodList,e.saveAccess(e.deliver.id,e.boeType),e.isEdit(1==e.deliver.orderStatus?"Y":"N"),e.saveSuccess=!0):e.$Modal.warning({content:t.msg})},error:function(){window.top.home.loading("hide"),layer.alert("服务器异常，请稍后再试！",{icon:0})}})):e.$Modal.warning({content:"请检查仓库是否输入！"})}}else e.$Modal.warning({content:p})},approval:function(){this.modalType="approve",this.modalTrigger=!this.modalTrigger},reject:function(){this.modalType="reject",this.modalTrigger=!this.modalTrigger,this.$forceUpdate()},cancel:function(){window.parent.closeCurrentTab({name:"",openTime:this.openTime,exit:!0})},rowClick:function(t){if(1==this.deliver.orderStatus)if("add"===t){if(null==this.deliver.goodsTypePath||""==this.deliver.goodsTypePath)return void layer.alert("请选择商品类型！",{icon:0});if(0<this.productDetailList.length)for(var e=0;e<this.productDetailList.length;e++)if(null==this.productDetailList[e].commodityId||null==this.productDetailList[e].commodityId)return void layer.alert("请输输入第"+(e+1)+"行的商品信息！",{icon:0});this.productDetailList.push({options:this.commodityList})}else if("del"===t){if(2==this.deliver.dataSource&&1==this.productDetailList.length)return void layer.alert("生成的商品明细不能全部删除！",{icon:0});this.productDetailList[this.selectedIndex].goodsId&&(this.deliver.delDeliver||(this.deliver.delDeliver=[]),this.deliver.delDeliver.push(this.productDetailList[this.selectedIndex].goodsId)),this.productDetailList.splice(this.selectedIndex,1)}},clearNoNum:function(t,e,o){if("deliverGoodsCount"===e){if(t.deliverGoodsCount<=0)return;if(t.deliverGoodsCount<t.goodsEntities.length){var i=Number(t.deliverGoodsCount),s=Number(t.goodsEntities.length)-i;t.goodsEntities.splice(i,s)}else for(var d=Number(t.deliverGoodsCount),r=Number(t.goodsEntities.length),a=0;a<d-r;a++)t.goodsEntities.push({goodsEntity:{id:null,options:[]}})}return htInputNumber(t,e,o)}},watch:{productDetailList:{handler:function(t,e){var o=this;console.log("newQuestion",t),console.log("oldQuestion",e);var i=0,s=0,d=0;t.map(function(t){t.deliverGoodsCount&&!isNaN(t.deliverGoodsCount)&&(i=math.eval(Number(i)+Number(t.deliverGoodsCount))),t.deliverGoodsWeight&&!isNaN(t.deliverGoodsWeight)&&(s=math.eval(Number(s)+Number(t.deliverGoodsWeight))),t.price&&(1==t.pricingMethod&&t.deliverGoodsWeight?t.amount=parseFloat(math.eval(Number(t.price)*Number(t.deliverGoodsWeight)).toFixed(3)):2==t.pricingMethod&&t.deliverGoodsCount?t.amount=parseFloat(math.eval(Number(t.price)*Number(t.deliverGoodsCount)).toFixed(3)):t.amount=0,d=parseFloat(math.eval(Number(d)+Number(t.amount)).toFixed(2))),o.deliver.deliverCount=i,o.deliver.deliverWeight=s})},deep:!0}},computed:{typeValue:function(){var t=this.deliver.goodsTypePath,e=[];return this.typeInit(this.productTypeList,e,t),e.reverse()}},mounted:function(){var o=this;this.openTime=window.parent.params.openTime,this.params=window.parent.params.params;var t=window.parent.params.params.type;o.documentType2=t,o.deliver=JSON.parse(JSON.stringify(window.parent.params.params.goodsData)),o.deliver.delDeliver=[],o.productDetailList=o.deliver.goodList,o.deliver.goodList.map(function(t){var e=JSON.parse(JSON.stringify(t));o.productDetailList2.push(e)}),"generate"==t?(o.isGenerate=!0,o.deliver.dataSource=2,0==this.wareHouse.length&&this.loadData(this.deliver.goodList),o.productDetailList.map(function(t){t.goodsEntities.map(function(t){t.goodsEntity.options=[]})}),this.isEdit("Y")):"add"==t?(o.deliver.dataSource,this.isEdit("Y")):"detail"==t&&(o.productDetailList.map(function(t){t.goodsEntities.map(function(t){t.goodsEntity.options=[]})}),0==this.wareHouse.length&&this.loadData(this.deliver.goodList),2==o.deliver.dataSource&&o.deliver.goodList.map(function(t){var e=JSON.parse(JSON.stringify(t));o.productDetailList2.push(e)}),this.getAccess(o.deliver.id,o.boeType),this.isEdit(1==o.deliver.orderStatus?"Y":"N"))}});