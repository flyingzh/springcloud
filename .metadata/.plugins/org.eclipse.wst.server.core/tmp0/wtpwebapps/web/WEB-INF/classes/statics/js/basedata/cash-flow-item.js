var vm = new Vue({
    el: '#cash-flow-item',
    data() {
        let This = this;
        return {
            isShow: false,
            isSearchHide: true,
            reload: false,
            isLook: false,
            isUpdate: false,
            isSave:true,
            openTime: '',
            selectedNodes: [],
            selected: [],
            nodeData: [],
            banks: [],
            setting1: {
                //注意：如果使用如上简单Json数据，以下data.simpleData.enable必须设置为true。
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "parentId",
                        rootPId: -1
                    }
                },
                //callback内定义事件和回调函数，更多事件请参考官方文档。
                callback: {
                    onClick: this.clickEvent,
                }

            },
            body: {
                id: 0,
                code: '',
                status: '',
                grade: 0,
                fullname: '',
                parentId: 0,
                createName: '',
                createTime: '',
                createId: 0,
                updateId: 0,
                updateUser: '',
                updateTime: ''
            },
            searchBody: {
                fullname: '',
                code: '',
                status: ''
            },
            addBody: {
                id: 0,
                parentId: 0,
                grade: 0,
                name: '',
                code: '',
                parentCode: '',
                fullname: '',
                status: '1',
                createTime: '0000',
                createName: 'tom'
            },
            tmpUnit: '',
            tmpCashItem: '',
            state: [
                {
                    value: '1',
                    label: '有效'
                },
                {
                    value: '0',
                    label: '无效'
                },
                // {
                //     value: '',
                //     label: '所有'
                // }
            ],
            data_config: {
                url: contextPath+'/tbasecashflow/list',
                colNames: ['代码', '名称', '全名', '有效状态'],
                colModel: [
                    {
                        name: 'code', index: 'code', width: 90, align: "left",
                        formatter: function (value, grid, rows, state) {
                            value = value ? value :'';
                            var val = value.replace('.', '');
                            val = val.replace('.', '');
                            $(document).off('click', ".detail" + value).on("click", ".detail" + val, function () {
                                This.detailClick({value, grid, rows, state})
                            });
                            let btns = `<a class="detail${val}">${value}</a>`;
                            return btns;
                        }
                    },
                    {name: 'name', index: 'name', width: 220, align: "left"},
                    {name: 'fullname', index: 'fullname', width: 520, align: "left"},
                    {
                        name: 'status', index: 'status', width: 80, align: "left", formatter: function (value) {
                        return value == 1 ? "有效" : "无效";
                    }
                    },
                ]
            },
            status: [
                {
                    value: '1',
                    label: '有效'
                },
                {
                    value: '0',
                    label: '无效'
                }
            ]
        }
    },
    created() {
    },
    methods: {
        clickEvent(event, treeId, treeNode) {
            console.log(treeNode)
            vm.body.code = treeNode.code;
            vm.addBody.parentId = treeNode.id;

            vm.selectedNodes = $.fn.zTree.getZTreeObj("tree").getSelectedNodes();
            if (vm.selectedNodes[0].grade == 1) {
                vm.body.code = '';
            }
            this.search();
        },
        search() {
            this.reload = !this.reload;
        },
        cancel() {
            this.isShow = false;
            //清空地址绑定
            this.addBody.id = 0;
            this.addBody.name = '';
            this.addBody.code = '';
            this.addBody.fullname = '';
            this.isLook = false;
            vm.isUpdate = false;
            $("form").validate().resetForm();
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
            //清空地址绑定
            this.body.code = '';
            this.body.fullname = '';
            this.body.status = '';
            this.search();
        },
        add() {
            if (vm.selectedNodes.length === 0) {
                this.$Modal.info({
                    content:'请选择项目!'
                })
                return false;
            }
            if (vm.selectedNodes[0].grade != 3) {
                this.$Modal.info({
                    content:'只能对三级项目进行操作!'
                })
                return false;
            }
            vm.addBody.parentCode = vm.selectedNodes[0].code + '.';
            vm.addBody.createTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
            vm.addBody.createName = layui.data('user').username;
            this.isShow = true;
        },
        del() {
            console.log(this.selected)
            if (this.selected.length == 0) {
                this.$Modal.info({
                    content:'请选择要删除的行!'
                })
                return;
            }

            //查询是否是4级项目
            $.ajax({
                type: "POST",
                url: contextPath+"/tbasecashflow/queryGrade",
                contentType: 'application/json',
                dataType: "json",
                data: JSON.stringify(vm.selected),
                success: function (data) {
                    console.log(data)
                    if (data.data.length === vm.selected.length) {
                        vm.$Modal.confirm({
                            title:'提示信息',
                            content:'当前数据有可能被引用，会影响数据准确性，确认是否删除？',
                            onOk:() => {
                               $.ajax({
                                    type: "POST",
                                    url: contextPath+"/tbasecashflow/delete",
                                    contentType: 'application/json',
                                    data: JSON.stringify(vm.selected),
                                    dataType: "json",
                                    success: function (result) {
                                        if (result.code == "100100") {
                                            setTimeout(function(){
                                                vm.$Modal.success({
                                                    title:'提示信息',
                                                    content:result.data
                                                })
                                                vm.selected = [];
                                                vm.search();
                                            },300)
                                        } else {
                                            setTimeout(function(){
                                                vm.$Modal.warning({
                                                    title:'提示信息',
                                                    content:result.msg
                                                })
                                            },300)
                                        }
                                    },
                                    error: function (err) {
                                        vm.$Modal.warning({
                                            title:'提示信息',
                                            content:'服务器出错'
                                        })
                                        // layer.alert('服务器出错', {icon: 0});
                                    },
                                 });
                            }
                        })
                        /*
                        //删除项目
                        layer.confirm('当前数据有可能被引用，会影响数据准确性，确认是否删除？', {
                                btn: ['确认', '取消'], btn1: function () {
                                    $.ajax({
                                        type: "POST",
                                        url: contextPath+"/tbasecashflow/delete",
                                        contentType: 'application/json',
                                        data: JSON.stringify(vm.selected),
                                        dataType: "json",
                                        success: function (result) {
                                            if (result.code == "100100") {
                                                vm.$Modal.success({
                                                    title:'提示信息',
                                                    content:result.data
                                                })
                                                // layer.alert(result.data, {icon: 1});
                                                vm.selected = [];
                                                vm.search();
                                            } else {
                                                vm.$Modal.error({
                                                    title:'提示信息',
                                                    content:result.msg
                                                })
                                            }
                                        },
                                        error: function (err) {
                                            vm.$Modal.error({
                                                title:'提示信息',
                                                content:'服务器出错'
                                            })
                                            // layer.alert('服务器出错', {icon: 0});
                                        },
                                    });
                                }
                            }
                        );
                        */

                    } else {
                        vm.$Modal.warning({
                            title:'提示信息',
                            content:'只能对三级项目进行删除'
                        })
                        // layer.alert("只能对三级项目进行删除")
                    }
                },
                error: function (err) {
                    vm.$Modal.warning({
                        title:'提示信息',
                        content:'服务器出错！'
                    })
                },
            });
        },
        modify() {
            if (this.selected.length !== 1) {
                this.$Modal.info({
                    content:'修改只能对单条数据进行操作!'
                })
                return;
            }
            //查询是否是4级项目
            $.ajax({
                type: "POST",
                url: contextPath+"/tbasecashflow/queryGrade",
                contentType: 'application/json',
                dataType: "json",
                data: JSON.stringify(vm.selected),
                success: function (data) {
                    if (data.data.length === vm.selected.length) {
                        vm.info(data.data[0].id);
                    } else {
                        // layer.alert("只能对三级项目进行修改")
                        vm.$Modal.warning({
                            title:'提示信息',
                            content:'只能对三级项目进行删除'
                        })
                    }
                },
                error: function (err) {
                    vm.$Modal.warning({
                        title:'提示信息',
                        content:'服务器出错'
                    })
                },

            });
        },
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        detailClick(data) {
            var id = data.rows.id;
            if (id) {
                vm.isLook = true;
                this.info(id);
            }
        },
        info(id) {
            if (id) {
                $.ajax({
                    type: "POST",
                    url: contextPath+"/tbasecashflow/info/" + id,
                    contentType: 'application/json',
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        if (data.code === "100100") {
                            vm.addBody = data.data;
                            var arr = data.data.code.split('.');
                            vm.addBody.parentCode = arr[0].concat('.', arr[1], '.');
                            vm.addBody.code = arr[2];
                            vm.isUpdate = true;
                            vm.isShow = true;
                        } else {
                            vm.$Modal.warning({
                                title:'提示信息',
                                content:data.message ? data.message : data.msg
                            })
                            // layer.alert(data.message ? data.message : data.msg);//没有弹出对话框
                            return false;
                        }
                    },
                    error: function (err) {
                        vm.$Modal.warning({
                            title:'提示信息',
                            content:"服务器出错"
                        })
                    },
                });
            }
        },
        save() {
            let url = contextPath+"/tbasecashflow/save";
            if (this.addBody.id) {
                url =  contextPath+"/tbasecashflow/update";
            }
            vm.addBody.grade = 4;
            vm.addBody.code = vm.addBody.parentCode + vm.addBody.code;
            let This = this;
            if ($('#addForm').valid()) {
                this.isSave = false;
                $.ajax({
                    type: "POST",
                    url: url,
                    contentType: 'application/json',
                    data: JSON.stringify(this.addBody),
                    dataType: "json",
                    success: function (result) {
                        console.log(result)
                        if (result.code === "100100") {
                            vm.$Modal.success({
                                title:'提示信息',
                                content:"保存成功！",
                                onOk: () => {
                                    vm.cancel();
                                    vm.search();
                                }
                            })
                            // layer.alert(result.msg, {icon: 1,end: function () {
                            //     vm.cancel();
                            //     vm.search();
                            // }});


                        } else {
                            vm.codeSplit();
                            vm.$Modal.warning({
                                title:'提示信息',
                                content:result.msg || '系统错误！'
                            })
                        }
                        vm.isSave = true;
                    },
                    error: function (err) {
                        vm.codeSplit();
                        vm.$Modal.warning({
                            title:'提示信息',
                            content:"服务器出错"
                        })
                    },
                });
            } else {
                vm.codeSplit();
                vm.$Modal.warning({
                    title:'提示信息',
                    content:"请填写必填项信息！"
                })

            }
        },
        codeSplit() {
            var arr = vm.addBody.code.split('.');
            vm.addBody.code = arr[2];
        },
        hideSearch() {
            this.isHide = !this.isHide;
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top", "")
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
                        maxlength: 100,
                        remote: {
                            url: contextPath+"/tbasecashflow/queryForValidate",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                id: function () {
                                    return vm.addBody.id;
                                },
                                parentCode: function () {
                                    return vm.addBody.parentCode;
                                }
                            },
                            dataFilter: function (data, type) {//判断控制器返回的内容
                                console.log(data)
                                var res = JSON.parse(data);
                                if (res.code === "100100") {
                                    return true;
                                } else {
                                    return false;
                                }
                            }

                        }
                    },
                    fullname: {
                        remote: {
                            url: contextPath+"/tbasecashflow/queryForValidate",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                id: function () {
                                    return vm.addBody.id;
                                }
                            },
                            dataFilter: function (data, type) {//判断控制器返回的内容
                                var res = JSON.parse(data);
                                if (res.code === "100100") {
                                    return true;
                                } else {
                                    return false;
                                }
                            }

                        }
                    },
                },
                messages: {
                    code: {
                        required: "请填写编码!",
                        remote: "该编码已存在!",
                        maxlength: "编码最大长度为100！",
                    },
                    fullname: {
                        //required: "请填写名称!",
                        remote: "该全名已存在!",
                    },
                }
            };
            $("#addForm").validate(validateOptions);
        }
    },
    mounted() {
        let _this = this;
        $.ajax({
            url: contextPath+"/tbasecashflow/listAll",
            type: "POST",
            datatype: "json",
            success: function (data) {
                console.log(data);
                var arr = data.data;
                var datas = [];
                var y = 0;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].grade < 4) {
                        datas[y] = arr[i];
                        y++;
                    }
                }
                _this.banks = datas;
                _this.$refs.my_tree.nodeData = _this.banks;
                _this.$refs.my_tree.loadData();
            }
        });

        this.initFormValidate();
        jQuery.validator.addMethod("isChar", function (value, element) {
            var chrnum = /^([a-zA-Z0-9]+)$/;
            return chrnum.test(value);
        }, "编码格式错误!");
        this.openTime = window.parent.params.openTime;
    }

})