var ButtonVM = new Vue({
    el: "#button-index",
    data() {
        let This = this;
        return {
            isHideSearch:false,
            isShow: false,
            isEdit: false,
            reload: false,
            status: [],
            selected: [],
            Constant: {
                SUCCESS_CODE: '100100',
                Is_View: '0'
            },
            body: {
                name: ''
            },
            addButton: {
                id: '',
                name: '',
                iCon: '',
                permission: '',
                status: '',
                remark: ''
            },
            button_list: {
                url: contextPath+'/button/buttonListPage',
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
    methods: {//方法区
        add() {//点击'新增',显示新增页
            this.isShow = true;
        },
        search() {//搜索
            this.reload = !this.reload;
        },
        cancel() {//点击'退出',隐藏新增页显示列表页
            this.isShow = false;
            this.isEdit = false;
            this.clearAddButton();
        },
        save() {//点击'保存'
            if (this.isEdit) {//查看状态下,不能保存
                return;
            }
            var params = this.addButton;
            if (!$('form').valid()) {
                return;
            }
            if ($.isEmptyObject(String(params.id))) {
                this.saveButton(params);
            } else {
                this.updateButton(params);
            }
        },
        saveButton(params) {//新增时,点击保存,调用后台方法
            $.ajax({
                url: contextPath+'/button/add',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(params),
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    if (res.code === ButtonVM.Constant.SUCCESS_CODE) {//成功
                        layer.alert("添加按钮成功");
                        //添加成功后初始化,清空输入内容
                        ButtonVM.clearAddButton();
                    } else {
                        //输出错误提示
                        layer.alert(res.msg);
                    }

                },
                error: function (res) {

                }
            });
        },
        modify() {//点击'修改'按钮
            if (this.selected.length === 0) {
                layer.alert("请选择一条记录进行修改");
                return;
            }
            if (this.selected.length > 1) {
                layer.alert("只能选择一条记录进行修改");
                return;
            }
            var id = this.selected[0];
            if (!$.isEmptyObject(id) && id !== undefined) {
                this.viewButton(id, "1");
            }
        },
        updateButton(params) {//修改按钮信息
            $.ajax({
                url: contextPath+'/button/updateButton',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(params),
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    if (res.code === ButtonVM.Constant.SUCCESS_CODE) {//成功
                        layer.alert("修改按钮成功");
                        //添加成功后初始化,清空输入内容
                    } else {
                        //输出错误提示
                        layer.alert(res.msg);
                    }

                },
                error: function (res) {

                }
            });
        },
        view() {//点击'查看'按钮
            if (this.selected.length === 0) {
                layer.alert("请选择一条记录进行查看");
                return;
            }
            if (this.selected.length > 1) {
                layer.alert("只能选择一条记录进行查看");
                return;
            }
            var id = this.selected[0];
            if (!$.isEmptyObject(id) && id !== undefined) {
                this.viewButton(id, "0");
            }
        },
        viewButton(id, editStatus) {//查看按钮信息
            $.ajax({
                url: contextPath+'/button/viewButtonInfo?id=' + id,
                type: 'POST',
                dataType: 'json',
                data: '',
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    if (res.code === ButtonVM.Constant.SUCCESS_CODE) {
                        ButtonVM.isShow = true;
                        //输入框禁用
                        if (editStatus === ButtonVM.Constant.Is_View) {
                            ButtonVM.isEdit = true;
                        }
                        var button = res.data;
                        //输入框赋值
                        ButtonVM.addButton = {
                            id: button.id,
                            name: button.name,
                            permission: button.permission,
                            iCon: button.iCon,
                            remark: button.remark
                        };
                    }

                }, error: function () {

                }
            });
        },
        del() {//点击'删除'按钮
            if (this.selected.length === 0) {
                layer.alert("请选择一条记录进行删除");
                return;
            }
            if (this.selected.length > 1) {
                layer.alert("只能选择一条记录进行删除");
                return;
            }
            var id = this.selected[0];
            $.ajax({
                type: "POST",
                url: contextPath+'/button/delButtonById/' + id,
                data: '',
                dataType: "json",
                success: function (res) {
                    if (res.code === ButtonVM.Constant.SUCCESS_CODE) {//成功
                        layer.alert("删除按钮成功");
                        ButtonVM.reload = !ButtonVM.reload;
                    } else {
                        //输出错误提示
                        layer.alert(res.msg);
                    }
                }, error: function (res) {

                }
            });
        },
        clearAddButton() {//清空输入框内容
            ButtonVM.addButton = {
                id: '',
                name: '',
                permission: '',
                iCon: '',
                remark: ''
            };
        },
        initFormValidate() {//参数验证
            var validateOptions = {
                onfocusout: function (element) {
                    $(element).valid();
                },
                onkeyup: false,
                rules: {
                    menu: {
                        required: true,
                    },
                    menutitle: {
                        required: true,
                    },
                    menuimage: {
                        required: true,
                    },

                },
                messages: {
                    menu: {
                        required: '请输入按钮名称'
                    },
                    menutitle: {
                        required: '请输入按钮标识'
                    },
                    menuimage: {
                        required: '请输入按钮图标'
                    },

                }
            };
            //return validateOptions;
            $("#form").validate(validateOptions);
        },
    },
    mounted() {
        this.initFormValidate();
    }
});