"use strict";function _defineProperty(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}var mrpauto=new Vue({el:"#mrp-auto",data:function(){var t;return _defineProperty(t={single:"",reload:!1,selected:[],timeShow:!1,openTime:"",oldTime:{},config:{url:contextPath+"/MRPCountSet/warehouseInfoList",colNames:["仓库代码","仓库名称","id"],colModel:[{name:"codes",index:"codes",width:130,align:"center"},{name:"name",index:"name",width:150,align:"center"},{name:"id",index:"id",width:130,align:"center",hidden:!0}]}},"reload",!1),_defineProperty(t,"tabId","tabId"),_defineProperty(t,"timeObj",{hour:"00",min:"00",sec:"00",id:"",storeId:[]}),_defineProperty(t,"timeArray",[]),_defineProperty(t,"delIndex",""),_defineProperty(t,"updateShow",!1),t},methods:{clear:function(){this.timeObj={hour:"00",min:"00",sec:"00"}},addTime:function(){!0!==this.timeShow?(""===this.delIndex||($(".info").removeClass("br-back"),this.reload=!this.reload,this.selected="",this.delIndex=""),this.timeShow=!0,this.updateShow=!1):this.$Modal.info({content:"现在不能此操作,请关闭弹窗"})},modifyTime:function(){!0!==this.timeShow?""===this.delIndex?this.$Modal.info({content:"请先选取时刻"}):(this.reload=!this.reload,this.timeObj=Object.assign({},this.timeArray[this.delIndex]),this.selected="",this.updateShow=!0,this.timeShow=!0,this.oldTime=this.timeObj.hour+this.timeObj.min+this.timeObj.sec):this.$Modal.info({content:"现在不能此操作,请关闭弹窗"})},delTime:function(){!0!==this.timeShow?""===this.delIndex?this.$Modal.info({content:"请先选取时刻"}):(this.timeArray.splice(this.delIndex,1),$(".info").removeClass("br-back"),this.reload=!this.reload,this.selected="",this.delIndex=""):this.$Modal.info({content:"现在不能此操作,请关闭弹窗"})},confirm:function(){var e=this;if(this.timeShow=!1,0<=this.timeObj.hour&&this.timeObj.hour<=23&&2==this.timeObj.hour.length&&0<=this.timeObj.min&&this.timeObj.min<=59&&2==this.timeObj.min.length&&0<=this.timeObj.sec&&this.timeObj.sec<=59&&2==this.timeObj.sec.length)if(this.timeArray.length<1)if(0<this.selected.length){for(var t=[],i=0;i<this.selected.length;i++){var s=$("#"+this.tabId).jqGrid("getRowData",this.selected[i]);t.push(s.id)}this.timeObj.storeId=t;var n=Object.assign({},this.timeObj);this.timeArray.push(n),this.clear()}else this.$Modal.info({content:"请选择仓库ID"});else{var o=!0;if(this.timeArray.map(function(t){t.hour==e.timeObj.hour&&t.min==e.timeObj.min&&t.sec==e.timeObj.sec&&(e.$Modal.info({content:"请输入不同时刻"}),o=!1,e.clear())}),o)if(0<this.selected.length){var h=[];for(i=0;i<this.selected.length;i++){var a=$("#"+this.tabId).jqGrid("getRowData",this.selected[i]);h.push(a.id)}this.timeObj.storeId=h;var r=Object.assign({},this.timeObj);this.timeArray.push(r),this.clear()}else this.$Modal.info({content:"请选择仓库ID"})}else this.$Modal.info({content:"请输入合法时刻"}),this.clear()},cancel:function(){this.timeShow=!1,this.clear()},exit:function(){window.parent.closeCurrentTab({exit:!0,openTime:this.openTime})},actionShow:function(t){!1===this.timeShow?(this.delIndex=t,jQuery("#tabId").jqGrid("resetSelection"),this.timeArray[this.delIndex].storeId.map(function(t){jQuery("#tabId").jqGrid("setSelection",t)}),this.selected=this.timeArray[this.delIndex].storeId,$(".info").eq(this.delIndex).addClass("br-back").siblings().removeClass("br-back")):this.$Modal.info({content:"现在不能选择时刻,请关闭弹窗"})},show:function(){},refresh:function(){window.location.reload()},update:function(){var e=this;if(0<=this.timeObj.hour&&this.timeObj.hour<=23&&2==this.timeObj.hour.length&&0<=this.timeObj.min&&this.timeObj.min<=59&&2==this.timeObj.min.length&&0<=this.timeObj.sec&&this.timeObj.sec<=59&&2==this.timeObj.sec.length)if(0<this.selected.length){for(var t=[],i=0;i<this.selected.length;i++){var s=$("#"+this.tabId).jqGrid("getRowData",this.selected[i]);t.push(s.id)}this.timeObj.storeId=t;var n=Object.assign({},this.timeObj),o=!0;n.hour+n.min+n.sec!=this.oldTime&&this.timeArray.map(function(t){t.hour==n.hour&&t.min==n.min&&t.sec==n.sec&&(e.$Modal.info({content:"请输入不同时刻"}),o=!1,e.clear())}),o&&this.timeArray.splice(this.delIndex,1,n),this.timeShow=!1,this.updateShow=!1}else this.$Modal.info({content:"请选择仓库ID"});else this.$Modal.info({content:"请输入合法时刻"}),this.clear()},saveInfo:function(){var i=[];this.timeArray.map(function(t){var e={};e.id=t.id,e.countSetTime=t.hour+":"+t.min+":"+t.sec,e.warehouseId=t.storeId.join(","),i.push(e)}),$.ajax({type:"POST",cache:!1,async:!1,contentType:"application/json;charset=utf-8",dataType:"json",data:JSON.stringify(i),url:contextPath+"/MRPCountSet/save",success:function(t){0<t.code?mrpauto.$Modal.success({content:"保存成功！",okText:"确定",onOk:function(){mrpauto.refresh()}}):mrpauto.$Modal.error({content:"保存失败！"})},error:function(){mrpauto.$Modal.error({content:"保存失败！"})}});var t=!0===this.single?1:0;$.ajax({type:"POST",cache:!1,async:!1,data:{enabledState:t},url:contextPath+"/MRPCountSet/saveSetStatus",success:function(t){}})}},watch:{selected:function(){}},mounted:function(){this.openTime=window.parent.params.openTime;var e=this;$.ajax({type:"POST",cache:!1,url:contextPath+"/MRPCountSet/list",success:function(t){var s=[];t.data.map(function(t){var e={};e.id=t.id;var i=t.countSetTime.split(":");e.hour=i[0],e.min=i[1],e.sec=i[2],e.storeId=t.warehouseId.split(","),s.push(e)}),e.timeArray=e.timeArray.concat(s)}}),$.ajax({type:"POST",cache:!1,url:contextPath+"/MRPCountSet/getSetStatus",success:function(t){mrpauto.single=0!==t.data}})}});