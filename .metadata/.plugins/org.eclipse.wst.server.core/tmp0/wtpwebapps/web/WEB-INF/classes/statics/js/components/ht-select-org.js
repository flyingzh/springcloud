
Vue.component('ht-select-org', {
    props:{
        tid:{
            require: false,
            type: String,
            default(){
                return ('ztree' + Math.random()*1000000000).substring(3,7);
            }
        },
        url:{
            require: false,
            type: String,
            default(){
                return contextPath + '/organizationController/queryKtcAllOrgan'
            }
        },
        init:{
            require: false,
            type: String,
            default(){
                return '';
            }
        }
    },
    data() {
        return {
            now: false,
            showModal: false,
            treeData: [],
            setting: {
                //注意：如果使用如上简单Json数据，以下data.simpleData.enable必须设置为true。
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "parentId",
                        rootPId: 0

                    },
                    key: {
                        name: 'orgName'
                    }
                },
                check: {
                    enable: true,
                    chkboxType: { "Y": "", "N": "" },
                    chkStyle: "radio",  //单选框, checkbox多选
                    radioType: "all"   //对所有节点设置单选
                },
                //callback内定义事件和回调函数，更多事件请参考官方文档。
                callback: {
                    onCheck: this.zTreeOnCheck,
                    beforeCheck: this.beforeCheck
                }
            },
        }
    },
    methods: {
        beforeCheck(){
            this.nowOrg();//清空默认值，不清空的话会有bug
        },
        zTreeOnCheck(treeId, treeNode, clickFlag) {
            this.now = false;
        },
        loadData() {
            let config = Object.assign({}, this.setting);
            let This = this;
            $.ajax({
                type: "POST",
                url: This.url,
                contentType: 'application/json',
                data:JSON.stringify({}),
                dataType: "json",
                success: function(data) {

                    let arr = data.data;
                    let zTree = $.fn.zTree.init($("#" + This.tid), config,arr);
                    This.$parent.$ztree = zTree;
                },
                error: function(){
                    This.$Modal.warning({
                        content: '服务器出错！'
                    })
                }
            });
        },
        nowOrg(){ //选择本组织
            let This = this;
            let treeObj = $.fn.zTree.getZTreeObj(This.tid);
            let nodes = treeObj.getCheckedNodes();
            if(nodes.length > 0){
                nodes[0].checked = false;
                treeObj.refresh();
            }
        },
        doSelect(){
            let This = this;
            let treeObj = $.fn.zTree.getZTreeObj(This.tid);

            let selected = treeObj.getCheckedNodes(true);

            let value = {
                selected: selected,
                nowORg: this.now
            };
            console.log(value);

            this.$emit('sure',value);
            this.showModal = false;

        },
        closeModal(){
            this.showModal = false;
        },
        showModalTap(){
            this.showModal = true;
        },
        setData(){
            if(this.init === true){
                this.$nextTick(()=>{
                    this.now = "本组织";
                });
                return false;
            }
            let treeObj = $.fn.zTree.getZTreeObj(this.tid);
            if(treeObj != null){
                let allNode =  treeObj.transformToArray(treeObj.getNodes());
                let node = allNode.filter((item,index) =>{
                    if(item.id === this.init){
                        item.checked = true;
                    }
                    return item.checked;
                });

                treeObj.updateNode (node[0]);
                treeObj.expandAll(true);
            }

        }
    },
    mounted() {
        this.loadData();

        setTimeout(()=>{

            this.setData();

        },1000);
    },
    watch:{
      init(){
          this.setData();
      }
    },
    template: `  <div class="select-org">
        <Icon type="ios-search" @click="showModalTap"></Icon>      
       <modal @on-ok="doSelect" @on-cancel="closeModal" v-model="showModal" title="选择组织" width="600" >
            <div class="clearfix">
                <div style="float: left;width: 80px;">上级组织名称:</div>
                <div style="float: left">
                    <ul :id="tid" class="ztree"></ul>
                    <div><!--<Checkbox @on-change="nowOrg" v-model="now">本组织</Checkbox>-->
                    <RadioGroup @on-change="nowOrg" v-model="now">
                        <Radio label="本组织"></Radio>
                    </RadioGroup>
                    </div>
                </div>
            </div>
            <div slot="footer">
                    <i-button type="primary" @click="doSelect">确定</i-button>
                                <i-button type="primary" style="margin-left: 20px" @click="closeModal">取消</i-button>
            </div>
        </modal>
   </div>`
})

