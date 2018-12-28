"use strict";Vue.component("ht-select",{props:{optionData:{type:Object,require:!0},initModel:{type:String},isDisabled:{type:Boolean}},data:function(){return{isShow:!1,code:""}},methods:{transitem:function(i){this.$emit("getitem",i)},chooseOne:function(i){this.code=i.code,this.transitem(i),this.$emit("one"),this.$emit("input",i.id),this.isShow=!1},transcode:function(){this.$emit("getinput",this.code)},change:function(){this.isShow=!0,this.transcode(),this.$emit("change")},inInput:function(){this.isShow=!0},leave:function(){var i=this;setTimeout(function(){i.isShow=!1},300)}},mounted:function(){this.code=this.initModel},template:'<div id="ht-select">\n    <i-input :disabled="isDisabled" class="ht-width-md" @on-change="change" @on-blur="leave" @on-focus="inInput" v-model="code" :clearable="!isDisabled" ></i-input>\n    <div class="ivu-select-dropdown" v-show="isShow" >\n        <ul style="width:auto;min-width:200px;">\n            <li v-if="optionData.length == 0" style="width:200px">暂无数据</li>\n            <li  v-for="(item,index) in optionData" :key="index" @click="chooseOne(item)">{{item.code}}&nbsp;|&nbsp;{{item.name}}</li>\n        </ul>\n    </div>\n</div>'});