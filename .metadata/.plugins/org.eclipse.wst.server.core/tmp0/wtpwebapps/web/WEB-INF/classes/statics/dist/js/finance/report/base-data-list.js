"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};Vue.component("base-data-list",{props:["data_config","needReload","pageName","tableName","totalData"],data:function(){var a=this;return{selected:[],base_config:{multiselect:!1,jsonReader:{root:"data",cell:"data"},mtype:"POST",contentType:"application/json",datatype:"json",styleUI:"Bootstrap",rownumbers:!1,multiselectWidth:50,viewrecords:!0,pager:"#"+this.pageName,onSelectAll:function(t,e){a.handlerId(t,e),a.$emit("input",a.selected)},onSelectRow:function(t,e){a.handlerId(t,e),a.$emit("input",a.selected)}}}},methods:{completeMethods:function(){$("#"+this.tableName).footerData("set",{fieldName:"合计",lineNum:1,amount1:101,amount2:102,id:1,parentLine:10,computeType:""})},handlerId:function(t,e){if("object"===(void 0===t?"undefined":_typeof(t))&&e&&(this.selected=t),"object"!==(void 0===t?"undefined":_typeof(t))||e||(this.selected=[]),"string"==typeof t)if(e)!(-1<this.selected.indexOf(t.toString()))&&this.selected.push(t.toString());else{var a=this.selected.indexOf(t.toString());-1<a&&this.selected.splice(a,1)}},jqGridInit:function(){var t=Object.assign(this.data_config,this.base_config,{colNames:this.data_config.colNames,colModel:this.data_config.colModel,caption:this.data_config.caption,postData:this.$parent.body,url:this.data_config.url||"./JSONData.json",prmNames:{page:"",pagerpos:"",rows:"limit",order:"order"}});jQuery("#"+this.tableName).jqGrid(t)},jqGridClearData:function(){$("#"+this.tableName).jqGrid("clearGridData")},reload:function(){var t={postData:this.$parent.body};this.jqGridClearData(),$("#"+this.tableName).jqGrid("setGridParam",t).trigger("reloadGrid")}},computed:{sum_amount1:{get:function(){return $("#"+this.tableName).getCol("amount1",!1,"sum")},set:function(t){$("#"+this.tableName).footerData("set",{fieldName:"合计",lineNum:1,amount1:t,amount2:102,id:1,parentLine:10,computeType:""})}}},watch:{needReload:function(){this.reload()}},mounted:function(){this.jqGridInit(),this.completeMethods()},template:'<div class="jqGrid_wrapper ht-set-table mt10">\n            <table :id="tableName"></table> \n            <div :id="pageName"></div>\n        </div>'});