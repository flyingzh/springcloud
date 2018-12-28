var category = new Vue({
    el: '#productLevel',
    data() {
        let This = this;
        return {
            isShow: false,
            isEdit: false,
            reload: false,
            isSave: true,
            isSearchHide: true, //搜索栏
            selected: [],
            openTime: '',
            userName: '',
            isUpdate: false,
            productType: [
                {
                    label: '钻石',
                    value: '1'
                },
                {
                    label: '黄金',
                    value: '2'
                },
                {
                    label: '白银',
                    value: '3'
                },
                {
                    label: '项链',
                    value: '4'
                },
                {
                    label: '金大祥的产品类别',
                    value: '5'
                }
            ],
            status: [
                {
                    label: '有效',
                    value: 1
                },
                {
                    label: '无效',
                    value: 0
                }
            ],
            dataValue:[],
            body: {
                name: '',
                startTime: '',
                endTime: '',
                status: '',
                ktcStatus:0,
            },
            addBody: {
                code: '',
                name: '',
                remark: '',
                status: 1,
                createTime: '',
                createName: ''
            },
            data_config: {
                url: contextPath+'/tmainproductcategory/list',
                colNames: ['主营商品类别代码', '主营商品类别', '有效状态', '备注', '创建人', '创建时间'],
                colModel: [
                    {
                        name: 'code', index: 'code', width: 150, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                This.detailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {name: 'name', index: 'name', width: 180,align: "left", sortable: false},
                    {
                        name: 'status', index: 'status', width: 150, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return value == 1 ? "有效" : "无效";
                        }
                    },
                    {name: 'remark', index: 'remark', width: 150, align: "left", sortable: false},
                    {name: 'createName', index: 'createName', width: 180, align: "left"},
                    {name: 'createTime', index: 'createTime', width: 180, sortable: false, align: "left"}
                ]
            },
        }
    },
    methods: {
        hideSearch() {
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top","")
        },
        search() {
            this.reload = !this.reload;
        },
        changeDate(value) {
            this.body.startTime = value[0]=="" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endTime = value[1]=="" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        clearItem(name, ref) {
            if (this.$refs[ref]) {
                this.$refs[ref].reset();
            }
            this.$nextTick(() => {
                this.body[name] = '';
            })
        },
        clear() {
            // this.$refs.start.date = '';
            // this.$refs.end.date = '';
            this.dataValue =[];
            this.body = {
                name: '',
                startTime: '',
                endTime: '',
                status: '',
                ktcStatus:0,
            }
        },
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        add() {
            this.addBody.createTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
            this.addBody.createName = category.userName;
            this.isShow = true;
        },
        copy() {
            if (this.selected.length !== 1) {
                this.$Modal.info({
                    title: "提示信息",
                    content: "只能对单条数据操作!"
                });
                return;
            }
            var id = this.selected[0];
            if (id) {
                this.queryById(id, false, true);
            }
        },
        update(url,params) {
            $.ajax({
                type: "POST",
                url: url,
                contentType: 'application/json',
                data: JSON.stringify(params),
                dataType: "json",
                success: function (result) {
                    if (result.code === "100100") {
                        category.$Modal.success({
                            title: "提示",
                            content: "保存成功!",
                            okText: "确定",
                            onOk: function () {
                                category.cancel();
                                category.reload = !category.reload;
                            }
                        });
                    } else {
                        category.$Modal.warning({
                            title: "提示",
                            content: result.msg,
                            okText: "确定"
                        });
                    }
                    category.isSave = true;
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            });
        },
        del() {
            if (this.selected.length == 0) {
                this.$Modal.info({
                    title: "提示信息",
                    content: "请选择至少一条记录!"
                });
                return;
            }
            this.$Modal.confirm({
                title: "提示",
                okText: "确定",
                content: "当前数据有可能被引用，会影响数据准确性，确认是否删除？",
                onOk: function () {
                    $.ajax({
                        type: "POST",
                        url: contextPath+"/tmainproductcategory/delete",
                        contentType: 'application/json',
                        data: JSON.stringify(category.selected),
                        dataType: "json",
                        success: function (result) {
                            if (result.code === "100100") {
                               setTimeout(function(){
                                   category.$Modal.success({
                                       title: "提示信息",
                                       content: result.data
                                   });
                                   category.selected = [];
                                   category.reload = !category.reload;
                               },300)
                            } else {
                                setTimeout(function(){
                                    category.$Modal.warning({
                                        title: "提示信息",
                                        content:result.msg
                                    });
                                },300)
                            }
                        },
                        error: function (err) {
                            // layer.alert('数据删除失败', {icon: 0});
                            category.$Modal.warning({
                                title: "提示信息",
                                content:'数据删除失败!'

                            });
                        },
                    });
                }
            });
        },
        modify() {
            if (this.selected.length !== 1) {
                this.$Modal.info({
                    title: "提示信息",
                    okText: "确定",
                    content: "只能对单条数据操作!"
                });
                return
            }
            var id = this.selected[0];
            if (id) {
                this.queryById(id, false, false);
            }
        },
        save() {
            let This = this;
            if (!$('#add-product-category').valid()) {
                return;
            }
            this.isSave = false;
            var params = this.addBody;
            var url =contextPath+"/tmainproductcategory/save";
            if (params.id) {
                url =contextPath+"/tmainproductcategory/update";
            }
            this.update(url,params);
        },
        detailClick(data) {
            var id = data.rows.id;
            if (id) {
                this.queryById(id, true, false);
            }
        },
        queryById(id, isEdit, isCopy) {
            $.ajax({
                type: "POST",
                url: contextPath+"/tmainproductcategory/info/" + id,
                data: {"id": id},
                dataType: "json",
                success: function (result) {
                    if (result.code === "100100") {
                        category.isEdit = isEdit;
                        if (isCopy) {
                            category.addBody.remark = result.data.remark == null ? "" : result.data.remark;
                            category.addBody.status = result.data.status;
                            category.addBody.createTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
                            category.addBody.createName = category.userName;
                        } else {
                            category.isUpdate = true;
                            category.addBody = result.data;
                        }
                        category.isShow = true;
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            });
        },
        cancel() {
            this.addBody = {
                code: '',
                name: '',
                remark: '',
                status: 1,
                createTime: ''
            };
            this.isUpdate = false;
            this.isShow = false;
            this.isEdit = false;
            $("#add-product-category").validate().resetForm();
        },

        initFormValidate() {
            var validateOptions = {
                onfocusout: function (element) {
                    $(element).valid();
                },
                onkeyup: false,
                rules: {
                    code: {
                        isChar: true,
                        required: true,
                        remote: {
                            url: contextPath+"/tmainproductcategory/checkcode",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                id: function () {
                                    return category.addBody.id == undefined ? "" : category.addBody.id;
                                }
                            },
                            dataFilter: function (data) {//判断控制器返回的内容
                                var res = JSON.parse(data);
                                if (res.code === "100100") {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }
                    },
                    name: {
                        required: true,
                        remote: {
                            url: contextPath+"/tmainproductcategory/checkname",
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                id: function () {
                                    return category.addBody.id == undefined ? "" : category.addBody.id;
                                },
                                name: function () {
                                    return category.addBody.name;
                                }
                            },
                            dataFilter: function (data) {//判断控制器返回的内容
                                var res = JSON.parse(data);
                                if (res.code === "100100") {
                                    return true;
                                } else {
                                    return false;
                                }
                            }

                        }
                    }
                },
                messages: {
                    code: {
                        isChar: "请正确输入名称!",
                        required: "请填写编码!",
                        remote: "该编码已存在!"
                    },
                    name: {
                        isChar: "请正确输入名称!",
                        required: "请填写名称!",
                        remote: "该名称已存在!"
                    }
                }
            };
            $("#add-product-category").validate(validateOptions);
        }
    },
    mounted() {
        this.userName = layui.data('user').username;

        this.initFormValidate();
        jQuery.validator.addMethod("isChar", function (value, element) {
            var chrnum = /^([a-zA-Z0-9]+)$/;
            return chrnum.test(value);
        }, "编码格式错误!");
        this.openTime = window.parent.params.openTime;
    },

})