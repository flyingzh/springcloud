
Vue.component('ht-tree', {
    props:{
        url:{
            type: String,
            require: true
        },
        setting:{
            require: false,
            type: Object
        },
        tid:{
            require: false,
            type: String,
            default(){
                return 'ztree' + Math.random()*(Date.parse(new Date()));
            }
        },
        reload:{
            require: false,
            type: Boolean,
            default(){
                return true;
            }
        },
        nodeData:{
            require: false,
            type: Object,
        }
    },
    data() {
        return {
            defaultSetting: {
                data: {
                    simpleData: {
                        enable: true
                    }
                }
            },
        }
    },
    methods: {
        loadData() {
            let config = Object.assign({},{callback: this.evalCallback}, this.defaultSetting, this.setting);
            let This = this;
            if(this.nodeData === undefined && This.url){
                $.ajax({
                    type: "POST",
                    url: This.url || './tree_data.json',
                    contentType: 'application/json',
                    dataType: "json",
                    success: function(data) {
                        This.nodeData = data.data;
                        let zTree = $.fn.zTree.init($("#" + This.tid), config, This.nodeData);
                        This.$parent.$ztree = zTree;
                    },
                    error: function(err){
                        alert('服务器出错啦!')
                    }
                });
            }else {
                let zTree = $.fn.zTree.init($("#" + this.tid), config, this.nodeData);
                this.$parent.$ztree = zTree;
            }
        },
        evalCallback() {
            let vm = this;
            let res = {};
            $.each(this.setting.callback, function (key, val) {
                console.log(key, val)
                res[key] = vm.$parent[val];
            });
            return res;
        }
    },
    mounted() {
        // console.log(this.nodeData)
        this.loadData();
    },
    watch:{
        nodeData:{
            handler(newName, oldName) {
                if(this.reload === false){//为了解决不知道父页面搜索为何会触发这个方法
                    return;
                }
                this.loadData();
            }
        }
    },
    template: `  <div>      
       <ul :id="tid" class="ztree"></ul>
   </div>`
})

