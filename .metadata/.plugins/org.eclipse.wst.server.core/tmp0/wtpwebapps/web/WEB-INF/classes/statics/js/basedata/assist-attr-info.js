var assistAttrVM = new Vue({
    el: '#assist-attr-info',
    data() {
        let This = this;
        return {
            body: {
                code: '',
                name: ''
            },
            assistAttr: {
                name: '',
                status: 1,
                rangeUse: '',
                tBaseAssistAttrValuess: []
            },
            openTime: '',
            selectedRange: [],
            selected: [],
            isShow: false,
            reload: false,
            isEdit: false,
            isUpdate: false,
            isSave: true,
            isCheckedAll: false,
            isSearchHide: true, //搜索栏
            range: [
                {
                    value: 'attr_ranges_gold',
                    label: '金料'
                },
                {
                    value: 'attr_ranges_stone',
                    label: '石料'
                },
                {
                    value: 'attr_ranges_part',
                    label: '配件'
                },
                {
                    value: 'attr_ranges_other',
                    label: '其它'
                }
            ],
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
            data_config: {
                url: contextPath+"/tBaseAssistAttr/list/base?ktcStatus=0",
                colNames: ['编码', '属性名称', '是否有效', '创建人', '创建时间', '最后修改人', '最后修改时间'],//jqGrid的列显示名字
                colModel: [
                    {
                        name: 'code', index: 'code', width: 180, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                This.detailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {name: 'name', index: 'name', width: 180, align: "left"},
                    {
                        name: 'status',
                        index: 'status',
                        width: 180,
                        align: "left",
                        sortable: false,
                        formatter: function (value) {
                            return value == 1 ? "有效" : "无效";
                        }
                    },
                    {name: 'createName', index: 'createName', align: "left", width: 180},
                    {name: 'createTime', index: 'createTime', align: "left", width: 180},
                    {name: 'updateName', index: 'createName', align: "left", width: 180},
                    {name: 'updateTime', index: 'name', align: "left", width: 180}
                ],
            },
        }
    },
    methods: {
        hideSearch() {
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top", "")
        },
        checkValues() {
            var flag = true;
            var values = this.assistAttr.tBaseAssistAttrValuess;
            var chrnum = /^([a-zA-Z0-9]+)$/;
            this.assistAttr.tBaseAssistAttrValuess.forEach((el, i) => {
                if (!el.value) {
                    // layer.alert('属性值第' + (i + 1) + '行值名称不合法', {icon: 0});
                    this.$Modal.info({
                        content:'属性值第' + (i + 1) + '行值名称不合法！'
                    })
                    flag = false;
                    return;
                }
            });
            return flag;
        },
        clickOne(index) {
            var selectContants = this.assistAttr.tBaseAssistAttrValuess[index];
            if (!selectContants.isCheck) {
                selectContants.isCheck = true;
            } else {
                selectContants.isCheck = false;
            }
            this.checkIsAllSelected();
        },
        checkAllValues() {
            if (!this.isCheckedAll) {
                this.assistAttr.tBaseAssistAttrValuess.forEach((el, i) => {
                    el.isCheck = true;
                })
            } else {
                this.assistAttr.tBaseAssistAttrValuess.forEach((el, i) => {
                    el.isCheck = false;
                })
            }
        },
        checkIsAllSelected(){
            let flag = true;
            let arr = this.assistAttr.tBaseAssistAttrValuess;
            if(arr.length){
                arr.forEach((el, i) => {
                    if(!el.isCheck){
                        flag = false;
                    }
                });
            }else{
                flag = false;
            }
            this.isCheckedAll =flag;
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
        addContacts() {
            // 非编辑状态下不能新增行
            if (this.isEdit) {
                return;
            }
            if (!this.checkValues()) {
                return;
            }
            this.assistAttr.tBaseAssistAttrValuess.push(
                {
                    isCheck: false,
                    value: '',
                    code: ''
                }
            );
            this.checkIsAllSelected();
        },
        delContacts() {
            if (this.isEdit) {
                return;
            }
            var arr = [];
            assistAttrVM.assistAttr.tBaseAssistAttrValuess.forEach(function (val, index) {
                if (val.isCheck == undefined || val.isCheck == false) {
                    arr.push(val);
                }
            });
            assistAttrVM.assistAttr.tBaseAssistAttrValuess = arr;
            this.checkIsAllSelected();
        },
        // 清空搜索条件
        clear() {
            this.body = {
                code: '',
                name: ''
            }
        },
        add() {
            this.isShow = true;
        },
        copy() {
            if (this.selected.length !== 1) {
                // layer.alert("只能对单行数据操作!");
                this.$Modal.info({
                    title:'提示',
                    content:'只能对单行数据操作！'
                })
                return;
            }
            var id = this.selected[0];
            if (id) {
                this.queryById(id, false, true);
            }
        },
        update(url, params) {
            if (assistAttrVM.selectedRange) {
                params.rangeUse = assistAttrVM.selectedRange.join(",");
            }
            $.ajax({
                type: "POST",
                url: url,
                data: params,
                contentType: 'application/json',
                data: JSON.stringify(params),
                dataType: "json",
                success: function (result) {
                    if (result.code === "100100") {
                        /*layer.alert('操作成功', {icon: 1,end:function () {
                            assistAttrVM.cancel();
                            assistAttrVM.reload = !assistAttrVM.reload;
                        }});
                        */
                        setTimeout(function(){
                            assistAttrVM.$Modal.success({
                                content:'操作成功！'
                            })
                            assistAttrVM.cancel();
                            assistAttrVM.reload = !assistAttrVM.reload;
                        },300)
                    } else {
                        // layer.alert(result.msg,{icon: 0});
                        assistAttrVM.$Modal.warning({
                            content:result.msg
                        })
                    }
                    assistAttrVM.isSave = true;
                },
                error: function (err) {
                    assistAttrVM.isSave = true;
                    // layer.alert('服务器异常，请重试！', {icon: 0});
                    assistAttrVM.$Modal.warning({
                        content:'服务器异常，请稍后再试！'
                    })
                },
            });
        },
        del() {
            if (this.selected.length == 0) {
                // layer.alert("请选择行!");
                this.$Modal.info({
                    title:'提示信息',
                    content:'请至少选择一条数据操作！'
                })
                return;
            }
            this.$Modal.confirm({
                content:'当前数据有可能被引用，会影响数据准确性，确认是否删除？',
                onOk:() => {
                    $.ajax({
                        type: "POST",
                        url: contextPath+"/tBaseAssistAttr/delete",
                        contentType: 'application/json',
                        data: JSON.stringify(assistAttrVM.selected),
                        dataType: "json",
                        success: function (result) {
                            if (result.code === "100100") {
                                // layer.alert(result.data, {icon: 1});
                                setTimeout(function(){
                                    assistAttrVM.$Modal.success({
                                        content:result.data
                                    })
                                    assistAttrVM.selected = [];
                                    assistAttrVM.reload = !assistAttrVM.reload;
                                },300)
                            } else {
                                // layer.alert(result.msg, {icon: 0});
                                setTimeout(function(){
                                    assistAttrVM.$Modal.warning({
                                        content:result.msg
                                    })
                                },300)
                            }
                        },
                        error: function (err) {
                            // layer.alert('数据删除失败', {icon: 0});
                            assistAttrVM.$Modal.warning({
                                content:'数据删除失败！'
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
                            url: contextPath+"/tBaseAssistAttr/delete",
                            contentType: 'application/json',
                            data: JSON.stringify(assistAttrVM.selected),
                            dataType: "json",
                            success: function (result) {
                                if (result.code === "100100") {
                                    layer.alert(result.data, {icon: 1});
                                    assistAttrVM.selected = [];
                                    assistAttrVM.reload = !assistAttrVM.reload;
                                } else {
                                    layer.alert(result.msg, {icon: 0});
                                }
                            },
                            error: function (err) {
                                layer.alert('数据删除失败', {icon: 0});
                            },
                        });
                    }
                }
            );
            */
        },
        modify() {
            if (this.selected.length !== 1) {
                // layer.alert("只能对单行数据操作!");
                this.$Modal.info({
                    content:'只能对单行数据操作！'
                })
                return;
            }
            var id = this.selected[0];
            if (id) {
                this.queryById(id, false, false);
            }
        },
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        queryById(id, isEdit, isCopy) {
            $.ajax({
                type: "POST",
                url: contextPath+"/tBaseAssistAttr/info/" + id,
                dataType: "json",
                success: function (result) {
                    if (result.code === "100100") {
                        var data = result.data;
                        if (isCopy) {
                            assistAttrVM.assistAttr.rangeUse = data.rangeUse;
                            assistAttrVM.assistAttr.status = data.status;
                        } else {
                            assistAttrVM.assistAttr = data;
                            assistAttrVM.isUpdate = true;
                        }
                        if (assistAttrVM.assistAttr.rangeUse) {
                            assistAttrVM.selectedRange = assistAttrVM.assistAttr.rangeUse.split(",");
                        }
                        assistAttrVM.isEdit = isEdit;
                        assistAttrVM.isShow = true;
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            });
        },
        save() {
            console.log(this.selectedRange);
            if (!$('#attr_form').valid()) {
                return;
            }
            if(this.selectedRange.length == 0){
                this.$Message.info('请选择适用范围！');
                return;
            }
            var params = this.assistAttr;
            if (params.tBaseAssistAttrValuess.length < 1) {
                // layer.alert("请至少添加一条属性值!");
                this.$Modal.warning({
                    content:'请至少添加一条属性值！'
                })
                return;
            }
            if (!this.checkValues()) {
                return;
            }
            this.isSave = false;
            var url = contextPath+"/tBaseAssistAttr/save";
            if (params.id) {
                url = contextPath+"/tBaseAssistAttr/update";
            }
            this.update(url, params);
        },
        detailClick(data) {
            var id = data.rows.id;
            if (id) {
                this.queryById(id, true);
            }
        },
        cancel() {
            this.assistAttr = {
                code: '',
                name: '',
                status: 1,
                rangeUse: '',
                tBaseAssistAttrValuess: []
            };
            this.selectedRange = [];
            this.isUpdate = false;
            this.isShow = false;
            this.isEdit = false;
            this.isCheckedAll = false;
            $("#attr_form").validate().resetForm();
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
                            url: contextPath+"/tBaseAssistAttr/checkName",
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                id: function () {
                                    return assistAttrVM.assistAttr.id == undefined ? "" : assistAttrVM.assistAttr.id;
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
                    rangeUse: {
                        required: true,
                    },
                },
                messages: {
                    name: {
                        required: "请填写名称!",
                        remote: "该属性已存在!"
                    },
                    rangeUse: {
                        required: "请选择使用范围!"
                    }
                },
                errorPlacement: function (error, element) { //指定错误信息位置
                    if (element.is(':radio') || element.is(':checkbox')) {
                        var eid = element.attr('name');
                        error.appendTo(element.parent().parent());
                    } else {
                        error.insertAfter(element);
                    }
                }
            };
            $("#attr_form").validate(validateOptions);
        }
    },
    mounted() {

        this.initFormValidate();
        jQuery.validator.addMethod("isChar", function (value, element) {
            var chrnum = /^([a-zA-Z0-9]+)$/;
            return chrnum.test(value);
        }, "编码格式错误!");
        this.assistAttr.tBaseAssistAttrValuess.forEach(item => {
            this.$set(item, 'isCheck', false)
        });

        this.openTime = window.parent.params.openTime;
    }
})



