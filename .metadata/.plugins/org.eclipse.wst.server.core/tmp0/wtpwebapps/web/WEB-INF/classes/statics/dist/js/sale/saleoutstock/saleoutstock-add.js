"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},vm=new Vue({el:"#sale-delivery-order",data:function(){var s=this;return{tempGoodsMailType:"",modalTrigger:!1,dataSourceType:!1,dataSource:null,submitFlag:!1,codesUsed:{},modalType:"",updateFlag:1,steplist:[],options:[],barcodeOptions:[],todyGoldPrice:"",body:{code:"",name:""},custTabId:"customerTab",approvalTableData:[],employees:[],jumpFlag:{query:"query",update:"update",add:"add"},emp:{saleMenId:"",saleMenName:""},productDetailModal:{showModal:!1,ids:{goodsId:"",commodityId:"",documentType:"S_OUT_STOCK"}},typeShowFlag:!1,saveFlag:!1,operationFlag:{yes:0,no:1},isView:!1,isDisable:!0,isWait:!1,isHint:!0,isNotGold:!0,isOpen:!0,selectedIndex:0,detailselectedRow:"",isSearchHide:!0,isFinance:!0,isPriceTag:!1,otherDisable:!0,isShow:!1,rowFlag:!0,reload:!0,goldPriceList:[],barCodeDetailList:[],barCodeDetailModal:{showModal:!1,ids:{goodsId:"",commodityId:"",documentType:"W_STOCK_IN"}},commodityList:[],barCodeSelectedIndex:null,unitMap:{},wareHouseList:[],wareHouseObj:{},locationList:[],locationObj:{},locationMap:{},unitList:[],unitListObj:{},pricingMethod:{1:"标签价折扣",2:"金工石计价"},infoDisable:!1,detailedDisable:!1,area:{},areaInit:{isInit:!1,province:"",city:"",county:"",detail:"",disabled:!1},openTime:"",orderStatus:{temporaryStorage:1,unreviewed:2,revieweding:3,audited:4,turnDown:5},jumpParam:{},custSelected:[],categoryType:[],logisticsInfo:[],businessType:[],operatioStatus:{yes:0,no:1},showTab:"product",selected:"",parentPramas:{},num:0,rowIndex:0,optionList:[],user:{userId:"",username:"",organizationId:"",organizationName:""},tabId:"customerTab1",addBody:{id:"",outStockNo:"",outStockTime:(new Date).format("yyyy/MM/dd"),goodsType:"",checkFlag:"",organizationId:"",status:1,businessType:"",shipMethod:"",saleMenId:"",saleMenName:"",custNo:"",remark:"",operationFlag:"",customerId:"",saleCustInfoEntity:{custId:"",custNo:"",email:"",province:"",city:"",county:"",detail:"",name:"",zipCode:"",area:"",phone:"",weChartNo:""},pricingMethod:"",totalCost:"0.00",totalSaleAmount:"0.00",totalActualAmount:"0.00",goldAmount:"0.00",stoneAmount:"0.00",accessoryAmount:"0.00",totalLaborCost:"0.00",totalCertificateAmount:"0.00",totalOtherAmount:"0.00",depositReceived:"0.00",prepaidFee:"0.00",incomingPrice:"0.00",receivables:"0.00",stockPriceEntity:[],createId:"",createName:"",createTime:"",updateId:"",updateName:"",updateTime:"",auditName:"",auditTime:"",goodList:[]},stockPriceEntityObj:{goodsName:"",goldColor:"",lastCustDeposit:"",currentArrival:"",goldPrice:"",priceMark:0,priceNum:"",priceAmount:"",currentBalance:"",custId:"",custNo:"",custName:"",outStockNo:""},goodList:[],oneInfo:{id:"",goodsMainType:"",goodsLineNo:"",goldColor:"",pictureUrl:"",goodsCode:"",goodsName:"",goodsNorm:"",countingUnit:"",goldPrice:"",num:"",weightUnit:"",totalWeight:"",goldWeight:"",mainStoneWeight:"",deliveryDate:"",warehouseId:"",warehouseName:"",locationId:"",locationName:"",documentType:"",documentNo:"",pricingMethod:"",commodityId:"",cost:"",goldAmount:"",stoneAmount:"",accessoryAmount:"",processingFee:"",goodsLineNoId:"",certificateAmount:"",otherAmount:"",saleAmount:"",discountRate:"",actualSaleAmount:"",tSaleOutGoodsDetailEntitys:[]},tSaleOutGoodsDetailEntitys:[],oneDetail:{goodsEntity:{countingUnitId:"",goodsNo:"",goodsName:"",batchNum:"",countingUnitName:"",num:"1",weightUnitName:"",totalWeight:"",netGoldWeight:"",mainStoneWeight:"",certificateNo:"",certificateType:"",purchaseCost:""},goodsBarcode:"",goldPrice:"",goldPurchase:"",goldAmount:"",stonePrice:"",stoneAmount:"",accessoryAmount:"",processingFee:"",certificateFee:"",otherFee:"",saleAmount:"",goodsMainType:"",goodsId:"",outStockGoodsId:""},detailInput:{goodsCode:"",goodsName:"",num:""},data_user_list:{url:contextPath+"/tbasecustomer/list",colNames:["操作","客户名称","客户编码"],colModel:[{name:"id",index:"invdate",width:80,align:"center",formatter:function(t,o,e,i){return $(document).off("click",".select"+e.id).on("click",".select"+e.id,function(){s.confirm(t,o,e,i)}),'<a type="primary" class="select'+e.id+'">选取</a>'}},{name:"name",index:"name",width:300,align:"left"},{name:"code",index:"code",width:300,align:"left"}],multiselect:!1}}},methods:{isEdit:function(t,o){eventHub.$emit("isEdit",t)},saveAccess:function(t,o,e){eventHub.$emit("saveFile",t,o)},getAccess:function(t,o,e){eventHub.$emit("queryFile",t,o)},isMark:function(t,o){console.log(t.target.value);parseFloat(o.priceNum),parseFloat(o.goldPrice);var e=parseFloat(o.lastCustDeposit)||0,i=parseFloat(o.currentArrival)||0;1==t.target.value&&(o.priceNum="",o.priceAmount="",o.currentBalance=e+i,this.getReceivedAmount())},getReceivedAmount:function(){this.addBody.incomingPrice=this.sum(this.addBody.stockPriceEntity,"priceAmount").toFixed(2),this.addBody.receivables=(parseFloat(this.addBody.totalActualAmount)-parseFloat(this.addBody.depositReceived)-parseFloat(this.addBody.prepaidFee)-parseFloat(this.addBody.incomingPrice)).toFixed(2)},getPriceAmount:function(t){var o=parseFloat(t.lastCustDeposit)||0,e=parseFloat(t.currentArrival)||0,i=parseFloat(t.priceNum)||0,s=parseFloat(t.goldPrice)||0,a=o+e-i;if(a<0)return this.$Modal.warning({content:"【结价数量】应小于【上期客存料】【本期来料】之和"}),t.priceNum="",t.priceAmount="",t.currentBalance=o+e,void this.getReceivedAmount();t.currentBalance=a,t.priceAmount=(i*s).toFixed(2),this.getReceivedAmount()},changeEmp:function(t){console.log(t),this.addBody.saleMenId=t.value;var o=t.label;this.addBody.saleMenName=o.substring(o.lastIndexOf("-")+1,o.length)},checkNumber:function(t,o,e){if(""!==t[o]){var i="",s="";return 0===e?(i=/^[0-9]*$/,s="请输入整数"):2===e?(i=/(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/,s="请输入正确的数字，不超过两位小数"):3===e&&(i=/(^[1-9](\d+)?(\.\d{1,3})?$)|(^0$)|(^\d\.\d{1,3}$)/,s="请输入正确的数字，不超过三位小数"),!!i.test(t[o])||(this.$Modal.warning({content:s}),t[o]="",!1)}},checkData:function(t){for(var o in t)if(void 0===t[o]||""===t[o]||null===t[o])return this.$Modal.warning({title:"提示",okText:"确定",content:o+"不能为空"}),!1;return!0},submit:function(){if(!1!==$("form").valid()){var t={"客户":this.addBody.saleCustInfoEntity.name,"日期":this.addBody.outStockTime,"商品类型":this.addBody.goodsType};if(this.checkData(t)){this.addBody.goodList=this.goodList;var o={"客户":this.addBody.saleCustInfoEntity.name,"日期":this.addBody.outStockTime,"商品类型":this.addBody.goodsType};this.checkData(o)&&(""==this.addBody.id?this.submitSave():this.submitUpdate())}}else this.$Modal.warning({title:"提示信息",content:"<p>请填写必填项!</p >"})},submitSave:function(){var e=this;if(this.checkSubmitSaveData(this.addBody)){this.addBody.status=this.orderStatus.unreviewed;var t=this.handlerDataToPost();console.log(t),e.saveFlag=!0,$.ajax({type:"POST",url:contextPath+"/tsaleoutstock/save",data:JSON.stringify(t),contentType:"application/json",success:function(t){if("100100"==t.code){e.$Modal.success({content:t.msg});var o=t.data;Object.assign(e.addBody,o),Object.assign(e.goodList,o.goodList),e.saveFlag=!1,e.areaInit={isInit:!0,province:o.saleCustInfoEntity.province,city:o.saleCustInfoEntity.city,county:o.saleCustInfoEntity.county,detail:o.saleCustInfoEntity.detail,disabled:!0},e.isView=!0,e.isEdit(1==e.addBody.status?"Y":"N")}else e.$Modal.warning({content:t.msg}),e.addBody.status=e.orderStatus.temporaryStorage,e.saveFlag=!1},error:function(t){e.$Modal.error({content:"系统出现异常,请联系管理人员"}),e.addBody.status=e.orderStatus.temporaryStorage,e.saveFlag=!1}})}},submitUpdate:function(){if(this.checkSubmitSaveData(this.addBody)){this.addBody.status=this.orderStatus.unreviewed;var t=this.handlerDataToPost();console.log("这是修改保存。。。"),this.publicUpdateAjax(t)&&(this.isView=!0)}},checkSaveDate:function(t){var e=this,i={tmpCheckFlag:!0,tmpFlag:!0},s=this;return""!=t.outStockTime&&""!=t.goodsType&&""!=t.saleCustInfoEntity.custNo&&0!=t.goodList.length||(i.tmpCheckFlag=!1),t.goodList.map(function(t,o){if(""==t.commodityId&&(i.tmpCheckFlag=!1),"attr_ranges_gold"!=t.goodsMainType)""==t.num&&(i.tmpCheckFlag=!1);else{if(e.addBody.operationFlag!=e.operationFlag.yes){if(!s.addBody.saleCustInfoEntity.custId)return s.$Modal.warning({content:"请输入客户信息！"}),void(i.tmpFlag=!1);if(!t.assistAttrs)return s.$Modal.warning({content:"请输入第"+o+"1行商品简述的商品明细信息！"}),void(i.tmpFlag=!1);if(""==t.warehouseId)return s.$Modal.warning({content:"请输入第"+o+"1行商品简述的发货仓库！"}),void(i.tmpFlag=!1)}t.totalWeight||(i.tmpCheckFlag=!1),t.saleAmount||(i.tmpCheckFlag=!1)}t.num!=t.tSaleOutGoodsDetailEntitys.length&&(i.tmpCheckFlag=!1),0<t.tSaleOutGoodsDetailEntitys&&t.tSaleOutGoodsDetailEntitys.map(function(t){""==t.goodsBarcode&&(i.tmpCheckFlag=!1)})}),i},checkSubmitSaveData:function(t){var i=this,s=this,o=t.goodList;if(0!=o.length){var a=!0;return o.map(function(t,o){if(""==t.commodityId)return s.$Modal.warning({content:"请输入第"+o+"1行商品简述的商品信息！"}),void(a=!1);if("attr_ranges_gold"!=t.goodsMainType){if(""==t.num)return s.$Modal.warning({content:"请输入第"+o+"1行商品简述的数量！"}),void(a=!1);var e=[];if(t.tSaleOutGoodsDetailEntitys.forEach(function(t){""!=t.goodsId&&e.push(t.goodsId)}),t.num!=e.length)return s.$Modal.info({content:"商品明细数据和商品简述订单数量不一致！"}),void(a=!1)}else{if(!t.totalWeight)return s.$Modal.warning({content:"请输入第"+o+"1行商品简述的总重！"}),void(a=!1);if(i.addBody.operationFlag!=i.operationFlag.yes){if(""==t.warehouseId)return s.$Modal.warning({content:"请选择第"+o+"1行商品简述的发货仓库！"}),void(a=!1);if(!t.assistAttrs)return s.$Modal.warning({content:"请输入第"+o+"1行商品简述的商品明细信息！"}),void(a=!1)}if(!t.saleAmount)return s.$Modal.warning({content:"请输入第"+o+"1行商品简述的商品销售金额！"}),void(a=!1)}0<t.tSaleOutGoodsDetailEntitys&&t.tSaleOutGoodsDetailEntitys.map(function(t){if(""==t.goodsBarcode)return s.$Modal.info({content:"商品明细数据未录入完整！"}),void(a=!1)})}),a}s.$Modal.warning({content:"请添加商品简述信息！"})},publicSaveAjax:function(t){var o=this;$.ajax({type:"POST",url:contextPath+"/tsaleoutstock/save",data:JSON.stringify(t),contentType:"application/json",success:function(t){"100100"==t.code?(o.$Modal.success({content:t.msg}),Object.assign(o.addBody,t.data),Object.assign(o.goodList,t.data.goodList)):o.$Modal.warning({content:t.msg}),o.saveFlag=!1},error:function(t){o.$Modal.error({content:"系统出现异常,请联系管理人员"}),o.saveFlag=!1}})},publicUpdateAjax:function(t){var o=this,e=!1;return $.ajax({type:"POST",url:contextPath+"/tsaleoutstock/update",data:JSON.stringify(t),contentType:"application/json",success:function(t){"100100"==t.code?(o.$Modal.success({content:t.msg}),o.saveFlag=!0,e=!0):o.$Modal.warning({content:t.msg})},error:function(t){o.$Modal.error({content:"系统出现异常,请联系管理人员"}),o.saveFlag=!1}}),e},hideSearch:function(){this.isSearchHide=!this.isSearchHide},selectedTr:function(t){this.selected=t},selectedDetailRow:function(t){this.detailselectedRow=t,console.log(this.detailselectedRow)},addRow:function(t,o){this.isWait||(this.addBody.goodsType?(o.deliveryDate=(new Date).format("yyyy/MM/dd"),o.options=this.commodityList,t.push(Object.assign({},o))):this.$Modal.info({title:"提示",okText:"确定",content:"请选择商品类型!"}))},delRow:function(t,o){console.log(o),""!==o?(t.splice(o,1),this.isWait?this.detailselectedRow="":this.selected="",this.sumFinance(),this.updateCodesUsed()):this.$Modal.warning({content:"请选中一行数据！"})},showDetail:function(t,o){if("attr_ranges_gold"!==t.goodsMainType)if(""!=t.num){this.showTab="detail",this.detailInput.goodsCode=t.goodsCode,this.detailInput.goodsName=t.goodsName,this.detailInput.num=t.num;var e=t.tSaleOutGoodsDetailEntitys.length;if(this.rowIndex=o,this.getGoodsBarcodeValue(""),this.isWait)this.tSaleOutGoodsDetailEntitys=t.tSaleOutGoodsDetailEntitys;else if(e==t.num&&0!=e)this.tSaleOutGoodsDetailEntitys=t.tSaleOutGoodsDetailEntitys;else if(e>t.num&&0!=e)t.tSaleOutGoodsDetailEntitys.splice(t.num,e-t.num),this.tSaleOutGoodsDetailEntitys=t.tSaleOutGoodsDetailEntitys,this.allSumItem(this.rowIndex);else if(e<t.num&&0!=e){this.tSaleOutGoodsDetailEntitys=t.tSaleOutGoodsDetailEntitys;for(var i=0;i<t.num-e;i++)this.tSaleOutGoodsDetailEntitys.push(Object.assign({},this.oneDetail));t.tSaleOutGoodsDetailEntitys=this.tSaleOutGoodsDetailEntitys,this.allSumItem(this.rowIndex)}else if(0==e){for(var s=0;s<t.num;s++)this.tSaleOutGoodsDetailEntitys.push(Object.assign({},this.oneDetail));t.tSaleOutGoodsDetailEntitys=this.tSaleOutGoodsDetailEntitys}}else this.$Modal.warning({content:"请输入数量！"})},cnangeTab:function(){"detail"==this.showTab&&(this.showTab="product",this.goodList[this.rowIndex].tSaleOutGoodsDetailEntitys=this.tSaleOutGoodsDetailEntitys,this.allSumItem(this.rowIndex),this.tSaleOutGoodsDetailEntitys=[],this.num=0)},repositionDropdown:function(){return repositionDropdownOnSroll("testTableWrap","goods")},sumFinance:function(){this.addBody.totalCost=this.sum(this.goodList,"cost").toFixed(2),this.addBody.totalSaleAmount=this.sum(this.goodList,"saleAmount").toFixed(2),this.addBody.goldAmount=this.sum(this.goodList,"goldAmount").toFixed(2),this.addBody.stoneAmount=this.sum(this.goodList,"stoneAmount").toFixed(2),this.addBody.accessoryAmount=this.sum(this.goodList,"accessoryAmount").toFixed(2),this.addBody.totalLaborCost=this.sum(this.goodList,"processingFee").toFixed(2),this.addBody.totalCertificateAmount=this.sum(this.goodList,"certificateAmount").toFixed(2),this.addBody.totalOtherAmount=this.sum(this.goodList,"otherAmount").toFixed(2),this.addBody.totalActualAmount=this.sum(this.goodList,"actualSaleAmount").toFixed(2),this.getReceivedAmount()},allSumItem:function(t){if(this.goodList[t].goldWeight=this.sumInner(this.tSaleOutGoodsDetailEntitys,"netGoldWeight").toFixed(2),this.goodList[t].mainStoneWeight=this.sumInner(this.tSaleOutGoodsDetailEntitys,"mainStoneWeight").toFixed(2),this.goodList[t].cost=this.sumInner(this.tSaleOutGoodsDetailEntitys,"purchaseCost").toFixed(2),this.goodList[t].goldAmount=this.sum(this.tSaleOutGoodsDetailEntitys,"goldAmount").toFixed(2),this.goodList[t].stoneAmount=this.sum(this.tSaleOutGoodsDetailEntitys,"stoneAmount").toFixed(2),this.goodList[t].accessoryAmount=this.sum(this.tSaleOutGoodsDetailEntitys,"accessoryAmount").toFixed(2),this.goodList[t].processingFee=this.sum(this.tSaleOutGoodsDetailEntitys,"processingFee").toFixed(2),this.goodList[t].certificateAmount=this.sum(this.tSaleOutGoodsDetailEntitys,"certificateFee").toFixed(2),this.goodList[t].otherAmount=this.sum(this.tSaleOutGoodsDetailEntitys,"otherFee").toFixed(2),this.goodList[t].saleAmount=this.sum(this.tSaleOutGoodsDetailEntitys,"saleAmount").toFixed(2),this.goodList[t].totalWeight=this.sumInner(this.tSaleOutGoodsDetailEntitys,"totalWeight").toFixed(2),""==this.goodList[t].discountRate||null==this.goodList[t].discountRate||null==this.goodList[t].discountRate)this.goodList[t].actualSaleAmount=this.goodList[t].saleAmount;else{var o=parseFloat(this.goodList[t].discountRate)/100;this.goodList[t].actualSaleAmount=(o*this.goodList[t].saleAmount).toFixed(2)}this.sumFinance()},sumSaleAmount:function(t,o){if("1"!==this.addBody.pricingMethod){var e=t.goldAmount?parseFloat(t.goldAmount):0,i=t.stoneAmount?parseFloat(t.stoneAmount):0,s=t.accessoryAmount?parseFloat(t.accessoryAmount):0,a=t.processingFee?parseFloat(t.processingFee):0,n=t.certificateFee?parseFloat(t.certificateFee):0,d=t.otherFee?parseFloat(t.otherFee):0;t.saleAmount=(e+i+s+a+n+d).toFixed(2),o&&(this.goodList[this.rowIndex].tSaleOutGoodsDetailEntitys=this.tSaleOutGoodsDetailEntitys,this.allSumItem(this.rowIndex))}},sum:function(t,e){var i=this;return console.log(t),t.reduce(function(t,o){return""===o[e]||null===o[e]||null==o[e]?0+t:isNaN(o[e])?(i.$Modal.warning({content:"请输入数字"}),o[e]="",0+t):parseFloat(o[e])+t},0)},sumInner:function(t,e){return t.reduce(function(t,o){return""==o.goodsEntity[e]||null===o.goodsEntity[e]?0+t:(isNaN(o.goodsEntity[e])&&(alert("请输入数字"+e),o.goodsEntity[e]=""),parseFloat(o.goodsEntity[e])+t)},0)},getActualSaleAmount:function(t){var o=parseFloat(t.saleAmount),e=1-parseFloat(t.discountRate)/100;if(isNaN(e)||isNaN(o))return t.actualSaleAmount=t.saleAmount,this.addBody.totalActualAmount=this.sum(this.goodList,"actualSaleAmount").toFixed(2),void this.getReceivedAmount();t.actualSaleAmount=(o*e).toFixed(2),this.addBody.totalActualAmount=this.sum(this.goodList,"actualSaleAmount").toFixed(2),this.getReceivedAmount()},getGoldAmount:function(t){if("1"!==this.addBody.pricingMethod){var o=parseFloat(t.goldPrice),e=parseFloat(t.goldPurchase)/100+1,i=parseFloat(t.goodsEntity.netGoldWeight);isNaN(o)||isNaN(i)||isNaN(e)?t.goldAmount="":t.goldAmount=(o*e*i).toFixed(2)}},getStoneAmount:function(t){if("1"!==this.addBody.pricingMethod){var o=parseFloat(t.stonePrice),e=parseFloat(t.goodsEntity.mainStoneWeight);isNaN(o)||isNaN(e)?t.stoneAmount="":t.stoneAmount=(o*e).toFixed(2)}},getSaleAmount:function(t){"attr_ranges_gold"===t.goodsMainType&&(this.getActualSaleAmount(t),this.sumFinance())},test:function(){var t={goodsEntity:{countingUnitId:"",goodsNo:"",goodsName:"testtet",batchNum:"1",countingUnitName:"",num:"1",weightUnitName:"",totalWeight:"15",goldWeight:"10",mainStoneWeight:"10",certificateNo:"E39545454545",certificateType:"sssss",purchaseCost:""},goodsBarcode:"123",purchaseCost:"10",goldPrice:"300",goldPurchase:"10",goldAmount:"",stonePrice:"200",stoneAmount:"",accessoryAmount:"10",processingFee:"10",certificateFee:"10",otherFee:"10",saleAmount:""};this.getGoldAmount(t),this.getStoneAmount(t),this.sumSaleAmount(t,!0);for(var o=0;o<this.tSaleOutGoodsDetailEntitys.length;o++)if(""==this.tSaleOutGoodsDetailEntitys[o].goodsBarcode){this.$set(this.tSaleOutGoodsDetailEntitys,o,t);break}this.goodList[this.rowIndex].tSaleOutGoodsDetailEntitys=this.tSaleOutGoodsDetailEntitys,this.allSumItem(this.rowIndex)},getUserInfo:function(){var o=this;$.ajax({type:"GET",url:contextPath+"/shiroUser/info",success:function(t){console.log(t),o.user.userId=t.id,o.user.username=t.username,o.user.organizationId=t.id,o.user.organizationName=t.username,o.addBody.createName=t.username,o.addBody.updateName=t.username},error:function(t){o.$Modal.error({content:"系统出现异常,请联系管理人员"})}})},getLocationList:function(t,o){if(t){var e=t;"object"===(void 0===t?"undefined":_typeof(t))&&(e=t.target.value);for(var i="",s=0;s<this.wareHouseList.length;s++)if(e==this.wareHouseList[s].id){i=this.wareHouseList[s].groupId;break}this.$set(this.locationList,o,this.locationMap[i])}},changeLocation:function(t,o){console.log(t.target.value),console.log(o),console.log(this.locationObj);var e=t.target.value;console.log(this.locationObj[e]),this.goodList[o].locationId=e,this.goodList[o].locationName=this.locationObj[e]},changeCategory:function(t,o){this.goodList=[];var e=o[o.length-1];e&&(this.addBody.goodsType=e.value,this.addBody.goodsTypeName=e.label,this.getCommodityList())},getCommodityList:function(){var o=this,t={categoryCustomCode:o.addBody.goodsType,field:"",limit:""};$.ajax({type:"post",url:contextPath+"/tbasecommodity/findByType",data:t,dataType:"json",success:function(t){"100100"==t.code?o.commodityList=t.data:this.$Modal.error({content:t.msg})},error:function(){this.$Modal.error({content:"网络异常,请联系技术人员！"})}})},isHintShow:function(t){var o=this;t&&this.addBody.goodsType&&this.isHint&&this.goodList&&0<this.goodList.length&&this.$Modal.warning({content:"温馨提示：改变商品类型将删除所有商品信息!",onOk:function(){o.isHint=!1,console.log("温馨提示：改变商品类型将删除所有商品信息！")}})},confirm:function(t,o,e,i){if(console.log(t),console.log(e),this.addBody.pricingMethod=""!=e.pricingMethod?e.pricingMethod.toString():"",this.addBody.customerId=e.id,this.addBody.custNo=e.custNo,this.addBody.saleCustInfoEntity.custNo=e.code,this.addBody.saleCustInfoEntity.zipCode=e.zipCode,this.addBody.saleCustInfoEntity.custId=e.id,this.addBody.custName=e.name,e.contacts){var s=e.contacts[0];this.addBody.saleCustInfoEntity.email=s.email,this.addBody.saleCustInfoEntity.phone=s.phone,this.addBody.saleCustInfoEntity.wechat=s.wechat,this.addBody.saleCustInfoEntity.name=s.name}e.province&&(vm.areaInit={isInit:!0,province:e.province||"",city:e.city||"",county:e.county,detail:e.detail,disabled:!1}),this.getStockPrice(e.id),this.isShow=!1},getStockPrice:function(t){var i=this;$.ajax({url:contextPath+"/tsaleoutstock/findSaleStockPrice",method:"POST",dataType:"json",data:{custId:t},success:function(t){if("100100"==t.code){var o=t.data;for(var e in o)"stockPriceEntity"==e&&(i.addBody.stockPriceEntity=o[e]),"depositReceived"==e&&(i.addBody.depositReceived=o[e]),"prepaidFee"==e&&(i.addBody.prepaidFee=o[e])}else i.$Modal.success({content:t.msg,title:"提示"})}})},changeCustm:function(t){var o=this;""!==t.saleCustInfoEntity.name&&(0<this.goodList.length?this.$Modal.confirm({content:"修改客户将会清空分录行，是否修改客户？",onOk:function(){o.addBody.customerId="",t.saleCustInfoEntity.name="",o.isShow=!0,o.goodList=[],o.tSaleOutGoodsDetailEntitys=[]}}):this.isShow=!0)},userInfo:function(){this.isWait||this.isView||(""===this.addBody.saleCustInfoEntity.name?this.isShow=!0:this.changeCustm(this.addBody))},clear:function(){console.log("这是清空。。。")},add:function(){console.log("这是新增。。。"),this.jump(this.operationFlag.no,this.jumpFlag.add)},jump:function(t,o){window.parent.activeEvent({name:"销售出库单新增",url:contextPath+"/sale/saleoutstock/saleoutstock-add.html",params:{type:o,data:t}})},handlerDataToPost:function(){var t={tSaleOutGoodsDetailEntitys:[],stonesParts:[],materialParts:[],partParts:[],goldParts:[]};Object.assign(this.addBody.saleCustInfoEntity,this.area);var e=Object.assign({},this.addBody);return 0<this.goodList.length&&(e.goodList=[JSON.parse(JSON.stringify(t))]),htHandlerProductDetail(this.goodList,e,t),this.goodList.map(function(t,o){e.goodList[o]||(e.goodList[o]={}),Object.assign(e.goodList[o],{id:t.id,outStockNo:t.outStockNo,goodsMainType:t.goodsMainType,goodsLineNo:t.goodsLineNo,goodsLineNoId:t.goodsLineNoId,pictureUrl:t.pictureUrl,goodsCode:t.goodsCode,goodsName:t.goodsName,goodsNorm:t.goodsNorm,goldColor:t.goldColor,commodityId:t.commodityId,countingUnit:t.countingUnit,deliveryDate:t.deliveryDate,num:t.num,weightUnit:t.weightUnit,totalWeight:t.totalWeight,goldWeight:t.goldWeight,mainStoneWeight:t.mainStoneWeight,warehouseId:t.warehouseId,warehouseName:t.warehouseName,locationId:t.locationId,locationName:t.locationName,documentType:t.documentType,documentNo:t.documentNo,pricingMethod:t.pricingMethod,cost:t.cost,goldAmount:t.goldAmount,stoneAmount:t.stoneAmount,accessoryAmount:t.accessoryAmount,processingFee:t.processingFee,certificateAmount:t.certificateAmount,otherAmount:t.otherAmount,saleAmount:t.saleAmount,discountRate:t.discountRate,actualSaleAmount:t.actualSaleAmount,assistAttrs:t.assistAttrs,tSaleOutGoodsDetailEntitys:t.tSaleOutGoodsDetailEntitys})}),e},clearNoNum:function(t,o,e){return htInputNumber(t,o,e)},save:function(){var t=this.handlerDataToPost();if(console.log(t),""==this.addBody.id){this.saveFlag=!0;var o=this.checkSaveDate(t);1==o.tmpCheckFlag?t.checkFlag=0:t.checkFlag=1,o.tmpFlag&&this.publicSaveAjax(t)}else{this.publicUpdateAjax(t)&&this.isEdit(1==this.addBody.status?"Y":"N")}},review:function(){console.log("这是提交。。。"),this.addBody.status=this.orderStatus.unreviewed,this.save()},approval:function(){this.isView=!0,console.log(this.addBody.status),this.modalType="approve",this.modalTrigger=!this.modalTrigger},reject:function(){this.modalType="reject",this.modalTrigger=!this.modalTrigger},approvalOrRejectCallBack:function(t){console.log(t);var o=this;"100515"==t.result.code&&("approve"==o.modalType&&o.ajaxUpdateDocStatusById(o.addBody.id,4,"审核"),"reject"==o.modalType&&o.ajaxUpdateDocStatusById(o.addBody.id,1,"驳回")),"100100"==t.result.code&&(o.addBody.status=t.result.data.status)},ajaxUpdateDocStatusById:function(t,o,e){var i=this;$.ajax({url:contextPath+"/tsaleoutstock/updateStatus",method:"POST",dataType:"json",contentType:"application/json;charset=utf-8",data:JSON.stringify({id:t,status:o}),success:function(t){"100100"==t.code?(i.$Modal.success({content:e+"成功!",title:"提示"}),i.addBody.status=o):i.$Modal.success({content:e+"失败!",title:"提示"})}})},exit:function(){window.parent.closeCurrentTab({exit:!0,openTime:this.openTime})},getSelectedItem:function(t,i){console.log(t);var s=this;$.ajax({type:"post",url:contextPath+"/tbasecommodity/getBriefById/"+t.id,dataType:"json",success:function(t){console.log(t);var o=t.data,e={};Object.assign(e,s.oneInfo,{goodsCode:o.code,goodsName:o.name,commodityId:o.id,id:o.id,goodsLineNoId:o.id,goodsId:o.id,pictureUrl:o.frontPic&&o.frontPic.fdUrl,goodsType:o.categoryCustomCode,goodsMainType:o.mainType,goodsNorm:o.specification,countingUnit:""!=o.countUnitId?s.unitListObj[o.countUnitId.toString()]:"",weightUnit:""!=o.weightUnitId?s.unitListObj[o.weightUnitId.toString()]:"",pricingMethod:o.pricingType.toString()}),s.$set(s.goodList,i,e),"attr_ranges_gold"===o.mainType&&(s.goodList[i].goldColor=o.certificateType,s.goodList[i].goldPrice=s.goldPriceList[o.certificateType]),s.isOpen=!1,console.log(s.goodList),s.$forceUpdate()},error:function(){layer.alert("服务器出错啦")}})},getInputValue:function(t,o){var e=this,i={categoryCustomCode:e.addBody.goodsType,field:t,limit:""};$.ajax({type:"post",url:contextPath+"/tbasecommodity/findByType",data:i,dataType:"json",success:function(t){Object.assign(e.goodList[o],{options:t.data}),e.$forceUpdate()},error:function(){layer.alert("服务器出错啦")}})},searchCut:function(){this.reload=!this.reload},searchClear:function(){this.body={code:"",name:""}},cancelPoPup:function(){this.body={code:"",name:""}},showBarCodeDetail:function(t){console.log("当前下标：",t);var o=this;o.updateFlag=2,this.barCodeSelectedIndex=t,this.tempGoodsMailType=o.tSaleOutGoodsDetailEntitys[t].goodsEntity.goodsMainType,console.log(o.tSaleOutGoodsDetailEntitys);var e={goodsId:o.tSaleOutGoodsDetailEntitys[t].goodsId,commodityId:o.tSaleOutGoodsDetailEntitys[t].goodsId,documentType:"W_STOCK_IN"};Object.assign(o.barCodeDetailModal,{showModal:!0,ids:e}),this.$nextTick(function(){o.$refs.barCodeModalRef.getProductDetail()})},showProductDetail:function(t){var o=this;if(this.selectedIndex=t,this.goodList[t].documentNo?this.updateFlag=2:this.updateFlag=1==this.addBody.status?1:2,!this.goodList[t].commodityId)return this.$Modal.error({content:"还未选择商品，请先选择商品，再选择明细！"}),!1;this.dataSourceType&&(this.dataSource={goldParts:this.goodList[this.selectedIndex].goldParts,stonesParts:this.goodList[this.selectedIndex].stonesParts,partParts:this.goodList[this.selectedIndex].partParts,materialParts:this.goodList[this.selectedIndex].materialParts});var e={goodsId:"S_CUST_ORDER"==this.goodList[t].documentType?this.goodList[t].goodsLineNoId:this.goodList[t].id,commodityId:this.goodList[t].commodityId,documentType:"S_CUST_ORDER"==this.goodList[t].documentType?"S_CUST_ORDER":"S_OUT_STOCK"};Object.assign(this.productDetailModal,{showModal:!0,ids:e}),this.$nextTick(function(){o.$refs.modalRef.getProductDetail()})},modalSure:function(t){this.productDetailModalClick(t),this.productDetailModal.showModal=!1},modalCancel:function(t){this.productDetailModal.showModal=!1},barModalSure:function(t){this.barCodeDetailModal.showModal=!1},barModalCancel:function(t){this.barCodeDetailModal.showModal=!1},productDetailModalClick:function(t){"attr_ranges_goods"===this.goodList[this.selectedIndex].goodsMainType?Object.assign(this.goodList[this.selectedIndex],{tBaseBomEntity:t,assistAttrs:null,overEdit:!0}):Object.assign(this.goodList[this.selectedIndex],{assistAttrs:t,tBaseBomEntity:null,overEdit:!0})},initLocationData:function(t){var e=this;t.map(function(t,o){e.getLocationList(t.warehouseId,o)})},initGoodCategory:function(t){var s=this,a=[];return t.forEach(function(t){var o=t.customCode,e=t.name,i=t.cateLists;i&&(i=s.initGoodCategory(i)),a.push({value:o,label:e,children:i})}),a.forEach(function(t){t.children||delete t.children}),a},copyList:function(t){console.log(t),Object.assign(this.addBody,t),this.goodList=t.goodList.concat(),console.log(this.addBody),0==this.wareHouseList.length?this.getWareHouseList(this.goodList):this.initLocationData(this.goodList)},updateCodesUsed:function(t,o){var e,i={},s={},a=this.tSaleOutGoodsDetailEntitys||[];void 0!==t&&void 0!==o&&8!=String(t).length&&(a[o].goodsBarcode=""),$.each(this.goodList,function(t,o){$.isArray(o.tSaleOutGoodsDetailEntitys)&&0<o.tSaleOutGoodsDetailEntitys.length&&$.each(o.tSaleOutGoodsDetailEntitys,function(t,o){i[Number(o.goodsBarcode)]=""})}),$.isArray(a)&&0<a.length&&$.each(a,function(t,o){s[Number(o.goodsBarcode)]=""}),e=$.extend(!0,{},i,s),this.codesUsed=e},copyWait:function(t){var e=this;console.log(t),this.goldPriceList=t.goldPriceList,this.wareHouseList=t.wareHouseList,this.areaInit=t.areaInit,this.addBody.stockPriceEntity=t[0].stockPriceEntity,this.addBody.businessType=t[0].businessType,this.addBody.depositReceived=t[0].depositReceived,this.addBody.prepaidFee=t[0].prepaidFee,this.addBody.incomingPrice=t[0].incomingPrice,this.addBody.receivables=t[0].receivables,this.addBody.operationFlag=this.operationFlag.yes,this.addBody.goodsTypeName=t[0].goodsTypeName,this.addBody.goodsType=t[0].goodsType,this.addBody.pricingMethod=t[0].pricingMethod,this.addBody.custName=t[0].custName,this.addBody.custNo=t[0].custNo,this.addBody.saleCustInfoEntity.custId=t[0].custId,this.addBody.saleCustInfoEntity.custNo=t[0].custNo,this.addBody.customerId=t[0].custId,this.addBody.saleCustInfoEntity.email=t[0].email,this.addBody.saleCustInfoEntity.name=t[0].name,this.addBody.saleCustInfoEntity.zipCode=t[0].zipCode,this.addBody.saleCustInfoEntity.detail=t[0].detail,this.addBody.saleCustInfoEntity.phone=t[0].phone,this.addBody.saleCustInfoEntity.weChatNo=t[0].weChatNo,t.map(function(t){t.goldPrice="attr_ranges_gold"==t.goodsMainType?"":e.goldPriceList[t.goldColor],t.num="attr_ranges_gold"==t.goodsMainType?"":t.waitOutStockAmount,t.pricingMethod=t.pricingUnitId,t.tSaleOutGoodsDetailEntitys=t.tSaleBarcodeGoodsEntityVoList,delete t.tSaleBarcodeGoodsEntityVoList,delete t.waitOutStockAmount}),this.addBody.goodList=t,this.goodList=this.addBody.goodList.concat(),this.goodList&&(this.goodList.map(function(t){t.tSaleOutGoodsDetailEntitys.map(function(t){e.getGoldAmount(t),e.getStoneAmount(t),e.sumSaleAmount(t,!1)})}),this.goodList.map(function(t,o){0<t.tSaleOutGoodsDetailEntitys.length&&(e.tSaleOutGoodsDetailEntitys=t.tSaleOutGoodsDetailEntitys,e.allSumItem(o))})),0==this.wareHouseList.length?this.getWareHouseList(this.goodList):this.initLocationData(this.goodList)},getWareHouseList:function(o){var e=this;$.ajax({url:contextPath+"/wareHouse/listByTypeAndOrganizationId?type=1",type:"POST",dataType:"json",success:function(t){console.log(t),e.wareHouseList=t.data,e.wareHouseList.map(function(t){e.wareHouseObj[t.id.toString()]=t.name})},error:function(t){e.$Modal.error({content:"系统出现异常,请联系管理人员"})}}).then(function(t){o&&e.initLocationData(o)})},getGoodsItem:function(t,e){var i=this,o={id:t.id,custId:i.addBody.saleCustInfoEntity.custId};$.ajax({type:"post",url:contextPath+"/goodsController/queryListGiveStockWait",data:JSON.stringify(o),contentType:"application/json",dataType:"json",success:function(t){if(console.log("明细",t.data),"100100"===t.code){var o=Object.assign({},i.oneDetail,{goodsName:t.data[0].goodsName,goodsBarcode:t.data[0].goodsBarcode,certificateFee:t.data[0].certificateFee,otherFee:t.data[0].otherFee,processingFee:t.data[0].processingFee,goodsMainType:t.data[0].goodsMainType,goodsId:t.data[0].id,goldAmount:t.data[0].goldAmount,stoneAmount:t.data[0].stoneAmount,goldColor:t.data[0].certificateType,goldPurchase:t.data[0].goldPurchase,accessoryAmount:null==t.data[0].salePart?0:t.data[0].salePart,goldPrice:null==i.goldPriceList[t.data[0].goldColor]?0:i.goldPriceList[t.data[0].goldColor],stonePrice:null==t.data[0].saleStonePrice?0:t.data[0].saleStonePrice,goodsEntity:Object.assign({},t.data[0],{options:i.tSaleOutGoodsDetailEntitys[e].options,num:1})});"1"===i.addBody.pricingMethod&&(o.saleAmount=t.data[0].salePrice),i.$set(i.tSaleOutGoodsDetailEntitys,e,o),i.getGoldAmount(i.tSaleOutGoodsDetailEntitys[e]),i.getStoneAmount(i.tSaleOutGoodsDetailEntitys[e]),i.sumSaleAmount(i.tSaleOutGoodsDetailEntitys[e],!0),i.goodList[i.rowIndex].tSaleOutGoodsDetailEntitys=i.tSaleOutGoodsDetailEntitys,i.allSumItem(i.rowIndex),i.updateCodesUsed()}},error:function(){layer.alert("服务器出错啦")}})},getGoodsBarcodeValue:function(o,e){var i=this;if(1!=i.addBody.operationFlag||""!=i.addBody.saleCustInfoEntity.custId){var t={goodsBarcode:o,commodityId:"",goodsNo:i.detailInput.goodsCode,isInStock:1,stockInNo:"",soldStatus:0,warehouseId:"",reservoirPositionId:"",limit:""};$.ajax({type:"post",url:contextPath+"/goodsController/queryGoodsDetail",data:JSON.stringify(t),contentType:"application/json",dataType:"json",success:function(t){"100100"===t.code&&(i.tSaleOutGoodsDetailEntitys[e]&&(i.tSaleOutGoodsDetailEntitys[e].options=t.data.map(function(t){return $.extend(!0,{},{code:t.goodsBarcode,name:t.goodsName,id:t.id})})),i.$forceUpdate(),i.updateCodesUsed(o,e))},error:function(){layer.alert("服务器出错啦")}})}else i.$Modal.warning({content:"请选择客户！"})},loadData:function(){this.logisticsInfo=getCodeList("jxc_jxc_wlfs")},loadLocation:function(){var e=this;$.ajax({url:contextPath+"/tpurchasecollectgoods/findByAllPosition",method:"POST",dataType:"json",contentType:"application/json;charset=utf-8",success:function(t){if("100100"==t.code){var o={};t.data.map(function(t){null==o[t.groupId]&&(o[t.groupId]=[]),o[t.groupId].push(t)}),e.locationMap=o}}})},loadProductType:function(){var o=this;$.ajax({type:"post",url:contextPath+"/tbasecommoditycategory/listByAll?parentId=0",contentType:"application/json",dataType:"json",success:function(t){console.log(t),o.categoryType=o.initGoodCategory(t.data.cateLists)},error:function(t){console.log("服务器出错")}})},getData:function(){var o=this;$.ajax({type:"post",url:contextPath+"/tpurchasecollectgoods/data",dataType:"json",success:function(t){o.user.organizationId=t.data.orgId,o.user.organizationName=t.data.orgName,o.user.userId=t.data.userId,o.user.username=t.data.username,o.user.createName=t.data.username,o.user.updateName=t.data.username,o.employees=t.data.employees},error:function(t){o.$Modal.error({content:"系统出现异常,请联系管理人员"})}})},initGoldPrice:function(t){var o=this;$.ajax({type:"post",url:contextPath+"/tbasetodygoldprice/queryPrice",data:{type:t},dataType:"json",success:function(t){o.goldPriceList=t.data},error:function(){o.$Message.warning("服务器报错")}})},inquire:function(t,o){var e=this;console.log(o),console.log("这是查询。。。");var i={outStockNo:t,operationFlag:o};$.ajax({type:"POST",url:contextPath+"/tsaleoutstock/info",data:i,success:function(t){if("100100"==t.code){console.log("进入查看状态");var o=t.data;1!==o.status&&(e.isView=!0),e.updateFlag=2,e.copyList(o),e.areaInit={isInit:!0,province:o.saleCustInfoEntity.province||"",city:o.saleCustInfoEntity.city||"",county:o.saleCustInfoEntity.county,detail:o.saleCustInfoEntity.detail,disabled:1!=e.addBody.status},e.typeShowFlag=!1}else e.$Modal.warning({content:t.msg})},error:function(t){e.$Modal.error({content:"系统出现异常,请联系管理人员"})}})},getUnitList:function(){var o=this;$.ajax({type:"POST",url:contextPath+"/tbaseunit/list",async:!1,success:function(t){console.log(t),o.unitList=t.data,o.unitList.map(function(t){o.unitListObj[t.id.toString()]=t.name})},error:function(t){o.$Modal.error({content:"系统出现异常,请联系管理人员"})}})}},created:function(){this.getData(),this.loadProductType(),this.loadData(),this.getUnitList(),this.getWareHouseList(),this.loadLocation(),this.initGoldPrice(1)},computed:{},mounted:function(){if(this.repositionDropdown(),this.parentPramas=window.parent.params.params,$("form").validate(),this.jumpParam=window.parent.params.params,console.log(this.jumpParam),""==this.jumpParam.data.goodsType&&(this.typeShowFlag=!1),"update"===this.jumpParam.type){console.log("进入修改状态！");var t=this.jumpParam.data;this.updateFlag=1==t.status?1:2,this.copyList(t),this.areaInit={isInit:!0,province:t.saleCustInfoEntity.province||"",city:t.saleCustInfoEntity.city||"",county:t.saleCustInfoEntity.county,detail:t.saleCustInfoEntity.detail,disabled:!1},this.typeShowFlag=!1,this.addBody.operationFlag=this.jumpParam.data.operationFlag,1==this.addBody.operationFlag&&(this.rowFlag=!1),this.isEdit("Y")}else if("query"===this.jumpParam.type){console.log("进入查看状态"),console.log(this.jumpParam.data),1!==this.jumpParam.data.status&&(this.isView=!0),this.updateFlag=2;var o=this.jumpParam.data;this.copyList(o),this.areaInit={isInit:!0,province:o.saleCustInfoEntity.province||"",city:o.saleCustInfoEntity.city||"",county:o.saleCustInfoEntity.county,detail:o.saleCustInfoEntity.detail,disabled:1!=this.addBody.status},this.typeShowFlag=!1}else"add"===this.jumpParam.type?(console.log("进入新增状态"),this.addBody.operationFlag=this.operationFlag.no,this.addBody.businessType="S_CUST_ORDER_01",this.rowFlag=!0,this.typeShowFlag=!0,this.jumpParam.data,this.updateFlag=1,this.isEdit("Y")):"wait"===this.jumpParam.type?(console.log("进入待销售列表跳转新增状态"),console.log(this.jumpParam.data),this.typeShowFlag=!1,this.dataSourceType=!0,this.isWait=!0,this.copyWait(this.jumpParam.data),this.updateFlag=2,this.isEdit("Y")):"other"===this.jumpParam.type&&this.inquire(this.jumpParam.data,this.operationFlag.yes);this.openTime=window.parent.params.openTime},watch:function(){},filters:{capitalize:function(t){return 1==t?"重量计价":2==t?"数量计价":" "}}});