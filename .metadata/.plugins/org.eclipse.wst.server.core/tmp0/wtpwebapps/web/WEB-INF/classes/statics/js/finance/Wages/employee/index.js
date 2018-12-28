let _vue = new Vue({
    el: '#employee', //工资模块---职员页面
    data() {
        return {
            orgName: '',
            openTime: '',
            formData: {
                categoryId: '',
                empCode: '',
                empName: '',
                deptName: '',
                idCard: '',
                mailbox: '',
                phone: '',
                station: '',
                rank: '',
                stationLevel: '',
                education: '',
                entryDateStart: '',
                entryDateEnd: '',
                empStatus: '',
            },
            importData: {
                categoryId: '',
                empCode: '',
                empName: '',
                deptName: '',
                employeeIdList: [],
            },
            detailData: {
                id: '',
                categoryId: '',
                empCode: '',
                empName: '',
                basicWage: '',
                publicFunds: '',
                socialSecurity: '',
            },
            filterVisible: false,
            importVisible: false,
            detailVisible: false,
            selected: [],  // 获取列表列的勾选数组的rowId
            tableList: [],  // 获取列表列的所有数据
            impertSelected: [],  // 获取导入列的勾选数组的rowId
            impertTableList: [],  // 获取导入列的所有数据
            categoryList: [],
            empCodeList: [],
            empNameList: [],
            idCardList: [],
            mailboxList: [],
            phoneList: [],
            stationList: [],
            rankList: [],
            stationLevelList: [],
            educationList: [],
            empStatusList: [
                {name: '已离职', value: 0},
                {name: '在职', value: 1},
                {name: '离职中', value: 2},
            ],


            showFilterDept: false,
            showImportDept: false,
            filterDeptTreeSetting: {//过滤功能 部门树
                data: {
                    key: {
                        name: "title"
                    }
                },
                callback: {
                    onClick: this.filterDeptTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            importDeptTreeSetting: {//导入功能部门树
                data: {
                    key: {
                        name: "title"
                    }
                },
                callback: {
                    onClick: this.importDeptTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
        }
    },
    created() {
        this.initPage();
    },
    mounted() {
        this.openTime = window.parent.params && window.parent.params.openTime;
        this.orgName = layui.data('user').currentOrgName;

    },
    methods: {
        initPage() {
            let _vm = this;
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + '/WmEmployeeAppController/initPage',
                success: function (result) {
                    if (result.code != '100100') {
                        let _msg = '页面初始化失败';
                        if (result.hasOwnProperty("data")) {
                            _msg = result.msg;
                        }
                        _vm.$Modal.error({
                            scrollable: true,
                            content: _msg,
                        });
                        return;
                    }
                    let r = result.data;
                    let clist = r.categoryList;
                    if (!clist || clist.length === 0) {
                        _vm.$Modal.error({
                            scrollable: true,
                            content: "请先设置工资类别!!",
                        });
                        return;
                    }
                    _vm.$nextTick(() => {
                        _vm.categoryList = clist;
                        _vm.formData.categoryId = clist[0].id;
                        _vm.importData.categoryId = clist[0].id;
                        $.each(clist, function (idx, ele) {
                            if (ele.sysDefault === 1) {
                                _vm.formData.categoryId = ele.id;
                                _vm.importData.categoryId = ele.id;
                            }
                        });
                        //把初始化的若干list赋值,以及遍历类别list,赋值为default,并执行一次查询
                        _vm.deptNameList = r.deptNameList;
                        _vm.educationList = r.educationList;
                        _vm.empCodeList = r.empCodeList;
                        _vm.empNameList = r.empNameList;
                        _vm.idCardList = r.idCardList;
                        _vm.mailboxList = r.mailboxList;
                        _vm.rankList = r.rankList;
                        _vm.stationLevelList = r.stationLevelList;
                        _vm.stationList = r.stationList;
                        _vm.phoneList = r.phoneList;
                        _vm.initData();
                    });

                },
            });
        },
        initData() {
            console.log("进入--->initData");
            let that = this;
            jQuery("#grid").jqGrid(
                {
                    datatype: "json",
                    mtype: 'POST',
                    postData: JSON.stringify(that.formData),
                    multiselect: true,
                    url: contextPath + '/WmEmployeeAppController/getEmployeeList',
                    ajaxGridOptions: {contentType: 'application/json;charset=utf-8'},
                    colNames: ['id', '序号', '员工工号', '员工姓名', '性别', '出生日期', '身份证号码', '手机号码',
                        '邮箱', '所属部门', '工作性质', '职级', '员工岗位', '岗位级别', '入职日期', '离职日期',
                        '员工状态', '开户行', '银行卡号', '学历', '籍贯', '户口所在地', '婚姻状况', '政治面貌'],
                    colModel: [
                        {name: 'id', width: 50, hidden: true},
                        {name: 'serialNumber', width: 50, align: "center", sortable: false},
                        {
                            name: 'empCode', width: 200, align: "center", sortable: false,
                            formatter: function (value, grid, rows, state) {
                                $(document).off("click", ".detaila" + rows.id).on("click", ".detaila" + rows.id, function () {
                                    that.detailClick(rows)
                                });
                                let div = `<a class="detaila${rows.id} ht-link">${rows.empCode}</a>`;
                                return div
                            }
                        },
                        {name: 'empName', width: 200, align: "center", sortable: false},
                        {name: 'sexStr', width: 200, align: "center", sortable: false},
                        {name: 'birthDate', width: 200, align: "center", sortable: false},
                        {name: 'idCard', width: 200, align: "center", sortable: false},
                        {name: 'phone', width: 200, align: "center", sortable: false},
                        {name: 'mailbox', width: 200, align: "center", sortable: false},
                        {name: 'deptName', width: 200, align: "center", sortable: false},
                        {name: 'jobNatureStr', width: 200, align: "center", sortable: false},
                        {name: 'rank', width: 200, align: "center", sortable: false},
                        {name: 'station', width: 200, align: "center", sortable: false},
                        {name: 'stationLevel', width: 200, align: "center", sortable: false},
                        {name: 'entryDate', width: 200, align: "center", sortable: false},
                        {name: 'dimissionDate', width: 200, align: "center", sortable: false},
                        {name: 'empStatusStr', width: 200, align: "center", sortable: false},
                        {name: 'depositBank', width: 200, align: "center", sortable: false},
                        {name: 'bankAccount', width: 200, align: "center", sortable: false},
                        {name: 'education', width: 200, align: "center", sortable: false},
                        {name: 'nativePlace', width: 200, align: "center", sortable: false},
                        {name: 'domicilePlace', width: 200, align: "center", sortable: false},
                        {name: 'maritalStatusStr', width: 200, align: "center", sortable: false},
                        {name: 'politicsStatus', width: 200, align: "center", sortable: false},
                    ],
                    rowNum: 999999999,//一页显示多少条
                    jsonReader: {
                        root: "data",
                    },
                    styleUI: 'Bootstrap',
                    height: $(window).height() - 210,
                    onSelectAll: function (data, status) { // 且点击头部的checkbox时才会触发此事件
                        that.handlerId(data, status, "selected");
                    },
                    onSelectRow: function (data, status) { // 当选择行时触发此事件
                        // console.log("data---------", data, status);
                        if (!!data) {
                            that.handlerId(data, status, "selected");
                            console.log(that.selected)
                            //that.getListId(that.selected, that.selectedId, that.tableList)
                        }
                    },
                    loadComplete: function (ret) {
                        //获取表格所有行数据
                        // if (ret.code === '100100') {
                        //     that.tableList = ret.data || [];
                        // }
                        // console.log('tableList', that.tableList)
                    },
                })
        },
        // 查看明细
        detailClick(row) {
            let _vm = this;
            //先把之前的数据清空
            _vm.clearDetailData();
            _vm.detailData.categoryId = _vm.formData.categoryId;
            _vm.detailData.id = row.id;
            $.ajax({
                type: 'post',
                async: false,
                data: JSON.stringify(_vue.detailData),
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                url: contextPath + '/WmEmployeeAppController/detailClick',
                success: function (result) {
                    if (result.code === '100100') {
                        _vm.detailData.empCode = result.data.empCode;
                        _vm.detailData.empName = result.data.empName;
                        _vm.detailData.basicWage = result.data.basicWage;
                        _vm.detailData.publicFunds = result.data.publicFunds;
                        _vm.detailData.socialSecurity = result.data.socialSecurity;
                        _vm.detailVisible = true;
                    } else {
                        _vm.$Modal.error({
                            title: '提示信息',
                            scrollable: true,
                            content: result.msg,
                        });
                    }
                }
            });
        },
        openFun() {
            this.filterVisible = true;
        },
        delFun() {
            this.$Modal.confirm({
                title: '提示信息',
                content: '<p>确定要删除所选</p>',
                loading: true,
                onOk: () => {
                    this.$Modal.remove();
                    setTimeout(() => {
                        _vue.deleteEmplOnCategory();
                    }, 300)

                }
            });
        },

        deleteEmplOnCategory() {
            //解除 职员与当前类别表的关系
            console.log("进入删除职员方法...");
            let _vm = this;
            let selected = _vm.selected;
            if (selected == [] || selected.length == 0) {
                _vue.$Modal.warning({
                    title: '提示信息',
                    scrollable: true,
                    content: "请选择至少1个职员!",
                });
                return;
            }
            let DeleteData = {'categoryId': _vm.formData.categoryId, 'employeeIdList': selected};
            $.ajax({
                type: 'post',
                url: contextPath + '/WmEmployeeAppController/deleteEmplOnCategory',
                data: DeleteData,
                // contentType: 'application/json',
                // dataType: "json",
                success: function (result) {
                    if (result.code === '100100') {
                        _vue.$Modal.success({
                            title: '提示信息',
                            scrollable: true,
                            content: result.msg,
                        });
                        //删除成功后刷新一下页面
                        _vue.refresh();
                    } else {
                        _vue.$Modal.error({
                            title: '提示信息',
                            scrollable: true,
                            content: result.msg,
                        })
                    }
                }
            });
        },
        importFun() {
            //点击菜单栏的 导入 按钮,显示弹出框,并执行一次查询
            this.importVisible = true;
            this.importTable();
        },
        importSerach() {
            //导入弹出框里面的 搜索 按钮..要先清空导入弹出框之前的table,再渲染新的数据
            $("#importGrid").jqGrid('setGridParam', {
                postData: JSON.stringify(_vue.importData)
            }).trigger("reloadGrid");
        },
        handlerId(data, status, type) {
            let _vm = this;
            if (typeof data === 'object' && status) {
                _vm[type] = data.filter(row => {
                    if (row != 'null' && row != '0') {
                        return row;
                    }
                });
            }
            if (typeof data === 'object' && !status) {
                _vm[type] = [];
            }
            if (typeof data === 'string') {
                if (status) {
                    let flag = (data != 'null' && data != '0');
                    if (flag) {
                        (_vm[type].indexOf(data.toString()) > -1) ? null : _vm[type].push(data.toString());
                    }
                } else {
                    let index = _vm[type].indexOf(data.toString());
                    index > -1 ? _vm[type].splice(index, 1) : null;
                }
            }
        },
        // 导入表格
        importTable() {
            let that = this;
            jQuery("#importGrid").jqGrid(
                {
                    datatype: "json",
                    mtype: 'POST',
                    postData: JSON.stringify(that.importData),
                    multiselect: true,
                    url: contextPath + '/WmEmployeeAppController/importSearch',
                    ajaxGridOptions: {contentType: 'application/json;charset=utf-8'},
                    colNames: ['id', '序号', '员工工号', '员工姓名', '性别', '出生日期', '身份证号码', '手机号码',
                        '邮箱', '所属部门', '工作性质', '职级', '员工岗位', '岗位级别', '入职日期', '离职日期',
                        '员工状态', '开户行', '银行卡号', '学历', '籍贯', '户口所在地', '婚姻状况', '政治面貌'],
                    colModel: [
                        {name: 'id', width: 50, hidden: true},
                        {name: 'serialNumber', width: 50, align: "center", sortable: false},
                        {name: 'empCode', width: 200, align: "left", sortable: false},
                        {name: 'empName', width: 200, align: "center", sortable: false},
                        {name: 'sexStr', width: 200, align: "center", sortable: false},
                        {name: 'birthDate', width: 200, align: "center", sortable: false},
                        {name: 'idCard', width: 200, align: "center", sortable: false},
                        {name: 'phone', width: 200, align: "center", sortable: false},
                        {name: 'mailbox', width: 200, align: "center", sortable: false},
                        {name: 'deptName', width: 200, align: "center", sortable: false},
                        {name: 'jobNatureStr', width: 200, align: "center", sortable: false},
                        {name: 'rank', width: 200, align: "center", sortable: false},
                        {name: 'station', width: 200, align: "center", sortable: false},
                        {name: 'stationLevel', width: 200, align: "center", sortable: false},
                        {name: 'entryDate', width: 200, align: "center", sortable: false},
                        {name: 'dimissionDate', width: 200, align: "center", sortable: false},
                        {name: 'empStatusStr', width: 200, align: "center", sortable: false},
                        {name: 'depositBank', width: 200, align: "center", sortable: false},
                        {name: 'bankAccount', width: 200, align: "center", sortable: false},
                        {name: 'education', width: 200, align: "center", sortable: false},
                        {name: 'nativePlace', width: 200, align: "center", sortable: false},
                        {name: 'domicilePlace', width: 200, align: "center", sortable: false},
                        {name: 'maritalStatusStr', width: 200, align: "center", sortable: false},
                        {name: 'politicsStatus', width: 200, align: "center", sortable: false},
                    ],
                    rowNum: 999999999,//一页显示多少条
                    jsonReader: {
                        root: "data",
                    },
                    styleUI: 'Bootstrap',
                    height: 250,
                    onSelectAll: function (data, status) { // 且点击头部的checkbox时才会触发此事件
                        that.handlerId(data, status, "impertSelected");
                    },
                    onSelectRow: function (data, status) { // 当选择行时触发此事件
                        // console.log("data---------", data, status);
                        if (!!data) {
                            that.handlerId(data, status, "impertSelected");
                            console.log(that.impertSelected)
                            //that.getListId(that.selected, that.selectedId, that.tableList)
                        }
                    },
                    loadComplete: function (ret) {

                        if (ret.code != '100100') {
                            let _msg = '页面初始化失败';
                            if (ret.hasOwnProperty("data")){
                                _msg  = ret.msg;
                            }
                            _vue.$Modal.error({
                                title:'提示信息',
                                scrollable:true,
                                content:_msg,
                            })
                            return;
                        }

                        //获取表格所有行数据
                        /*if (ret.code === '100100') {
                            that.impertTableList = ret.data || [];
                        }
                        console.log('impertTableList', that.impertTableList)*/
                        //搜索完之后,清空一下过滤条件,提高用户体验
                        _vue.importClear();
                    },
                });

            //第一次初始化也要执行一次,因为有可能用户关闭弹出框之后,再进来一次
            console.log("test");
            _vue.importClear();
            $("#importGrid").jqGrid('setGridParam', {
                postData: JSON.stringify(_vue.importData)
            }).trigger("reloadGrid");
        },
        saveFun() {
            //过滤弹出框的 确定按钮
            this.refresh();
            this.filterVisible = false;
        },
        saveCancelFun() {
            //过滤弹出框的取消按钮
            this.clearFormData();
            this.filterVisible = false;
        },
        importSaveFun() {
            //导入弹出框的 导入按钮,将把选择的idList进行导入
            this.importData.employeeIdList = this.impertSelected;
            $.ajax({
                type: 'post',
                async: false,
                data: JSON.stringify(_vue.importData),
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                url: contextPath + '/WmEmployeeAppController/importSaveFun',
                success: function (result) {
                    _vue.$Modal.success({
                        scrollable: true,
                        content: result.msg,
                    })
                }
            });

            //导入之后应该按照原参数刷新一下 importTable 以及 页面table
            $("#importGrid").jqGrid('setGridParam', {
                postData: JSON.stringify(_vue.importData)
            }).trigger("reloadGrid");

            _vue.refresh();

        },
        importCancelFun() {
            //导入弹出框的取消按钮, 把已选择的数组清空,再把导入弹出框的内容清空
            this.impertSelected = [];
            $("#importGrid").clearGridData();
            this.importVisible = false;
        },
        detailSaveFun() {
            //详情弹出框的 保存 按钮
            let _vm = this;
                $.ajax({
                type: 'post',
                async: false,
                data: JSON.stringify(_vue.detailData),
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                url: contextPath + '/WmEmployeeAppController/detailSave',
                success: function (result) {
                    if (result.code === '100100') {
                        _vm.$Modal.success({
                            title: '提示信息',
                            scrollable: true,
                            content: result.msg,
                        });
                        _vm.detailVisible = true;
                    } else {
                        _vm.$Modal.error({
                            title: '提示信息',
                            scrollable: true,
                            content: result.msg,
                        });
                    }
                }
            });
        },
        detailCancelFun() {
            //详情弹出框的 取消 按钮
            this.clearDetailData();
            this.detailVisible = false;
        },
        refresh() {
            /*简版的方法不会更新参数jQuery("#grid").trigger("reloadGrid");*/
            $("#grid").jqGrid('setGridParam', {
                postData: JSON.stringify(_vue.formData)
            }).trigger("reloadGrid");
        },
        //过滤条件的部门树
        filterDeptTreeClickCallBack(event, treeId, treeNode) {
            console.log(treeNode);
            // this.filterCard.assetTypeId = treeNode.id;
            this.formData.deptName = treeNode.title;
            this.showFilterDept = false;
        },
        //导入功能的搜索部门树
        importDeptTreeClickCallBack(event, treeId, treeNode) {
            console.log(treeNode);
            this.importData.deptName = treeNode.title;
            this.showImportDept = false;
        },
        // 当单击父节点，返回false，不让选取
        treeBeforeClick(treeId, treeNode, clickFlag) {
            return !treeNode.isParent;
        },
        showTrees(value, which, index) {
            // this.idx = index;
            switch (which) {
                case 'showFilterDept':
                    if (this.showFilterDept === true) {
                        this.showFilterDept = false;
                        return;
                    }
                    this.showFilterDept = value;
                    break;
                case 'showImportDept':
                    if (this.showImportDept === true) {
                        this.showImportDept = false;
                        return;
                    }
                    this.showImportDept = value;
                    break;
            }
        },
        categoryChange() {
            //切换工资类别的时候,先清空fomrData,的其他过滤条件,然后执行一次查询
            let _vm = this;
            let categoryId = _vm.formData.categoryId;
            _vm.importData.categoryId = categoryId;
            _vm.clearFormData();
            _vm.refresh();
            _vm.changeSysDefaultCategory(categoryId);
        },

        changeSysDefaultCategory(id){
            let _that = this;
            $.ajax({
                url: contextPath + "/category/select/" + id,
                type: "post",
                async: false,
                success: function (data) {
                    var _text = '';
                    if (data.code == '100100') {
                        _that.refresh();
                        //成功修改表中字段之后,重新刷新页面 部门树 的数据
                        _that.$refs.depTreeRef.loadData();
                        _text = data.msg;
                    } else {
                        _text = data.msg;
                    }
                    _that.$Message.info({
                        content: _text,
                        duration: 3
                    });
                }
            });
        },

        clearFormData() {
            //不能清空 categoryId
            _vue.$refs.empCodeRef.reset();
            _vue.$refs.empNameRef.reset();
            _vue.$refs.idCardRef.reset();
            _vue.$refs.mailboxRef.reset();
            _vue.$refs.phoneRef.reset();
            _vue.$refs.stationRef.reset();
            _vue.$refs.rankRef.reset();
            _vue.$refs.stationLevelRef.reset();
            _vue.$refs.educationRef.reset();
            _vue.$refs.empStatusRef.reset();
            this.formData.deptName = '';
            this.formData.entryDateStart = '';
            this.formData.entryDateEnd = '';

        },
        importClear() {
            //清除导入页面的过滤条件
            _vue.$refs.importEmpCodeRef.reset();
            _vue.$refs.importEmpNameRef.reset();
            this.importData.deptName = '';
            this.importData.employeeIdList = [];
        },
        clearDetailData() {
            let _d = this.detailData;
            //清理 详细页面数据
            _d.id = '';
            _d.categoryId = '';
            _d.empCode = '';
            _d.empName = '';
            _d.basicWage = '';
            _d.publicFunds = '';
            _d.socialSecurity = '';
        },
        //退出
        exitPrevent () {
            //关闭当前页签
            var name = '职员';
            window.parent.closeCurrentTab({'name': name, 'openTime': this.openTime, 'url': this.openTime, exit: true})
        },
    }
});