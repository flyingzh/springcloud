new Vue({
    el: '#wagePaymentDetail',
    data() {
        return {
            openTime: '',   //用于控制退出按钮
            formData: {
                categoryId: 0,//工资类别id
                itemIds: [],
                startYear: 0,
                startPeriod: 0,
                endYear: 0,
                endPeriod: 0,
                empName: '',
                empCode: '',
                empIDCard: '',
                depId: '',
                planId: 0,
                empStation: '',
                empRank: '',
                empStationLevel: '',
                sortId: 0
            },
            planName: '',
            employeePostList: [],//员工岗位集合
            categoryList: [],//工资类别集合
            rankList: [],//职级集合
            postLevelList: [],//岗位级别集合

            colNames: [],
            colModel: [],
            dataList: [],
            filterVisible: true,
            copyVisible: false,
            calcVisible: false,
            orgName: "",
            title: "",
            tableList: [],
            chooseId: '',
            organizationName: '',
            filterTableList: [],  // 获取列表列的所有数据
            organizationList: [],
            showAssetType: false,
            accountantYearList: [],//会计年度集合
            startPeriodList: [], //起始会计期间集合
            endPeriodList: [],//结束会计期间集合
            assetsClassTreeSetting: {//资产类别
                data: {
                    key: {
                        name: "title"
                    }
                },
                callback: {
                    onClick: this.assetsClassTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            checkAll: true,
            columns1: [
                {type: 'selection', width: 60, align: 'center'},
                {title: '项目名称', key: 'itemName', width: 100},
                {title: '序号', key: 'sortId', width: 70}
            ],
            dataList: [],
            checkList: [],
            detail_table: [],
            printInfo: {},
            printModal: false,
        }
    },
    created() {

    },
    mounted() {

        this.init();
        this.openTime = window.parent.params && window.parent.params.openTime;
        // this.pageInit();
    },
    computed: {
        getCategoryName() {
            for (var i = 0, len = this.categoryList.length; i < len; i++) {
                if (this.formData.categoryId == this.categoryList[i].id) {
                    return this.categoryList[i].categoryName;
                }
            }
            return '';
        },
    },
    methods: {

        rowDblclick(item) {
            var that = this;
            console.log(item, '==================1');

            setTimeout(function () {
                that.checkList = [];
            }, 1000);
        },
        selectionChange(item) {
            console.log(item, '==================2');
            this.checkList = item;
        },

        selectionPeriod() {
            for (var i = 0, len = this.accountantYearList.length; i < len; i++) {
                if (this.accountantYearList[i].year == this.formData.startYear) {
                    this.startPeriodList = this.accountantYearList[i].period;
                }
                if (this.accountantYearList[i].year == this.formData.endYear) {
                    this.endPeriodList = this.accountantYearList[i].period;
                }
            }
            console.log(this.accountantPeriodList, " this.periodList ")
        },
        //初始化加载
        init() {
            var that = this;
            $.ajax({
                url: contextPath + "/wmWageSchedule/init",
                type: "post",
                async: false,
                success: function (data) {
                    console.log("data", data);
                    if (data.code == '100100') {
                        that.detail_table = data.data.itemsList;
                        that.organizationName = data.data.org.label;
                        // that.checkList = data.data.itemsList;
                        that.formData.categoryId = data.data.wmCategory;
                        that.categoryList = data.data.categoryList;
                        that.rankList = data.data.filterList.rankList;
                        that.postLevelList = data.data.filterList.stationLevelList;
                        that.employeePostList = data.data.filterList.stationList;
                        that.formData.startYear = data.data.accountingYearAndPeriods.year;
                        that.formData.startPeriod = data.data.accountingYearAndPeriods.period;
                        that.formData.endYear = data.data.accountingYearAndPeriods.year;
                        that.formData.endPeriod = data.data.accountingYearAndPeriods.period;
                        that.accountantYearList = data.data.accountingYearAndPeriods.list;
                        that.selectionPeriod();
                    }
                }
            })
        },
        delTable() {
            //清空列名称 及 数据
            this.colNames = [];
            this.colModel = [];
            this.dataList = [];
            $("#grid").empty();// 清空表格内容
            var parent = $("#subsidiaryLedger_jqGrid_wrapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="grid"></table><div id="page"></div>`).appendTo(parent);

            this.getGridData();
        },
        getGridData() {
            var that = this;
            var itemIds = [];
            var sortId = 0;
            var itemId = 0;
            for (var i = 0, len = that.checkList.length; i < len; i++) {
                itemIds.push(parseInt(that.checkList[i].id));
                if (i == 0) {
                    sortId = that.checkList[i].sortId;
                    itemId = that.checkList[i].id;
                } else {
                    if (sortId > that.checkList[i].sortId) {
                        sortId = that.checkList[i].sortId;
                        itemId = that.checkList[i].id;
                    }
                }
            }

            // var orderNumber = Math.max.apply(Math, that.checkList.map(function(o) {return o.sortId}));
            // console.log("orderNumber",orderNumber);
            // console.log("itemIds", itemIds)
            //选中列的最小的序号列 第一列
            that.formData.sortId = itemId;
            //选中列的id
            that.formData.itemIds = itemIds;
            console.log('that.formData', that.formData)
            $.ajax({
                type: 'post',
                dataType: 'json',
                async: false,
                data: JSON.stringify(that.formData),
                contentType: 'application/json',
                url: contextPath + '/wmWageSchedule/getDetailsOfPaymentOfWages',
                success: function (result) {
                    console.log("result", result)
                    if (result.code == '100100') {
                        var data = result.data;
                        that.colModel = data.colModel;
                        that.colNames = data.colNames;
                        that.dataList = data.dataList;
                        // console.log("data.colModel",data.colModel,"data.colNames",data.colNames)
                        that.jqGridList();
                    } else {
                        that.$Message.info({
                            content: result.msg,
                            duration: 3
                        });
                    }
                }
            });
        },
        // 生成jqGrid
        jqGridList() {
            let that = this;
            console.log(that.colNames, that.colModel)
            jQuery("#grid").jqGrid({
                datatype: "local",
                colNames: that.colNames,
                colModel: that.colModel,
                data: that.dataList,
                sortable: false,
                styleUI: 'Bootstrap',
                height: $(window).height() - 210,
                loadComplete: function (ret) {
                    $("table[id='grid']").addClass("alltotalClass");
                },
                gridComplete() { // 多表头表格设置
                    // console.log("that.tableHeader11s",that.tableHeaders)
                    // jQuery("#grid").jqGrid('setGroupHeaders', {
                    //     useColSpanStyle: true,
                    //     groupHeaders:that.tableHeaders
                    // });

                },
            });
            this.$Message.info("数据加载中...");
        },
        //判断部门名称为空时的操作 将员工置空 部门id置空
        show(value) {
            if (!this.planName) {
                this.formData.planId = 0;
            }
            console.log("this.formData.planId", this.formData.planId)
        },
        filterFun() {
            this.filterVisible = true;

        },
        copyFun() {
            this.copyVisible = true;
        },
        calcFun() {
            this.calcVisible = true;
        },
        delFun() {
            this.$Modal.confirm({
                title: '提示信息',
                content: '<p>确定要删除所选</p>',
                loading: true,
                onOk: () => {
                    console.log("删除");
                    setTimeout(() => {
                        this.$Modal.remove();
                    }, 2000);
                }
            });
        },
        // 打印
        mimeograph() {
            var that = this;
            console.log(that.dataList, '=========that.tableList');
            if (!that.dataList || !that.dataList.length) {
                that.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }
            //that.colNames  that.colModel
            var colNameList = [];
            for (var i = 0, len = that.colNames.length; i < len; i++) {
                var colName = {'name': that.colNames[i], 'col': that.colModel[i].name};
                colNameList.push(colName);
            }
            console.log("colNameList", colNameList)
            var _info = {
                'title': '凭证管理',  // 标题
                'template': 1,  // 模板
                'titleInfo': [],      // title
                'colNames': colNameList,
                'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                'colMaxLenght': 9,  // 显示最大长度， 默认为7
                'data': that.dataList,  // 打印数据  list
            }
            // 弹窗选择列 模式
            that.printInfo = _info;
            that.printModalShow(true);
        },
        printModalShow(_t) {
            this.printModal = _t;
        },
        save() {
            this.refresh();
            this.filterVisible = false;
        },
        cancel() {
            this.filterVisible = false;
        },
        cancelFun() {
            this.filterVisible = false;
        },
        closeWindow: function () {
            //关闭当前页签
            var name = '费用分配与凭证';
            window.parent.closeCurrentTab({'name': name, 'openTime': this.openTime, 'url': this.openTime, exit: true})
        },
        refresh() {
            // jQuery("#grid").trigger("reloadGrid");  //刷新
            this.delTable();

        },
        //导出
        exports() {
            var that = this;
            var itemIds = [];  // 选中的工资项目展示列的项目id
            var sortId = 0;  // 选中序号最小列
            var itemId = 0;  // 选中最小列的id
            for (var i = 0, len = that.checkList.length; i < len; i++) {
                itemIds.push(parseInt(that.checkList[i].id));
                if (i == 0) {
                    sortId = that.checkList[i].sortId;
                    itemId = that.checkList[i].id;
                } else {
                    if (sortId > that.checkList[i].sortId) {
                        sortId = that.checkList[i].sortId;
                        itemId = that.checkList[i].id;
                    }
                }
            }
            //选中列的最小的序号列 第一列
            that.formData.sortId = itemId;
            //选中列的id
            that.formData.itemIds = itemIds;
            console.log('that.formData', that.formData)
            // categoryId: 0,//工资类别id
            //     empRank: '', // 职级
            //     itemIds: [],
            //     startYear: 0,
            //     startPeriod: 0,
            //     endYear: 0,
            //     endPeriod: 0,
            //     empName: '',
            //     empCode: '',
            //     empIDCard: '',
            //     depId: '',
            //     planId: 0,
            //     empStation: '',
            //     empRank: '',
            //     empStationLevel: '',
            //     sortId:0


            var _url = contextPath + "/wmWageSchedule/exportExcel?categoryId=" + that.formData.categoryId + "&employeePost=" + that.formData.employeePost +
                "&itemIds=" + that.formData.itemIds.toString() + "&startYear=" + that.formData.startYear + "&startPeriod=" + that.formData.startPeriod +
                "&endYear=" + that.formData.endYear + "&endPeriod=" + that.formData.endPeriod + "&empName=" + that.formData.empName +
                "&empCode=" + that.formData.empCode + "&empIDCard=" + that.formData.empIDCard + "&depId=" + that.formData.depId +
                "&planId=" + that.formData.planId + "&empStation=" + that.formData.empStation + "&empRank=" + that.formData.empRank +
                "&empStationLevel=" + that.formData.empStationLevel + "&sortId=" + that.formData.sortId;
            window.open(_url);
        },
        //点击树选择，函数名自己改
        assetsClassTreeClickCallBack(event, treeId, treeNode) {
            console.log(treeNode, '----');
            this.formData.planId = treeNode.id;
            this.planName = treeNode.title;
            console.log(this.planName, this.formData.planId, '------');
            this.showAssetType = false;
        },
        //当单击父节点，返回false，不让选取
        treeBeforeClick(treeId, treeNode, clickFlag) {
            return !treeNode.isParent;
        },
        showTrees(value, which) {
            var that = this;
            // this.idx = index;
            switch (which) {
                case 'showAssetType':
                    if (that.showAssetType === true) {
                        that.showAssetType = false;
                        return;
                    }
                    that.showAssetType = value;
                    break;
            }
        },
    }
})