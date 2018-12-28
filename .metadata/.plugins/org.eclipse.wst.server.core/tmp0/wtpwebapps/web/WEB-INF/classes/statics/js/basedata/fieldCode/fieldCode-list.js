let numList = new Vue({
    el: "#sale-settlement",
    data() {
        return {
            categoryList: [],
            setting: {
                //注意：如果使用如上简单Json数据，以下data.simpleData.enable必须设置为true。
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pId",

                    },
                    key: {
                        name: 'name'
                    }
                },
                //callback内定义事件和回调函数，更多事件请参考官方文档。
                callback: {
                    onClick: this.clickEvent,
                }
            },
            body:{
                category:""
            },
            data_config_list: {
                url: contextPath + '/docAutoFieldCode/listPage',
                colNames: ["id", '单据名', '单据类型'],
                colModel: [
                    {name: "id", hidden: true},
                    {
                        name: 'docName', index: 'docName', width: 200, align: "center",
                    },
                    {
                        name: 'category',
                        index: 'category',
                        width: 200,
                        align: "center",
                        formatter: function (value, grid, rows, state) {
                            var name = "";
                            for (var i in numList.categoryList) {
                                if (numList.categoryList[i].value == value) {
                                    name = numList.categoryList[i].name;
                                }
                            }
                            return name;
                        }
                    }
                ]
            },
            reload: true,
            selected: []
        }
    },
    methods: {
        loadCategoryList() {
            let info = layui.data('dict')._document_sort;
            let parentObj = [{}];
            //将数据进行过滤
            info.map((item, index) => {
                if (!item.pId) {
                    item.pId = 1
                    var num = index + 5
                    item.id = num
                }
            })

            info.unshift({
                id: 1,
                name: "单据类别",
                pId: 0
            })
            this.categoryList = [].concat(info);
            console.log(this.categoryList)
            this.$refs.my_tree.nodeData = this.categoryList;
            this.$refs.my_tree.loadData();
        },
        clickEvent(event, treeId, treeNode) {
            console.log(event, treeId, )
            //获取到value
            this.body.category = treeNode.value
            this.reload = !this.reload
        },
        updateView() {
            if (this.selected.length !== 1) {
                this.$Modal.info({
                    title: "提示",
                    okText: "确定",
                    content: "只能对单条数据操作!"
                });
                return;
            }
            let id = this.selected[0];
            window.parent.activeEvent({
                name: '修改单据自动编码',
                url: contextPath + '/base-data/fieldCode/fieldCode-add.html',
                params: {type: 'update', id: id}
            });
        },
        addView() {
            window.parent.activeEvent({
                name: '新增单据自动编码',
                url: contextPath + '/base-data/fieldCode/fieldCode-add.html',
                params: {type: 'add'}
            });
        },
        //刷新
        refresh(){
            this.selected = []
            this.reload = !this.reload
        },
        view(){
            if (this.selected.length !== 1) {
                this.$Modal.info({
                    title: "提示",
                    okText: "确定",
                    content: "只能对单条数据操作!"
                });
                return;
            }
            let id = this.selected[0];
            window.parent.activeEvent({
                name: '查看单据自动编码',
                url: contextPath + '/base-data/fieldCode/fieldCode-add.html',
                params: {type: 'view', id: id}
            });
        }
    },
    mounted() {
        this.loadCategoryList()
    }
})