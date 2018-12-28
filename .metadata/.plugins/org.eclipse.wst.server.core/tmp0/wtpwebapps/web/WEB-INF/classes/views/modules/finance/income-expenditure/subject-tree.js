
Vue.component('subject-tree',{
    props: {
        end:{
            type: Boolean,
            require: false,
            default(){
                return false;
            },
        },
        show:{

        }
    },
    data() {
        return{
            cashSetting: {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "parentId",
                    },
                    key:{
                        name: "subjectName"
                    }
                },
                callback: {
                    onClick: this.clickTab
                }
            },
            id1:1,
            treeValue:'name1',
            url:'/finance/incomeCategory/getListByType',
            choose: {
                name:  '',
                value: '',
                isEnd: false
            },
            treeData: {
                zichan: [],
                fuzhai: [],
            }
        }
    },
    methods:{
        closeModal() {
            this.$emit('close')
        },
        save() {
            this.choose.isEnd = this.end;
            this.$emit('save',this.choose);
            this.$emit('close');
        },
        clickTab(event, treeId, treeNode){
            this.choose.value = treeNode.id;
            this.choose.name = treeNode.subjectName;
        }
    },
    created(){
        let This = this;
        $.ajax({
            type: "POST",
            url: '/finance/incomeCategory/getListByType',
            contentType: 'application/json',
            dataType: "json",
            success: function(data) {
                This.treeData = data.data;
            },
            error: function(err){
                alert('服务器出错啦!')
            },
        });
    },
    template:`
        <Modal
        title="选择科目"
        v-model="show"
        width="500"
        @on-cancel='closeModal'
        :mask-closable="false">
        <tabs v-model="treeValue" type="card">
            <tab-pane label="资产" name="name1">
                <ht-tree 
                    :nodeData="treeData.zichan"
                    :setting="cashSetting"
                    tid="id1"
                    v-if="treeValue==='name1'"></ht-tree>
            </tab-pane>
            <tab-pane label="负债" name="name2">
                <ht-tree 
                    :nodeData="treeData.fuzhai"
                    :setting="cashSetting"
                    tid="id2"
                    v-if="treeValue==='name2'"></ht-tree>
            </tab-pane>
            <tab-pane label="共同" name="name3">
                <ht-tree 
                    :nodeData="treeData.gongtong"
                    :setting="cashSetting"
                    tid="id3"
                    v-if="treeValue==='name3'"></ht-tree>
            </tab-pane>
            <tab-pane label="权益" name="name4">
                <ht-tree 
                    :nodeData="treeData.quanyi"
                    :setting="cashSetting"
                    tid="id4"
                    v-if="treeValue==='name4'"></ht-tree>            
            </tab-pane>
            <tab-pane label="成本" name="name6">
                <ht-tree 
                    :nodeData="treeData.chenben"
                    :setting="cashSetting"
                    tid="id6"
                    v-if="treeValue==='name6'"></ht-tree>               
            </tab-pane>
            <tab-pane label="损益" name="name7">
                <ht-tree 
                    :nodeData="treeData.shunyi"
                    :setting="cashSetting"
                    tid="id7"
                    v-if="treeValue==='name7'"></ht-tree>             
            </tab-pane>
            <tab-pane label="表外" name="name8">表外</tab-pane>
        </tabs>
        <div slot="footer">
            <i-button type="primary" @click="save">确定</i-button>
            <i-button @click="closeModal">取消</i-button>
        </div>
    </Modal>
    `
})