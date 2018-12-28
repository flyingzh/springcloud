load_group = function () {
    $.ajax({
        url: contextPath + "/tbaserepertorypositiongroup/list",
        type: "POST",
        datatype: "JSON",
        success: function (data) {
            vm.groups = data.data;
        }
    });
};

var vm = new Vue({
    el: '#unit-info',
    data() {
        let This = this;
        return {
            username: "",
            title: "",
            //判断新增、修改、查看详细信息 1新增 2修改 3查看
            action: 0,
            positionInfo: {
                code: '',
                name: '',

            },
            groupId: 0,
            groupName: '',
            groups: [],
            //控制显示隐藏
            isEdit: false,
            isView: false,
            reload: false,
            isShowAddUnitGroup: false,
            isShowModifyUnitGroup: false,
            activeStyle: '',
            selected: [],
            body: {
                name: '',
                code: '',
                status: '',
                groupIds: ''
            },
            belongs: [
                {
                    label: "华东区普通仓1",
                    value: 1
                },
                {
                    label: "华东区普通仓2",
                    value: 2
                },
                {
                    label: "华南区普通仓1",
                    value: 3
                }
            ],
            repertoryPosition: {
                code: '',
                name: '',
                groupId: '',
                groupName: '',
                remark: '',
                createTime: '',
                updateTime: '',
                createName: '',
                updateName: ''
            },
            data_config: {
                url: contextPath + '/tbaserepertoryposition/list',
                colNames: ['id', '库位编码', '库位名称', '所属库位组id', '所属库位组', '备注', '创建人', '创建时间', '最新修改人', '最新修改时间'],
                colModel: [
                    // {
                    //     name: 'id', index: 'id', width: 200, align: "center",
                    //     formatter: function (value, grid, rows, state) {
                    //         $(document).on("click", ".detail" + value, function () {
                    //             This.detailClick({value, grid, rows, state})
                    //         });
                    //         let btns = `<button type="primary" class="detail${value} ivu-btn ivu-btn-primary">查看</button>`;
                    //         return btns
                    //     }
                    // },
                    { name: 'id', index: 'id', width: 100, align: "center", hidden: true },
                    {
                        name: 'code', index: 'code', width: 210, align: "center",
                        formatter: function (value, grid, rows, state) {
                            let cssClass = ".detail" + value;
                            $(document).off('click', cssClass).on('click', cssClass, function () {
                                This.detailClick({ value, grid, rows, state })
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            console.log(value, grid, rows, state)
                            return myCode;
                        }
                    },
                    // {
                    //     name: 'code', index: 'code', width: 90, align: "center", formatter: function (value) {
                    //         return value;
                    //     }
                    // },
                    { name: 'name', index: 'name', width: 100, align: "center" },
                    { name: 'groupId', index: 'groupId', width: 80, align: "center", hidden: true },
                    { name: 'groupName', index: 'groupName', width: 80, align: "center" },
                    { name: 'remark', index: 'remark', width: 80, align: "center" },
                    { name: 'createName', index: 'createName', width: 80, align: "center" },
                    { name: 'createTime', index: 'createTime', width: 150, sortable: false },
                    { name: 'updateName', index: 'updateName', width: 80, align: "center" },
                    { name: 'updateTime', index: 'updateTime', width: 150, sortable: false, align: "center" }
                ],
                shrinkToFit: false
            },
            nodeData: [
                { id: 1, pId: 0, name: "库位组1", open: true },
                { id: 11, pId: 1, name: "库位1" },
                { id: 12, pId: 1, name: "库位2" },
                { id: 2, pId: 0, name: "库位组2", open: true },
                { id: 21, pId: 2, name: "库位3" },
                { id: 22, pId: 2, name: "库位4" },
            ],
            //setting:配置相关
            setting1: {
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
            tmpWhouse: '',
            addRepertoryGroup: '',
            modifyRepertoryGroup: '',
            showModal: false,
            selectOrginId: [],
            isSearchHide: true,
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '组织名称',
                    key: 'orgName'
                }
            ],
            colContent: [],
            organId: 0
        }
    },
    created() {

    },
    methods: {
        get_user() {
            let That = this;
            $.ajax({
                url: contextPath + "/tbaserepertorypositiongroup/getusername",
                type: "POST",
                datatype: "JSON",
                success: function (data) {
                    That.username = data.data;
                }
            });
        },

        load_group() {
            $.ajax({
                url: contextPath + "/tbaserepertorypositiongroup/list",
                type: "POST",
                datatype: "JSON",
                success: function (data) {
                    vm.groups = data.data;
                },
            });
        },
        add_click() {
            vm.title = "新增库位";
            var rq = new Date();
            var year = rq.getFullYear();
            var month = rq.getMonth() + 1;
            var day = rq.getDate();
            var hours = rq.getHours();
            var minutes = rq.getMinutes();
            var seconds = rq.getSeconds();
            var formatTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
            vm.repertoryPosition.createTime = formatTime;
            vm.repertoryPosition.updateTime = formatTime;
            if (vm.groupId === 0) {
                this.$Modal.info({
                    content: '请选择库位组'
                })
                return false;
            }
            vm.action = 1;
            this.repertoryPosition.groupId = vm.groupId;
            this.isEdit = true;
            let pId = vm.groupId;
            //清空地址绑定
            this.areaInit = {
                isInit: false,
                province: '',
                city: '',
                county: '',
                detail: '',
                disabled: false
            }
            $.ajax({
                url: contextPath + "/tbaserepertorypositiongroup/list",
                type: "POST",
                dataType: "JSON",
                success: function (data) {
                    vm.groups = data.data;
                }

            });

        },
        save() {
            vm.repertoryPosition.code = '';
            vm.repertoryPosition.name = '';
            vm.repertoryPosition.groupId = '';
            vm.repertoryPosition.remark = '';
            vm.repertoryPosition.createName = '';
            vm.repertoryPosition.createTime = '';
            vm.repertoryPosition.updateName = '';
            vm.repertoryPosition.updateTime = '';
            if (vm.action == 1 || vm.action == 4) {
                if ($('form').valid()) {
                    var formData = $('form').serializeArray();
                    var position = {};
                    position.code = formData[0].value;
                    position.name = formData[1].value;
                    position.groupId = formData[2].value;
                    position.remark = formData[3].value;
                    var positionJson = JSON.stringify(position);
                    let that = this;
                    $.ajax({
                        url: contextPath + "/tbaserepertoryposition/save",
                        type: "POST",
                        dataType: "JSON",
                        data: positionJson,
                        contentType: "application/json",
                        success: function (data) {
                            if (data.code == '100100') {
                                that.$Modal.success({
                                    content: '保存成功'
                                })

                            } else {
                                that.$Modal.warning({
                                    content: '保存失败'
                                })
                            }

                            vm.isEdit = !vm.isEdit;
                        }
                    });
                }
            }
            if (vm.action == 2) {
                if ($('form').valid()) {
                    console.log(this.$data);
                    var formData = $('form').serializeArray();
                    console.log(formData);
                    var position = {};
                    position.id = vm.selected[0];
                    // alert(position.id);
                    position.code = formData[0].value;
                    position.name = formData[1].value;
                    position.groupId = formData[2].value;
                    position.remark = formData[3].value;
                    var positionJson = JSON.stringify(position);
                    let That = this;
                    $.ajax({
                        url: contextPath + "/tbaserepertoryposition/update",
                        type: "POST",
                        dataType: "JSON",
                        data: positionJson,
                        contentType: "application/json",
                        success: function (data) {
                            if (data.code == '100100') {
                                That.$Modal.success({
                                    content: '更新成功！'
                                })
                            } else {
                                That.$Modal.warning({
                                    content: '更新失败!'
                                })
                            }

                            vm.isEdit = !vm.isEdit;
                            vm.selected = [];
                        }
                    });
                }
            }
            if (vm.action == 3) {
                alert("详情");
                return false;
            }

        },
        search() {
            var obj = {};
            obj.name = vm.body.name;
            obj.code = vm.body.code;
            obj.groupIds = vm.body.groupIds;
            var j = JSON.stringify(obj);
            if (vm.body.groupIds !== "") {
                vm.body.groupIds = vm.body.groupIds.join(",");
            }

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
            vm.groupId = 0;
            vm.body.code = "";
            vm.body.name = "";
            vm.body.groupIds = [];
            vm.body.status = "";
            vm.activeStyle = "";
            this.reload = !this.reload;
        },
        delg() {
            if (vm.groupId === 0) {
                // alert("请选择需要删除的库位组");
                layer.alert('请选择需要删除的库位组', {
                    icon: 2,
                    title: "信息"
                });
                return false;
            }

            layer.confirm('确认删除？', {
                btn: ['确认', '取消'] //按钮
            }, function () {
                $.ajax({
                    url: contextPath + "/tbaserepertorypositiongroup/delete/" + vm.groupId,
                    type: "POST",
                    async: false,
                    success: function (data) {
                        if (data.code == '100100') {
                            layer.alert('删除成功', {
                                icon: 1,
                                title: "信息"
                            });
                        } else {
                            layer.alert('删除失败', {
                                icon: 2,
                                title: "信息"
                            });
                        }
                        load_group();


                        // vm.reload = !vm.reload;
                    }
                });
            }
            );
        },
        delo() {
            if (vm.selected.length < 1) {
                this.$Modal.info({
                    content: '请选择需要删除的库位'
                })
                return false;
            }

            layer.confirm('当前数据有可能被引用，会影响数据准确性，确认是否删除？', {
                btn: ['确认', '取消'] //按钮
            }, function () {
                var json = JSON.stringify(vm.selected);
                $.ajax({
                    url: contextPath + "/tbaserepertoryposition/delete",
                    type: "POST",
                    dataType: "JSON",
                    contentType: "application/json",
                    data: json,
                    success: function (data) {
                        layer.alert('删除成功', {
                            icon: 1,
                            title: "信息"
                        });
                        vm.reload = !vm.reload;
                    }
                });
                vm.selected = [];
            }
            );

        },
        modify(data) {
            vm.title = "修改库位";
            if (vm.selected.length < 1) {
                this.$Modal.info({
                    content: '请选择库位'
                })
                return false;
            }
            if (vm.selected.length > 1) {
                this.$Modal.info({
                    content: '只能选择一个库位'
                })
                return false;
            }
            vm.action = 2;
            vm.isEdit = !vm.isEdit;
            var id = vm.selected[0];
            $.ajax({
                url: contextPath + "/tbaserepertoryposition/info/" + id,
                type: "POST",
                dataType: "JSON",
                contentType: "application/json",
                async: false,
                success: function (data) {
                    vm.repertoryPosition.code = data.data.code;
                    vm.repertoryPosition.name = data.data.name;
                    vm.repertoryPosition.groupId = data.data.groupId;
                    vm.repertoryPosition.remark = data.data.remark;
                    vm.repertoryPosition.createTime = data.data.createTime;
                    vm.repertoryPosition.updateTime = data.data.updateTime;
                    vm.repertoryPosition.createName = data.data.createName;
                    vm.repertoryPosition.updateName = data.data.updateName;
                }
            });
            // vm.selected = [];
        },
        copy(data) {
            vm.title = "复制库位";
            if (vm.selected.length < 1) {
                // alert("请选择库位");
                layer.alert('请选择库位', {
                    icon: 2,
                    title: "信息"
                });

                return false;
            }
            if (vm.selected.length > 1) {

                this.$Modal.info({
                    content: '只能选择一个库位'
                })
                return false;
            }
            vm.action = 4;
            vm.isEdit = !vm.isEdit;
            var id = vm.selected[0];
            $.ajax({
                url: contextPath + "/tbaserepertoryposition/info/" + id,
                type: "POST",
                dataType: "JSON",
                contentType: "application/json",
                async: false,
                success: function (data) {
                    // vm.repertoryPosition.code = data.data.code;
                    // vm.repertoryPosition.name = data.data.name;
                    vm.repertoryPosition.groupId = data.data.groupId;
                    vm.repertoryPosition.remark = data.data.remark;
                    vm.repertoryPosition.createTime = data.data.createTime;
                    vm.repertoryPosition.updateTime = data.data.updateTime;
                    vm.repertoryPosition.createName = data.data.createName;
                    vm.repertoryPosition.updateName = data.data.updateName;
                }
            });
            // vm.selected = [];
        },
        exit() {
            vm.repertoryPosition.code = '';
            vm.repertoryPosition.name = '';
            vm.repertoryPosition.groupId = '';
            vm.repertoryPosition.remark = '';
            vm.repertoryPosition.createName = '';
            vm.repertoryPosition.createTime = '';
            vm.repertoryPosition.updateName = '';
            vm.repertoryPosition.updateTime = '';
            vm.selected = [];
            //清空地址绑定
            this.areaInit = {
                isInit: false,
                province: '',
                city: '',
                county: '',
                detail: '',
                disabled: false
            }
            this.isEdit = false;
        },
        addWarehouseGroup() {
            this.isShowAddUnitGroup = true;
        },
        addSure() {
            let _this = this;
            var obj = {};
            obj.name = _this.addRepertoryGroup;
            var json = JSON.stringify(obj);
            $.ajax({
                url: contextPath + "/tbaserepertorypositiongroup/save",
                async: false,
                data: json,
                type: "POST",
                dataType: "JSON",
                contentType: "application/json",
                success: function (data) {
                    _this.$Modal.success({
                        content: '保存成功'
                    })
                    _this.isShowAddUnitGroup = false;
                    location.reload();
                }
            });
        },
        addCancel() {
            this.isShowAddUnitGroup = false;
            this.addRepertoryGroup = '';
        },
        // addWarehouseGroup() {
        //     let _this = this;
        //     let index = layer.open({
        //         type: 1,
        //         title: '新增库位组',
        //         content: $("#addUnitGroup"),
        //         btn: ['保存', '取消'],
        //         area: '400px',
        //         btn1() {
        //             var obj = {};
        //             obj.name = _this.addRepertoryGroup;
        //             var json = JSON.stringify(obj);
        //             $.ajax({
        //                 url: contextPath + "/tbaserepertorypositiongroup/save",
        //                 async: false,
        //                 data: json,
        //                 type: "POST",
        //                 dataType: "JSON",
        //                 contentType: "application/json",
        //                 success: function (data) {
        //                     _this.$Modal.success({
        //                         content: '保存成功'
        //                     })
        //                 }
        //             });
        //             layer.close(index);
        //             _this.addRepertoryGroup = '';
        //             load_group();
        //             // window.location.reload();
        //         }
        //     })
        // },
        modifyWarehouseGroup(){
            if (vm.groupId === 0) {
                this.$Modal.info({
                    title:'提示信息',
                    content: '请先选择库位组'
                })
                return;
            }
            this.isShowModifyUnitGroup = true;
        },
        modifySure(){
            var group = {};
            group.id = vm.groupId;
            group.name = vm.modifyRepertoryGroup;
            var groupJson = JSON.stringify(group);
            vm.groupId = 0;
            $.ajax({
                url: contextPath + "/tbaserepertorypositiongroup/update",
                async: false,
                type: "POST",
                dataType: "JSON",
                contentType: "application/json",
                data: groupJson,
                success: function (data) {
                    vm.$Modal.info({
                        title:'提示信息',
                        content: '更新成功'
                    })
                    location.reload();
                    vm.isShowModifyUnitGroup = false;
                }
            });
        },
        modifyCancel(){
            this.isShowModifyUnitGroup = false;
        },
        // modifyWarehouseGroup() {
        //     if (vm.groupId === 0) {
        //         this.$Modal.info({
        //             content: '请先选择库位组'
        //         })
        //         return;
        //     }

        //     let index = layer.open({
        //         type: 1,
        //         title: '修改库位组',
        //         content: $("#modifyUnitGroup"),
        //         btn: ['保存', '取消'],
        //         area: '400px',
        //         btn1() {
        //             var group = {};
        //             group.id = vm.groupId;
        //             group.name = vm.modifyRepertoryGroup;
        //             var groupJson = JSON.stringify(group);
        //             vm.groupId = 0;
        //             $.ajax({
        //                 url: contextPath + "/tbaserepertorypositiongroup/update",
        //                 async: false,
        //                 type: "POST",
        //                 dataType: "JSON",
        //                 contentType: "application/json",
        //                 data: groupJson,
        //                 success: function (data) {
        //                     // alert("更新成功");
        //                     layer.alert('更新成功', {
        //                         icon: 1,
        //                         title: "信息"
        //                     });
        //                 }
        //             });
        //             layer.close(index);
        //             load_group();
        //             // window.location.reload();
        //         }
        //     })
        // },
        clickEvent(event, treeId, treeNode) {
            //可以调用ztree原生方法，更多方法请参考官方文档。
            let selnode = this.$ztree.getSelectedNodes();
            console.log(selnode);
            this.tmpWhouse = selnode[0].name;
        },
        detailClick(data) {
            vm.isView = true;
            vm.action = 3;
            vm.title = "库位详情";

            var id = data.rows.id;
            vm.isEdit = true;
            let lineData = jQuery('#list').jqGrid('getRowData', id);
            // var id = lineData.id;
            // vm.repertoryPosition.code = lineData.code;
            var str = lineData.code;

            var regex = /<a.*?>(.*?)<\/a>/ig;
            var result = regex.exec(str);


            // vm.repertoryPosition.code = result[1];
            // vm.repertoryPosition.name = lineData.name;
            // vm.repertoryPosition.groupId = lineData.groupId;
            // vm.repertoryPosition.remark = lineData.remark;
            // vm.repertoryPosition.createTime = lineData.createTime;
            // vm.repertoryPosition.updateTime = lineData.updateTime;
            // vm.repertoryPosition.createName = lineData.createName;
            // vm.repertoryPosition.updateName = lineData.updateName;

            vm.selected = [];
            $.ajax({
                url: contextPath + "/tbaserepertoryposition/info/" + id,
                type: "POST",
                dataType: "JSON",
                contentType: "application/json",
                async: false,
                success: function (data) {
                    console.log(data);
                    vm.repertoryPosition.code = data.data.code;
                    vm.repertoryPosition.name = data.data.name;
                    vm.repertoryPosition.groupId = data.data.groupId;
                    vm.repertoryPosition.remark = data.data.remark;
                    vm.repertoryPosition.createTime = data.data.createTime;
                    vm.repertoryPosition.updateTime = data.data.updateTime;
                    vm.repertoryPosition.createName = data.data.createName;
                    vm.repertoryPosition.updateName = data.data.updateName;
                }
            });
            // alert(vm.repertoryPosition.updateName);
            // alert(vm.repertoryPosition.updateName != '');

        },
        selectGroup(group, index) {
            vm.groupId = group.id;
            vm.body.groupIds = group.id;
            vm.modifyRepertoryGroup = group.name;
            this.activeStyle = index;
            this.reload = !this.reload;
        },
        showOrgin() {
            if (this.selected.length == 0) {
                layer.alert("请选择库位");
                return;
            }
            this.showModal = true;
        },
        okModel() {
            if (this.selectOrginId.length == 0) {
                layer.alert("请选择分配组织!");
                return;
            }
            let param = {
                ids: {},
                orginIds: {}
            }
            param.ids = this.selected.join(',');
            param.orginIds = this.selectOrginId.join(',');
            this.cancelModel();
            // console.log(param)
            let that = this;
            $.ajax({
                type: "POST",
                url: contextPath + '/tbaserepertoryposition/allot',
                traditional: true,
                // contentType: 'application/json',
                datatype: "json",//请求数据返回的类型。可选json,xml,txt
                data: param,
                success: function (result) {
                    if (result.code === "100100") {
                        layer.alert("分配成功", { icon: 1 });
                        that.selectOrginId = [];
                    } else {
                        layer.alert("分配成功", { icon: 1 });
                    }
                },
                error: function (err) {
                    layer.alert("系统错误", { icon: 2 });
                },
            });
        },
        cancelModel() {
            this.selectOrginId = [];
            this.$refs.test.selectAll(false);
            this.showModal = false;
        },
        changeselect(selection) {
            // 获取勾选的行数据
            for (let i = 0; i < selection.length; i++) {
                this.selectOrginId.push(selection[i].id);
            }
        },
        getOrganizations() {
            var That = this;
            $.ajax({
                url: contextPath + '/tbaserepertorypositiongroup/getorganizations',
                type: 'POST',
                dataType: "json",
                success(data) {
                    if (data.code == 100100) {


                        let orgnArr = data.data.organizationList;
                        let organId = data.data.organId;
                        let index = -1;
                        for (let i = 0; i < orgnArr.length; i++) {
                            if (organId == orgnArr[i].id) {
                                index = i;
                                break;
                            }
                        }
                        orgnArr.splice(index, 1);
                        That.colContent = orgnArr;
                    }
                },
                error() {
                    That.$Modal.warning({
                        content: '网络异常，请重试！'
                    })
                }
            });
        },
        hideSearch() {
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top", "")
        },
        quit() {
            // window.parent.closeCurrentTab({ name: "库位资料", openTime: this.openTime, exit: true });
            window.parent.closeCurrentTab({ exit: true, openTime: this.openTime });
        }
    },
    mounted() {
        var organId = window.parent.userInfo.organId;
        load_group();
        this.get_user();
        this.getOrganizations();
        this.openTime = window.parent.params.openTime;
    }


})