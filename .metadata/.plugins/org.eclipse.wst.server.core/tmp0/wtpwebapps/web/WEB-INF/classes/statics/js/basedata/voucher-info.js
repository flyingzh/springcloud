var voucherVm = new Vue({
    el: '#voucher-info',
    data() {
        let This = this;
        return {
            body: {
                name: '',
                status: ''
            },
            voucher: {
                name: '',
                status: 1
            },
            selected: [],
            isShow: false,
            reload: false,
            isEdit: false,
            isSave: true,
            isSearchHide: true, //搜索栏
            openTime: '',
            status: [
                {
                    value: 1,
                    label: '有效'
                },
                {
                    value: 0,
                    label: '无效'
                }
            ],
            statusNum: 0,
            voucherName: '',
            nodeData: [
                { id: 1, pId: 0, name: "1001 库存现金", open: true },//一级科目，默认展开
                { id: 11, pId: 1, name: "100101 现金" },
                { id: 12, pId: 1, name: "100102 库存外币" },
                { id: 2, pId: 0, name: "1002 银行存款", open: true },//一级科目
                { id: 21, pId: 2, name: "100201 建行" },//二级科目
                { id: 22, pId: 2, name: "100202 中行" },//二级科目
                { id: 23, pId: 2, name: "100203 测试辅助账科目", open: true },//二级科目，默认展开
                { id: 231, pId: 23, name: "10020300001 奉公守法" },//三级科目
                { id: 232, pId: 23, name: "10020300002 勤俭节约" },
                { id: 24, pId: 2, name: "100204 项目辅助账" },
                { id: 25, pId: 2, name: "100205 农行" },
                { id: 3, pId: 0, name: "1012 其他货币资金" },
                { id: 4, pId: 0, name: "1101 短期投资", open: true },
                { id: 41, pId: 4, name: "110101 基金" },
                { id: 42, pId: 4, name: "110102 股票" },
                { id: 43, pId: 4, name: "110103 债券" },
                { id: 44, pId: 4, name: "110104 其他" },
                { id: 5, pId: 0, name: "1121 应收票据" },
                { id: 6, pId: 0, name: "1122 应收账款" },
                { id: 7, pId: 0, name: "1123 预付账款" },
                { id: 8, pId: 0, name: "1131 应收股利" },
                { id: 9, pId: 0, name: "1132 应收利息" },
                { id: 10, pId: 0, name: "1135 辅助核算验证" },
                { id: 11, pId: 0, name: "1221 其他应收款", open: true },
                { id: 111, pId: 11, name: "122101 社保" },
                { id: 112, pId: 11, name: "122102 公积金" }
            ],
            //setting:配置相关
            setting: {
                //注意：如果使用如上简单Json数据，以下data.simpleData.enable必须设置为true。
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                //callback内定义事件和回调函数，更多事件请参考官方文档。
                callback: {
                    onClick: 'clickEvent',
                }
            },
            tmpSubject: '',
            subject: {
                sub1: '',
                sub2: '',
                sub3: '',
                sub4: '',
                sub5: '',
                sub6: ''
            },
            data_config: {
                url: contextPath + '/tbasevoucherdata/list',
                colNames: ['凭证字', '有效状态', '创建人', '创建时间'],//jqGrid的列显示名字
                colModel: [ //jqGrid每一列的配置信息。包括名字，索引，宽度,对齐方式.....
                    {
                        name: 'name', index: 'name', width: 300, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                This.detailClick({ value, grid, rows, state })
                            });
                            let myName = `<a class="detail${value}">${value}</a>`;
                            return myName;
                        }
                    },
                    {
                        name: 'status',
                        index: 'status',
                        width: 300,
                        align: "left",
                        sortable: false,
                        formatter: function (value) {
                            return value == 1 ? "有效" : "无效";
                        }
                    },
                    { name: 'createName', index: 'createName', width: 300, align: "left", sortable: false },
                    { name: 'createTime', index: 'createTime', width: 300, align: "left", sortable: false }
                ],
            },
        }
    },
    methods: {
        hideSearch() {
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top", "")
        },
        clickEvent(event, treeId, treeNode) {
            //可以调用ztree原生方法，更多方法请参考官方文档。
            let selnode = this.$ztree.getSelectedNodes();
            if (treeNode.children === undefined) {
                this.tmpSubject = selnode[0].name;
            }
        },
        search() {
            this.reload = !this.reload;
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
            this.body = {
                name: '',
                status: ''
            }
        },
        add() {
            this.isShow = true;
        },
        copy() {
            if (this.selected.length !== 1) {
                this.$Modal.info({
                    titel: '提示信息',
                    content: '只能对单行数据操作！'
                })
                // layer.alert("只能对单行数据操作!");
                return;
            }
            var id = this.selected[0];
            if (id) {
                this.queryById(id, false, true);
            }
        },
        update(url, params) {
            $.ajax({
                type: "POST",
                url: url,
                data: params,
                contentType: 'application/json',
                data: JSON.stringify(params),
                dataType: "json",
                success: function (result) {
                    if (result.code === "100100") {
                        voucherVm.$Modal.success({
                            titel: '提示信息',
                            content: '操作成功！'
                        })
                        voucherVm.cancel();
                        voucherVm.reload = !voucherVm.reload;
                        // layer.alert("操作成功", {
                        //     icon: 1, end: function () {
                        //         voucherVm.cancel();
                        //         voucherVm.reload = !voucherVm.reload;
                        //     }
                        // });
                    } else {
                        voucherVm.$Modal.warning({
                            titel: '提示信息',
                            content: result.msg
                        })
                        // layer.alert(result.msg, {icon: 0});
                    }
                    voucherVm.isSave = true;
                },
                error: function (err) {
                    voucherVm.$Modal.warning({
                        titel: '提示信息',
                        content: '服务器出错！'
                    })
                    // console.log("服务器出错");
                },
            });
        },
        del() {
            this.isShow = false;
            if (this.selected.length == 0) {
                this.$Modal.info({
                    titel: '提示信息',
                    content: '请选择行！'
                })
                // layer.alert("请选择行!");
                return;
            }
            this.$Modal.confirm({
                content:'当前数据有可能被引用，会影响数据准确性，确认是否删除？',
                onOk:() => {
                    $.ajax({
                        type: "POST",
                        url: contextPath + "/tbasevoucherdata/delete",
                        contentType: 'application/json',
                        data: JSON.stringify(voucherVm.selected),
                        dataType: "json",
                        success: function (result) {
                            if (result.code === "100100") {
                                // layer.alert(result.data, { icon: 1 });
                                setTimeout(function(){
                                    voucherVm.$Modal.success({
                                        content:result.data
                                    })
                                    voucherVm.selected = [];
                                    voucherVm.reload = !voucherVm.reload;
                                },300)
                            } else {
                                // layer.alert(result.msg, { icon: 0 });
                                setTimeout(function(){
                                    voucherVm.$Modal.success({
                                        content:result.msg
                                    })
                                },300)
                            }
                        },
                        error: function (err) {
                            // layer.alert('数据删除失败', { icon: 0 });
                            voucherVm.$Modal.warning({
                                content:'数据删除失败'
                            })
                        },
                    });
                }
            })
            /*
            layer.confirm('当前数据有可能被引用，会影响数据准确性，确认是否删除？', {
                btn: ['确认', '取消'], btn1: function () {
                    $.ajax({
                        type: "POST",
                        url: contextPath + "/tbasevoucherdata/delete",
                        contentType: 'application/json',
                        data: JSON.stringify(voucherVm.selected),
                        dataType: "json",
                        success: function (result) {
                            if (result.code === "100100") {
                                layer.alert(result.data, { icon: 1 });
                                voucherVm.selected = [];
                                voucherVm.reload = !voucherVm.reload;
                            } else {
                                layer.alert(result.msg, { icon: 0 });
                            }
                        },
                        error: function (err) {
                            layer.alert('数据删除失败', { icon: 0 });
                        },
                    });
                }
            }
            );
            */
        },
        modify() {
            if (this.selected.length !== 1) {
                this.$Modal.info({
                    titel: '提示信息',
                    content: '只能对单行数据操作！'
                })
                // layer.alert("只能对单条数据进行操作!");
                return;
            }
            var id = this.selected[0];
            if (id) {
                voucherVm.queryById(id, false);
            }
        },
        exit() {
            window.parent.closeCurrentTab({ exit: true, openTime: this.openTime });
        },
        queryById(id, isEdit, isCopy) {
            if (id) {
                $.ajax({
                    type: "POST",
                    url: contextPath + "/tbasevoucherdata/info/" + id,
                    dataType: "json",
                    success: function (result) {
                        if (result.code === "100100") {
                            voucherVm.isEdit = isEdit;
                            if (isCopy) {
                                voucherVm.voucher.status = result.data.status;
                            } else {
                                voucherVm.voucher = result.data;
                            }
                            voucherVm.isShow = true;
                        }
                    },
                    error: function (err) {
                        // layer.alert("服务器出错!");
                        voucherVm.$Modal.warning({
                            titel: '提示信息',
                            content: '服务器出错，请稍后再试！'
                        })
                    },
                });
            }
        },
        save() {
            if (!$('#addVoucherForm').valid()) {
                return;
            }
            this.isSave = false;
            var params = this.voucher;
            var url = contextPath + "/tbasevoucherdata/save";
            if (params.id) {
                url = contextPath + "/tbasevoucherdata/update";
            }
            this.update(url, params);
        },
        detailClick(data) {
            var id = data.rows.id;
            if (id) {
                voucherVm.queryById(id, true);
            }
        },
        cancel() {
            this.voucher = {
                name: '',
                status: 1
            };
            this.isShow = false;
            this.isEdit = false;
            $("#addVoucherForm").validate().resetForm();
        },
        initFormValidate() {
            var validateOptions = {
                onfocusout: function (element) {
                    $(element).valid();
                },
                onkeyup: false,
                rules: {
                    name: {
                        required: true,
                        remote: {
                            url: contextPath + "/tbasevoucherdata/checkname",
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                id: function () {
                                    return voucherVm.voucher.id == undefined ? "" : voucherVm.voucher.id;
                                },
                                name: function () {
                                    return voucherVm.voucher.name;
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
                    name: {
                        required: "请填写名称!",
                        remote: "该凭证字已存在!"
                    }
                }
            };
            $("#addVoucherForm").validate(validateOptions);
        }
    },
    mounted() {

        this.initFormValidate();
        jQuery.validator.addMethod("isChar", function (value, element) {
            var chrnum = /^([a-zA-Z0-9]+)$/;
            return chrnum.test(value);
        }, "编码格式错误!");
        this.openTime = window.parent.params.openTime;
    }
})