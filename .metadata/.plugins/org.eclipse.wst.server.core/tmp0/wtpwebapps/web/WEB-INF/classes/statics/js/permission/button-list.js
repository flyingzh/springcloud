let ButtonListVM = new Vue({
    el: "#button-list",
    data() {
        let This = this;
        return {
            isShow: false,
            reload: false,
            selected: [],
            SUCCESS_CODE: '100100',
            body: {
                name: ''
            },
            button_list: {
                url: contextPath + '/button/buttonListPage',
                colNames: ['操作', '名称', '标识', '状态', '图标'],
                colModel: [
                    {name: 'id', index: 'id', width: 200, align: "center"},
                    {name: 'name', index: 'name', width: 200, align: "center"},
                    {name: 'permission', index: 'permission', width: 200, align: "center"},
                    {
                        name: 'status', index: 'status', width: 200, align: "center",
                        formatter: function (value, grid, rows, state) {
                            return value === 1 ? "正常" : "禁用";
                        }
                    },
                    {name: 'icon', index: 'icon', width: 200, align: "center"}
                ]
            }
        }
    },
    methods: {
        //刷新
        refresh() {
            this.reload = !this.reload;
        },
        //新增
        add() {
            window.parent.activeEvent({
                name: '按钮-新增',
                url: contextPath + '/sysmanager/permission/button-add.html',
                params: {type: 'add'}
            });
        },
        //修改
        modify() {
            // 判断所选行有且仅有一条
            if (!this.checkRowNum()) return;
            var id = this.selected[0];
            window.parent.activeEvent({
                name: '按钮-修改',
                url: contextPath + '/sysmanager/permission/button-add.html',
                params: {type: 'update', id: id}
            });
        },
        //查看
        view() {
            // 判断所选行有且仅有一条
            if (!this.checkRowNum()) return;
            var id = this.selected[0];
            window.parent.activeEvent({
                name: '按钮-查看',
                url: contextPath + '/sysmanager/permission/button-add.html',
                params: {type: 'view', id: id}
            });
        },
        //删除
        del() {
            // 判断所选行有且仅有一条
            if (!this.checkRowNum()) return;
            var id = this.selected[0];
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath + '/button/delButtonById/' + id,
                data: '',
                dataType: "json",
                success: function (res) {
                    if (res.code === This.SUCCESS_CODE) {//成功
                        this.messageTip('info', '删除成功');
                    } else {
                        this.messageTip('error', res.msg);
                    }
                }, error: function (res) {

                }
            });
        },
        //搜索
        search() {
            this.reload = !this.reload;
        },
        // 判断有且仅选中一行
        checkRowNum() {
            if (this.selected.length === 0) {
                this.messageTip('warning', '请选择一条记录!');
                return false;
            } else if (this.selected.length > 1) {
                this.messageTip('warning', '只能对单条数据操作!');
                return false;
            } else {
                return true;
            }
        },
        //提示框
        messageTip(type, message) {
            if (type === 'warning') {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: message
                });
            }
            if (type === 'error') {
                this.$Modal.error({
                    title: "提示",
                    okText: "确定",
                    content: message
                });
            }
            if (type === 'info') {
                this.$Modal.info({
                    title: "提示",
                    okText: "确定",
                    content: message
                });
            }
        }
    }
});