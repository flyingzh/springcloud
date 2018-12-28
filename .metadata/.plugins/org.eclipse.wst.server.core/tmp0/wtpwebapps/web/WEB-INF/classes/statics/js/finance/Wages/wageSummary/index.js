var _vue = new Vue({
    el: '#wageSummary', /*工资汇总表*/
    data() {
        return {
            orgName: '',
            dateStr: '',
            categoryStr: '',
            openTime: '',
            colNames: [],
            colModel: [],
            printInfo: {},
            printModal: false,
            filterVisible: false,
            showDept: false,
            formData: {
                showEmployee: '',
                checkStartYear: '',
                checkStartPeriod: '',
                checkEndYear: '',
                checkEndPeriod: '',
                categoryId: '',
                empName: '',
                empCode: '',
                deptName: '',
                depId: '',
                idCard: '',
                empRank: '',
                empStation: '',
                stationLevel: '',
            },
            dataList: [],
            categoryList: [],
            empNameList: [],
            empCodeList: [],
            idCardList: [],
            rankList: [],
            stationList: [],
            stationLevelList: [],
            accountantYearList: [],
            accountantPeriodList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            //渲染部门树组件
            showDepartmentTreeSetting: {
                /*data: {
                    key: {
                        name: "title"
                    }
                },*/
                callback: {
                    onClick: this.deptTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
        }
    },
    created() {
        this.orgName = layui.data('user').currentOrgName;
    },
    mounted() {
        this.openTime = window.parent.params && window.parent.params.openTime;
        //this.filterVisible = true;
        let _vm = this;
        _vm.initPage();
    },
    methods: {
        //点击过滤弹窗,展示部门树
        showDepartmentTree(value, which, index) {
            if (this.showDept === true) {
                this.showDept = false;
                return;
            }
            this.showDept = value;
        },
        //部门树点击事件
        deptTreeClickCallBack(event, treeId, treeNode) {
            console.log(treeNode);
            this.formData.depId = treeNode.id;
            this.formData.deptName = treeNode.name;
            this.showDept = false;
        },
        //当单击父节点，返回false，不让选取
        treeBeforeClick(treeId, treeNode, clickFlag) {
            return !treeNode.isParent;
        },

        initPage() {
            //初始化数据
            let _vm = this;
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + '/personalIncomeTaxReportAppController/initPage',
                success: function (result) {
                    console.log("result", result);
                    if (result.code == '100100') {
                        let _r = result.data;
                        _vm.categoryList = _r.categoryList;
                        _vm.empNameList = _r.empNameList;
                        _vm.empCodeList = _r.empCodeList;
                        _vm.idCardList = _r.idCardList;
                        _vm.rankList = _r.rankList;
                        _vm.stationList = _r.stationList;
                        _vm.stationLevelList = _r.stationLevelList;
                        _vm.accountantYearList = _r.accountYearList;
                        _vm.formData.checkStartYear = _r.curYear;
                        _vm.formData.checkStartPeriod = _r.curPeriod;
                        _vm.formData.checkEndYear = _r.curYear;
                        _vm.formData.checkEndPeriod = _r.curPeriod;
                        if (_r.accountPeriodNumber === 13) {
                            _vm.accountantPeriodList.push(13);
                        }
                        _vm.dateStr = _vm.formData.checkStartYear + '年' + _vm.formData.checkStartPeriod + '期 -- '
                            + _vm.formData.checkEndYear + '年' + _vm.formData.checkEndPeriod + '期';
                        _vm.categoryStr = '全部';
                    } else {
                        _vm.$Modal.error({
                            title: '提示信息',
                            content: result == null || result.msg == null || result.msg == '' ? "页面初始化失败" : result.msg
                        })
                    }
                }
            });
            //初始化完页面之后执行一次查询
            this.getGridData();
        },

        getGridData() {
            let that = this;
            $.ajax({
                type: 'post',
                dataType: 'json',
                async: false,
                data: JSON.stringify(that.formData),
                url: contextPath + '/wageSummaryReportAppController/getWageSummaryReportList',
                contentType: 'application/json;charset=utf-8',
                success: function (result) {
                    if (result.code != '100100') {
                        let _msg = '页面初始化失败';
                        if (result.hasOwnProperty("data")){
                            _msg  = result.msg;
                        }
                        that.$Modal.error({
                            title:'提示信息',
                            scrollable:true,
                            content:_msg,
                        });
                        return;
                    }

                    let data = result.data;
                    that.colNames = data.colNames;
                    that.colModel = data.colModel;
                    that.dataList = data.dataList;
                    that.jqGridInit();
                }
            });
        },

        // 生成jqGrid
        jqGridInit() {
            let that = this;
            jQuery("#grid").jqGrid({
                datatype: "local",
                colNames: that.colNames,
                colModel: that.colModel,
                data: that.dataList,
                sortable: false,
                styleUI: 'Bootstrap',
                height: $(window).height() - 210,
                loadComplete: function (ret) {
                    $("table[id='grid'] tr[id='-2'] td").addClass("alltotalClass");
                }
            });
            this.$Message.info("数据加载中...");
        },

        delTable() {
            $("#grid").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="grid"></table><div id="page"></div>`).appendTo(parent);
        },

        open() {
            this.filterVisible = true;
        },
        _nullData(_t) {
            if (_t) {
                return _t;
            } else {
                return '';
            }
        },
        formartMoney(value) {
            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
        },
        //点击保存
        saveFun: function () {
            this.refresh();
            this.filterVisible = false;
        },
        //点击取消或者x
        cancelFun: function () {
            this.clearFormData();
            this.filterVisible = false;
        },
        //刷新
        refresh () {
            this.delTable();
            this.getGridData();  //刷新
        },
        //引出
        exportExcel() {

        },
        clearFormData(){
            //过滤查询弹出框,点击取消按钮,清除过滤条件的formData
            this.formData.showEmployee = false;
            _vue.$refs.categoryIdRef.reset();
            _vue.$refs.empCodeRef.reset();
            _vue.$refs.empNameRef.reset();
            _vue.$refs.idCardRef.reset();
            this.formData.deptName = '';
            this.formData.depId = '';
            _vue.$refs.empStationRef.reset();
            _vue.$refs.empRankRef.reset();
            _vue.$refs.stationLevelRef.reset();
        },
        //退出
        exitPrevent() {
            //关闭当前页签
            var name = '折旧费用分配表';
            window.parent.closeCurrentTab({'name': name, 'openTime': this.openTime, 'url': this.openTime, exit: true})

        },
        //打印
        print() {

        },
        printModalShow(_t) {
            this.printModal = _t;
        },

        exitThisPage() {
            //退出当前页签
            window.parent.closeCurrentTab({name: '折旧费用分配表', openTime: this.openTime, exit: true})
        },
    },
});