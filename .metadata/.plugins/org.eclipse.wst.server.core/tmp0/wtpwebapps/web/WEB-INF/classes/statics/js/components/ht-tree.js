
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
                return ('ztree' + Math.random()*1000000000).substring(3,7);
            }
        },
        nodeData:{
            require: false,
            type: Array,
        },
        expand:{
            require: false,
            type: Boolean,
            default(){
                return false;
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
                },

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
                    url: This.url || './treedata.json',
                    contentType: 'application/json',
                    data:{
                        countNo:"MRP0001"
                    },
                    dataType: "json",
                    success: function(data) {

                        let arr = data.data;
                        if(This.expand){
                            arr.forEach((item, index)=>{
                                item.open = true;
                            })
                        }
                        let zTree = $.fn.zTree.init($("#" + This.tid), config,arr);
                        This.$parent.$ztree = zTree;
                    },
                    error: function(err){
                        alert('服务器出错啦!')
                    }
                });
            }else {
                if(This.expand){
                    this.nodeData.forEach((item, index)=>{
                        item.open = true;
                    })
                }
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

        this.loadData();
    },
    watch:{
        nodeData:{
            handler() {
				// 暂时注释掉下一行，原因：树数据有变动时，触发重新初始化，导致所有节点收缩
                //this.loadData();
            }
        }
    },
    template: `  <div>      
       <ul :id="tid" class="ztree"></ul>
   </div>`
})

