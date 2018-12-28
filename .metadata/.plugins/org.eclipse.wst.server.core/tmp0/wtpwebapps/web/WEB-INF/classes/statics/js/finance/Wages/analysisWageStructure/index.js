var vm = new Vue({
    el: '#analysisWageStructure',
    data () {
        return {
            formData: {
                for1: '',
                for3: '',
            },
            wmPerPayParamsVO: {
                categoryId: 0,
                taxonomy: '',
                itemCode: '',
                startAccountYear: 0,
                startAccountPeriod: 0,
                endAccountYear: 0,
                endAccountPeriod: 0
            },
            taxonomys: {},
            taxonomyName: '',
            wmCategoryEntities: {},
            wmItemsEntities: {},
            dateList: [],
            sysStartYear: 0,       //系统启用年
            sysStartPeriod: 0,     //系统启用期间
            currenAccountYear: 0,       //系统当前年
            currenAccountPeriod: 0,     //系统当前期间
            startYearPeriodList: [],   //选择启用年度时 启用年!=当前年 可选期间
            endYearPeriodList: [],     //选择当前年度时 可选期间
            periodList: [],           //除开始年度,当前年度可用的全年12期 期间
            startEndPeriodList: [],   //启用年 = 当前期间年
            startPeriodList: [],
            endPeriodList: [],
            accountYearList: [],
            openTime: '',
            isPreDisabled: false,
            isNextDisabled: false,
            yearList: [],
            periodList: [],
            filterVisible: true,
            base_config: {
                treeGrid: true,
                treeGridModel: 'adjacency', //treeGrid模式，跟json元数据有关 ,adjacency/nested
                ExpandColumn: 'accountCode',
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/wmPerPayAnalysis/filter',
                ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                datatype: 'json',
                postData: JSON.stringify(this.wmPerPayParamsVO),
                jsonReader: {
                    root: "data",
                    cell: "data",
                    // userdata: "data.userData",
                    repeatitems: false
                },
                treeReader: {
                    level_field: "level",
                    parent_id_field: "accountPid",
                    leaf_field: "leaf",
                    expanded_field: "expanded"
                },
                viewrecords: true,
                rowNum: 99999,
                shrinkToFit: false
            },
            colNames: [],
            colModel: [],
            tableHeaders: [],
            orgList: [],
        }
    },
    created: function () {
        var _vm = this;
        _vm.initFilterParam();
        _vm.openTime = window.parent.params && window.parent.params.openTime;
    },
    mounted () {

    },
    methods: {
        startYearMethod (value) {

            // let newValue = this.filterCard.startAccountYear;
            this.wmPerPayParamsVO.startAccountPeriod = null;
            this.startPeriodList = null;
            this.selectStartPeriod(value);
        },
        selectStartPeriod (newValue) {
            if (newValue == this.sysStartYear && this.currenAccountYear != this.sysStartYear) {
                //选择为启用年 当前年!=启用年
                this.startPeriodList = this.startYearPeriodList;
            } else if (newValue == this.sysStartYear && this.currenAccountYear == this.sysStartYear) {
                //选择为启用年 当前年=启用年
                this.startPeriodList = this.startEndPeriodList;
            } else if (newValue == this.currenAccountYear && this.currenAccountYear != this.sysStartYear) {
                //选择为当前年 当前年!=启用年
                this.startPeriodList = this.endYearPeriodList;
            } else {
                //除开始年度,当前年度之间年 可用的全年12期 期间
                this.startPeriodList = this.periodList;
            }
        },
        startPeriodMethod (value) {
            let startYear = this.wmPerPayParamsVO.startAccountYear;
            let startPeriod = this.wmPerPayParamsVO.startAccountPeriod;
            this.wmPerPayParamsVO.endAccountYear = startYear;
            this.wmPerPayParamsVO.endAccountPeriod = startPeriod;
        },
        endYearMethod (value) {
            // let newValue = this.filterCard.endAccountYear;
            if (this.wmPerPayParamsVO.startAccountYear > this.wmPerPayParamsVO.endAccountYear) {
                //截止年不能小于起始年
                this.whetherFilter = false
                layer.alert('截止年不能小于起始年');
                this.$refs.sel3.reset();
                this.$refs.sel4.reset();
                return false;
            }
            this.wmPerPayParamsVO.endAccountPeriod = null;
            this.endPeriodList = null;
            this.$refs.sel4.reset();
            this.selectEndPeriod(value);
        },
        selectEndPeriod (newValue) {
            if (newValue == this.sysStartYear && this.currenAccountYear != this.sysStartYear) {
                //选择为启用年 当前年!=启用年
                this.endPeriodList = this.startYearPeriodList;
            } else if (newValue == this.sysStartYear && this.currenAccountYear == this.sysStartYear) {
                //选择为启用年 当前年=启用年
                this.endPeriodList = this.startEndPeriodList;
            } else if (newValue == this.currenAccountYear && this.currenAccountYear != this.sysStartYear) {
                //选择为当前年 当前年!=启用年
                this.endPeriodList = this.endYearPeriodList;
            } else {
                //除开始年度,当前年度之间年 可用的全年12期 期间
                this.endPeriodList = this.periodList;
            }
        },
        endPeriodMethod (newVal, oldVal) {

            let startYear = this.wmPerPayParamsVO.startAccountYear;
            let startPeriod = this.wmPerPayParamsVO.startAccountPeriod;
            let endYear = this.wmPerPayParamsVO.endAccountYear;
            let endPeriod = this.wmPerPayParamsVO.endAccountPeriod;
            if (startYear > endYear || (startYear == endYear && startPeriod > endPeriod)) {
                //截止期间不能小于起始期间
                layer.alert('截止期间不能小于起始期间');
                return false;
            }

        },
        _clearUser () {
        },
        //初始化过滤条件
        initFilterParam () {
            let that = this;
            $.ajax({
                url: contextPath + '/wmPerPayAnalysis/initPage',
                data: '',
                type: 'post',
                dateType: 'json',
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    if (res.code == '100100') {
                        console.log('初始化过滤条件>>>', res.data);
                        that.wmCategoryEntities = res.data.wmCategoryEntities;
                        that.wmItemsEntities = res.data.wmItemsEntities;
                        that.wmPerPayParamsVO.categoryId = that.wmCategoryEntities[0].id;
                        that.wmPerPayParamsVO.itemCode = that.wmItemsEntities[0].itemCode;

                        //除开始年度,当前年度可用的全年12期 期间
                        that.accountYearList = res.data.dateList.yearList;
                        //选择启用年度时 可选期间
                        that.startYearPeriodList = res.data.dateList.startYearPeriodList;
                        //选择当前年度时 可选期间
                        that.endYearPeriodList = res.data.dateList.endYearPeriodList;
                        //启用年 = 当前期间年
                        that.startEndPeriodList = res.data.dateList.startEndPeriodList;

                        that.sysStartYear = res.data.dateList.startSysYear;
                        that.sysStartPeriod = res.data.dateList.startSysPeriod;

                        that.wmPerPayParamsVO.startAccountYear = that.wmPerPayParamsVO.endAccountYear = that.currenAccountYear = res.data.dateList.currenAccountYear;
                        that.wmPerPayParamsVO.startAccountPeriod = that.wmPerPayParamsVO.endAccountPeriod = that.currenAccountPeriod = res.data.dateList.currenAccountPeriod;
                        that.selectStartPeriod(that.wmPerPayParamsVO.startAccountYear);
                        that.selectEndPeriod(that.wmPerPayParamsVO.startAccountYear);
                    }
                },
                error (res) {
                    that.$Modal.error({
                        title: '提示',
                        content: "页面初始化失败"
                    })
                }
            })
            that.initTaxonomyList();
        },
        //获得分类标准
        initTaxonomyList () {
            this.taxonomys = getCodeList("wm_taxonomy");
            console.log(' this.taxonomys===', this.taxonomys)
            this.wmPerPayParamsVO.taxonomy = this.taxonomys[0].value;
            this.taxonomyName = this.taxonomys[0].name;
        },
        //资产列表弹窗
        onAssets () {
            // if (this.showReceive || this.showUserInfo) {
            //     return;
            // }
            this.showAssetsList = true;
        },
        //关闭资产列表弹窗
        closeAssets () {
            // this.card.AssetsId = this.selectAssets.id;
            // this.formData.assetsName = this.selectAssets.supplierName;
            this.formData.assetCode = this.selectAssets.assetCode;
            this.formData.assetName = this.selectAssets.assetName;
            this.showAssetsList = false;
        },
        assetTypeTreeClickCallBack (event, treeId, treeNode) {
            console.log(treeNode);
            if (treeNode.children != null && treeNode.children.length != 0) {
                /*this.$Message.error("请选择最明细类别");*/
                return;
            }
            this.formData.assetTypeValue = treeNode.name;
            this.formData.assetType = treeNode.id;
            this.showAssetType = false;
        },
        depTreeClickCallBack (event, treeId, treeNode) {
            console.log(treeNode);
            if (treeNode.children != null && treeNode.children.length != 0) {
                /*this.$Message.error("请选择最明细部门");*/
                return;
            }
            this.formData.depValue = treeNode.name;
            this.formData.depName = treeNode.name;
            this.formData.depId = treeNode.id;
            this.showDepType = false;
        },
        showTree (value, which, index) {
            switch (which) {
                case 'showAssetType':
                    if (this.showAssetType === true) {
                        this.showAssetType = false;
                        return;
                    }
                    this.showAssetType = value;
                    break;
                case 'showDepType':
                    if (this.showDepType === true) {
                        this.showDepType = false;
                        return;
                    }
                    this.showDepType = value;
                    break;
            }
        },
        getLastDay (y, m) {//根据年月获取当月最后一天
            var dt = new Date(y, m, 1);
            var cdt = new Date(dt.getTime() - 1000 * 60 * 60 * 24);
            return cdt.getFullYear() + "-" + (Number(cdt.getMonth()) + 1) + "-" + cdt.getDate();
        },
        operateDate (date) {
            return new Date(date).format("yyyy-MM-dd");
        },
        initData () {  //初始化日期数据
            let that = this;
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + '/expenseAllocation/initData',
                success: function (result) {
                    if (result == null || result.code != '100100') {
                        that.$Modal.error({
                            title: '提示',
                            content: result == null || result.msg == null || result.msg == '' ? "页面初始化失败" : result.msg
                        })
                    } else {
                        var data = result.data;
                        that.yearList = data.year.year;
                        that.periodList = data.year.period;
                        that.formData.startYear = data.year.presents[0];   //默认选中当前会计年度
                        that.formData.startPeriod = data.year.presents[1];
                        that.formData.endYear = data.year.presents[0];
                        that.formData.endPeriod = data.year.presents[1];

                        that.faStartYear = data.faStartYear;
                        that.faStartPeriod = data.faStartPeriod;
                        that.faCurYear = data.year.presents[0];
                        that.faCurPeriod = data.year.presents[1];

                        that.orgList = data.org;
                        that.formData.sobId = that.orgList[0].value
                        that.initMethod();
                    }
                },
                error (result) {
                    that.$Modal.error({
                        title: '提示',
                        content: "页面初始化失败"
                    })
                }
            });
        },
        // 初始值
        initMethod () {
            this.delTable();
            this.setTableHeader();
        },
        setTableHeader () {
            let that = this;
            that.colNames = ['id', that.taxonomyName, '人数', '人数比例(%)', '最低工资',
                '最高工资', '平均工资', '工资总量', '总量比例(%)'
            ];
            that.colModel = [
                { name: 'id', width: 30, hidden: true },
                { name: 'postDepartName', width: 150, align: 'center' },
                { name: 'peopleNum', width: 100, align: 'center' },
                {
                    name: 'peopleRatio', width: 100, align: 'center', formatter: function (value, options, rowData) {
                        return value==null? '0':(value * 100).toFixed(2);
                    }
                },
                { name: 'minWage', width: 100, align: 'center', formatter: function (value, options, rowData) {
                    return value==null? '':value.toFixed(2);
                } },
                { name: 'maxWage', width: 150, align: 'center', formatter: function (value, options, rowData) {
                    return value==null? '':value.toFixed(2);}
                },
                { name: 'avgWage', width: 100, align: 'center', formatter: function (value, options, rowData) {
                    return value==null? '':value.toFixed(2);} },
                { name: 'totalWage', width: 150, align: 'right', formatter: function (value, options, rowData) {
                    return value==null? '':value.toFixed(2);} },
                {
                    name: 'totalRatio', width: 120, align: 'right', formatter: function (value, options, rowData) {
                        return value==null? '':(value * 100).toFixed(2);
                    }
                }

            ];
            that.tableHeaders = [];
            that.base_config.height = $(window).height() - 180;
            that.jqGridInit(that.colNames, that.colModel, that.tableHeaders);
        },
        delTable () {
            $("#grid").empty();// 清空表格内容
            var parent = $("#subsidiaryLedger_jqGrid_wrapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="grid"></table><div id="page"></div>`).appendTo(parent);
        },
        // 生成jqGrid
        jqGridInit (colNames, colModel, headers) {
            let _vm = this;
            let config = Object.assign({},
                this.base_config,
                {
                    colNames: colNames,
                    colModel: colModel,
                    postData: JSON.stringify(_vm.wmPerPayParamsVO),
                    loadComplete: function (ret) { },
                    gridComplete: function () { },

                });
            jQuery("#grid").jqGrid(config);
        },
        open () {
            this.filterVisible = true;
        },
        refresh () { //刷新
            this.save();
        },
        save () {
            let startYear = this.wmPerPayParamsVO.startAccountYear;
            let startPeriod = this.wmPerPayParamsVO.startAccountPeriod;
            let endYear = this.wmPerPayParamsVO.endAccountYear;
            let endPeriod = this.wmPerPayParamsVO.endAccountPeriod;
            if (startYear != null && startPeriod == null) {
                layer.alert('已选择起始会计年度,起始期间数不能为空');
                return false;
            }
            if (startYear != null && startPeriod != null && endYear != null && endPeriod == null) {
                layer.alert('已选择截止会计年度,截止期间数不能为空');
                return false;
            }
            this.filterVisible = false;
            let filterStr1 = this.wmPerPayParamsVO.startAccountYear + '年' + this.wmPerPayParamsVO.startAccountPeriod + '期';
            if (endYear != null) {
                filterStr1 = filterStr1 + ' 至 ' + this.wmPerPayParamsVO.endAccountYear + '年' + this.wmPerPayParamsVO.endAccountPeriod + '期';
            }
            this.formData.for3 = filterStr1;
            this.formData.for1 = (this.wmCategoryEntities.find(item => { return item.id === this.wmPerPayParamsVO.categoryId })).categoryName;
            let _item = this.taxonomys.find(item => { return item.value === this.wmPerPayParamsVO.taxonomy });
            this.taxonomyName = _item.name;
            //加载grid
            this.base_config.url = contextPath + '/wmPerPayAnalysis/filter';
            this.base_config.postData = JSON.stringify(this.wmPerPayParamsVO);

            this.initMethod();
        },
        cancel () {
            this.filterVisible = false;
        },
        exportExcel () {
        },
        exitPrevent () {
            window.parent.closeCurrentTab({ name: '固定资产明细账', openTime: this.openTime, exit: true })
        },
        nullValue (exp) {  //设置空
            if (exp == null || typeof (exp) == "undefined" || exp == 0) {
                return '';
            }
            return exp;
        },
        formartMoney (value) {
            return value == null || value == 0 ? '0.00' : accounting.formatNumber(value, 2, ",");
        },
        clearAssetCode () {
            this.formData.assetCode = '';
            this.formData.assetName = '';
        },
        clearAssetType () {
            this.formData.assetType = '';
            this.formData.assetTypeValue = '';
        },
        clearDepId () {
            this.formData.depValue = '';
            this.formData.depName = '';
            this.formData.depId = '';
        }
    },
    watch: {
    }
})