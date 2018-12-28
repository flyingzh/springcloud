let ButtonAddVM = new Vue({
    el: "#button-add",
    data() {
        let This = this;
        return {
            isShow: false,
            reload: false,
            selected: [],
            operType: '',
            SUCCESS_CODE: '100100',
            addButton: {
                id: '',
                name: '',
                iCon: '',
                permission: '',
                status: '',
                remark: ''
            }
        }
    },
    methods: {
        //保存
        save() {
            var params = this.addButton;
            if (!$('form').valid()) {
                return;
            }
            if ($.isEmptyObject(String(params.id)) && this.operType === 'add') {
                this.saveButton(params);
            } else {
                this.updateButton(params);
            }
        },
        saveButton(params) {
            let This = this;
            $.ajax({
                url: contextPath + '/button/add',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(params),
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    if (res.code === This.SUCCESS_CODE) {//成功
                        This.messageTip("info", "添加按钮成功");
                    } else {
                        This.messageTip("info", res.msg);
                    }
                },
                error: function (res) {

                }
            });
        },
        updateButton(params) {
            let This = this;
            $.ajax({
                url: contextPath + '/button/updateButton',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(params),
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    if (res.code === This.SUCCESS_CODE) {//成功
                        This.messageTip("info", "添加按钮成功");
                    } else {
                        This.messageTip("info", res.msg);
                    }
                },
                error: function (res) {

                }
            });
        },
        getButtonInfo(id) {
            let This = this;
            $.ajax({
                url: contextPath + '/button/viewButtonInfo?id=' + id,
                type: 'POST',
                dataType: 'json',
                data: '',
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    if (res.code === This.SUCCESS_CODE) {
                        var button = res.data;
                        This.addButton = button;
                    } else {

                    }

                }, error: function () {

                }
            });
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
        },
        //参数验证
        initFormValidate() {
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
            $("#form").validate(validateOptions);
        }
    },

    mounted() {
        let param = window.parent.params.params;
        var type = param.type;
        this.operType = type;
        if (type === "add") {

        }
        //修改与查看时获取用户信息
        if (type === "update" || type === "view") {
            var id = param.id;
            this.getButtonInfo(id);
        }
        this.initFormValidate();
    }
});