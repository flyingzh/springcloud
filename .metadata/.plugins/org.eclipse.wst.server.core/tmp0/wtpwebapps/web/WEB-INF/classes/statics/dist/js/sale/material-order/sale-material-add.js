"use strict";function _defineProperty(t,e,o){return e in t?Object.defineProperty(t,e,{value:o,enumerable:!0,configurable:!0,writable:!0}):t[e]=o,t}var customerAdd=new Vue({el:"#customer-add",data:function(){var t;return _defineProperty(t={processList:[{value:1,label:"锁价"},{value:2,label:"预付款"}],showToggle:!0,isSaveDisable:!1,isSubmitDisable:!1,isAddRowDisable:!1,isDelRowDisable:!1,modalTrigger:!1,isDisableCustName:!1,goodsTypeShow:!1,modalType:"",steplist:[],approvalTableData:[],boeType:"S_CUST_MATERIAL",optionList:[],employees:[],isView:!1,openName:"",unitList:[],urgencyList:[],shipTypeList:[],productTypeList:[],goldPriceList:[],productDetailModal:{showModal:!1,ids:{goodsId:"",commodityId:"",documentType:"S_CUST_MATERIAL"},overEdit:!1,orderStatus:1},selectedIndex:0,TSaleMaterialOrderEntity:{id:"",materialOrderNo:"",organizationId:"",organizationName:"",custNo:"",customerName:"",documentStatus:1,inTime:"",materialType:"",saleMenId:"",saleMenName:"",saleOrderNo:"",source:"",sourceName:"",remark:"",createId:"",createName:"",createTime:"",updateId:"",updateName:"",updateTime:"",auditId:"",auditName:"",auditTime:"",isDel:1,businessTypeId:"",customerId:"",goodsType:"",goodList:[],delGoodIds:[]},goodinfoList:[],onegoodInfo:{goodsId:"",materialOrderNo:"",goodsCode:"",goodsName:"",goodsNorm:"",pictureUrl:"",weightUnit:"",countingUnit:"",goodsContent:"",num:"",totalWeight:"",remark:"",goodsType:"",goodTypeName:"",groupPath:"",commodityId:"",organizationId:"",goodsMainType:"",goodsLineNo:"",pricingMethod:"",custStyleCode:"",alreadyCollectCount:"",alreadyCollectWeight:"",isDel:1,processNature:"",goldColor:"",showProcess:0,numTemp:0},user:{userId:"",username:"",organizationId:"",organizationName:"",userCurrentOrganId:""},bsShow:!1,isShow:!1,isDisable:!1,delIndex:"",customer:{name:"",code:""}},"customer",{saleOrderNo:""}),_defineProperty(t,"reload",!1),_defineProperty(t,"tabId","tabId"),_defineProperty(t,"openTime",""),_defineProperty(t,"selected",[]),_defineProperty(t,"data_user_list",{url:contextPath+"/deposit/findCustomerCode",colNames:["选择","客户编码","客户名称"],colModel:[{name:"id",index:"invdate",width:80,align:"center",formatter:function(t,e,o,a){return $(document).off("click",".select"+o.id).on("click",".select"+o.id,function(){customerAdd.confirm(t,e,o,a)}),'<a type="primary" class="select'+o.id+'">选取</a>'}},{name:"code",index:"code",width:300,align:"center"},{name:"name",index:"name",width:300,align:"center"}],multiselect:!1}),_defineProperty(t,"body",{custNo:"",saleOrderNo:""}),_defineProperty(t,"typeValue",""),_defineProperty(t,"isHint",!0),_defineProperty(t,"productTypeList",[]),_defineProperty(t,"productDetailList",[]),_defineProperty(t,"conSelected",[]),_defineProperty(t,"cutId","cutId"),_defineProperty(t,"cutReload",!1),_defineProperty(t,"unitMap",{}),_defineProperty(t,"other",{countNum:"",countWeight:""}),t},methods:{clearNum:function(t,e,o){return console.log(t,e,o),htInputNumber(t,e,o)},action:function(){this.countAmount(),this.countWeightSum()},countAmount:function(){if(0<this.goodinfoList.length){var e=0;this.goodinfoList.map(function(t){""!=t.num&&null!=t.num||(t.num=0),e+=Number(t.num)}),this.other.countNum=e.toFixed(2)}},countWeightSum:function(){if(0<this.goodinfoList.length){var e=0;this.goodinfoList.map(function(t){""!=t.totalWeight&&null!=t.totalWeight||(t.totalWeight=0),e+=Number(t.totalWeight)}),this.other.countWeight=e.toFixed(2)}},isEdit:function(t,e){eventHub.$emit("isEdit",t)},saveAccess:function(t,e,o){eventHub.$emit("saveFile",t,e)},getAccess:function(t,e,o){eventHub.$emit("queryFile",t,e)},userAction:function(){this.isDisable||this.isDisableCustName||(this.isShow=!0)},addRow:function(){if(""===this.TSaleMaterialOrderEntity.custNo)this.$Modal.info({content:"请先选择客户"});else{if(!this.validateProduct())return;this.goodinfoList.push(Object.assign({},this.onegoodInfo))}},delRow:function(){""===this.delIndex?this.$Modal.info({content:"请选择需要删除的下标"}):(console.log(this.goodinfoList),null!=this.goodinfoList[this.delIndex].goodsId&&this.TSaleMaterialOrderEntity.delGoodIds.push(this.goodinfoList[this.delIndex].goodsId),this.goodinfoList.splice(this.delIndex,1),this.countAmount(),this.countWeightSum(),this.goodinfoList.length<1&&(this.other.countNum=0,this.other.countWeight=0),$(".tdInfo").removeClass("tr-back"),this.delIndex="")},getIndex:function(t){this.delIndex!=t||""===this.delIndex?(this.delIndex=t,$(".tdInfo").eq(this.delIndex).addClass("tr-back").siblings().removeClass("tr-back")):($(".tdInfo").eq(this.delIndex).removeClass("tr-back"),this.delIndex="")},searchCut:function(){var t={postData:{customerName:this.customer.name,customerNum:this.customer.code}};$("#"+this.tabId).jqGrid("setGridParam",t).trigger("reloadGrid")},searchClear:function(){this.customer={name:"",code:""};var t={postData:{customerName:this.customer.name,customerNum:this.customer.code}};$("#"+this.tabId).jqGrid("clearGridData"),$("#"+this.tabId).jqGrid("setGridParam",t).trigger("reloadGrid")},confirm:function(t,e,o,a){var i=o;console.log(i),this.TSaleMaterialOrderEntity.customerName=i.name,this.TSaleMaterialOrderEntity.custNo=i.code,this.TSaleMaterialOrderEntity.customerId=i.id,this.isShow=!1},save:function(){var a=this,o=this.handlerDataToPost();if(this.validateProduct()){if(o.goodList.map(function(t,e){t.commodityId||o.goodList.splice(e,1)}),this.TSaleMaterialOrderEntity.id){if(console.log("修改时保存"),1!==this.TSaleMaterialOrderEntity.documentStatus)return this.$Modal.warning({title:"提示",content:"该单据之前已经提交过了,不能再保存！"}),!1}else console.log("新增时保存"),this.TSaleMaterialOrderEntity.documentStatus;console.log(o),$.ajax({url:contextPath+"/tsaleMaterialOrder/saveMaterialOrder",type:"post",async:!1,traditional:!0,dataType:"json",contentType:"application/json;charset=utf-8",data:JSON.stringify(o),success:function(t){"100100"===t.code?($.ajax({type:"POST",async:!1,url:contextPath+"/tsaleMaterialOrder/quaryAllInformation",dataType:"json",data:{materialOrderNo:a.TSaleMaterialOrderEntity.materialOrderNo},success:function(t){console.log(t);var e=t;null===e.data.goodList&&(e.data.goodList=[]),a.TSaleMaterialOrderEntity=e.data;var o=e.data.goodList;customerAdd.goodinfoList=[],o&&(o.map(function(t){null!=t.goodsId&&customerAdd.goodinfoList.push(t)}),a.TSaleMaterialOrderEntity.delGoodIds=[]),1!=a.TSaleMaterialOrderEntity.documentStatus&&(a.isView=!0),a.isDisable=!1,a.TSaleMaterialOrderEntity.organizationName=window.parent.userInfo.orgName}}),a.$Modal.success({title:"提示",content:"保存成功!"}),console.log(t.data),a.TSaleMaterialOrderEntity.id=t.data.id,a.TSaleMaterialOrderEntity.createName=t.data.createName,a.TSaleMaterialOrderEntity.createTime=t.data.createTime,a.TSaleMaterialOrderEntity.updateName=t.data.updateName,a.TSaleMaterialOrderEntity.updateTime=t.data.updateTime,a.saveAccess(t.data.id,a.boeType)):a.$Modal.error({title:"提示",content:"保存失败!"})},error:function(){a.$Modal.warning({title:"提示",content:"服务器异常"})}})}},checkData:function(t){for(var e in this.paramsMap)if(null==this.paramsMap[e]||""===this.paramsMap[e]||"null"===this.paramsMap[e]||this.paramsMap[e].length<1)return t?this.$Modal.warning({title:"提示",okText:"确定",content:e+"不能为空"}):this.TSaleMaterialOrderEntity.isCheck="N",!1;return!0},submit:function(){var e=this;if(console.log(this.TSaleMaterialOrderEntity),this.paramsMap={"客户名称":this.TSaleMaterialOrderEntity.custNo,"业务员":this.TSaleMaterialOrderEntity.saleMenName,"明细信息":this.goodinfoList},this.checkData(!0)&&this.validateProduct()){if(this.goodinfoList){console.info(this.goodinfoList);for(var t=0;t<this.goodinfoList.length;t++){if("attr_ranges_gold"==this.goodinfoList[t].goodsMainType){if(""==this.goodinfoList[t].totalWeight||null==this.goodinfoList[t].totalWeight)return this.$Modal.info({content:"第"+(t+1)+"行金料总重没填"}),!1;if(""==this.goodinfoList[t].processNature||null==this.goodinfoList[t].processNature)return this.$Modal.info({content:"第"+(t+1)+"行来料性质没填"}),!1;""==this.goodinfoList[t].num&&(this.goodinfoList[t].num=0)}if("attr_ranges_gold"!=this.goodinfoList[t].goodsMainType){if(""==this.goodinfoList[t].num||null==this.goodinfoList[t].num)return e.$Modal.warning({content:"提交失败,第"+(t+1)+"行数量没填！"}),!1;if(""==this.goodinfoList[t].totalWeight||null==this.goodinfoList[t].totalWeight)return e.$Modal.warning({content:"提交失败,第"+(t+1)+"行总重没填！"}),!1;if(this.goodinfoList[t].totalWeight<=0||this.goodinfoList[t].num<=0)return void e.$Modal.warning({content:"提交失败,第"+(t+1)+"行总重数量必须大于0！"})}}}if(1!==this.TSaleMaterialOrderEntity.documentStatus)return this.$Modal.warning({title:"提示",content:"该单据之前已经提交过了,不能再提交!"}),!1;var o=this.handlerDataToPost();console.log(o),o.documentStatus=2,$.ajax({type:"POST",url:contextPath+"/tsaleMaterialOrder/saveMaterialOrder",async:!1,traditional:!0,dataType:"json",contentType:"application/json",data:JSON.stringify(o),success:function(t){"100100"===t.code?(e.$Modal.success({title:"提示",content:"提交成功!"}),e.isSaveDisable=!0,e.isSubmitDisable=!0,e.isAddRowDisable=!0,e.isDelRowDisable=!0,e.isDisableCustName=!0,e.TSaleMaterialOrderEntity.id=t.data.id,e.TSaleMaterialOrderEntity.inTime=(new Date).format("yyyy-MM-dd HH:mm:ss"),e.TSaleMaterialOrderEntity.updateName=t.data.updateName,e.TSaleMaterialOrderEntity.updateTime=t.data.updateTime,e.TSaleMaterialOrderEntity.goodList=t.data.goodList,e.saveAccess(t.data.id,e.boeType),e.TSaleMaterialOrderEntity.documentStatus=2,1<e.TSaleMaterialOrderEntity.documentStatus&&(e.isDisable=!0),e.goodinfoList=t.data.goodList,1<customerAdd.TSaleMaterialOrderEntity.documentStatus&&(customerAdd.isDisable=!0),e.isEdit(1==e.TSaleMaterialOrderEntity.documentStatus?"Y":"N")):(e.$Modal.error({title:"提示",content:"提交失败!"}),e.TSaleMaterialOrderEntity.documentStatus=1)},error:function(t){e.$Modal.warning({title:"提示",content:"服务器出错"})}})}},approval:function(t){this.modalType="approve",this.modalTrigger=!this.modalTrigger},reject:function(t){console.log(t);this.modalType="reject",this.modalTrigger=!this.modalTrigger},approvalOrRejectCallBack:function(o){var a=this;console.log(o),$.ajax({type:"POST",async:!1,url:contextPath+"/tsaleMaterialOrder/quaryAllInformation",dataType:"json",data:{materialOrderNo:o.result.data.materialOrderNo},success:function(t){console.log(t);var e=t.data;"1"==o.result.data.documentStatus&&(customerAdd.isDisable=!1,null==e.saleOrderNo||""==e.saleOrderNo?customerAdd.isDisableCustName=!1:customerAdd.isDisableCustName=!0),"100515"==o.result.code&&("approve"==a.modalType&&a.updateData(a.TSaleMaterialOrderEntity.materialOrderNo,4),"reject"==a.modalType&&(a.updateData(a.TSaleMaterialOrderEntity.materialOrderNo,1),customerAdd.isDisable=!1,null==e.saleOrderNo.saleOrderNo||""==e.saleOrderNo?customerAdd.isDisableCustName=!1:customerAdd.isDisableCustName=!0))}}),"100100"==o.result.code&&(this.TSaleMaterialOrderEntity.documentStatus=o.result.data.documentStatus,a.TSaleMaterialOrderEntity.updateName=o.result.data.updateName,a.TSaleMaterialOrderEntity.updateTime=o.result.data.updateTime,4===this.TSaleMaterialOrderEntity.documentStatus&&(this.TSaleMaterialOrderEntity.auditName=o.result.data.auditName,this.TSaleMaterialOrderEntity.auditTime=o.result.data.auditTime),1===this.TSaleMaterialOrderEntity.documentStatus&&(this.isSaveDisable=!1,this.isSubmitDisable=!1,this.isAddRowDisable=!1,this.isDelRowDisable=!1,this.isAddRowDisable=!1,this.isDelRowDisable=!1)),this.isEdit(1==this.TSaleMaterialOrderEntity.documentStatus?"Y":"N")},updateData:function(t,o){var a=this;$.ajax({type:"POST",contentType:"application/json",url:contextPath+"/tsaleMaterialOrder/update",data:JSON.stringify({materialOrderNo:t,documentStatus:o}),dataType:"json",success:function(t){var e="审核";1==o&&(e="驳回"),"100100"===t.code?(a.$Modal.success({title:"提示",content:e+"成功!"}),a.TSaleMaterialOrderEntity.documentStatus=t.data.documentStatus,a.TSaleMaterialOrderEntity.updateName=t.data.updateName,a.TSaleMaterialOrderEntity.updateTime=t.data.updateTime,a.TSaleMaterialOrderEntity.auditName=t.data.auditName,a.TSaleMaterialOrderEntity.auditTime=t.data.auditTime,a.TSaleMaterialOrderEntity.documentStatus):a.$Modal.success({title:"提示",content:e+"失败!"})},error:function(t){a.$Modal.warning({title:"提示",content:"服务器出错"})}})},selectProductDetail:function(t){this.selectedIndex=t},cancel:function(){window.parent.closeCurrentTab({name:this.openName,exit:!0,openTime:customerAdd.openTime})},getSelectedItem:function(t,i){var s=this;$.ajax({type:"post",url:contextPath+"/tbasecommodity/getBriefById/"+t.id,dataType:"json",success:function(e){console.log(e.data.code),s.order=e.data;var t=e.data;console.log(t);var o=!0;if(s.goodinfoList.map(function(t){if(console.log(s.goodinfoList),t.goodsCode==e.data.code)return o=!1,s.$Modal.info({content:"此编码已经存在,请输入不同的编码"}),s.goodinfoList.splice(i,1),$(".tdInfo").removeClass("tr-back"),void(i="")}),o){t.countUnitId=s.unitMap[t.countUnitId],t.weightUnitId=s.unitMap[t.weightUnitId];var a=Object.assign({},{goodsName:t.name,commodityId:t.id,goodsCode:t.code,countingUnit:t.countUnitId,weightUnit:t.weightUnitId,goodsType:t.categoryCustomCode,custStyleCode:t.styleCustomCode,goodsNorm:t.specification,pictureUrl:t.frontPic&&t.frontPic.fdUrl,goodTypeName:t.categoryName,pricingMethod:t.pricingType,goodsMainType:t.mainType});s.goodinfoList[i].goodsId&&(s.TSaleMaterialOrderEntity.delGoodIds||(s.TSaleMaterialOrderEntity.delGoodIds=[]),s.TSaleMaterialOrderEntity.delGoodIds.push(s.goodinfoList[i].goodsId)),console.log(s.goodinfoList),Vue.set(s.goodinfoList,i,a),console.log(s.goodinfoList),"attr_ranges_gold"===t.mainType?(s.goodinfoList[i].goldColor=t.certificateType,console.log(t.certificateType),s.goodinfoList[i].showProcess=1,s.goodinfoList[i].numTemp=1,s.goodinfoList[i].num=0):(s.goodinfoList[i].showProcess=0,s.goodinfoList[i].numTemp=0)}s.$forceUpdate()},error:function(){layer.alert("服务器出错啦")}})},getInputValue:function(t,e){console.log(1111);var o=this,a={categoryCustomCode:"0.",field:t,limit:""};$.ajax({type:"post",url:contextPath+"/tbasecommodity/findByTypeRemoveGoods",data:a,dataType:"json",success:function(t){console.log(t),o.optionList=t.data},error:function(){layer.alert("服务器出错啦")}})},showProductDetail:function(t,e){var o=this;if(""==this.goodinfoList[t].goodsCode||null==this.goodinfoList[t].goodsCode)this.$Modal.error({content:"请先输入商品编码！"});else{this.productDetailModal.isOrderBom="detail"!==e,this.selectedIndex=t;var a={goodsId:this.goodinfoList[t].goodsId,commodityId:this.goodinfoList[t].commodityId,documentType:"S_CUST_MATERIAL"};console.log(a),Object.assign(this.productDetailModal,{showModal:!0,ids:a}),this.$nextTick(function(){o.$refs.modalRef.getProductDetail()})}},handlerDataToPost:function(){var t={stonesParts:[],materialParts:[],partParts:[],goldParts:[]},o=this.TSaleMaterialOrderEntity;0<this.goodinfoList.length&&(o.goodList=[JSON.parse(JSON.stringify(t))]),htHandlerProductDetail(this.goodinfoList,o,t);for(var e=0;e<this.goodinfoList.length;e++)null!=this.goodinfoList.alreadyCollectCount&&null!=this.goodinfoList.alreadyCollectWeight||(this.goodinfoList[e].alreadyCollectWeight=0,this.goodinfoList[e].alreadyCollectCount=0),null!=this.goodinfoList[e].num&&""!=this.goodinfoList[e].num||(this.goodinfoList[e].num=0),null!=this.goodinfoList[e].totalWeight&&""!=this.goodinfoList[e].totalWeight||(this.goodinfoList[e].totalWeight=0),null!=this.goodinfoList[e].isDel&&""!=this.goodinfoList[e].isDel||(this.goodinfoList[e].isDel=1);return console.log(o.goodList),this.goodinfoList.map(function(t,e){o.goodList[e]||(o.goodList[e]={}),Object.assign(o.goodList[e],{goodsId:t.goodsId,pictureUrl:t.pictureUrl,orderStatus:t.orderStatus,materialOrderNo:t.materialOrderNo,goodsContent:t.goodsContent,organizationId:t.organizationId,isDel:t.isDel,commodityId:t.commodityId,goodsCode:t.goodsCode,goodsName:t.goodsName,goodsNorm:t.goodsNorm,countingUnit:t.countingUnit,num:t.num,weightUnit:t.weightUnit,totalWeight:t.totalWeight,remark:t.remark,groupPath:t.groupPath,pricingMethod:t.pricingMethod,goodTypeName:t.goodTypeName,goodsMainType:t.goodsMainType,custStyleCode:t.custStyleCode,goodsType:t.goodsType,processNature:t.processNature,showProcess:t.showProcess,numTemp:t.numTemp,goodsLineNo:t.goodsLineNo,goldColor:t.goldColor,alreadyCollectCount:t.alreadyCollectCount,alreadyCollectWeight:t.alreadyCollectWeight})}),o},validateProduct:function(){var o=!0,a=this;return console.log(a.goodinfoList),$.each(a.goodinfoList,function(t,e){if(e.goodsId)return!0;if("attr_ranges_goods"==e.goodsMainType){if(!e.tBaseBomEntity)return o=!1,a.$Modal.error({content:"第"+(t+1)+"行商品明细未选择，请先选择商品明细！"}),!1}else if(!e.assistAttrs)return o=!1,a.$Modal.error({content:"第"+(t+1)+"行商品明细未选择，请先选择商品明细！"}),!1}),o},modalSure:function(t){this.productDetailModalClick(t)},modalCancel:function(t){},getFinishedProduct:function(t,e){var a=this,i=0,s=0;t.goldBoms.map(function(t){if(t.checked){console.log(t.condition);var e=parseFloat(a.goldPriceList[t.condition]);s=parseFloat(t.weightReference);var o=0;o=t.lose?parseFloat(t.lose)/100:0,i=(s*(1+o)*e).toFixed(2)}}),e[this.selectedIndex].goldWeight=s;var r=[];t.stonesBoms.map(function(t){var e={count:t.count,lose:t.lose,price:"",param:"",weightReference:t.weightReference,partName:t.partName},o="",a="",i="";t.attr.map(function(t){"净度"===t.name?i=t.model:"分段"===t.name?o=t.model:"颜色"===t.name&&(a=t.model)}),e.param=o+"_"+a+"_"+i,r.push(e)}),console.log(r);var o=0;r.map(function(t){t.price=a.stonePriceList[t.param],1==t.partName?e[a.selectedIndex].mainStoneWeight=t.weightReference:o+=parseFloat(t.weightReference)}),e[this.selectedIndex].viceStoneWeight=o;var n=r.reduce(function(t,e){var o=0;o=e.lose?parseFloat(e.lose)/100:0;parseFloat(e.price);return((e.price?parseFloat(e.price):0)*parseFloat(e.count)*(1+o)).toFixed(2)},0),d=e[this.selectedIndex].certificatePrice?parseFloat(e[this.selectedIndex].certificatePrice):0,l=e[this.selectedIndex].laborCharges?parseFloat(e[this.selectedIndex].laborCharges):0,c=e[this.selectedIndex].otherFee?parseFloat(e[this.selectedIndex].otherFee):0;e[this.selectedIndex].saleUnitPrice=parseFloat(i)+parseFloat(n)+d+l+c},getStoneProduct:function(t,e){var o="",a="",i="";t.assistAttrs.map(function(t){t.attr.map(function(t){"净度"===t.name?i=t.model:"分段"===t.name?o=t.model:"颜色"===t.name&&(a=t.model)})});var s=o+"_"+a+"_"+i;console.log(s),e[this.selectedIndex].saleUnitPrice=this.stonePriceList[s]?this.stonePriceList[s]:""},productDetailModalClick:function(t){console.log(t),"attr_ranges_goods"===this.goodinfoList[this.selectedIndex].goodsMainType?Object.assign(this.goodinfoList[this.selectedIndex],{tBaseBomEntity:t,assistAttrs:null,overEdit:!0}):Object.assign(this.goodinfoList[this.selectedIndex],{assistAttrs:t,tBaseBomEntity:{},overEdit:!0})},changeEmp:function(t){console.log(t),this.TSaleMaterialOrderEntity.saleMenId=t.value;var e=t.label;this.TSaleMaterialOrderEntity.saleMenName=e.substring(e.lastIndexOf("-")+1,e.length)},getEmployees:function(){var e=this;$.ajax({type:"post",url:contextPath+"/tpurchasecollectgoods/data",dataType:"json",success:function(t){e.TSaleMaterialOrderEntity.organizationId=t.data.orgId,e.TSaleMaterialOrderEntity.organizationName=t.data.orgName,e.user.userId=t.data.userId,e.user.username=t.data.username,console.log(t),e.employees=t.data.employees},error:function(){console.log("服务器出错啦")}})},getUnit:function(){var a=this;$.ajax({type:"post",url:contextPath+"/tbaseunit/list",dataType:"json",success:function(t){t.data.map(function(t){var e=t.id,o=t.name;a.unitMap[e]=o})},error:function(){a.$Message.warning("服务器报错")}})},starAdd:function(){var t=window.parent.params.params;customerAdd.TSaleMaterialOrderEntity.saleOrderNo=t.allInfo,customerAdd.TSaleMaterialOrderEntity.custNo=t.custInfo.code,customerAdd.TSaleMaterialOrderEntity.customerId=t.custInfo.id,customerAdd.TSaleMaterialOrderEntity.customerName=t.custInfo.name,$.ajax({type:"POST",url:contextPath+"/tsaleMaterialOrder/addTSaleMaterialOrder",contentType:"application/json; charset=utf-8",dataType:"json",success:function(t){console.log(t),customerAdd.TSaleMaterialOrderEntity.materialOrderNo=t.data.materialOrderNo,customerAdd.TSaleMaterialOrderEntity.inTime=new Date,customerAdd.isDisableCustName=!0,customerAdd.showToggle=!1,customerAdd.isEdit("Y")},error:function(){console.log("请求失败")}})},custadd:function(){var a=window.parent.params.params;console.log(a),this.cutTemp=!0,$.ajax({type:"post",url:contextPath+"/tsaleMaterialOrder/quaryAllSaleOrderNo",dataType:"json",success:function(t){var e=t.data;if(0<e.length){var o=!0;e.map(function(t){if(t.saleOrderNo==a.allInfo)return $.ajax({type:"POST",async:!1,url:contextPath+"/tsaleMaterialOrder/quaryAllInformation",dataType:"json",data:{materialOrderNo:a.allInfo},success:function(t){var e=t.data;console.info(e),null===e.goodList&&(e.goodList=[]);var o=(customerAdd.TSaleMaterialOrderEntity=e).goodList;o?o.map(function(t){null!=t.goodsId&&customerAdd.goodinfoList.push(t)}):customerAdd.TSaleMaterialOrderEntity=e,1==customerAdd.TSaleMaterialOrderEntity.documentStatus?(customerAdd.isDisable=!1,customerAdd.isDisableCustName=!0,customerAdd.TSaleMaterialOrderEntity.delGoodIds=[]):(customerAdd.isDisable=!0,customerAdd.isDisableCustName=!0,customerAdd.isAddRowDisable=!0,customerAdd.isDelRowDisable=!0,customerAdd.isSaveDisable=!0,customerAdd.isSubmitDisable=!0,customerAdd.isView=!0),customerAdd.TSaleMaterialOrderEntity.organizationName=window.parent.userInfo.orgName}}),void(o=!1)}),o&&customerAdd.starAdd()}else customerAdd.starAdd()}})},updata:function(){var e=this,t=window.parent.params.params;null===t.allInfo.data.goodList&&(t.allInfo.data.goodList=[]),this.TSaleMaterialOrderEntity=t.allInfo.data;var o=t.allInfo.data.goodList;if(o){o.map(function(t){null!=t.goodsId&&e.goodinfoList.push(t)}),this.TSaleMaterialOrderEntity.delGoodIds=[];for(var a=0;a<o.length;a++)"attr_ranges_gold"==o[a].goodsMainType&&(this.goodinfoList[a].numTemp=1)}1!=this.TSaleMaterialOrderEntity.documentStatus&&(this.isView=!0),this.isDisable=!1,null==t.allInfo.data.saleOrderNo||""==t.allInfo.data.saleOrderNo?this.isDisableCustName=!1:this.isDisableCustName=!0,this.TSaleMaterialOrderEntity.organizationName=window.parent.userInfo.orgName},query:function(){var e=this,t=window.parent.params.params;console.log(t),null===t.allInfo.data.goodList&&(t.allInfo.data.goodList=[]),this.TSaleMaterialOrderEntity=t.allInfo.data;var o=t.allInfo.data.goodList;if(o){o.map(function(t){null!=t.goodsId&&e.goodinfoList.push(t)}),this.isEdit("N");for(var a=0;a<o.length;a++)"attr_ranges_gold"==o[a].goodsMainType&&(this.goodinfoList[a].numTemp=1)}else this.TSaleMaterialOrderEntity=t.allInfo.data;1==this.TSaleMaterialOrderEntity.documentStatus?(this.isDisable=!1,null==t.allInfo.data.saleOrderNo||""==t.allInfo.data.saleOrderNo?this.isDisableCustName=!1:this.isDisableCustName=!0,this.TSaleMaterialOrderEntity.delGoodIds=[]):(this.isDisable=!0,this.isAddRowDisable=!0,this.isDelRowDisable=!0,this.isSaveDisable=!0,this.isSubmitDisable=!0,this.isDisableCustName=!0,this.isShow=!1),this.TSaleMaterialOrderEntity.organizationName=window.parent.userInfo.orgName,console.log(this.TSaleMaterialOrderEntity),this.isEdit(1==this.TSaleMaterialOrderEntity.documentStatus?"Y":"N"),this.getAccess(this.TSaleMaterialOrderEntity.id,this.boeType),this.countAmount(),this.countWeightSum()},initInp:function(){var e=this;$.ajax({type:"post",url:contextPath+"/tbasecommodity/findByTypeRemoveGoods",data:{categoryCustomCode:"0.",field:"",limit:""},dataType:"json",success:function(t){e.optionList=t.data},error:function(){layer.alert("服务器出错啦")}})}},mounted:function(){this.initInp(),$("form").validate(),this.getEmployees(),this.getUnit(),this.countAmount(),this.countWeightSum(),this.openTime=window.parent.params.openTime,this.openName=window.parent.params.name;var t=window.parent.params.params;"query"===t.type&&(console.log(t.allInfo.data),this.query()),"add"===t.type&&(this.TSaleMaterialOrderEntity.materialOrderNo=t.allInfo.data.materialOrderNo,this.TSaleMaterialOrderEntity.organizationName=window.parent.userInfo.orgName,this.TSaleMaterialOrderEntity.source=t.allInfo.data.source,this.TSaleMaterialOrderEntity.inTime=new Date,this.isEdit("Y")),"updata"===t.type&&this.updata(),"custadd"===t.type&&(console.log(t.custInfo),this.custadd())}});