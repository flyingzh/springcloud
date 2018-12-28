
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
                return 'ztree' + Math.random().toString().substring(2,8);
            }
        },
        nodeData:{
            require: false,
            type: Object,
        },
        initLoad:{//是否初始化的时候加载树
            require: false,
            type: Boolean,
            default(){
                return true;
            }
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
            console.log(this.nodeData)
            if(this.nodeData === undefined && This.url){
                $.ajax({
                    type: "POST",
                    url: This.url,
                    contentType: 'application/json',
                    dataType: "json",
                    success: function(data) {
                        This.nodeData = data.data;
                        $.fn.zTree.init($("#" + This.tid), config, This.nodeData);
                        let zTree = $.fn.zTree.init($("#" + This.tid), config, This.nodeData);
                        This.$parent.$ztree = zTree;
                    },
                    error: function(err){
                        alert('服务器出错啦!')
                    },
                });
            }else {
                $.fn.zTree.init($("#" + this.tid), config, this.nodeData);
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
        if(!this.initLoad){
            return;
        }
        this.loadData();
    },
    watch:{

    },
    template: `  <div>      
       <ul :id="tid" class="ztree"></ul>
   </div>`
})

