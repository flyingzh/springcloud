
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
            nodeData: [
                {id: 1, pId: 0, name: "库位组1", open: true},
                {id: 11, pId: 1, name: "库位1"},
                {id: 12, pId: 1, name: "库位22222"},
                {id: 2, pId: 0, name: "库位组2", open: true},
                {id: 21, pId: 2, name: "库位3"},
                {id: 22, pId: 2, name: "库位4"},
                {id: 221, pId: 22, name: "库位5"},
            ],
        }
    },
    methods: {
        loadData() {
            let This = this;
            let config = Object.assign({},{callback: this.evalCallback}, this.defaultSetting, this.setting);
            $.ajax({
                type: "POST",
                url: This.url || 'http://www.baidu.com',
                contentType: 'application/json',
                dataType: "json",
                success: function(data) {
                    $.fn.zTree.init($("#" + This.tid), config, This.nodeData);
                    let zTree = $.fn.zTree.init($("#" + This.tid), config, This.nodeData);
                    This.$parent.$ztree = zTree;
                },
                error: function(err){
                    $.fn.zTree.init($("#" + This.tid), config, This.nodeData);
                    let zTree = $.fn.zTree.init($("#" + This.tid), config, This.nodeData);
                    This.$parent.$ztree = zTree;
                },
            });
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
    template: `  <div>           
       <ul :id="tid" class="ztree"></ul>
   </div>`
})
