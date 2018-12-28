let UserListVM = new Vue({
    el: "#user-list",
    data() {
        let This = this;
        return {
            isShow: false,
            reload: false,
            selected: [],
            body: {username: "", loginName: "", email: "", empCode: "", status: ""},
            data_user_list: {
                url: contextPath + "/user/list",
                colNames: ["id", "账号", "用户名", "员工编号", "邮箱账号", "状态"],
                colModel: [{name: 'id', hidden: true}, {
                    name: "loginName",
                    index: "loginName",
                    width: 200,
                    align: "center"
                }, {name: "username", index: "username", width: 200, align: "center"}, {
                    name: "userCode",
                    index: "userCode",
                    width: 200,
                    align: "center"
                }, {name: "email", index: "email", width: 200, align: "center"}, {
                    name: "status",
                    index: "status",
                    width: 200,
                    align: "center",
                    formatter: function (e, r, t, n) {
                        return 1 == e ? "正常" : "禁用"
                    }
                }],
                multiselect: true,
                multiboxonly: true,
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
                name: '用户-新增',
                url: contextPath + '/sysmanager/permission/user-add.html',
                params: {type: 'add'}
            });
        },
        //修改
        modify() {
            // 判断所选行有且仅有一条
            if (!this.checkRowNum()) return;
            let id = this.selected[0];
            window.parent.activeEvent({
                name: '用户-修改',
                url: contextPath + '/sysmanager/permission/user-add.html',
                params: {type: 'update', id: id}
            });

        },
        //查看
        view() {
            // 判断所选行有且仅有一条
            if (!this.checkRowNum()) return;
            let id = this.selected[0];
            window.parent.activeEvent({
                name: '用户-查看',
                url: contextPath + '/sysmanager/permission/user-add.html',
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
                type: 'POST',
                url: contextPath + '/user/delete',
                contentType: 'application/json',
                data: id,
                dataType: '',
                success: function (res) {
                    if (res.code === This.SUCCESS_CODE) {
                        This.messageTip('info', '删除用户成功');
                        This.reload = !This.reload;
                    } else {
                        This.messageTip('error', res.msg);
                    }
                },
                error: function (res) {

                }
            });
        },
        updatePassword() {
            // 判断所选行有且仅有一条
            if (!this.checkRowNum()) return;
            let id = this.selected[0];
            window.parent.activeEvent({
                name: '用户-修改密码',
                url: contextPath + '/sysmanager/permission/user-add.html',
                params: {type: 'updatepassword', id: id}
            });

        },
        //搜索
        search() {
            this.reload = !this.reload;
        },
        //清空
        clear() {
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
        }
    }
});