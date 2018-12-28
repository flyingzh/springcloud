"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};Vue.component("model-list",{props:["data_config","needReload"],data:function(){var o=this;return{selected:[],base_config:{multiselect:!1,jsonReader:{root:"data",cell:"data"},mtype:"POST",contentType:"application/json",datatype:"json",styleUI:"Bootstrap",rownumbers:!1,multiselectWidth:50,viewrecords:!0,pager:"#ht-my-pager",onSelectAll:function(t,e){o.handlerId(t,e),o.$emit("input",o.selected)},onSelectRow:function(t,e){o.handlerId(t,e),o.$emit("input",o.selected)}}}},methods:{handlerId:function(t,e){if("object"===(void 0===t?"undefined":_typeof(t))&&e&&(this.selected=t),"object"!==(void 0===t?"undefined":_typeof(t))||e||(this.selected=[]),"string"==typeof t)if(e)!(-1<this.selected.indexOf(t.toString()))&&this.selected.push(t.toString());else{var o=this.selected.indexOf(t.toString());-1<o&&this.selected.splice(o,1)}},jqGridInit:function(){var t=Object.assign(this.data_config,this.base_config,{colNames:this.data_config.colNames,colModel:this.data_config.colModel,caption:this.data_config.caption,postData:this.$parent.body,url:this.data_config.url||"./JSONData.json",prmNames:{page:"",pagerpos:"",rows:"limit",order:"order"}});jQuery("#ht-my-table").jqGrid(t)},jqGridClearData:function(){$("#ht-my-table").jqGrid("clearGridData")},reload:function(){var t={postData:this.$parent.body};this.jqGridClearData(),$("#ht-my-table").jqGrid("setGridParam",t).trigger("reloadGrid")}},watch:{needReload:function(){this.reload()}},mounted:function(){this.jqGridInit()},template:'<div class="jqGrid_wrapper ht-set-table">\n            <table id="ht-my-table"></table> \n            <div id="ht-my-pager"></div>\n        </div>'});