
Vue.component('ht-treeinc', {
    props: {
        url: {
            type: String,
            require: true
        },
        setting: {
            require: false,
            type: Object
        },
        tid: {
            require: false,
            type: String,
            default () {
                return 'ztree' + Math.random().toString().substring(2, 8);
            }
        },
        nodeData: {
            require: false,
            type: Object,
        }
    },
    data () {
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
        loadData () {
            let config = Object.assign({}, { callback: this.evalCallback }, this.defaultSetting, this.setting);
            let This = this;
            if (this.nodeData === undefined && This.url) {
                $.ajax({
                    type: "POST",
                    url: This.url || './tree_data.json',
                    contentType: 'application/json',
                    dataType: "json",
                    success: function (data) {
                        This.nodeData = data.data;
                        let zTree = $.fn.zTree.init($("#" + This.tid), config, This.nodeData);
                        This.$parent.$ztree = zTree;
                    },
                    error: function (err) {
                        alert('服务器出错啦!')
                    }
                });
            } else {
                let zTree = $.fn.zTree.init($("#" + this.tid), config, this.nodeData);
                this.$parent.$ztree = zTree;
            }
        },
        evalCallback () {
            let vm = this;
            let res = {};
            $.each(this.setting.callback, function (key, val) {
                console.log(key, val)
                res[key] = vm.$parent[val];
            });
            return res;
        }
    },
    mounted () {
        console.log(this.tid)
        this.loadData();
    },
    watch: {
        nodeData: {
            handler () {
                // 暂时注释掉下一行，原因：树数据有变动时，触发重新初始化，导致所有节点收缩
                //this.loadData();
            }
        }
    },
    template: `  <div>      
       <ul :id="tid" class="ztree"></ul>
   </div>`
})

