Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
var warehouseVm = new Vue({
    el: '#warehouse-info',
    data: function () {
        let This = this;
        return {
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isHide: true,
            showModal: false,
            buttonFlag: true,
            openTime: "",
            selectOrginId: [],
            // 配置表头
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
            // 表格内数据,与表头对应
            colContent: [

            ],
            //控制显示隐藏
            isEdit: false,
            reload: false,
            isLock: false,
            //列表勾选项
            selected: [],
            //搜索页面数据绑定
            body: {
                name: "",
                codes: "",
                type: []
            },
            //新增页面表单数据绑定
            addBody: {
                id: "",
                codes: "",
                name: "",
                type: "",
                managerId: "",
                managerName: "",
                groupId: "",
                groupName: "",
                address: "",
                remark: "",
                createId: "",
                createName: "",
                status: 1,
                phoneNum: ""
            },
            isAdd: false,
            //控制显示隐藏新增界面
            isShow: false,
            //仓库类型
            warehouseType: [
                {
                    name: '普通仓',
                    code: 1
                },
                {
                    name: '待检仓',
                    code: 2
                },
                {
                    name: '赠品仓',
                    code: 3
                },
                {
                    name: '代管仓',
                    code: 4
                },
                {
                    name: '受托代销',
                    code: 5
                },
                {
                    name: '其他',
                    code: 6
                }
            ],
            //库位组,接口获取
            warehouseGroup: [],
            //地址

            //仓库管理员
            admin: [
            ],

            // 有效无效状态
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
            warehoseUrl: contextPath + "/baseaddress/queryAddress",
            data_config: {
                url: contextPath + '/wareHouse/list',
                colNames: ['编码', '仓库名称', '仓库类型', '仓管员', '联系电话', '备注', '创建人', '创建时间'],//jqGrid的列显示名字
                colModel: [ //jqGrid每一列的配置信息。包括名字，索引，宽度,对齐方式.....
                    {
                        name: 'codes', index: 'warehouseCode asc, invdate', width: 120,
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on("click", ".detail" + value, function () {
                                //This.detailClick({value, grid, rows, state})
                                This.selected = [rows.id];
                                This.view()
                            });
                            let btns = `<a class="detail${value}">${value}</a>`;
                            return btns
                        }
                    },
                    {
                        name: 'name', index: 'warehouseName', width: 120
                    },

                    { name: 'type', index: 'warehouseType', width: 120, align: "left" },
                    { name: 'managerName', index: 'warehouseAdmin', width: 120, align: "left" },
                    { name: 'phoneNum', index: 'contacts', width: 120, align: "left" },
                    { name: 'remark', index: 'comment', width: 120, align: "left" },
                    { name: 'createName', index: 'creator', width: 120, sortable: false, align: "left" },
                    {
                        name: 'createTime', index: 'createTime', width: 150, align: "left",
                        formatter: function (value) {
                            return new Date(value).Format('yyyy-MM-dd hh:mm:ss');
                        }
                    }

                ],

            },
            //变更历史记录
            data_config2: {
                // url: contextPath+'/wareHouse/changeInfos',
                colNames: ['变更信息', '变更前', '变更后', '变更日期', '变更人'],//jqGrid的列显示名字
                colModel: [ //jqGrid每一列的配置信息。包括名字，索引，宽度,对齐方式.....
                    { name: 'changeInfo', index: 'changeInfo', width: 235 },
                    { name: 'operationBefore', index: 'operationBefore', width: 235 },
                    { name: 'operationAfter', index: 'operationAfter', width: 235 },
                    { name: 'operationTime', index: 'operationTime', width: 235 },
                    { name: 'userName', index: 'userName', width: 235 },
                ],
                multiselect: false
            },
            //变更记录请求路径
            logUrl: '',
            area: {},
            areaInit: {
                isInit: false,
                province: '',
                city: '',
                county: '',
                detail: '',
                disabled: false,
            },

        }
    },
    created() {
        // this.loadrepertorypositiongroup();
    },
    methods: {
        hideSearch() {
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top", "")
        },

        getManager() {
            console.log("查询管理员");
            let _this = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/wareHouse/getManager",
                contentType: 'application/json',
                dataType: "json",
                async: false,
                success: function (data) {
                    console.log(data);
                    if (data.code === "100100") {
                        _this.admin = [];
                        for (let emp of data.data) {
                            _this.admin.push({ label: emp.empName, value: emp.id, code: emp.empCode });
                        }
                    } else {
                        // layer.alert('网络异常', {icon: 0});
                        _this.$Modal.warning({
                            title: '提示信息',
                            content: '网络异常'
                        })
                    }
                },
                error: function (err) {
                    // layer.alert('网络异常', {icon: 0});
                    _this.$Modal.warning({
                        title: '提示信息',
                        content: '网络异常'
                    })
                },
            })
        },
        initOrgin() {
            let _this = this;
            isAdd = true,
                $.ajax({
                    type: "POST",
                    url: contextPath + "/wareHouse/paramMap",
                    contentType: 'application/json',
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        console.log(data);
                        if (data.code === "100100") {
                            let orgnArr = data.data.organList;
                            let organId = data.data.organId;
                            let index = -1;
                            for (let i = 0; i < orgnArr.length; i++) {
                                if (organId == orgnArr[i].id) {
                                    index = i;
                                    break;
                                }
                            }
                            orgnArr.splice(index, 1);
                            _this.colContent = orgnArr;

                        } else {
                            _this.$Modal.warning({
                                title: '提示信息',
                                content: '网络异常'
                            })
                            // layer.alert('网络异常', {icon: 0});
                        }
                    },
                    error: function (err) {
                        _this.$Modal.warning({
                            title: '提示信息',
                            content: '网络异常'
                        })
                        // layer.alert('网络异常', {icon: 0});
                    },
                })
        },
        hideSearch() {
            this.isHide = !this.isHide;
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top", "")
        },
        hidTabulation() {
            this.isHide = !this.isHide;
            this.isTabulationHide = !this.isTabulationHide;
            if (!this.isTabulationHide) {
                $(".chevron").css("top", "84%")
            } else {
                $(".chevron").css("top", "")
            }
        },
        showOrgin() {
            if (this.selected.length == 0) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '请选择行!'
                })
                // layer.alert("请选择行!");
                return;
            }
            this.showModal = true;
        },
        okModel() {
            if (this.selectOrginId.length == 0) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '请选择分配组织!'
                })
                // layer.alert("请选择分配组织!");
                return;
            }
            let param = {
                ids: {},
                orginIds: {}
            }
            param.ids = this.selected.join(',');
            param.orginIds = this.selectOrginId.join(',');
            this.cancelModel();
            console.log(param)
            let that = this;
            $.ajax({
                type: "POST",
                url: contextPath + '/wareHouse/allot',
                traditional: true,
                // contentType: 'application/json',
                datatype: "json",//请求数据返回的类型。可选json,xml,txt
                data: param,
                success: function (result) {
                    if (result.code === "100100") {
                        // layer.alert("分配成功", {icon: 1});
                        that.$Modal.success({
                            title: '提示信息',
                            content: '分配成功!'
                        })
                        that.selectOrginId = [];
                    } else {
                        // layer.alert(result.msg, {icon: 0});
                        that.$Modal.warning({
                            title: '提示信息',
                            content: result.msg
                        })
                    }
                },
                error: function (err) {
                    // layer.alert("服务器出错", {icon: 0});
                    that.$Modal.warning({
                        title: '提示信息',
                        content: '服务器出错!'
                    })
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
            console.log(selection)
            for (let i = 0; i < selection.length; i++) {
                this.selectOrginId.push(selection[i].id);
            }
        },
        // loadrepertorypositiongroup(){
        //     $.ajax({
        //         url: contextPath+'/wareHouse/repertorypositiongroup',
        //         dataType: 'json',
        //         method: 'post',
        //         data: {},
        //         success: function (res) {
        //             warehouseVm.warehouseGroup = [];
        //             if (res.code === '100100' && res.data.length > 0) {
        //                 $.each(res.data, function (i, o) {
        //                     if (o.isDel == 1) {
        //                         warehouseVm.warehouseGroup.unshift(Object.assign({}, {label: o.name, value: o.id}));
        //                     }
        //                 });
        //             }
        //         },
        //         error: function (e) {
        //             console.log(e)
        //         }
        //     })
        // },
        addBodyInit() {
            this.addBody = {
                codes: "",
                name: "",
                type: "",
                managerId: "",
                managerName: "",
                groupId: "",
                groupName: "",
                address: "",
                remark: "",
                createId: "",
                createName: "",
                status: 1,
                phoneNum: ""
            }
        },
        //点击新增行时
        add_click() {
            console.log("新增按钮")
            this.addBody.createName = layui.data('user').username
            this.buttonFlag = true
            this.isAdd = true;
            this.isLock = false;
            this.isEdit = true;
            this.areaInit.disabled = false
            this.areaClear()
            this.bodyClear()
        },
        bodyClear() {
            this.addBody.codes = '';
            this.addBody.name = '';
            this.addBody.managerId = '';
            this.addBody.managerName = '';
            this.addBody.groupId = '';
            this.addBody.groupName = '';
            this.addBody.remark = '';
            this.addBody.phoneNum = '';
            this.addBody.type = '';
            this.addBody.id = '';
        },
        areaClear() {
            this.area = []
            this.areaInit = {
                isInit: false,
                province: '',
                city: '',
                county: '',
                detail: '',
                disabled: false,
            }
        },
        //点击删除时
        del_click() {
            console.log(JSON.stringify(this.selected));
            // layer.confirm('当前数据有可能被引用，会影响数据准确性，确认是否删除？', {
            //     btn: ['确定', '取消']
            // }, function (index, layero) {
            //     $.ajax({
            //         type: "POST",
            //         url: contextPath + "/wareHouse/delete",
            //         contentType: 'application/json',
            //         data: JSON.stringify(warehouseVm.selected),
            //         dataType: "json",
            //         success: function (result) {
            //             if (result.code == "100100") {
            //                 console.log(result.msg + "123");
            //                 // layer.alert(result.msg)
            //                 warehouseVm.$Modal.success({
            //                     title: '提示信息',
            //                     content: result.msg
            //                 })
            //                 warehouseVm.contentType = result.data;
            //                 warehouseVm.selected = []
            //                 warehouseVm.reload = !warehouseVm.reload;
            //             } else {
            //                 // layer.alert(result.msg)
            //                 warehouseVm.$Modal.warning({
            //                     title: '提示信息',
            //                     content: result.msg
            //                 })
            //             }
            //
            //         },
            //         error: function (err) {
            //             // alert(err);
            //             warehouseVm.$Modal.warning({
            //                 title: '提示信息',
            //                 content: err
            //             })
            //         },
            //     })
            // })

            if(this.selected.length<1){
                this.$Modal.warning({
                    title: '提示信息',
                    content: '请选中一条数据！'
                })
                return;
            }
            this.$Modal.confirm({
                title: '提示',
                content: '当前数据有可能被引用，会影响数据准确性，确认是否删除？',
                onOk    : function () {
                    $.ajax({
                        type: "POST",
                        url: contextPath + "/wareHouse/delete",
                        contentType: 'application/json',
                        data: JSON.stringify(warehouseVm.selected),
                        dataType: "json",
                        success: function (result) {
                            if (result.code == "100100") {
                                console.log(result.msg + "123");
                                // layer.alert(result.msg)
                                warehouseVm.$Modal.success({
                                    title: '提示信息',
                                    content: result.msg
                                })
                                warehouseVm.contentType = result.data;
                                warehouseVm.selected = []
                                warehouseVm.reload = !warehouseVm.reload;
                            } else {
                                // layer.alert(result.msg)
                                warehouseVm.$Modal.warning({
                                    title: '提示信息',
                                    content: result.msg
                                })
                            }

                        },
                        error: function (err) {
                            // alert(err);
                            warehouseVm.$Modal.warning({
                                title: '提示信息',
                                content: err
                            })
                        },
                    })
                },
                onCancel(){
                    return;
                }


            })

        },
        //点击修改时
        modify() {
            let _this = this;
            console.log('点击了修改');
            this.buttonFlag = true
            let id = warehouseVm.selected[0]
            // console.log(warehouseVm.selected[0]);
            this.addBody.id = id
            console.log(this.addBody.id)
            if (warehouseVm.selected.length !== 1) {
                // layer.alert("修改只能对单条数据进行操作")
                this.$Modal.info({
                    title: '提示信息',
                    content: '修改只能对单条数据进行操作!'
                })
            } else {
                // if ($('form').valid()) {
                warehouseVm.isEdit = false;

                $.ajax({
                    type: "POST",
                    url: contextPath + "/wareHouse/info",
                    // contentType: 'application/json',
                    data: { id: id },
                    dataType: "json",
                    success: function (result) {
                        console.log("id查询 " + JSON.stringify(result.data))
                        _this.addBody = result.data;
                        _this.addBody.managerName = result.data.managerId + "-" + result.data.managerName;
                        _this.isLock = false;
                        _this.isEdit = true;
                        _this.isAdd = false;
                        if (result.data.province) {
                            _this.areaInit = {
                                isInit: true,
                                province: result.data.province,
                                city: result.data.city,
                                county: result.data.county,
                                detail: result.data.detail,
                                disabled: false,
                            },
                                _this.area = {
                                    province: result.data.province,
                                    city: result.data.city,
                                    county: result.data.county,
                                    detail: result.data.detail,
                                };;
                        }
                    },
                    error: function (err) {
                        // alert(err.msg);
                        _this.$Modal.warning({
                            title: '提示信息',
                            content: err.msg
                        })
                    },
                })
                // }
            }
            //请求详情信息
        },
        //点击查看时
        view() {
            console.log('点击了查看');
            let _this = this;
            _this.isShow = true;
            if (this.selected.length > 1) {
                // layer.alert('查看只能对单条数据进行操作');
                this.$Modal.info({
                    title: '提示信息',
                    content: '查看只能对单条数据进行操作'
                })
                return;
            } else if (this.selected.length < 1) {
                // layer.alert('请选择操作数据');
                this.$Modal.info({
                    title: '提示信息',
                    content: '请选择操作数据'
                })
                return;
            }
            // if ($('form').valid()) {

            let id = this.selected[0]
            console.log(id)
            this.logUrl = contextPath + '/wareHouse/changeInfos?id=' + id + "&nd=" + $.now();
            $.ajax({
                type: "POST",
                url: contextPath + "/wareHouse/info?id=" + id,
                contentType: 'application/json',
                // data: JSON.stringify(id),
                // data:{id:id},
                dataType: "json",
                success: function (result) {
                    console.log("id查询 " + JSON.stringify(result.data))
                    _this.addBody = result.data;
                    _this.addBody.managerName = result.data.managerId + "-" + result.data.managerName;
                    console.log(_this.isLock)
                    _this.isLock = true;
                    _this.isEdit = true;
                    if (result.data.province) {
                        _this.areaInit = {
                            isInit: true,
                            province: result.data.province,
                            city: result.data.city,
                            county: result.data.county,
                            detail: result.data.detail,

                            disabled: true,
                        },
                            _this.area = {
                                province: result.data.province,
                                city: result.data.city,
                                county: result.data.county,
                                detail: result.data.detail,
                            };
                    }
                },
                error: function (err) {
                    // alert(err.msg);
                    _this.$Modal.warning({
                        title: '提示信息',
                        content: err.msg
                    })
                },
            })
            // }
        },
        //点击退出时
        exit() {
            $("#my_from").validate().resetForm();
            $(".layui-tab-title li").eq(0).click();
            this.isEdit = false;
            console.log(this.$refs.warea);
            this.addBodyInit();
            this.areaClear();
            this.selected = []
            this.reload = !this.reload;
        },
        save() {
            //表单验证
            let This = this

            if ($("#my_from").valid()) {
                This.buttonFlag = false
                if (warehouseVm.addBody.id) {
                    console.log("修改id: " + warehouseVm.addBody.id);
                    this.update();
                }
                else {
                    // for (let group of warehouseVm.warehouseGroup) {
                    //     if (group.value == warehouseVm.addBody.groupId) {
                    //         console.log(group.label)
                    //         warehouseVm.addBody.groupName = group.label;
                    //     }
                    // }
                    if (!$.isEmptyObject(this.area)) {
                        Object.assign(warehouseVm.addBody, this.area);
                    }
                    //获取表单数据值
                    console.log(JSON.stringify(warehouseVm.addBody));

                    $.ajax({
                        type: "POST",
                        url: contextPath + "/wareHouse/addWareHouse",
                        contentType: 'application/json',
                        data: JSON.stringify(warehouseVm.addBody),
                        dataType: "json",
                        success: function (data) {
                            This.buttonFlag = true
                            if (data.code == '100100') {
                                // layer.alert(data.msg, {
                                //     icon: 1, end: function () {
                                //
                                //     }
                                // })
                                This.$Modal.success({
                                    title: '提示信息',
                                    content: data.msg
                                })
                                This.area = []
                                This.addBodyInit()
                                This.isEdit = false
                                This.reload = !This.reload


                            } else {
                                // layer.alert(data.msg);
                                This.$Modal.warning({
                                    title: '提示信息',
                                    content: data.msg
                                })
                            }
                        },
                        error: function (err) {
                            // console.log("服务器出错");
                            This.$Modal.warning({
                                title: '提示信息',
                                content: '服务器出错'
                            })
                        },
                    });
                }
            }
        },
        search() {
            console.log('点击了搜索按钮');
            console.log(this.body);
            if (!$.isEmptyObject(this.body.type)) {
                let arr = [];
                for (let i of this.body.type) {
                    for (let l of warehouseVm.warehouseType) {
                        if (l.code == i) {
                            arr.push(l.name);
                        }
                    }
                }
                this.body.type = arr.join(',');
            }
            warehouseVm.reload = !warehouseVm.reload;

        },
        clear() {
            console.log('点击了清空按钮');
            this.$refs.type.selectMore = [];
            this.body = {
                name: "",
                codes: "",
                type: []
            }

        },
        detailClick(data) {
            let { rows } = data;
            this.isEdit = true;
            this.addBody = rows;

            if (rows.province) {
                this.areaInit = {
                    isInit: true,
                    province: rows.province,
                    city: rows.city,
                    county: rows.county,
                    detail: rows.detail,
                    disabled: true,
                };
            }

            this.isShow = true;
        },
        update() {
            let This = this
            // for (let group of warehouseVm.warehouseGroup) {
            //
            //     if (group.value == warehouseVm.addBody.groupId) {
            //         warehouseVm.addBody.groupName = group.label;
            //     }
            // }
            if (!$.isEmptyObject(this.area)) {
                Object.assign(warehouseVm.addBody, this.area);
            }
            console.log("修改入参 " + JSON.stringify(warehouseVm.addBody))
            $.ajax({
                type: "POST",
                url: contextPath + "/wareHouse/updateWareHouse",
                contentType: 'application/json',
                data: JSON.stringify(warehouseVm.addBody),
                dataType: "json",
                success: function (result) {
                    if (result.code == '100100') {
                        This.$Modal.success({
                            title: '提示信息',
                            content: result.msg
                        })

                        This.buttonFlag = true
                        This.isEdit = false
                        This.bodyClear()
                        This.reload = !This.reload

                    } else {
                        // layer.alert(result.msg);
                        This.$Modal.warning({
                            title: '提示信息',
                            content: result.msg
                        })
                    }
                },
                error: function (err) {
                    // alert(err);
                    This.$Modal.warning({
                        title: '提示信息',
                        content: err
                    })
                },
            })
        },
        cancel() {
            window.parent.closeCurrentTab({ exit: true, openTime: this.openTime });
        },
        copy() {
            console.log("进复制了。。")
            let _this = this
            if (this.selected.length != 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '请选择一条操作数据'
                })
                // layer.alert('请选择一条操作数据');
                return false;
            }
            warehouseVm.isEdit = false;
            let id = this.selected[0]
            console.log(this.selected)
            console.log(id)
            console.log(this.selected[0])
            $.ajax({
                type: "POST",
                url: contextPath + "/wareHouse/info",
                // contentType: 'application/json',
                data: { id: id },
                dataType: "json",
                success: function (result) {

                    console.log(result)
                    console.log("id查询 " + JSON.stringify(result.data))
                    // _this.addBody = result.data;
                    _this.addBody.type = result.data.type;
                    _this.addBody.managerName = result.data.managerId + "-" + result.data.managerName;
                    _this.addBody.groupId = result.data.groupId;
                    _this.addBody.remark = result.data.remark;
                    _this.addBody.status = result.data.status;
                    _this.addBody.phoneNum = result.data.phoneNum;
                    // for (let group of warehouseVm.warehouseGroup) {
                    //
                    //     if (group.value == warehouseVm.addBody.groupId) {
                    //         warehouseVm.addBody.groupName = group.label;
                    //     }
                    // }
                    _this.isLock = false;
                    _this.isAdd = true;
                    _this.isEdit = true;
                    if (result.data.province) {
                        _this.areaInit = {
                            isInit: true,
                            province: result.data.province,
                            city: result.data.city,
                            county: result.data.county,
                            detail: result.data.detail,
                            disabled: false,
                        }
                        _this.area = {
                            province: result.data.province,
                            city: result.data.city,
                            county: result.data.county,
                            detail: result.data.detail,
                        };
                    }
                },
                error: function (err) {
                    _this.$Modal.warning({
                        title: '提示信息',
                        content: err.msg
                    })
                },
            })


        },
        initFormValidate() {
            var validateOptions = {
                onfocusout: function (element) {
                    $(element).valid();
                },
                onkeyup: false,
                rules: {
                    wcode: {
                        required: true,
                        remote: {
                            url: contextPath + "/wareHouse/validateCode",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                code: function () {
                                    return warehouseVm.addBody.codes;
                                },
                                id: function () {
                                    return warehouseVm.addBody.id;
                                }
                            },
                            dataFilter: function (data, type) {//判断控制器返回的内容
                                var res = JSON.parse(data);
                                if (res.code === "100100") {
                                    return res.data;
                                } else {
                                    // layer.alert(res.msg);//没有弹出对话框
                                    this.$Modal.warning({
                                        title: '提示信息',
                                        content: res.msg
                                    })
                                    return false;
                                }
                            }

                        }
                    },
                    wname: {
                        required: true,
                        remote: {
                            url: contextPath + "/wareHouse/validateCode",  //后台处理程序
                            type: "post",  //数据发送方式
                            dataType: "json",  //接受数据格式
                            data: {  //要传递的数据
                                name: function () {
                                    return warehouseVm.addBody.name;
                                },
                                id: function () {
                                    return warehouseVm.addBody.id;
                                }
                            },
                            dataFilter: function (data, type) {//判断控制器返回的内容
                                var res = JSON.parse(data);
                                if (res.code === "100100") {
                                    return res.data;
                                } else {
                                    // layer.alert(res.msg);//没有弹出对话框
                                    this.$Modal.warning({
                                        title: '提示信息',
                                        content: res.msg
                                    })
                                    return false;

                                }
                            }

                        }
                    },
                    wType: {
                        required: true,
                    },
                },
                messages: {
                    wcode: {
                        required: "请填写仓库代码!",
                        remote: "该编码已存在!"
                    },
                    wname: {
                        required: "请填写仓库名称!",
                        remote: "该币种名称已存在!"
                    },
                    wType: {
                        required: "请填写仓库类型!",
                    },
                }
            };
            $("#my_from").validate(validateOptions);
        }

    },
    mounted() {
        let user = layui.data('user')

        this.initOrgin();
        this.initFormValidate();
        this.getManager();
        this.openTime = window.parent.params.openTime;
    }
})