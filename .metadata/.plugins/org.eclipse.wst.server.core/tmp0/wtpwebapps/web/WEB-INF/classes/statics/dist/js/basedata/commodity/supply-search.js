"use strict";Vue.component("supply-search",{props:{data_config:{type:String,require:!0},needReload:{require:!1,type:Object},table_id:{require:!1,type:String,default:function(){return("list"+1e8*Math.random()).substring(0,8)}},pager_id:{require:!1,type:String,default:function(){return("list"+1e8*Math.random()).substring(0,8)}}},data:function(){var a=this;return{selected:[],base_config:{jsonReader:{root:"data.list",total:"data.totalPage",records:"data.totalCount",cell:"list"},mtype:"POST",contentType:"application/json",datatype:"json",styleUI:"Bootstrap",rownumbers:!0,multiselectWidth:50,viewrecords:!0,forceFit:!0,rowNum:10,width:"99%",autowidth:!0,rowList:[10,20,30,40],onSelectAll:function(t,e){var i=$("#"+a.table_id).jqGrid("getRowData");a.handlerId(i,e),a.$emit("input",a.selected)},onSelectRow:function(t,e){var i=$("#"+a.table_id).jqGrid("getRowData",t);a.handlerId(i,e),a.$emit("input",a.selected)},onPaging:function(){},beforeSelectRow:function(){a.data_config.singleSelect&&(a.selected=[],$("#"+a.table_id).jqGrid("resetSelection"))},gridComplete:function(){if(a.data_config.singleSelect){var t=$("#"+a.table_id);$("#cb_"+t[0].id).hide()}}}}},methods:{handlerId:function(t,e){var i=this;if("array"===$.type(t))i.selected=e?t:[];else if("object"===$.type(t))if(e)i.selected.push(JSON.stringify(t));else{var a=i.selected.indexOf(JSON.stringify(t));-1<a&&i.selected.splice(a,1)}},jqGridInit:function(){var t=this,e=Object.assign(this.data_config,this.base_config,{multiselect:!1!==this.data_config.multiselect,colNames:this.data_config.colNames,colModel:this.data_config.colModel,caption:this.data_config.caption,postData:this.$parent.$parent.supplySearch,url:this.data_config.url||"./../JSONData.json",multiboxonly:!!this.data_config.multiboxonly,pager:t.pager_id,prmNames:{page:"page",rows:"limit",order:"order",id:"remark"}});jQuery("#"+t.table_id).jqGrid(e),jQuery("#"+t.table_id).jqGrid("navGrid","#"+t.table_id,{edit:!1,add:!1,del:!1})},jqGridClearData:function(){$("#"+this.table_id).jqGrid("clearGridData")},reload:function(){this.selected=[];var t={postData:this.$parent.$parent.supplySearch};this.jqGridClearData(),$("#"+this.table_id).jqGrid("setGridParam",t).trigger("reloadGrid")}},watch:{needReload:function(){this.reload()}},mounted:function(){this.jqGridInit()},template:'<div class="jqGrid_wrapper">\n        <table :id="table_id"></table> \n        <div :id="pager_id"></div>\n        </div>'});