"use strict";Vue.component("subject-tree",{data:function(){return{show:this.value,cashSetting:{callback:{onClick:this.clickTab}},id1:1,treeValue:"name1",url:"./treedata.json",chooseId:""}},methods:{closeModal:function(){this.$emit("close")},save:function(){var n=this;$.ajax({type:"get",data:"",url:"./treedata.json",dataType:"json",success:function(e){e.data;n.$emit("save",n.chooseId),n.$emit("close")},error:function(e){console.log(e)}})},clickTab:function(e,n,t){this.chooseId=t.id},tabClick:function(e){switch(e){case"name1":case"name2":case"name3":this.url="./treedata.json"}}},watch:{value:function(e){this.show=e}},props:["value"],template:'\n        <Modal\n        title="选择科目"\n        v-model="show"\n        width="430"\n        @on-cancel=\'closeModal\'\n        :mask-closable="false">\n        <tabs v-model="treeValue" type="card" @on-click="tabClick">\n            <tab-pane label="资产" name="name1">\n                <ht-tree \n                    :url="url"\n                    :setting="cashSetting"\n                    tid="id1"\n                    v-if="treeValue===\'name1\'"></ht-tree>\n            </tab-pane>\n            <tab-pane label="负债" name="name2">\n                <ht-tree \n                    :url="url"\n                    :setting="cashSetting"\n                    tid="id2"\n                    v-if="treeValue===\'name2\'"></ht-tree>\n            </tab-pane>\n            <tab-pane label="共同" name="name3">\n                <ht-tree \n                    :url="url"\n                    :setting="cashSetting"\n                    tid="id3"\n                    v-if="treeValue===\'name3\'"></ht-tree>\n            </tab-pane>\n            <tab-pane label="权益" name="name4">权益</tab-pane>\n            <tab-pane label="成本" name="name5">成本</tab-pane>\n            <tab-pane label="损益" name="name6">损益</tab-pane>\n        </tabs>\n        <div slot="footer">\n            <i-button type="primary" @click="save">确定</i-button>\n            <i-button @click="closeModal">取消</i-button>\n        </div>\n    </Modal>\n    '});