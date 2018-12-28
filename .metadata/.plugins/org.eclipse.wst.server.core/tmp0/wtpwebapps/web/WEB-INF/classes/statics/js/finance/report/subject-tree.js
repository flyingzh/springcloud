
Vue.component('subject-tree',{
    data(){
        return{
            show:this.value,
            cashSetting: {
                callback: {
                    onClick: this.clickTab
                }
            },
            id1:1,
            treeValue:'name1',
            url:'./treedata.json',
            chooseId:''
        }
    },
    methods:{
        closeModal() {
            this.$emit('close')
        },
        save() {
            // 请求数据，返回
            
            var _this = this;
            var _url = './treedata.json';
            $.ajax({
                type: 'get',
                data: '',
                url: _url,
                dataType: 'json',
                success: function(res){
                    let data = res.data;
                    _this.$emit('save',_this.chooseId)
                    _this.$emit('close')
                },
                error: function(code){
                    console.log(code);
                }
            });
        },
        clickTab(event, treeId, treeNode){
            // console.log(event, treeId, treeNode.id)
            this.chooseId = treeNode.id;
        },
        tabClick(name){
            switch(name){
                case 'name1':
                    this.url = './treedata.json';
                    break;
                case 'name2':
                    this.url = './treedata.json';
                    break;
                case 'name3':
                    this.url = './treedata.json';
                    break;
                default:
                    break;
            }
        },
    },
    watch:{
        value(val){
            this.show = val;
        }
    },
    props: ['value'],
    template:`
        <Modal
        title="选择科目"
        v-model="show"
        width="430"
        @on-cancel='closeModal'
        :mask-closable="false">
        <tabs v-model="treeValue" type="card" @on-click="tabClick">
            <tab-pane label="资产" name="name1">
                <ht-tree 
                    :url="url"
                    :setting="cashSetting"
                    tid="id1"
                    v-if="treeValue==='name1'"></ht-tree>
            </tab-pane>
            <tab-pane label="负债" name="name2">
                <ht-tree 
                    :url="url"
                    :setting="cashSetting"
                    tid="id2"
                    v-if="treeValue==='name2'"></ht-tree>
            </tab-pane>
            <tab-pane label="共同" name="name3">
                <ht-tree 
                    :url="url"
                    :setting="cashSetting"
                    tid="id3"
                    v-if="treeValue==='name3'"></ht-tree>
            </tab-pane>
            <tab-pane label="权益" name="name4">权益</tab-pane>
            <tab-pane label="成本" name="name5">成本</tab-pane>
            <tab-pane label="损益" name="name6">损益</tab-pane>
        </tabs>
        <div slot="footer">
            <i-button type="primary" @click="save">确定</i-button>
            <i-button @click="closeModal">取消</i-button>
        </div>
    </Modal>
    `
})