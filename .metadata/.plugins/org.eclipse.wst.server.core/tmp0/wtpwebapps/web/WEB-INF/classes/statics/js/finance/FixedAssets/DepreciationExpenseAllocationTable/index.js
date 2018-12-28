var _vue = new Vue({
    el: '#depreciationExpenseAllocationTable',
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
            itemList: [
            ],
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
                // check7:'',
                // check8:'',
                // check10:'',
                // check11:'',
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

            subjectVisable: false,
        }
    },
    //获取会计科目列表
    mounted () {
        this.openTime = window.parent.params && window.parent.params.openTime;
        this.filterVisible = true;
        this.economicUseList = getCodeList("fixedAssets_economicUse");
        let _vm = this;
        _vm.initPage();
    },
    methods: {

        Merger(gridName, cellName) {
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
                for (var j = i+1; j <= length; j++) {
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
        showDepartmentTree (value, which, index) {
            switch (which) {
                case 'assetsClassType':
                    if (this.assetsClassType === true) {
                        this.assetsClassType = false;
                        return;
                    }
                    this.assetsClassType = value;
                    break;
                case 'useStateType':
                    if (this.useStateType === true) {
                        this.useStateType = false;
                        return;
                    }
                    this.useStateType = value;
                    break;
                case 'useDepartmentType':
                    if (this.useDepartmentType === true) {
                        this.useDepartmentType = false;
                        return;
                    }
                    this.useDepartmentType = value;
                    break;
                case 'alterTypeType':
                    if (this.alterTypeType === true) {
                        this.alterTypeType = false;
                        return;
                    }
                    this.alterTypeType = value;
                    break;
                case 'showChangeMethod':
                    if (this.showChangeMethod === true) {
                        this.showChangeMethod = false;
                        return;
                    }
                    this.showChangeMethod = value;
                    break;
                default:
                    break;
            }
        },
        initPage () {
            //初始化数据
            let _vm = this;
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + '/expenseAllocation/initData',
                success: function (result) {
                    console.log("result", result);
                    if (result.code == '100100') {
                        _vm.formData.startYear = result.data.year.presents[0];
                        _vm.formData.endYear = result.data.year.presents[0];
                        _vm.formData.startPeriod = result.data.year.presents[1];
                        _vm.formData.endPeriod = result.data.year.presents[1];
                        _vm.accountantYearList = result.data.year.year;
                        _vm.accountantPeriodList = result.data.year.period;
                        _vm.projectCategory = result.data.detailProjectList;
                        _vm.organizationList = result.data.org;
                        _vm.formData.sobId = result.data.org[0].value;
                    }else {
                        _vm.$Modal.error({
                            title:'提示',
                            content:result==null||result.msg==null||result.msg==''?"页面初始化失败":result.msg
                        })
                    }
                }
            });
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
            var _cn = ['id'], _col = [{ name: 'cardId', width: 30, hidden: true, frozen: true }];
            var _dcn1 = ['费用科目代码', '费用科目名称'];
            var _dcol1 = [
                { name: 'subjectCode', width: 175 },
                { name: 'subjectName', width: 175, align: "right" },
            ];

            var _dcn2 = ['金额'];
            var _dcol2 = [
                {
                    name: 'amount', width: 175, formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }
                },
            ];
            this.formData.claType && (_cn.push('类别'), _col.push({
                name: 'assetTypeName', width: 100,
                // cellattr: function (rowId, val, rawObject, cm, rdata) {
                //     // console.log(rowId, val, rawObject, cm, rdata, '========rowId, val, rawObject, cm, rdata=======');
                //     if (rawObject.mergeColumn) {
                //         return 'style="border-bottom: none;"'
                //     } else {
                //         return ''
                //     }
                // }
            }));
            this.formData.departmentType && (_cn.push('使用部门'), _col.push({
                name: 'useDepartment', width: 100, frozen: true,
                // cellattr: function (rowId, val, rawObject, cm, rdata) {
                //
                //     // console.log(rowId, val, rawObject, cm, rdata, '========rowId, val, rawObject, cm, rdata=======');
                //     if (rawObject.departmentColumn) {
                //         return 'style="border-bottom: none;"'
                //     } else {
                //         return ''
                //     }
                // }
            }));
            // this.formData.check3 && (_cn.push('经济用途'), _col.push({ name: 'name', width: 100, frozen: true }));
            // this.formData.check4 && (_cn.push('存放地点'), _col.push({ name: 'locationName', width: 100, frozen: true }));
            // this.formData.check5 && (_cn.push('变动方式'), _col.push({ name: 'changemodeName', width: 100, frozen: true }));
            // this.formData.check6 && (_cn.push('使用状态'), _col.push({ name: 'stateName', width: 100, frozen: true }));
            this.formData.showProject && (_dcn1.push(this.projectName), _dcol1.push({ name: 'itemClassName', width: 300 }));
            this.colNames = [..._cn, ..._dcn1, ..._dcn2];
            this.colModel = [..._col, ..._dcol1, ..._dcol2];
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

                    // _vm.dataList = ret.data || [];

                    _vm.dateStr = _vm.formData.startYear + '年' + _vm.formData.startPeriod + '期 -- ' + _vm.formData.endYear + '年' + _vm.formData.endPeriod + '期';;
                    console.log("_vm.dateStr", _vm.dateStr)
                },
                gridComplete: function () {
                    var gridName = 'grid';
                    if (_vue.formData.claType && _vue.formData.departmentType) {
                        _vue.Merger(gridName,'assetTypeName');
                        _vue.Merger(gridName,'useDepartment');
                    }else if(_vue.formData.claType && !_vue.formData.departmentType) {
                        _vue.Merger(gridName,'assetTypeName');
                    }else if (!_vue.formData.claType && _vue.formData.departmentType){
                        _vue.Merger(gridName,'useDepartment');
                    }
                    $('table[id="grid"] tr td[title="小计"]').siblings().addClass("subtotalClass");
                    $('table[id="grid"] tr td[title="小计"]').addClass("subtotalClass");
                    $('table[id="grid"] tr td[title="合计"]').siblings().addClass("alltotalClass");
                    $('table[id="grid"] tr td[title="合计"]').addClass("alltotalClass");
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
            this.formData.relateSubjectId = $.trim(this.subjectName) ? this.formData.relateSubjectId : 0;
            this.formData.assetsClassId = $.trim(this.assetsClassName) ? this.formData.assetsClassId : 0;
            this.formData.useStateId = $.trim(this.useStateName) ? this.formData.useStateId : 0;
            this.formData.alterTypeId = $.trim(this.alterTypeName) ? this.formData.alterTypeId : 0;
            this.formData.useDepartmentId = $.trim(this.useDepartmentName) ? this.formData.useDepartmentId : 0;
            // $("#grid").jqGrid('setGridParam', { postData: JSON.stringify(this.formData) }).trigger("reloadGrid");
            this.initMethod();
            this.dateStr = this.formData.startYear + '年' + this.formData.startPeriod + '期 -- ' + this.formData.endYear + '年' + this.formData.endPeriod + '期';
            this.filterVisible = false;
        },
        //重置其他查询条件按钮
        reset(){
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
            this.initMethod();
        },
        //引出
        exportExcel () {

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