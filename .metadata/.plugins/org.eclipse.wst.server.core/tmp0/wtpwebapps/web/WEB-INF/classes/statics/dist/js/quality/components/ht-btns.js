"use strict";Vue.component("ht-btns",{props:["isSearch","isAdd"],data:function(){return{}},methods:{search:function(){this.$emit("search")},clear:function(){this.$emit("clear")},add:function(){this.$emit("add")},del:function(){this.$emit("del")}},template:' <div style="display: inline-block;">\n        <div>\n            <i-button type="primary" @click="search">搜索</i-button>\n            <i-button type="primary" @click="clear">清空</i-button>\n        </div>\n       \n    </div>'});