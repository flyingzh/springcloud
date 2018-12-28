new Vue({
    el: '#wagePaymentDetail',
    data() {
        return {
            formData: {
                categoryId: 0,//工资类别id
                employeePost: '',//员工岗位
                empRank:'', // 职级
                postLevel:'',//岗位级别
                itemIds:[],
                startYear:0,
                startPeriod:0,
                endYear:0,
                endPeriod:0,
                empName:'',
                empCode:'',
                empIDCard:'',
                depId:'',
                empStation:'',
                empRank:'',
                empStationLevel:''
            },
            planName:'',
            employeePostList: [],//员工岗位集合
            categoryList: [],//工资类别集合
            rankList:[],//职级集合
            postLevelList:[],//岗位级别集合

            colNames: [],
            colModel: [],
            dataList:[],
            filterVisible: false,
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
            endPeriodList:[],//结束会计期间集合
            assetsClassTreeSetting: {//资产类别
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
        }
    },
    created() {
        this.organizationName = window.parent.userInfo.orgName;
    },
    mounted() {
        this.init();
        // this.pageInit();
    },
    computed: {
        getCategoryName(){
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
                if(this.accountantYearList[i].year == this.formData.endYear){
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
                        that.checkList = data.data.itemsList;
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
                        that.getGridData();
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
        getGridData(){
            var that = this;
            var itemIds = [];
            for(var i = 0,len = that.checkList.length ; i<len ;i++){
                itemIds.push(parseInt(that.checkList[i].id));
            }
            console.log("itemIds",itemIds)
            //选中列的id
            that.formData.itemIds = itemIds;
            $.ajax({
                type: 'post',
                dataType:'json',
                async:false,
                data: JSON.stringify(that.formData),
                contentType: 'application/json',
                url: contextPath + '/wmWageSchedule/getDetailsOfPaymentOfWages',
                success: function (result) {
                    console.log("result",result)
                    if(result.code == '100100'){
                        var data = result.data;
                        that.colModel = data.colModel;
                        that.colNames = data.colNames;
                        that.dataList = data.dataList;
                        that.jqGridList();
                    }else {
                        that.$Message.info({
                            content: result.msg,
                            duration: 3
                        });
                    }
                }
            });
        },
        // 生成jqGrid
        jqGridList(){
            let that = this;
            console.log(that.colNames,that.colModel)
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
                // gridComplete() { // 多表头表格设置
                //     console.log("that.tableHeader11s",that.tableHeaders)
                //     jQuery("#grid").jqGrid('setGroupHeaders', {
                //         useColSpanStyle: true,
                //         groupHeaders:that.tableHeaders
                //     });
                // },
            });
            this.$Message.info("数据加载中...");
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
        refresh() {
            // jQuery("#grid").trigger("reloadGrid");  //刷新
            this.delTable();

        },
        //点击树选择，函数名自己改
        assetsClassTreeClickCallBack(event, treeId, treeNode) {
            console.log(treeNode);
            this.formData.planId = treeNode.id;
            this.planName = treeNode.name;
            this.showAssetType = false;
        },
        //当单击父节点，返回false，不让选取
        treeBeforeClick(treeId, treeNode, clickFlag) {
            return !treeNode.isParent;
        },
        showTrees(value, which, index) {
            // this.idx = index;
            switch (which) {
                case 'showAssetType':
                    if (this.showAssetType === true) {
                        this.showAssetType = false;
                        return;
                    }
                    this.showAssetType = value;
                    break;
            }
        },
    }
})