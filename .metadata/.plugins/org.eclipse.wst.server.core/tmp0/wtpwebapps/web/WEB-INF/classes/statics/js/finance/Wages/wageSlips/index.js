var _vue = new Vue({
    el: '#wageSlips',
    data () {
        return {
            dateStr: "",
            openTime: '',
            colNames: [],
            colModel: [],
            yearList: [],
            monthList: [],
            printInfo: {},
            printModal: false,
            showDept: false,
            deptName: '',
            colList: [], //工资条表头
            entityList: [], //工资条对象
            itemList: [],
            rankList: [], //职级
            stationList: [], //岗位
            stationLevelList: [],//岗位级别
            wmSheetParmas: {
                sobId: layui.data('user').userCurrentOrganId, //组织
                filterYear: 0, //会计年
                filterPeriod: 0, //会计期
                empCode: '',  //员工工号
                empName: '', //员工姓名
                idCard: '',  //身份证号
                deptId: '',  //所属部门
                rank: '',     //职级
                station: '',  //员工岗位
                stationLevel: '' //岗位级别
            },
            sysStartYear: 0,       //系统启用年
            sysStartPeriod: 0,     //系统启用期间
            currenAccountYear: 0,       //系统当前年
            currenAccountPeriod: 0,     //系统当前期间
            startYearPeriodList: [],   //选择启用年度时 启用年!=当前年 可选期间
            endYearPeriodList: [],     //选择当前年度时 可选期间
            periodList: [],           //除开始年度,当前年度可用的全年12期 期间
            startEndPeriodList: [],   //启用年 = 当前期间年
            startPeriodList: [],
            accountYearList: [],
            formData: {
                startYear: '',
                endYear: '',
                startPeriod: '',
                endPeriod: '',
                claType: true,
                departmentType: true,
                showProject: true,//是否显示核算项目
                projectId: '',//核算项目类别
                startCode: '', //起始核算项目code
                endCode: '', //结束核算项目code
                relateSubjectId: '', // 科目id
                // subjectCode: '',
                // subjectName: '',
                sobId: 0,//组织id
                economicUse: '', //经济用途
                assetsClassId: 0,//资产类别id
                useStateId: 0,//使用状态id
                alterTypeId: 0,//变动方式id
                useDepartmentId: 0//使用部门id
            },
            subjectName: '',//科目名称
            assetsClassName: '',//页面展示资产类别名称
            assetsClassType: false, //资产类别树开关
            useStateName: '',//使用状态名称
            useStateType: false,//使用状态树展开与关闭
            useDepartmentName: '',//使用部门名称
            useDepartmentType: false,//使用部门树开关
            alterTypeName: '',//
            alterTypeType: false,//变动方式树开关
            projectName: '核算项目',
            projectCategory: [],//核算项目类别
            projectCategoryId: [],//核算项目类别id
            accountingItems: [],//核算项目明细集合
            accountantYearList: [],//会计年度集合
            accountantPeriodList: [], //会计期间集合
            economicUseList: [],//经济用途集合
            currentOrgName: '',
            isEdit: true,
            filterVisible: false,
            dataList: [],
            showAssetType: false,
            organizationList: [],
            useDepartmentTreeSetting: {
                callback: {
                    onClick: this.useDepartmentTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            assetsClassTreeSetting: {
                callback: {
                    onClick: this.assetsClassTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            useStateTreeSetting: {
                callback: {
                    onClick: this.useStateTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            alterTypeTreeSetting: {
                callback: {
                    onClick: this.alterTypeTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            //渲染部门树组件
            showDepartmentTreeSetting: {
                callback: {
                    onClick: this.deptTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            subjectVisable: false,
            base_config: {
                treeGrid: true,
                treeGridModel: 'adjacency', //treeGrid模式，跟json元数据有关 ,adjacency/nested
                ExpandColumn: 'accountCode',
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/wmSheet/filter',
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
            dataList: [],
            tableHeaders: [],
            table1DataList: [{ 'id': '1', 'name': '001' }, { 'id': '2', 'name': '002' }],
        }
    },
    created () {

        this.currentOrgName = layui.data('user').currentOrgName
    },
    //获取会计科目列表
    mounted () {
        this.openTime = window.parent.params && window.parent.params.openTime;
        this.filterVisible = true;
        // this.economicUseList = getCodeList("fixedAssets_economicUse");
        let _vm = this;
        _vm.initPage();
    },
    watch:{
        deptName(newValue,oldValue){
            if(newValue == ''){
                this.wmSheetParmas.deptId = null;
            }
        }
    },
    methods: {
        //引出
        exportExcel(){
            let parma = this.wmSheetParmas;
            window.frames.exportIframe.location.href = contextPath + '/wmSheet/expord?sobId='+parma.sobId+
                                                                                        '&filterYear='+parma.filterYear+
                                                                                        '&filterPeriod='+parma.filterPeriod+
                                                                                        '&empCode='+parma.empCode+
                                                                                        '&empName='+parma.empName+
                                                                                        '&idCard='+parma.idCard+
                                                                                        '&deptId='+parma.deptId+
                                                                                        '&rank='+parma.rank+
                                                                                        '&station='+parma.station+
                                                                                        '&stationLevel='+parma.stationLevel
            ;
        },
        //点击过滤弹窗,展示部门树
        showDepartmentTree (value, which, index) {
            if (this.showDept === true) {
                this.showDept = false;
                return;
            }
            this.showDept = value;
        },
        //部门树点击事件
        deptTreeClickCallBack (event, treeId, treeNode) {
            console.log(treeNode);
            this.wmSheetParmas.deptId = treeNode.id;
            this.deptName = treeNode.name;
            this.showDept = false;
        },
        Merger (gridName, cellName) {
            //得到显示到界面的id集合
            var mya = $("#" + gridName + "").getDataIDs();
            //数据总行数
            var length = mya.length;
            //定义合并行数
            var rowSpanTaxCount = 1;
            for (var i = 0; i < length; i += rowSpanTaxCount) {
                //从当前行开始比对下面的信息
                var before = $("#" + gridName + "").jqGrid('getRowData', mya[i]);
                rowSpanTaxCount = 1;
                for (var j = i + 1; j <= length; j++) {
                    //和上边的信息对比 如果值一样就合并行数+1 然后设置rowspan 让当前单元格隐藏
                    var end = $("#" + gridName + "").jqGrid('getRowData', mya[j]);
                    if (before[cellName] == end[cellName]) {
                        rowSpanTaxCount++;
                        $("#" + gridName + "").setCell(mya[j], cellName, '', { display: 'none' });
                    } else {
                        break;
                    }
                }
                $("#" + gridName + "").setCell(mya[i], cellName, '', '', { rowspan: rowSpanTaxCount });
            }
        },

        // 科目下拉框
        showSubjectVisable (type) {
            this.subjectVisable = true;
        },
        //资产类别下拉
        assetsClassTreeClickCallBack (event, treeId, treeNode) {
            // console.log(treeNode,'资产类别');
            this.formData.assetsClassId = treeNode.id;
            this.assetsClassName = treeNode.name;
            this.assetsClassType = false;
        },
        treeBeforeClick (treeId, treeNode, clickFlag) {
            // console.log("treeNode",treeNode)
            return !treeNode.isParent;
        },
        //使用状态下拉
        useStateTreeClickCallBack (event, treeId, treeNode) {
            // console.log(treeNode,'使用状态');
            this.formData.useStateId = treeNode.id;
            this.useStateName = treeNode.name;
            this.useStateType = false;
        },
        //使用部门下拉
        useDepartmentTreeClickCallBack (event, treeId, treeNode) {
            // console.log(treeNode,'使用部门');
            this.formData.useDepartmentId = treeNode.id;
            this.useDepartmentName = treeNode.name;
            this.useDepartmentType = false;
        },
        //变动方式下拉
        alterTypeTreeClickCallBack (event, treeId, treeNode) {
            // console.log(treeNode,'变动方式');
            this.formData.alterTypeId = treeNode.id;
            this.alterTypeName = treeNode.name;
            this.alterTypeType = false;
        },
        subjectClose () {
            this.subjectVisable = false;
        },
        subjectData (treeNode) {
            console.log(treeNode, '====treeNode');
            var that = this;
            that.formData.relateSubjectId = treeNode.id;
            that.subjectName = treeNode.subjectName + '--' + treeNode.subjectCode;
            this.subjectClose();
        },
        initPage () {
            //初始化数据
            let that = this;
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + '/wmSheet/init',
                success: function (res) {
                    console.log("result", res);
                    if (res.code == '100100') {
                        //职级
                        that.rankList = res.data.rankList,
                            //岗位
                            that.stationList = res.data.stationList,
                            //岗位级别
                            that.stationLevelList = res.data.stationLevelList,

                            //除开始年度,当前年度可用的全年12期 期间
                            that.accountYearList = res.data.yearList;
                        //选择启用年度时 可选期间
                        that.startYearPeriodList = res.data.startYearPeriodList;
                        //选择当前年度时 可选期间
                        that.endYearPeriodList = res.data.endYearPeriodList;
                        //启用年 = 当前期间年
                        that.startEndPeriodList = res.data.startEndPeriodList;

                        that.sysStartYear = res.data.startSysYear;
                        that.sysStartPeriod = res.data.startSysPeriod;

                        that.wmSheetParmas.filterYear = that.currenAccountYear = res.data.currenAccountYear;
                        that.wmSheetParmas.filterPeriod = that.currenAccountPeriod = res.data.currenAccountPeriod;
                        that.selectStartPeriod(that.wmSheetParmas.filterYear);

                    } else {
                        that.$Modal.error({
                            title: '提示',
                            content: result == null || result.msg == null || result.msg == '' ? "页面初始化失败" : result.msg
                        })
                    }
                }
            });
        },
        startYearMethod (value) {

            this.wmSheetParmas.filterPeriod = null;
            // this.startPeriodList = null;
            this.$refs.sel2.reset();
            this.$nextTick(function () {
                this.selectStartPeriod(value);
            });
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
            let length = this.startPeriodList.length;
            this.wmSheetParmas.filterPeriod = this.startPeriodList[length - 1];
        },

        accountingItem () {
            let _vm = this;
            for (var i = 0; i < _vm.projectCategory.length; i++) {
                if (_vm.formData.projectId == _vm.projectCategory[i].id) {
                    _vm.accountingItems = _vm.projectCategory[i].value;
                }
            }
        },
        initMethod () {
            this.delTable();
            this.setTableHeader();
        },

        delTable () {
            $("#grid").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="grid"></table><div id="page"></div>`).appendTo(parent);
        },

        setTableHeader () {
            //mergeColumn
            var that = this;
            this.colNames = [];
            this.colModel = [];
            // this.base_config.height = $(window).height() - 100;
            this.tableHeaders = [];
            //this.base_config.height = $(window).height() - 140;
            that.jqGridInit(that.colNames, that.colModel, that.tableHeaders);
        },

        // 生成jqGrid
        jqGridInit (colNames, colModel, headers) {

            let _vm = this;
            let config = {
                colNames: colNames,
                colModel: colModel,
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/expenseAllocation/detail',
                ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                datatype: 'json',
                postData: JSON.stringify(_vm.formData),
                jsonReader: {
                    root: "data",
                    cell: "list",
                    repeatitems: false
                },
                height: $(window).height() - 140,
                rowNum: -1,
                viewrecords: true,
                loadComplete: function (ret) {
                    console.log("ret", ret)
                    if (ret.code != '100100') {
                        let _msg = '系统异常!';
                        if (ret.hasOwnProperty("data")) {
                            _msg = ret.msg;
                        }
                        layer.alert(_msg);
                        return;
                    }
                    _vm.dateStr = _vm.wmSheetParmas.filterYear +"年"+_vm.wmSheetParmas.filterPeriod+"期";
                    console.log("_vm.dateStr", _vm.dateStr)
                },
                gridComplete: function () {
                },
            };
            jQuery("#grid").jqGrid(config);

        },
        open () {
            this.filterVisible = true;
        },
        _nullData (_t) {
            if (_t) {
                return _t;
            } else {
                return '';
            }
        },
        formartMoney (value) {
            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
        },
        //点击保存
        save: function () {

            console.log('wmSheetParmas==', this.wmSheetParmas);
            //加载grid
            let that = this;
            that.dateStr = that.wmSheetParmas.filterYear +"年"+that.wmSheetParmas.filterPeriod+"期";
            let _url = contextPath + '/wmSheet/fieldsAndVals';
            let _param = JSON.stringify(that.wmSheetParmas);
            $.ajax({
                url: _url,
                type: "POST",
                dateType: "json",
                contentType: "application/json;charset=utf-8",
                data: _param,
                success: function (res) {
                    if (res.code == '100100') {
                        that.entityList = res.data.entityList;
                        if(that.entityList.length==0){
                            that.$Modal.error({
                                title:'信息提示',
                                content:`<p>无职员信息</p>`,
                            });
                            return;
                        }
                        that.colList = res.data.colList;
                    }
                },
                error (res) {
                    that.$Modal.error({
                        title: '提示',
                        content: "页面数据加载失败"
                    })
                }
            })
            this.filterVisible = false;
        },
        //重置其他查询条件按钮
        reset () {
            this.formData.relateSubjectId = 0;
            this.formData.assetsClassId = 0;
            this.formData.useStateId = 0;
            this.formData.alterTypeId = 0;
            this.formData.useDepartmentId = 0;
            this.formData.economicUse = '';
            this.subjectName = '';
            this.assetsClassName = '';
            this.useStateName = '';
            this.alterTypeName = '';
            this.useDepartmentName = '';

        },
        // trim (str){
        //     return str.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');
        // },
        //点击取消或者x
        cancel: function () {
            this.filterVisible = false;
        },
        //刷新
        refresh () {
            window.top.home.loading('show',{text:'数据正在加载中，请稍等'});
            this.save();
            this.$nextTick(function () {
                window.top.home.loading('hide');
            })
        },
        //退出
        exitPrevent () {
            //关闭当前页签
            var name = '折旧费用分配表';
            window.parent.closeCurrentTab({ 'name': name, 'openTime': this.openTime, 'url': this.openTime, exit: true })

        },
        //打印
        print () {

        },
        printModalShow (_t) {
            this.printModal = _t;
        },

        exitThisPage () {
            //退出当前页签
            window.parent.closeCurrentTab({ name: '折旧费用分配表', openTime: this.openTime, exit: true })
        },
    },
});