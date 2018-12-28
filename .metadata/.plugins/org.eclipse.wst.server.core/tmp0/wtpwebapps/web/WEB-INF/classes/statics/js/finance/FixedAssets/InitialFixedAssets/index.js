var ve = new Vue({
    el: '#initial-fixed-assets',
    data () {
        let This = this;
        return {
            id: '',     //当前页面所显示卡片的id
            startUsing: false,      //是否已启用固定资产模块

            enabledAccountYear: '',
            enabledAccountPeriod: '',
            currentAccountYear: '',
            currentAccountPeriod: '',

            changeDateScope: '',

            enterOrChange: '入账日期：',      //入账日期或变动日期

            previousFirstClick: true,       //进入add页面还没点击过上一页按钮
            nextFirstClick: true,       //进入add页面还没点击过下一页按钮

            firstWatchDeptSingleMul: true,       //页面加载时触发watch
            firstWatchSubjectSingleMul: true,       //页面加载时触发watch
            zclbId: 'assetTypeId',
            syztId: 'useStateId',
            bdfsId: 'alterTypeId',
            bmId: 'departmentId',
            managerType: '',        //页面类型，包括初始化、新增、修改、查看、变动

            hasVoucher: false,      //当前期间固定资产是否已生成凭证

            tempDeviceList: [],     //暂存附属设备情况
            tempSingleSubjectTreeNode: {},      //暂存单个折旧费用分配科目情况
            tempMulExpenseList: [],     //暂存多个折旧费用分配科目的情况
            tempMulCurrencyList: [],        //暂存多个币种的列表

            assetTypeName: '',  //资产类别名称
            deptName: '',       //部门名称
            useStateName: '',   //使用状态名称
            changeMethodName: '',       //变动方式名称
            supplierName: '',   //供应商名称

            // departmentTip: '',      //部门分配结果str
            // subjectTip: '',         //折旧费用分配结果str
            // currencyTip: '',       //原值str

            subjectTpye: '',    //四个科目窗口

            deptSingleMul: 1,  //分配部门是单个还是多个
            singleDepartmentList: [],   //选择单个部门是保存选择的分配部门
            mulDepartmentList: [],      //选择多个部门时保存选择的分配部门

            subjectSingleMul: 1,    //分配科目是单个还是多个
            singleSubjectList: [],  //选择单个分配科目时保存科目比例
            mulSubjectList: [],     //选择多个分配科目时保存科目比例

            currencySingleMul: 1,       //单币种或多币种
            singleCurrencyList: [],     //选择单币种时保存币种列表
            mulCurrencyList: [],        //选择多币种时保存币种列表

            singleProjectList: [],      //选择单个分配科目是的核算项目列表

            singleCurrency: {
                id: null,
                assetId: null,
                currencyId: null,
                exchangeRate: 1,
                orgValFor: 0.00,
                orgVal: 0.00

            },     //选择单币别

            singleStandardAmount: 0,      //单币别综合本位币金额
            mulStandardAmount: 0,         //多币别综合本位币金额
            allotDepartmentName: '',    //使用部门名称
            idx: '',        //分配部门数组index
            subjectIdx: '',     //折旧费用分配科目index


            // attachTotal: '',    //附属设备总金额
            card: {
                orginCardId: null,
                sobId: 100,
                accountYear: null,
                accountPeriod: null,
                changeType: null,
                assetTypeId: null,
                assetCode: '',
                assetName: null,
                unitGroupId: null,
                unitId: null,
                num: 1,
                enterAccountDate: new Date(),
                locationId: null,
                useType: null,
                useStateId: null,
                alterTypeId: null,
                model: null,
                originPlace: null,
                supplierId: null,
                manufacturer: null,
                remark: null,
                assetSubjectId: null,
                deprSubjectId: null,
                buyOrgVal: 0,
                buyDepr: 0,
                orgValAdjust: 0,
                beginUsedate: null,
                expectUsePeriods: 0,
                usePeriodsBeforeservice: 0,
                deprService: 0,
                deprServiceAdjust: 0,
                expectNetSalvage: 0,
                devalPreparation: 0,
                deductionAmount: 0,
                deprMethod: null,

                yearOriginalIncrease: 0,
                yearOriginalDecrease: 0,
                yearAccumulatedDepreciationIncrease: 0,
                yearAccumulatedDepreciationDecrease: 0,
                yearImpairmentIncrease: 0,
                yearImpairmentDecrease: 0,
                yearDepreciationsAlreadyPrepared: 0,
                yearAmountAdjust: 0,
                cardScrap: 0,

                financeFaAttachDeviceList: [],
                financeFaAssignDeptList: [],

                financeFaOrginValList: []

            },
            assetType: {},      //查询资产类别的预设值

            openData: {
                assetCode: '',
                changeType: ''
            },

            options: {
                disabledDate (date) {
                    // This.$nextTick(function () {                                              
                    //
                    // })
                    if (This.managerType == 'init' || (This.managerType == 'copy' && !This.startUsing) || (This.managerType == 'update' && !This.startUsing)) {
                        return date && date.valueOf() > This.card.enterAccountDate.valueOf();
                    } else if (This.managerType == 'change') {

                        return date.valueOf() < new Date(This.changeDateScope.startDate).valueOf() || date.valueOf() > new Date(This.changeDateScope.endDate).valueOf()
                        // return date && date.valueOf() >= new Date(This.changeDateScope.endDate).valueOf();
                    } else if (This.managerType == 'add' || This.managerType == 'copy' || This.managerType == 'update') {
                        return date.valueOf() < new Date(This.changeDateScope.startDate).valueOf();
                    }

                }
            },

            currentPeriodStr: null,
            numberOfPreiodInUse: null,
            accumulatedDepreciation: null,
            formData: {
                'subjectName': '', 'subjectCode': '', 'subjectId': '',
                // 基本信息
                basicInformation: {
                    for1: '',
                    for2: '',
                    for3: '',
                    for4: '',
                    for5: '',
                    for6: '',
                    for7: '',
                    for8: '',
                    for9: '',
                    for10: '',
                    for11: '',
                    for12: '',
                    for13: '',
                    for14: '',
                    for15: '',
                    for16: '',
                    for17: '',
                },
                // 部门及其他
                otherDepartments: {
                    for1: '',
                    for2: '',
                    for3: '1',
                    for4: '',
                    for5: '1',
                },
                // 原值与折扣
                discountOriginal: {
                    for1: '1',
                    for2: '',
                    for3: '',
                    for4: '',
                    for5: '',
                    for6: '',
                    for7: '',
                    for8: '',
                    for9: '',
                    for10: '',
                    for11: '',
                    for12: '',
                    for13: '',
                    for14: '',
                    for15: '',
                    for16: '',
                    for17: '',
                    for18: '',
                    for19: '',
                },
                // 初始化数据
                initData: {
                    for1: '',
                    for2: '',
                    for3: '',
                    for4: '',
                    for5: '',
                    for6: '',
                    for7: '',
                    for8: '',
                    for9: '',
                    for10: '',
                    for11: '',
                    for12: '',
                    for13: '',
                    for14: '',
                    for15: '',
                    for16: '',
                    for17: '',
                    for18: '',
                }

            },
            documentTypeList: [],
            organizationList: [
                { 'value': 1, 'label': '金大祥集团' },
                { 'value': 2, 'label': '航天集团' },
                { 'value': 3, 'label': '粮食集团' },
            ],
            unitGroupList: [],
            unitList: [],
            deviceUnitList: [],
            locationList: [],
            economyUseList: [],
            currencyList: [],
            deprMethodList: [],
            // unitGroup: 0,       //固定资产单位组id
            deviceUnitGroup: 0,     //设备单位组id
            showSupplier: false,    //显示供应商弹窗
            assetSubjectName: '',   //固定资产科目名称
            depreciationSubjectName: '',    //累计折旧科目名称
            allotSubjectName: '',       //折旧费用分配科目名称
            selectSupplier: '',
            nodesList: {},
            //收支类型树形
            nodes: [],
            parValueStr: ['100元', '50元', '20元', '10元', '5元', '2元', '1元', '5角', '2角', '1角', '5分', '2分', '1分'],
            setting: {
                callback: {
                    onClick: this.clickEvent,
                }
            },
            formItem: {
                input: '',
                select: '',
                radio: 'male',
                checkbox: [],
                switch: true,
                date: '',
                time: '',
                slider: [20, 50],
                textarea: ''
            },
            showdepreciation: false,
            treeUrl: '',

            assetTypeTreeSetting: {
                callback: {
                    onClick: this.assetTypeTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            useStateTreeSetting: {
                callback: {
                    onClick: this.useStateTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            changeMethodTreeSetting: {
                callback: {
                    onClick: this.changeMethodTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            supplierTreeSetting: {
                callback: {
                    onClick: this.supplierTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            departmentTreeSetting: {
                callback: {
                    onClick: this.sinDepartmentTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            mulDepartmentTreeSetting: {
                callback: {
                    onClick: this.mulDepartmentTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },

            treeSetting: {
                callback: {
                    onClick: this.treeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            showAssetType: false,
            showUseState: false,
            showChangeMethod: false,
            showSupplier: false,
            showDepartment: false,
            showMulDepartment: [],
            showAll: false,
            subjectVisable: false,
            cardVisible: false,
            tableList: [],
            selected: [],  // 获取列表列的勾选数组的rowId
            selectedId: [],   // 获取列表列的勾选数组的id
            base_config: {
                multiselect: true,
                mtype: 'POST',
                styleUI: 'Bootstrap',
                // url: contextPath + '/cashier/cashierDetail',
                url: contextPath + '/facard/listcard',
                ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                datatype: 'json',
                jsonReader: {
                    root: "data",
                    // cell: "list",
                    // userdata: "data.userData",
                    // repeatitems: false
                },
                height: $(window).height() - 140,
                viewrecords: true,
                rowNum: 999999999,
                onSelectAll: function (data, status) { // 且点击头部的checkbox时才会触发此事件
                    This.handlerId(data, status, "selected");
                    // that.getListId(that.selected, that.selectedId, that.tableList)
                },
                // beforeSelectRow: function (data, status) { // 当选择行时触发此事件
                //     console.log("data---------111",data, status);
                //     if(!!data){
                //         return false;
                //     }
                // },
                onSelectRow: function (data, status) { // 当选择行时触发此事件
                    console.log("data---------", data, status);
                    if (!!data) {
                        This.handlerId(data, status, "selected");
                        console.log(This.selected)
                        //that.getListId(that.selected, that.selectedId, that.tableList)
                    }
                },
                gridComplete: function () {
                    $("table[id='grid'] tr[id='null'] input").attr('style', 'display:none')
                    $("table[id='grid'] tr[id='0'] input").attr('style', 'display:none')
                    window.top.home.loading('hide');
                },
            },
            colNames: [],
            colModel: [],
            tableHeaders: [],
            SEListVisible: false,   //附属设备清单
            dataList: [],
            allShow: false,
            SDARListVisible: false, //选择部门及分配比例
            SDARdataList: [],
            SDARallShow: false,
            MDCAListVisible: false, //多个折扣费用分配
            MDCAdataList: [],
            MDCAallShow: false,
            MMCDListVisible: false, //维护多币别数据
            MMCDdataList: [],
            MMCDallShow: false,
            addSubjectListOptShow: false,
            testitemList: {},

            assetTypeTree: [],
            useStateTree: [],
            alterTypeTree: [],
            departmentTree: [],
            initSubjectList: [],
        }
    },
    methods: {

        openSEListModal () {
            this.tempDeviceList = this.dataList;
            this.SEListVisible = true;
        },
        cancelSEListModal (_t) {
            this.SEListVisible = false;
        },
        showSDARListModal (_t) {
            this.SDARListVisible = _t;
        },
        showMDCAListModal (_t) {
            var that = this;

            if (_t) {
                if ((that.deptSingleMul == 1 && that.singleDepartmentList.length < 1) || (that.deptSingleMul == 2 && that.mulDepartmentList.length < 1)) {
                    that.wrapAlert("要进行折旧费用分配，部门信息不能为空！");
                    return;
                }
                //保存修改前的折旧费用分配情况，以防其取消修改
                that.tempMulExpenseList = that.MDCAdataList;
            } else {
                //取消便恢复之前保存好的原分配情况
                that.MDCAdataList = that.tempMulExpenseList;
            }

            this.MDCAListVisible = _t;
        },
        showMMCDListModal (_t) {
            var that = this;
            if (_t) {
                //打开多个币别编辑窗口后暂存好原币别数据
                that.tempMulExpenseList = that.MMCDdataList;
            } else {
                //用户点击取消恢复原币别数据
                that.MMCDdataList = that.tempMulExpenseList;
            }
            this.MMCDListVisible = _t;
        },
        openCardModal () {
            this.cardVisible = true;
        },
        cancelModal (_t) {
            this.cardVisible = false;
        },
        // 科目树
        showSubjectVisable (type, index) {
            if (this.managerType == 'info') {
                return false;
            }
            //多个折旧费用分配科目保存索引
            if (type == 4) {
                this.subjectIdx = index;
            }
            var that = this;

            //单个折旧费用分配科目
            if (type == 3) {
                if ((that.deptSingleMul == 1 && that.singleDepartmentList.length < 1) || (that.deptSingleMul == 2 && that.mulDepartmentList.length < 1)) {
                    that.wrapAlert("要进行折旧费用分配，部门信息不能为空！");
                    return;
                }

                //每次打开单科目分配窗口都清空singleSubjectList
                that.singleSubjectList = [];

            }


            this.subjectVisable = true;
            this.subjectTpye = type;
        },
        subjectClose () {
            this.subjectVisable = false;
        },
        initsubjectFn (_list) {
            var that = this;
            console.log(_list, '=========_list=============');
            _list.forEach(function (_i) {
                switch (_i.id) {
                    case 1:
                        that.assetSubjectName = _i.value.subjectName;
                        break;
                    case 2:
                        that.depreciationSubjectName = _i.value.subjectName;
                        break;
                }
            })


        },
        subjectData (treeNode) {
            var that = this;
            switch (this.subjectTpye) {
                //固定资产科目弹窗
                case 1:
                    this.card.assetSubjectId = treeNode.id;
                    this.assetSubjectName = treeNode.subjectName;
                    break;
                //累计折旧科目弹窗
                case 2:
                    this.card.deprSubjectId = treeNode.id;
                    this.depreciationSubjectName = treeNode.subjectName;
                    break;
                //折旧费用分配选择单个科目的科目弹窗
                case 3:
                    that.tempSingleSubjectTreeNode = treeNode; //暂存单个科目选择情况
                    console.log(treeNode);
                    // for (var i=0;i<that.card.financeFaAssignDeptList.length;i++) {
                    //     this.singleSubjectList.push({
                    //         id: null,
                    //         departmentAllotId: null,
                    //         deptId: that.card.financeFaAssignDeptList[i].deptId,
                    //         expenseSubjectId: treeNode.id,
                    //         rate: 1
                    //     });
                    // }
                    //查询此科目的核算项目列表
                    that.listSingleProjectList(treeNode.id);

                    if (that.deptSingleMul == 1) {
                        //构造
                        for (var i = 0; i < that.singleDepartmentList.length; i++) {
                            this.singleSubjectList.push({
                                id: null,
                                departmentAllotId: null,
                                deptId: that.singleDepartmentList[i].deptId,
                                expenseSubjectId: treeNode.id,
                                rate: 100,
                                itemRelateDetailList: that.singleProjectList
                            });
                        }

                        for (var i = 0; i < that.singleProjectList.length; i++) {
                            that.singleProjectList[i].id = null;
                            that.singleProjectList[i].relateType = 5;
                            that.singleProjectList[i].itemId = null;
                            that.singleProjectList[i].relateId = null;
                            that.singleProjectList[i].sobId = null;
                        }
                        //清空
                        for (var i = 0; i < that.singleDepartmentList.length; i++) {
                            that.singleDepartmentList[i].financeFaAssignExpenseList = [];
                        }
                        //挂载
                        for (var i = 0; i < that.singleDepartmentList.length; i++) {
                            for (var j = 0; j < that.singleSubjectList.length; j++) {
                                if (that.singleDepartmentList[i].deptId == that.singleSubjectList[j].deptId) {
                                    that.singleDepartmentList[i].financeFaAssignExpenseList.push(that.singleSubjectList[j]);
                                }
                            }
                        }
                    } else {
                        //构造
                        for (var i = 0; i < that.mulDepartmentList.length; i++) {
                            this.singleSubjectList.push({
                                id: null,
                                departmentAllotId: null,
                                deptId: that.mulDepartmentList[i].deptId,
                                expenseSubjectId: treeNode.id,
                                rate: 100,
                                itemRelateDetailList: []
                            });
                        }

                        for (var i = 0; i < that.singleProjectList.length; i++) {
                            that.singleProjectList[i].id = null;
                            that.singleProjectList[i].relateType = 5;
                            that.singleProjectList[i].itemId = null;
                            that.singleProjectList[i].relateId = null;
                            that.singleProjectList[i].sobId = null;
                        }

                        //清空
                        for (var i = 0; i < that.mulDepartmentList.length; i++) {
                            that.mulDepartmentList[i].financeFaAssignExpenseList = [];
                        }
                        //挂载
                        for (var i = 0; i < that.mulDepartmentList.length; i++) {
                            for (var j = 0; j < that.singleSubjectList.length; j++) {
                                if (that.mulDepartmentList[i].deptId == that.singleSubjectList[j].deptId) {
                                    that.mulDepartmentList[i].financeFaAssignExpenseList.push(that.singleSubjectList[j]);
                                }
                            }
                        }
                    }
                    this.allotSubjectName = treeNode.subjectName;
                    // that.subjectTip = treeNode.subjectName.split(' ')[1] + ':100%';
                    break;
                //折旧费用分配选择多个科目的多个科目弹窗
                case 4:

                    that.tempMulExpenseList = that.MDCAdataList;

                    $.ajax({
                        url: contextPath + '/facard/listaccountingproject/' + treeNode.id,
                        type: 'post',
                        async: false,
                        success: function (data) {
                            that.MDCAdataList[that.subjectIdx].itemRelateDetailList = data.data;
                        }
                    });

                    //封装数据
                    // for (var i = 0; i < that.MDCAdataList.length; i++) {
                    //     for (var j = 0; j < that.MDCAdataList[i].itemRelateDetailList.length; j++) {
                    //         that.MDCAdataList[i].itemRelateDetailList[j].id = null;
                    //         that.MDCAdataList[i].itemRelateDetailList[j].relateType = 5;
                    //         that.MDCAdataList[i].itemRelateDetailList[j].itemId = null;
                    //         that.MDCAdataList[i].itemRelateDetailList[j].relateId = null;
                    //         that.MDCAdataList[i].itemRelateDetailList[j].sobId = null;
                    //     }
                    // }
                    for (var i = 0; i < that.MDCAdataList[that.subjectIdx].itemRelateDetailList.length; i++) {
                        that.MDCAdataList[that.subjectIdx].itemRelateDetailList[i].id = null;
                        that.MDCAdataList[that.subjectIdx].itemRelateDetailList[i].relateType = 5;
                        that.MDCAdataList[that.subjectIdx].itemRelateDetailList[i].itemId = null;
                        that.MDCAdataList[that.subjectIdx].itemRelateDetailList[i].relateId = null;
                        that.MDCAdataList[that.subjectIdx].itemRelateDetailList[i].sobId = null;
                    }

                    that.tempMulExpenseList[that.subjectIdx].expenseSubjectId = treeNode.id;
                    that.tempMulExpenseList[that.subjectIdx].expenseSubjectName = treeNode.subjectName;

                // that.mulSubjectList = that.MDCAdataList;
                // for (var i=0;i<that.mulSubjectList;i++) {
                //     delete mulSubjectList[i].expenseSubjectName;
                // }
                // that.card.financeFaAssignDeptList

            }
            // console.log(treeNode, '====treeNode');
            // var that = this;
            // this.card.assetSubjectId = treeNode.id;
            // this.assetSubjectName = treeNode.subjectName;

            // that.openData.relateSubjectId = treeNode.id;
            // that.openData.subjectCode = treeNode.subjectCode;
            // that.openData.subjectName = treeNode.subjectName;

        },
        assetTypeTreeClickCallBack (event, treeId, treeNode) {
            var that = this;
            console.log(treeNode);
            this.card.assetTypeId = treeNode.id;
            this.assetTypeName = treeNode.name;
            var alreadyCount;
            $.ajax({
                url: contextPath + '/assetsclassescontroller/getClassesById',
                type: 'post',
                async: false,
                data: { id: treeNode.id },
                success: function (data) {
                    that.assetType = data.data;
                }
            });
            $.ajax({
                url: contextPath + '/facard/countassetbytype/' + treeNode.id,
                type: 'post',
                async: false,
                success: function (data) {
                    alreadyCount = data.data;
                }
            });
            // 带出各种值


            if (that.stringIsEmpty(that.assetType.cardCodeRule)) {
                that.PrefixInteger((0 + alreadyCount), 4);
            } else {
                that.card.assetCode = that.assetType.cardCodeRule.match(/^[a-z|A-Z]+/gi) + that.PrefixInteger((Number(that.assetType.cardCodeRule.match(/\d+$/gi)) + alreadyCount), 3);
            }

            that.card.assetSubjectId = that.assetType.fixedAssetsSubject;

            that.card.deprSubjectId = that.assetType.cumulativeDiscountSubject;

            that.card.expectUsePeriods = that.assetType.durableYears * 12;

            that.card.deprMethod = that.assetType.advancedMethod;



            // var _s2 = [
            //     { 'id': 1, 'value': that.card.assetSubjectId },
            //     { 'id': 2, 'value': that.card.deprSubjectId }
            // ];
            // that.initSubjectList = _s2;
            // that.initsubjectFn(_s2);

            var tree = ve.$refs.modalSubject1.nodeData;
            for (_variable in tree) {
                tree[_variable].forEach(function (_item) {
                    if (that.card.assetSubjectId === _item.id) {
                        // var _it = { 'id': that.card.assetSubjectId, 'value': _item }
                        that.assetSubjectName = _item.subjectName;
                    }
                    if (that.card.deprSubjectId === _item.id) {
                        // var _it = { 'id': that.card.assetSubjectId, 'value': _item }
                        that.depreciationSubjectName = _item.subjectName;
                    }
                });
            }




            this.showAssetType = false;
        },
        PrefixInteger (num, length) {
            return (Array(length).join('0') + num).slice(-length);
        },
        useStateTreeClickCallBack (event, treeId, treeNode) {
            this.card.useStateId = treeNode.id;
            this.useStateName = treeNode.name;
            this.showUseState = false;
        },
        changeMethodTreeClickCallBack (event, treeId, treeNode) {
            console.log(treeNode);
            this.card.alterTypeId = treeNode.id;
            this.changeMethodName = treeNode.name;
            this.showChangeMethod = false;
        },
        supplierTreeClickCallBack (event, treeId, treeNode) {
            this.formData.basicInformation.for16 = treeNode.name;
            this.showSupplier = false;
        },
        sinDepartmentTreeClickCallBack (event, treeId, treeNode) {
            var that = this;
            //清空挂载的折旧费用分配情况
            for (var i = 0; i < that.singleDepartmentList.length; i++) {
                that.singleDepartmentList[i].financeFaAssignExpenseList = [];
            }
            for (var i = 0; i < that.mulDepartmentList.length; i++) {
                that.mulDepartmentList[i].financeFaAssignExpenseList = [];
            }
            that.singleSubjectList = [];
            that.mulSubjectList = [];
            that.allotSubjectName = '';
            that.MDCAdataList = [];

            that.singleDepartmentList = [
                {
                    id: null,
                    assetId: null,
                    deptId: treeNode.id,
                    departmentName: treeNode.name,
                    rate: 100,
                    financeFaAssignExpenseList: []
                }
            ];
            // that.card.financeFaAssignDeptList = that.singleDepartmentList;

            this.deptName = treeNode.name;
            this.showDepartment = false;

            // that.departmentTip = treeNode.name + ":100%";
        },
        mulDepartmentTreeClickCallBack (event, treeId, treeNode) {
            var that = this;
            console.log(event);
            console.log("treeId:" + treeId);
            console.log(treeNode);

            that.SDARdataList[that.idx].deptId = treeNode.id;
            that.SDARdataList[that.idx].departmentName = treeNode.name;
            // this.showMulDepartment[that.idx] = false;
            that.SDARdataList[that.idx].showChange = false;
        },
        treeClickCallBack (event, treeId, treeNode) {
            console.log(treeNode, '====treeClickCallBack');
            // this.formData.for2 = treeNode.name;
            // this.formData.for3= treeNode.id;
            // this.showDepartment = false;
            // this.loadTestEmp(treeNode.id)
        },
        treeBeforeClick (treeId, treeNode, clickFlag) {
            return !treeNode.isParent; //当单击父节点，返回false，不让选取
        },
        showDepartmentTree (value, which, index) {
            if (this.managerType == 'info') {

                return;
            }
            var that = this;
            this.idx = index;
            console.log(value, this.showDepartment, 'this.showdepreciation');
            switch (which) {
                case 'showAssetType':
                    if (this.showAssetType === true) {
                        this.showAssetType = false;
                        return;
                    }
                    this.showAssetType = value;
                    break;
                case 'showUseState':
                    if (this.showUseState === true) {
                        this.showUseState = false;
                        return;
                    }
                    this.showUseState = value;
                    break;
                case 'showChangeMethod':
                    if (this.showChangeMethod === true) {
                        this.showChangeMethod = false;
                        return;
                    }
                    this.showChangeMethod = value;
                    break;
                case 'showSupplier':
                    if (this.showSupplier === true) {
                        this.showSupplier = false;
                        return;
                    }
                    this.showSupplier = value;
                    break;
                case 'showDepartment':
                    if (this.showDepartment == true) {
                        this.showDepartment = false;
                        return;
                    }
                    this.showDepartment = value;
                    break;
                case 'showMulDepartment':
                    // if (this.showMulDepartment[this.idx] == true) {
                    //     this.showMulDepartment[this.idx] = false;
                    //     return;
                    // }
                    // this.showMulDepartment[this.idx] = value;
                    that.SDARdataList.forEach((_item, _idx) => {
                        if (_idx !== index) {
                            _item.showChange = false;
                        }
                    })
                    that.SDARdataList[index].showChange = !that.SDARdataList[index].showChange;
                    break;
            }
            // if (this.showDepartment === true) {
            //     this.showDepartment = false;
            //     return;
            // }
            // this.showDepartment = value;
        },


        showdepreciationTree (value) {
            if (this.showdepreciation === true) {
                this.showdepreciation = false;
                return;
            }
            this.showdepreciation = value;
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
        saveData: function () {
            /*that.showDataForm.timeStart = (new Date(that.filterBody.timeStart)).format("yyyy-MM-dd");
            that.showDataForm.timeEnd = (new Date(that.filterBody.timeEnd)).format("yyyy-MM-dd");*/
            let _vm = this;
            let startDate = Date.parse(_vm.filterBody.timeStart) / 1000;
            let endDate = Date.parse(_vm.filterBody.timeEnd) / 1000;
            if (startDate > endDate) {
                this.$Message.error('开始日期不能大于结束日期')
                return;
            }
            _vm.initCashCheckTree();
        },
        //点击取消或者x
        cancelData: function () {
            var that = this;
            /*that.filterBody.timeStart = (that.showDataForm.timeStart).format("yyyy-MM-dd");
            that.filterBody.timeEnd = (that.showDataForm.timeEnd).format("yyyy-MM-dd");*/
        },
        refreshData () {
            this.init();
        },
        init () {
            let _vm = this;
            $.ajax({
                type: 'post',
                // url: contextPath + "/checklist/init",
                data: null,
                success: function (ret) {
                    if (ret.code == '100100') {
                        _vm.currencyList = ret.data.currencyList;
                        _vm.subjectList = ret.data.subjectList;
                        _vm.organizationList = ret.data.org;
                        _vm.periodDate = ret.data.periodDate;
                        _vm.filterBody.sobId = ret.data.org[0].value;
                        _vm.filterBody.timeStart = ret.data.periodDate.startDate;
                        _vm.filterBody.timeEnd = ret.data.periodDate.endDate;
                        _vm.showDataForm.timeStart = (new Date(ret.data.periodDate.startDate)).format("yyyy-MM-dd");
                        _vm.showDataForm.timeEnd = (new Date(ret.data.periodDate.endDate)).format("yyyy-MM-dd");

                        _vm.formInitData.id = '';
                        _vm.formInitData.sobId = ret.data.org[0].value;
                        _vm.formInitData.datetime = ret.data.periodDate.endDate;
                        _vm.formInitData.currencyId = ret.data.currencyList[0].id;
                        _vm.formInitData.subjectName = ret.data.subjectList[0].accountName;
                        _vm.formInitData.subjectCode = ret.data.subjectList[0].accountCode;
                        _vm.formInitData.subjectId = ret.data.subjectList[0].accountId;
                        _vm.formInitData.remark = '';
                        _vm.formInitData.totalAmount = '';

                        _vm.initCashCheckTree();
                    } else {
                        // layer.alert(ret.msg)
                    }
                }
            });
            _vm.setTableHeader();
        },
        onTreeChange (val) {
            if (val == 'ltData') {
                this.nodes = this.nodesList.dateTree;
            } else {
                this.nodes = this.nodesList.subjectTree;
            }
        },
        initCashCheckTree () {
            let _vm = this;
            /*let startDate = Date.parse(_vm.filterBody.timeStart)/1000;
            let endDate = Date.parse(_vm.filterBody.timeEnd)/1000;
            if(startDate>endDate){
                this.$Message.error('开始日期不能大于结束日期')
                return;
            }*/
            _vm.filterBody.timeStart = (new Date(_vm.filterBody.timeStart)).format('yyyy-MM-dd')
            _vm.filterBody.timeEnd = (new Date(_vm.filterBody.timeEnd)).format('yyyy-MM-dd')
            $.ajax({
                type: 'post',
                // url: contextPath+"/checklist/cashCheckList",
                data: _vm.filterBody,
                success: function (ret) {
                    console.log(ret)
                    if (ret.code == '100100') {
                        _vm.nodesList = ret.data
                        if (_vm.leftType == 'ltData') {
                            _vm.nodes = ret.data.dateTree;
                        } else {
                            _vm.nodes = ret.data.subjectTree;
                        }
                    } else {
                        // layer.alert(ret.msg)
                    }
                }
            })
        },
        setTableHeader () {
            this.colNames = [
                '序号', '年度', '期间', '入账日期或变动日期', '摘要', '编码', '名称', '型号', '类别',
                '变动方式', '使用状态', '附属设备', '部门', '单位', '数量', '币别', '汇率', '原值原币', '原值本币',
                '购进原值', '原值预计净残值', '预计使用期间数或预计工作总量', '已使用期间数或已使用工作量', '减值准备',
                '折旧方法', '购进累计折旧', '累计折旧调整', '折旧费用项目', '经济用途', '存放地点',
                '开始使用日期', '制造商', '产地', '供应商', '制单人'
            ];
            this.colModel = [
                { name: 'id', width: 30 },
                { name: 'accountYear', width: 100 },
                { name: 'accountPeriod', width: 100 },
                { name: 'enterAccountDate', width: 100, },
                { name: 'remark', width: 100 },
                {
                    name: 'assetCode', width: 100
                },
                {
                    name: 'assetName', width: 100, align: 'center', formatter: function (value, options, rowData) {
                        let icon = '<i class="ivu-icon ivu-icon-checkmark-round"></i>';
                        if (value == 1) {
                            return icon;
                        } else {
                            return '';
                        }
                    }
                },
                { name: 'model', width: 120, },
                {
                    name: 'assetTypeName', width: 150
                },
                {
                    name: 'alterTypeName', width: 100, align: 'right'
                },
                {
                    name: 'useStateName', width: 100, align: 'right'
                },
                {
                    name: 'hasAttachDevice', width: 100, align: 'right'
                },
                {
                    name: 'departmentStr', width: 100, align: 'right'
                },
                {
                    name: 'unitName', width: 100, align: 'right'
                },
                {
                    name: 'num', width: 100, align: 'right'
                },
                { name: 'currencyNameStr', width: 90, },
                { name: 'exchangeRateStr', width: 90, },
                {
                    name: 'originValueOriginCurrencyStr', width: 150
                },
                { name: 'originValueLocalCurrency', width: 90, },
                { name: 'buyOrgVal', width: 90 },
                { name: 'expectNetSalvage', width: 90 },
                { name: 'expectUsePeriods', width: 90 },
                { name: 'usePeriodsBeforeservice', width: 90 },
                { name: 'devalPreparation', width: 90 },
                { name: 'deprMethodName', width: 90 },
                { name: 'buyDepr', width: 90 },
                { name: 'accumulatedDepreciationAdjust', width: 90 },
                { name: 'depreciationCostItemStr', width: 90 },
                { name: 'useType', width: 90 },
                { name: 'locationName', width: 90 },
                { name: 'beginUsedate', width: 90 },
                { name: 'manufacturer', width: 90 },
                { name: 'originPlace', width: 90 },
                { name: 'supplierName', width: 90 },
                { name: 'updateName', width: 90 }
            ];
            this.tableHeaders = [
                { startColumnName: 'currencyNameStr', numberOfColumns: 3, titleText: '原值原币' }
            ];
            this.jqGridInit(this.colNames, this.colModel, this.tableHeaders);
        },
        // 生成jqGrid
        jqGridInit (colNames, colModel, headers) {
            let _vm = this;
            _vm.openData.assetCode = _vm.card.assetCode;
            _vm.openData.changeType = 2;
            let config = Object.assign({}, this.base_config, {
                colNames: colNames,
                colModel: colModel,
                postData: JSON.stringify(_vm.openData),
                // loadComplete: function () {
                //
                // },
                loadComplete: function (ret) {
                    console.log(ret)
                    if (ret != null && ret.data != null && ret.data.resultVo != null) {
                        _vm.dataList = ret.data.resultVo;
                    }
                    jQuery("#grid").jqGrid('destroyGroupHeader');
                    jQuery("#grid").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders: headers
                    });

                    //获取表格所有行数据
                    let rows = jQuery("#grid").jqGrid('getRowData');
                    var allCountID = $("#grid").jqGrid('getDataIDs');
                    rows.push($("#grid").jqGrid('getRowData', allCountID[allCountID.length - 1]));
                    _vm.tableList = rows;
                    console.log('tableList', _vm.tableList)
                    // if (ret.code == '100100') {
                    //     _vm.baseData.subjectName = ret.data.subjectName;
                    //     _vm.baseData.currencyName = ret.data.currencyName;
                    //     _vm.baseData.periodDate = ret.data.queryPeriod;
                    // } else {
                    //     layer.alert(ret.msg)
                    // }
                }
            });
            jQuery("#grid").jqGrid(config);
        },
        handlerId (data, status, type) {
            let _vm = this;
            if (typeof data === 'object' && status) {
                _vm.selected = data.filter(row => {
                    if (row != 'null' && row != '0' && row != '') {
                        return row;
                    }
                });
            }
            if (typeof data === 'object' && !status) {
                _vm.selected = [];
            }
            if (typeof data === 'string') {
                if (status) {
                    let flag = (data != 'null' && data != '0' && data != '');
                    if (flag) {
                        (_vm.selected.indexOf(data.toString()) > -1) ? null : this.selected.push(data.toString());
                    }
                } else {
                    let index = _vm.selected.indexOf(data.toString());
                    index > -1 ? _vm.selected.splice(index, 1) : null;
                }
            }
        },
        // <!-- 附属设备清单 操作-->
        actionBtnMth (_type) {
            var that = this;
            if (that.stringIsEmpty(that.card.assetCode)) {
                that.wrapAlert("添加附属设备前请先设置固定资产编码！");
                return false;
            }
            if (that.managerType == 'info') {
                return false;
            }
            console.log(that.dataList);
            // 插入行 是在 选择 上面插入一条数据， 复制行 是在选择下面 插入一条数据并复制选择的数据值。 插入和复制都是单条，删除为多条
            // var sum = 0;
            // that.dataList.forEach(item=>{
            //     sum = floatObj.add(sum, item.amount);
            // });
            // that.attachTotal = sum;
            var _info = {
                show: false,
                id: '',//new Date().getTime(),
                deviceCode: '',
                deviceName: '',
                // (new Date()).format("yyyy-MM-dd"),
                specModel: '',//new Date().getTime(),
                recordDate: '',
                locationId: '',
                unitGroupId: '',
                unitId: '',
                num: '',
                amount: '',
                remark: '',
                unitList: []
            };
            if (that.dataList.length == 0) {
                _info.deviceCode = that.card.assetCode + '00';
            } else {
                var previous = that.dataList[that.dataList.length - 1].deviceCode;
                var basicLength = that.card.assetCode.length;
                _info.deviceCode = previous.substr(0, basicLength) + that.PrefixInteger((Number(previous.substr(basicLength)) + 1), 2);
            }

            if (_type === 'addNew') {
                that.dataList.push(_info);
                that.card.financeFaAttachDeviceList = that.dataList;
                // this.dataList.forEach(item => {
                //     _this.$set(item, 'show', false)
                // })
                console.log(that.card.financeFaAttachDeviceList);
            } else {
                var _f = that.dataList.filter(row => row.show)
                if (!_f.length) {
                    that.$Message.info({
                        content: '请选择一条数据',
                        duration: 3
                    });
                    return;
                }
                let _i = Object.assign({}, _f[_f.length - 1])
                if (_type === 'import') {
                    if (_f.length > 1) {
                        that.$Message.info({
                            content: '只能选择一条',
                            duration: 3
                        });
                        return;
                    }
                    var _idx = 0;
                    that.dataList.forEach((row, idx) => {
                        row.id === _i.id && (_idx = idx)
                    })

                    that.dataList.splice(_idx, 0, _info);
                } else if (_type === 'copye') {
                    if (_f.length > 1) {
                        that.$Message.info({
                            content: '只能选择一条',
                            duration: 3
                        });
                        return;
                    }

                    var _idx = 0;
                    that.dataList.forEach((row, idx) => {
                        row.id === _i.id && (_idx = idx)
                    })
                    _i.id = new Date().getTime();
                    _i.show = false;
                    that.dataList.splice(_idx + 1, 0, _i);
                } else if (_type === 'delete') {
                    that.dataList = that.dataList.filter(row => !row.show)
                }
            }
        },
        // <!-- 选择部门及分配比例 操作-->
        actionSDARListBtnMth (_type) {
            var that = this;
            if (that.managerType == 'info') {
                return false;
            }
            // 插入行 是在 选择 上面插入一条数据， 复制行 是在选择下面 插入一条数据并复制选择的数据值。 插入和复制都是单条，删除为多条

            var _info = {
                show: false,
                showChange: false,
                id: null,
                assetId: null,
                deptId: null,
                departmentName: null,
                rate: null
            };
            // var _info = {
            //     show: false,
            //     id: new Date().getTime(),
            //     locationId: '',
            //     num: ''
            // }
            if (_type === 'addNew') {
                that.SDARdataList.push(_info);

            } else {
                var _f = that.SDARdataList.filter(row => row.show)
                if (!_f.length) {
                    that.$Message.info({
                        content: '请选择一条数据',
                        duration: 3
                    });
                    return;
                }
                let _i = Object.assign({}, _f[_f.length - 1])
                if (_type === 'import') {
                    if (_f.length > 1) {
                        that.$Message.info({
                            content: '只能选择一条',
                            duration: 3
                        });
                        return;
                    }
                    var _idx = 0;
                    that.SDARdataList.forEach((row, idx) => {
                        row.id === _i.id && (_idx = idx)
                    })

                    that.SDARdataList.splice(_idx, 0, _info);
                } else if (_type === 'copye') {
                    if (_f.length > 1) {
                        that.$Message.info({
                            content: '只能选择一条',
                            duration: 3
                        });
                        return;
                    }

                    var _idx = 0;
                    that.SDARdataList.forEach((row, idx) => {
                        row.id === _i.id && (_idx = idx)
                    })
                    _i.id = new Date().getTime();
                    _i.show = false;
                    that.SDARdataList.splice(_idx + 1, 0, _i);
                } else if (_type === 'delete') {
                    that.SDARdataList = that.SDARdataList.filter(row => !row.show)
                }
            }
        },
        // <!-- 多个折扣费用分配 操作-->
        actionMDCAListBtnMth (_type) {
            var that = this;
            if (that.managerType == 'info') {
                return false;
            }
            // 插入行 是在 选择 上面插入一条数据， 复制行 是在选择下面 插入一条数据并复制选择的数据值。 插入和复制都是单条，删除为多条
            var _info = {
                show: false,
                id: null,
                departmentAllotId: null,
                deptId: null,
                expenseSubjectId: null,
                expenseSubjectName: null,
                rate: null,
                itemRelateDetailList: []
            };
            // var _info = {
            //     show: false,
            //     id: new Date().getTime(),
            //     locationId: '',
            //     num: '',
            //     assetSubjectName: '',
            //     for2: '',
            // }
            if (_type === 'addNew') {
                that.MDCAdataList.push(_info);
            } else {
                var _f = that.MDCAdataList.filter(row => row.show)
                if (!_f.length) {
                    that.$Message.info({
                        content: '请选择一条数据',
                        duration: 3
                    });
                    return;
                }
                let _i = Object.assign({}, _f[_f.length - 1])
                if (_type === 'import') {
                    if (_f.length > 1) {
                        that.$Message.info({
                            content: '只能选择一条',
                            duration: 3
                        });
                        return;
                    }
                    var _idx = 0;
                    that.MDCAdataList.forEach((row, idx) => {
                        row.id === _i.id && (_idx = idx)
                    })

                    that.MDCAdataList.splice(_idx, 0, _info);
                } else if (_type === 'copye') {
                    if (_f.length > 1) {
                        that.$Message.info({
                            content: '只能选择一条',
                            duration: 3
                        });
                        return;
                    }

                    var _idx = 0;
                    that.MDCAdataList.forEach((row, idx) => {
                        row.id === _i.id && (_idx = idx)
                    })
                    _i.id = new Date().getTime();
                    _i.show = false;
                    that.MDCAdataList.splice(_idx + 1, 0, _i);
                } else if (_type === 'delete') {
                    that.MDCAdataList = that.MDCAdataList.filter(row => !row.show)
                }
            }
        },
        // <!-- 维护多币别数据 操作-->
        actionMMCDListBtnMth (_type) {
            var that = this;
            // 插入行 是在 选择 上面插入一条数据， 复制行 是在选择下面 插入一条数据并复制选择的数据值。 插入和复制都是单条，删除为多条
            if (that.managerType == 'info') {
                return false;
            }
            var _info = {
                show: false,
                id: null,
                assetId: null,
                currencyId: null,
                exchangeRate: 1,
                orgValFor: 0,
                orgVal: 0
            };
            // var _info = {
            //     show: false,
            //     id: new Date().getTime(),
            //     locationId: '',
            //     num: '',
            //     assetSubjectName: '',
            //     for2: '',
            // }
            if (_type === 'addNew') {
                that.MMCDdataList.push(_info);
            } else {
                var _f = that.MMCDdataList.filter(row => row.show)
                if (!_f.length) {
                    that.$Message.info({
                        content: '请选择一条数据',
                        duration: 3
                    });
                    return;
                }
                let _i = Object.assign({}, _f[_f.length - 1])
                if (_type === 'import') {
                    if (_f.length > 1) {
                        that.$Message.info({
                            content: '只能选择一条',
                            duration: 3
                        });
                        return;
                    }
                    var _idx = 0;
                    that.MMCDdataList.forEach((row, idx) => {
                        row.id === _i.id && (_idx = idx)
                    })

                    that.MMCDdataList.splice(_idx, 0, _info);
                } else if (_type === 'copye') {
                    if (_f.length > 1) {
                        that.$Message.info({
                            content: '只能选择一条',
                            duration: 3
                        });
                        return;
                    }

                    var _idx = 0;
                    that.MMCDdataList.forEach((row, idx) => {
                        row.id === _i.id && (_idx = idx)
                    })
                    _i.id = new Date().getTime();
                    _i.show = false;
                    that.MMCDdataList.splice(_idx + 1, 0, _i);
                } else if (_type === 'delete') {
                    that.MMCDdataList = that.MMCDdataList.filter(row => !row.show)
                }
            }
        },
        clickTr (_item, _idx) {

        },
        MMCDclick_all () {
            this.MMCDallShow = !this.MMCDallShow;
            this.MMCDdataList.forEach(row => {
                row.show = this.MMCDallShow;
            })
        },
        MDCAclick_all () {
            this.MDCAallShow = !this.MDCAallShow;
            this.MDCAdataList.forEach(row => {
                row.show = this.MDCAallShow;
            })
        },
        SDARclick_all () {
            this.SDARallShow = !this.SDARallShow;
            this.SDARdataList.forEach(row => {
                row.show = this.SDARallShow;
            })
        },
        click_all () {
            this.allShow = !this.allShow;
            this.dataList.forEach(row => {
                row.show = this.allShow;
            })
        },
        // 附属设备清单 切换本行是否选中
        change_tr (row) {
            row.show = !row.show;
            let count = 0;
            this.dataList.forEach(row => {
                if (row.show) count++;
            })
            if (count === this.dataList.length) {
                this.allShow = true;
            } else {
                this.allShow = false;
            }
        },
        //  选择部门及分配比例 切换本行是否选中
        SDARchange_tr (row) {
            row.show = !row.show;
            let count = 0;
            this.SDARdataList.forEach(row => {
                if (row.show) count++;
            })
            if (count === this.SDARdataList.length) {
                this.SDARallShow = true;
            } else {
                this.SDARallShow = false;
            }
        },
        //  多个折扣费用分配 切换本行是否选中
        MDCAchange_tr (row) {
            row.show = !row.show;
            let count = 0;
            this.MDCAdataList.forEach(row => {
                if (row.show) count++;
            })
            if (count === this.MDCAdataList.length) {
                this.MDCAallShow = true;
            } else {
                this.MDCAallShow = false;
            }
        },
        //  维护多币别数据 切换本行是否选中
        MMCDchange_tr (row) {
            if (this.managerType == 'info') {
                return false;
            }
            row.show = !row.show;
            let count = 0;
            this.MMCDdataList.forEach(row => {
                if (row.show) count++;
            })
            if (count === this.MMCDdataList.length) {
                this.MMCDallShow = true;
            } else {
                this.MMCDallShow = false;
            }
        },
        //查询固定资产启用会计年
        getEnabledAccountYear () {
            var that = this;
            $.ajax({
                url: contextPath + '/facard/sysproval/assetEnabledAccountingYear',
                type: 'post',
                async: false,
                success: function (data) {
                    that.enabledAccountYear = Number(data.data);
                }
            });
        },
        //查询固定资产启用会计期间
        getEnabledAccountPeriod () {
            var that = this;
            $.ajax({
                url: contextPath + '/facard/sysproval/assetEnabledAccountingPeriod',
                type: 'post',
                async: false,
                success: function (data) {
                    that.enabledAccountPeriod = Number(data.data);
                }
            });
        },
        //查询当前固定资产会计年
        getCurrentAccountYear () {
            var that = this;
            $.ajax({
                url: contextPath + '/facard/sysproval/assetCurrentAccountingYear',
                type: 'post',
                async: false,
                success: function (data) {
                    that.currentAccountYear = Number(data.data);
                }
            });
        },
        //查询当前固定资产会计期间
        getCurrentAccountPeriod () {
            var that = this;
            $.ajax({
                url: contextPath + '/facard/sysproval/assetCurrentAccountingPeriod',
                type: 'post',
                async: false,
                success: function (data) {
                    that.currentAccountPeriod = Number(data.data);
                }
            });
        },
        //获取组织列表
        getOrgList () {
            var that = this;
            console.log("orglist>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            console.log(that.card);
            $.ajax({
                url: contextPath + "/bankdepositstatement/getognlist",
                type: "post",
                success: function (data) {
                    that.organizationList = data.data;
                    // that.card.sobId = that.organizationList[0].id;
                    // console.log(that.card.sobId);
                    // that.$nextTick(() => {
                    //     that.card.sobId = data.data[0].id;
                    //     console.log(that.card.sobId);
                    // });

                    that.$nextTick(() => {
                        that.card.sobId = 0;
                        setTimeout(() => {
                            that.card.sobId = that.organizationList[0].id;
                            // console.log(that.card.sobId, '===that.card.sobId');
                        }, 500);

                    });

                }
            });
        },
        listUnitGroup () {
            var that = this;
            $.ajax({
                url: contextPath + "/facard/listunitgroup",
                async: false,
                type: "post",

                success: function (data) {
                    that.unitGroupList = data.data;
                    // that.unitGroup = data.data[0].id;
                    // that.$nextTick(()=>{
                    //     that.unitGroup = data.data[0].id;
                    // });
                }
            });
        },
        listUnitByGroupId () {
            var that = this;

            // that.card.unitId = null;
            $.ajax({
                url: contextPath + "/facard/listunitbygroupid/" + that.card.unitGroupId,
                type: "post",
                success: function (data) {
                    that.unitList = data.data;
                    if (that.managerType == 'init' || that.managerType == 'add') {
                        that.card.unitId = -1;
                    }

                    // that.card.unitId = data.data[0].id;
                    // that.$nextTick(()=>{
                    //     that.card.unitId = data.data[0].id;
                    // });
                }

            });
        },
        listDeviceUnitByGroupId (idx) {
            console.log(this);
            var that = this;
            // that.dataList[idx].unitId = null;
            $.ajax({
                url: contextPath + "/facard/listunitbygroupid/" + that.dataList[idx].unitGroupId,
                type: "post",
                success: function (data) {
                    that.deviceUnitList = data.data;
                    if (that.managerType == 'init' || that.managerType == 'add') {
                        that.dataList[idx].unitId = -1;
                    }
                    that.dataList[idx].unitList = data.data;
                    // that.card.unitId = data.data[0].id;
                    // that.$nextTick(()=>{
                    //     that.card.unitId = data.data[0].id;
                    // });
                }

            });
        },
        listLocation () {
            var that = this;
            $.ajax({
                url: contextPath + "/falocation/initTree",
                type: "post",
                success: function (data) {
                    that.locationList = data.data;
                    // that.card.locationId = data.data[0].id;
                }
            })
        },
        listEconomyUse () {
            this.economyUseList = getCodeList("fixedAssets_economicUse");
            this.card.useType = this.economyUseList[0].value;
        },
        listCurrency () {
            var that = this;
            $.ajax({
                url: contextPath + "/tfinancebalance/listcurrency",
                type: "post",
                success: function (data) {
                    that.currencyList = data.data;
                    that.singleCurrency.currencyId = data.data[0].id;
                }
            });
        },
        listDepreciationMethod () {
            this.deprMethodList = getCodeList("fixedAssets_depreciation");

        },
        listSingleProjectList (subjectId) {
            var that = this;
            $.ajax({
                url: contextPath + '/facard/listaccountingproject/' + subjectId,
                type: 'post',
                async: false,
                success: function (data) {
                    that.singleProjectList = data.data;
                }
            });
        },
        //查询是否已经启用固定资产
        getStartUsing () {
            var that = this;
            $.ajax({
                url: rcContextPath + '/financeCommon/sysIsEnabled/' + 4,
                type: "post",
                async: false,
                success: function (data) {
                    that.startUsing = data.data;
                }
            })
        },
        //查询所有树
        allTree () {
            var that = this;
            $.ajax({
                url: contextPath + '/assetsclassescontroller/assetsClassesList',
                type: 'post',
                async: false,
                success: function (data) {
                    that.assetTypeTree = data.data;
                }

            });
            $.ajax({
                url: contextPath + '/useState/initTree',
                type: 'post',
                async: false,
                success: function (data) {
                    that.useStateTree = data.data;
                }
            });
            $.ajax({
                url: contextPath + '/app/financeFaChangeMode/treeData',
                type: 'post',
                async: false,
                success: function (data) {
                    that.alterTypeTree = data.data;
                }
            });
            $.ajax({
                url: contextPath + '/testDocument/getCurrentUserDeptInfo',
                type: 'post',
                async: false,
                success: function (data) {
                    that.departmentTree = data.data;
                }
            })
        },

        code (bnid, idx) {
            return `${bnid}${idx}`;
        },

        //多币别数组中根据币别id和数组索引联动汇率
        getExchangeRate (id, idx) {
            var that = this;
            $.ajax({
                url: contextPath + '/facard/getratebyid/' + id,
                type: 'post',
                success: function (data) {
                    that.MMCDdataList[idx].exchangeRate = data.data;
                }
            });
        },

        //变动情况下日期选择范围
        getDateScope () {
            let that = this;
            $.ajax({
                url: contextPath + '/facard/beginenddate',
                type: 'post',
                async: false,
                success: function (data) {
                    that.changeDateScope = data.data;
                }

            })
        },


        //供应商弹窗
        onSupplier () {
            // if (this.showReceive || this.showUserInfo) {
            //     return;
            // }
            if (this.managerType == 'info') {
                return;
            }
            this.showSupplier = true;
        },
        //关闭供应商弹窗
        closeSupplier () {
            this.card.supplierId = this.selectSupplier.id;
            this.supplierName = this.selectSupplier.supplierName;
            this.showSupplier = false;
            console.log("supplierId:" + this.card.supplierId);
        },
        //保存附属设备
        saveAttach () {
            var that = this;
            // this.card.financeFaAttachDeviceList = this.dataList;
            for (var i = 0; i < that.dataList.length; i++) {
                if (that.stringIsEmpty(that.dataList[i].deviceCode)) {
                    that.wrapAlert("编码不能为空！");
                    return false;
                }
                if (that.stringIsEmpty(that.dataList[i].deviceName)) {
                    that.wrapAlert("名称不能为空！");
                    return false;
                }
                if (that.moneyIsZero(that.dataList[i].amount)) {
                    that.wrapAlert("金额不能为0!");
                    return false;
                }
                if (that.moneyIsZero(that.dataList[i].num)) {
                    that.wrapAlert("数量不能为0!");
                    return false;
                }
            }
            this.SEListVisible = false;
        },
        //选择部门及分配比例
        saveDept () {
            var that = this;
            const arr = [];

            //检查是否有空值
            for (var i = 0; i < that.SDARdataList; i++) {
                if (that.SDARdataList[i].deptId == null) {
                    that.wrapAlert("部门不能为空！");
                    return;
                }
                if (that.SDARdataList[i].rate == null) {
                    that.wrapAlert("分配比例不能为空！");
                    return;
                }

            }
            for (var i = 0; i < that.SDARdataList.length; i++) {
                arr.push(that.SDARdataList[i].deptId);
            }
            const newArr = Array.from(new Set(arr));
            if (arr.length != newArr.length) {
                that.wrapAlert("部门重复");
                return false;
            }

            var temp = 0;
            for (var i = 0; i < that.SDARdataList.length; i++) {
                temp = floatObj.add(temp, that.SDARdataList[i].rate);
            }
            if (temp != 100) {
                that.wrapAlert("各部门分配比例之和必须等于100%！");
                return;
            }


            //清空挂载的折旧费用分配情况
            for (var i = 0; i < that.singleDepartmentList.length; i++) {
                that.singleDepartmentList[i].financeFaAssignExpenseList = [];
            }
            for (var i = 0; i < that.mulDepartmentList.length; i++) {
                that.mulDepartmentList[i].financeFaAssignExpenseList = [];
            }
            that.singleSubjectList = [];
            that.mulSubjectList = [];
            that.allotSubjectName = '';
            that.MDCAdataList = [];


            console.log("saveDEPT!!!!!!!!!!!");
            that.mulDepartmentList = JSON.parse(JSON.stringify(that.SDARdataList));
            console.log(that.card.financeFaAssignDeptList.length);

            //删除无用属性，百分数后台处理
            for (var i = 0; i < that.mulDepartmentList.length; i++) {
                delete that.mulDepartmentList[i].show;
                // that.mulDepartmentList[i].rate = floatObj.divide(floatObj.multiply(that.mulDepartmentList[i].rate, 100, 2), 100 * 100, 2);
            }


            // that.card.financeFaAssignDeptList = that.mulDepartmentList;
            // that.departmentTip = '';
            // that.mulDepartmentList.forEach(item => {
            //     that.departmentTip += item.departmentName + ':' + item.rate + '%  ';
            // });

            this.SDARListVisible = false;
        },
        // //多个折扣费用分配
        // MDCAsaveAttach () {
        //     this.MDCAListVisible = false;
        // },
        //多个折旧费用分配点击确定
        saveMulExpense () {
            var that = this;
            //检查是否有空值
            for (var i = 0; i < that.MDCAdataList.length; i++) {
                if (that.MDCAdataList[i].deptId == null) {
                    that.wrapAlert("部门不能为空！");
                    return;
                }
                if (that.MDCAdataList[i].expenseSubjectId == null) {
                    that.wrapAlert("科目不能为空！");
                    return;
                }
                if (that.MDCAdataList[i].rate == null) {
                    that.wrapAlert("分配比例不能为空！");
                    return;
                }
                for (var j = 0; j < that.MDCAdataList[i].itemRelateDetailList.length; j++) {
                    var temp = that.MDCAdataList[i].itemRelateDetailList[j].itemId;
                    if (temp == null || 'undefined' == typeof temp) {
                        that.wrapAlert(" 缺少核算项目数据！");
                        return;
                    }
                }
            }
            that.mulSubjectList = JSON.parse(JSON.stringify(that.MDCAdataList));

            //清理无用字段
            for (var i = 0; i < that.mulSubjectList.length; i++) {
                // delete that.mulSubjectList[i].expenseSubjectName;
                delete that.mulSubjectList[i].show;
            }
            //挂载到部门分配list中
            if (that.deptSingleMul == 1) {
                //先清空
                for (var i = 0; i < that.singleDepartmentList.length; i++) {
                    that.singleDepartmentList[i].financeFaAssignExpenseList = [];
                }
                //挂载
                for (var i = 0; i < that.singleDepartmentList.length; i++) {
                    for (var j = 0; j < that.mulSubjectList.length; j++) {
                        if (that.singleDepartmentList[i].deptId == that.mulSubjectList[j].deptId) {
                            that.singleDepartmentList[i].financeFaAssignExpenseList.push(that.mulSubjectList[j]);
                        }
                    }
                }

                //检查各部门下的折旧费用分配是否存在重复科目
                for (var i = 0; i < that.singleDepartmentList.length; i++) {
                    var subjectArr = [];
                    for (var j = 0; j < that.singleDepartmentList[i].financeFaAssignExpenseList.length; j++) {
                        subjectArr.push(that.singleDepartmentList[i].financeFaAssignExpenseList[j].expenseSubjectId);
                    }
                    if (Array.from(new Set(subjectArr)).length != subjectArr.length) {
                        that.wrapAlert("在同一部门下出现了重复的折旧费用分配项目！");
                        return;
                    }
                }

                //检查各部门下的折旧费用分配比例和是否等于100%
                for (var i = 0; i < that.singleDepartmentList.length; i++) {
                    var temp = 0;
                    for (var j = 0; j < that.singleDepartmentList[i].financeFaAssignExpenseList.length; j++) {
                        temp = floatObj.add(temp, that.singleDepartmentList[i].financeFaAssignExpenseList[j].rate, 2);
                    }
                    if (temp != 100) {
                        that.wrapAlert("在部门'" + that.singleDepartmentList[i].departmentName + "'下折旧费用分配比例之和必须为100%！");
                        return;
                    }
                }
            } else {
                //先清空
                for (var i = 0; i < that.mulDepartmentList.length; i++) {
                    that.mulDepartmentList[i].financeFaAssignExpenseList = [];
                }
                //挂载
                for (var i = 0; i < that.mulDepartmentList.length; i++) {
                    for (var j = 0; j < that.mulSubjectList.length; j++) {
                        if (that.mulDepartmentList[i].deptId == that.mulSubjectList[j].deptId) {
                            that.mulDepartmentList[i].financeFaAssignExpenseList.push(that.mulSubjectList[j]);
                        }
                    }
                }

                //检查各部门下的折旧费用分配是否存在重复科目
                for (var i = 0; i < that.mulDepartmentList.length; i++) {
                    var subjectArr = [];
                    for (var j = 0; j < that.mulDepartmentList[i].financeFaAssignExpenseList.length; j++) {
                        subjectArr.push(that.mulDepartmentList[i].financeFaAssignExpenseList[j].expenseSubjectId);
                    }
                    if (Array.from(new Set(subjectArr)).length != subjectArr.length) {
                        that.wrapAlert("在同一部门下出现了重复的折旧费用分配项目！");
                        return;
                    }
                }

                //检查各部门下的折旧费用分配比例和是否等于100%
                for (var i = 0; i < that.mulDepartmentList.length; i++) {
                    var temp = 0;
                    if (that.mulDepartmentList[i].financeFaAssignExpenseList.length == 0) {
                        that.wrapAlert("在部门'" + that.mulDepartmentList[i].departmentName + "'下还没有进行折旧费用分配");
                        return;
                    }
                    for (var j = 0; j < that.mulDepartmentList[i].financeFaAssignExpenseList.length; j++) {
                        temp = floatObj.add(temp, that.mulDepartmentList[i].financeFaAssignExpenseList[j].rate, 2);
                    }
                    if (temp != 100) {
                        that.wrapAlert("在部门'" + that.mulDepartmentList[i].departmentName + "'下折旧费用分配比例之和必须为100%！");
                        return;
                    }
                }

            }

            // that.subjectTip = '';
            // var tempDeptList;
            // if (that.deptSingleMul == 1) {
            //     tempDeptList = that.singleDepartmentList;
            // } else {
            //     tempDeptList = that.mulDepartmentList;
            // }
            // tempDeptList.forEach(dept => {
            //     dept.financeFaAssignExpenseList.forEach(subject => {
            //         that.subjectTip += dept.departmentName + ': ' + subject.expenseSubjectName.split(' ')[1];
            //         subject.itemRelateDetailList.forEach(project => {
            //             that.subjectTip += '/' + project.itemClassName + '-' + that.getItemName(project.itemList, project.itemId);
            //         });
            //         that.subjectTip += ':' + subject.rate + '% ';
            //     })
            // });

            this.MDCAListVisible = false;
        },
        getDepartmentName (list, id) {
            var temp;
            list.forEach(item => {
                if (item.deptId == id) {
                    temp = item.departmentName;
                }
            });
            return temp;
        },
        getItemName (list, id) {
            var temp;
            list.forEach(item => {
                if (item.itemId == id) {
                    temp = item.itemName;
                }
            });
            return temp;
        },
        moneyIsZero (money) {
            if (money == null || typeof money == 'undefined' || $.trim(money) == '' || money == 0) {
                return true;
            }
            return false;
        },
        stringIsEmpty (str) {
            if (str == null || typeof str == 'undefined' || $.trim(str) == '') {
                return true;
            }
            return false;
        },
        //保存卡片
        saveCard () {
            var that = this;
            if (that.managerType == 'info') {
                setTimeout(() => {
                    window.parent.closeCurrentTab({ openTime: that.openTime, exit: true });
                }, 500);
                return false;
            }
            if (that.card.assetTypeId == null || $.trim(that.card.assetTypeId) == '') {
                that.wrapAlert("请选择资产类别！");
                return false;
            }
            if (that.card.assetCode == null || $.trim(that.card.assetCode) == '') {
                that.wrapAlert("固定资产编码不能为空！");
                return false;
            }
            var count = 0;
            if (that.managerType == 'add' || that.managerType == 'copy') {
                $.ajax({
                    url: contextPath + '/facard/countbycode/' + that.card.assetCode,
                    type: 'post',
                    async: false,
                    success: function (data) {
                        count = data.data;


                    }
                });
                if (count > 0) {
                    that.wrapAlert("固定资产编码重复！");
                    return false;
                }
            }


            if (that.card.assetName == null || $.trim(that.card.assetName) == '') {
                that.wrapAlert("固定资产名称不能为空!");
                return false;
            }
            if (that.card.useStateId == null || $.trim(that.card.useStateId) == '') {
                that.wrapAlert("请选择使用状况!");
                return false;
            }
            if (that.card.alterTypeId == null || $.trim(that.card.alterTypeId) == '') {
                that.wrapAlert("请选择变动方式！");
                return false;
            }
            if (that.card.assetSubjectId == null || $.trim(that.card.assetSubjectId) == '') {
                that.wrapAlert("请选择固定资产科目！");
                return false;
            }
            if (that.card.deprSubjectId == null || $.trim(that.card.deprSubjectId) == '') {
                that.wrapAlert("请选择累计折旧科目！");
                return false;
            }
            let itemCount;
            $.ajax({
                url: contextPath + '/facard/countitem/' + that.card.deprSubjectId,
                type: 'post',
                async: false,
                success: function (data) {
                    itemCount = data.data;
                }
            });
            if (itemCount > 0) {
                that.wrapAlert("累计折旧科目不能下设核算项目！");
                return false;
            }
            if (that.deptSingleMul == 1) {
                if (that.singleDepartmentList == null || that.singleDepartmentList.length == 0) {
                    that.wrapAlert("缺少部门分配信息！");
                    return false;
                } else {
                    for (var i = 0; i < that.singleDepartmentList.length; i++) {
                        if (that.singleDepartmentList[i].financeFaAssignExpenseList == null || that.singleDepartmentList[i].financeFaAssignExpenseList.length == 0) {
                            that.wrapAlert("缺少折旧费用分配信息！");
                            return false;
                        }
                    }

                }
            } else {
                if (that.mulDepartmentList == null || that.mulDepartmentList == []) {
                    that.wrapAlert("缺少部门分配信息!");
                    return false;
                } else {
                    for (var i = 0; i < that.mulDepartmentList.length; i++) {
                        if (that.mulDepartmentList[i].financeFaAssignExpenseList == null || that.mulDepartmentList[i].financeFaAssignExpenseList.length == 0) {
                            that.wrapAlert("缺少折旧费用分配信息!");
                            return false;
                        }
                    }
                }
            }

            if (that.subjectSingleMul == 1) {
                if (that.deptSingleMul == 1) {
                    // that.singleDepartmentList.forEach(item=>{
                    //     item.financeFaAssignExpenseList.forEach(item2=>{
                    //         item2.itemRelateDetailList.forEach(item3=>{
                    //             if (item3.itemId == null || typeof item3.itemId == 'undefined') {
                    //                 alert("缺少核算项目数据！");
                    //                 return false;
                    //             }
                    //
                    //         })
                    //     })
                    // });
                    for (var i = 0; i < that.singleDepartmentList.length; i++) {
                        for (var j = 0; j < that.singleDepartmentList[i].financeFaAssignExpenseList.length; j++) {
                            for (var k = 0; k < that.singleDepartmentList[i].financeFaAssignExpenseList[j].itemRelateDetailList.length; k++) {
                                var temp = that.singleDepartmentList[i].financeFaAssignExpenseList[j].itemRelateDetailList[k].itemId;
                                if (temp == null || typeof temp == 'undefined') {
                                    that.wrapAlert("缺少核算项目数据！");
                                    return false;
                                }
                            }
                        }
                    }
                } else {
                    // that.mulDepartmentList.forEach(item=>{
                    //     item.financeFaAssignExpenseList.forEach(item2=>{
                    //         item2.itemRelateDetailList.forEach(item3=>{
                    //             if (item3.itemId == null || typeof item3.itemId == 'undefined') {
                    //                 alert("缺少核算项目数据！");
                    //                 return false;
                    //             }
                    //
                    //         })
                    //     })
                    // });
                    for (var i = 0; i < that.mulDepartmentList.length; i++) {
                        for (var j = 0; j < that.mulDepartmentList[i].financeFaAssignExpenseList.length; j++) {
                            for (var k = 0; k < that.mulDepartmentList[i].financeFaAssignExpenseList[j].itemRelateDetailList.length; k++) {
                                var temp = that.mulDepartmentList[i].financeFaAssignExpenseList[j].itemRelateDetailList[k].itemId;
                                if (temp == null || typeof temp == 'undefined') {
                                    that.wrapAlert("缺少核算项目数据！");
                                    return false;
                                }
                            }
                        }
                    }
                }

            }
            if (that.currencySingleMul == 1) {
                if (that.singleCurrency.currencyId == null || that.singleCurrency.currencyId == '') {
                    that.wrapAlert("币别不能为空！");
                    return false;
                }
                if (that.moneyIsZero(that.singleCurrency.orgValFor)) {
                    that.wrapAlert("金额必须大于0！");
                    return false;
                }
            } else {
                if (that.mulCurrencyList == null || that.mulCurrencyList.length < 1) {
                    that.wrapAlert("缺少原值信息！");
                    return false;
                }
                for (var i = 0; i < that.mulCurrencyList.length; i++) {
                    if (that.moneyIsZero(that.mulCurrencyList[i].orgValFor)) {
                        that.wrapAlert("金额必须大于0！");
                        return false;
                    }
                }
            }

            if (that.card.expectUsePeriods <= 0) {
                that.wrapAlert("预计使用期间数不能为0！");
                return false;
            }

            if (that.currencySingleMul == 1) {
                if (that.card.expectNetSalvage > that.singleCurrency.orgVal) {
                    that.wrapAlert("预计净残值不能大于固定资产原值！");
                    return false;
                }
            } else {
                if(that.card.expectNetSalvage >= that.mulStandardAmount) {
                    that.wrapAlert("预计净残值不能大于等于固定资产原值！");
                    return false;
                }
            }

            if (that.card.deprMethod == null || $.trim(that.card.deprMethod) == '') {
                that.wrapAlert("折旧方法不能为空！");
                return false;
            }

            if (that.deptSingleMul == 1) {
                var arrDept = JSON.parse(JSON.stringify(that.singleDepartmentList));
                for (var i = 0; i < arrDept.length; i++) {
                    delete arrDept[i].departmentName;
                }

                that.card.financeFaAssignDeptList = arrDept;
            } else {
                var arrDept = JSON.parse(JSON.stringify(that.mulDepartmentList));
                for (var i = 0; i < arrDept.length; i++) {
                    delete arrDept[i].departmentName;
                }
                that.card.financeFaAssignDeptList = arrDept;
            }

            if (that.currencySingleMul == 1) {
                that.card.financeFaOrginValList = that.singleCurrency;
            } else {
                that.card.financeFaOrginValList = that.mulCurrencyList;
            }

            that.card.financeFaAttachDeviceList = that.dataList;

            var _url = '';
            if (that.managerType == 'init' || (that.managerType == 'copy' && !that.startUsing)) {
                _url = contextPath + '/facard/initaddcard';
            } else if (that.managerType == 'add' || (that.managerType == 'copy' && that.startUsing)) {
                _url = contextPath + '/facard/addcard';
            } else if (that.managerType == 'update') {
                _url = contextPath + '/facard/updatecard'
            } else if (that.managerType == 'change') {
                _url = contextPath + '/faClearChange/changeOneCard';
            }

            $.ajax({
                url: _url,
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify(that.card),
                success: function (data) {
                    if (data.data == true) {
                        if (that.managerType == 'init' || that.managerType == 'add' || that.managerType == 'copy') {
                            that.wrapAlert("增加固定资产卡片成功！");
                        } else if (that.managerType == 'update') {
                            that.wrapAlert("修改固定资产卡片成功！");
                        } else {
                            that.wrapAlert("变动固定资产卡片成功！");
                        }

                        setTimeout(() => {
                            window.parent.closeCurrentTab({ openTime: that.openTime, exit: true });
                        }, 500);
                    } else {
                        that.wrapAlert("服务器出错，请稍后再试！");
                        setTimeout(() => {
                            window.parent.closeCurrentTab({ openTime: that.openTime, exit: true });
                        }, 500);
                    }

                }
            });


            return true;

        },


        //维护多币别数据
        saveMulCurrency () {
            var that = this;
            //检查是否含有重复币别
            for (var i = 0; i < that.MMCDdataList.length; i++) {
                if (that.MMCDdataList[i].currencyId == null || typeof that.MMCDdataList[i].currencyId == "undefined") {
                    that.wrapAlert("币别不能为空！");
                    return;
                }
            }
            var arr = [];
            for (var i = 0; i < that.MMCDdataList.length; i++) {
                arr.push(that.MMCDdataList[i].currencyId);
            }
            var newArr = Array.from(new Set(arr));
            if (arr.length != newArr.length) {
                that.wrapAlert("币别出现了重复");
                return false;
            }

            //检查币别字段是否有值
            for (var i = 0; i < that.MMCDdataList.length; i++) {
                if (that.MMCDdataList[i].currencyId == null || $.trim(that.MMCDdataList[i].currencyId) == '') {
                    that.wrapAlert("币别不能为空");
                    return;
                }
            }

            that.mulCurrencyList = JSON.parse(JSON.stringify(that.MMCDdataList));
            for (var i = 0; i < that.mulCurrencyList.length; i++) {
                delete that.mulCurrencyList[i].show;
            }

            //计算页面显示的综合本位币金额
            var sum = 0;
            for (var i = 0; i < that.mulCurrencyList.length; i++) {
                var orgVal = floatObj.multiply(that.mulCurrencyList[i].orgValFor, that.mulCurrencyList[i].exchangeRate, 2);
                sum = floatObj.add(sum, orgVal, 2);
            }
            that.mulStandardAmount = sum;
            this.MMCDListVisible = false;
        },
        //正则表达式法获取url参数值
        getQueryString (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return r[2];
            return '';
        },
        //提示alert
        wrapAlert (msg) {
            this.$Message.info({
                content: msg,
                duration: 3
            });
        },


        //取消且退出附属设备窗口
        cancelAttach () {
            this.dataList = this.tempDeviceList;
            this.SEListVisible = false;
        },
        // 多个折扣费用分配 核算项目
        addSubjectListOptClose () {
            var that = this;

        },
        showaddSubjectListOptVisable (_item, _idx) {
            var that = this;
            console.log(_item);
            that.MDCAdataList[_idx].itemRelateDetailList = _item.itemRelateDetailList;
            this.testitemList = _item;
            this.addSubjectListOptShow = true;
        },

        //回显ztree
        echoTree () {
            var that = this;
            var zclxTree = $.fn.zTree.getZTreeObj(that.zclbId);//ztree树的ID
            var zclxNode = zclxTree.getNodeByParam("id", that.card.assetTypeId);//根据ID找到该节点
            if (zclxNode != null) {
                zclxTree.selectNode(zclxNode);//根据该节点选中
                that.assetTypeName = zclxNode.name;
            }

            var syztTree = $.fn.zTree.getZTreeObj(that.syztId);//ztree树的ID
            var syztNode = syztTree.getNodeByParam("id", that.card.useStateId);//根据ID找到该节点
            if (syztNode != null) {
                syztTree.selectNode(syztNode);//根据该节点选中
                that.useStateName = syztNode.name;
            }

            var bdfsTree = $.fn.zTree.getZTreeObj(that.bdfsId);//ztree树的ID
            var bdfsNode = bdfsTree.getNodeByParam("id", that.card.alterTypeId);//根据ID找到该节点
            if (bdfsNode != null) {
                bdfsTree.selectNode(bdfsNode);//根据该节点选中
                that.changeMethodName = bdfsNode.name;
            }
        },
        quit () {
            window.parent.closeCurrentTab({ openTime: this.openTime, exit: true });
        },
        previous () {
            var that = this;
            var arr = JSON.parse(layui.data("assetIds").ids);
            var indexOf;
            if (that.managerType == 'add') {
                that.managerType = 'info';
                indexOf = arr.length;
            } else {
                indexOf = arr.indexOf(that.id.toString());
            }
            if (indexOf > 0) {
                that.id = arr[indexOf - 1];
                // $.ajax({
                //     url: contextPath + '/facard/cardvo/' + that.id,
                //     type: 'post',
                //     success: function (data) {
                //         that.card = data.data;
                //     }
                // });

                // window.parent.closeCurrentTab({ openTime: this.openTime, exit: true });
                // var _url = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=info&id=" + that.id;
                // window.parent.activeEvent({ 'name': '卡片详情', 'url': _url });

                window.location.href = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=info&id=" + that.id;
            } else {
                that.wrapAlert("已是第一张卡片！");
            }

        },
        next () {
            var that = this;
            var arr = JSON.parse(layui.data("assetIds").ids);
            var indexOf;
            if (that.managerType == 'add') {
                that.wrapAlert("已是最后一张卡片！");
                return;
            } else {
                indexOf = arr.indexOf(that.id.toString());
            }
            if (indexOf < arr.length - 1) {
                that.id = arr[indexOf + 1];
                // $.ajax({
                //     url: contextPath + '/facard/cardvo/' + that.id,
                //     type: 'post',
                //     success: function (data) {
                //         that.card = data.data;
                //     }
                // });

                // window.parent.closeCurrentTab({ openTime: this.openTime, exit: true });
                // var _url = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=info&id=" + that.id;
                // window.parent.activeEvent({ 'name': '卡片详情', 'url': _url });

                window.location.href = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=info&id=" + that.id;
            } else {
                that.wrapAlert("已是最后一张卡片！");
            }

        },
        first () {
            var that = this;
            var arr = JSON.parse(layui.data("assetIds").ids);
            that.id = arr[0];
            // $.ajax({
            //     url: contextPath + '/facard/cardvo/' + that.id,
            //     type: 'post',
            //     success: function (data) {
            //         that.card = data.data;
            //     }
            // });

            // window.parent.closeCurrentTab({ openTime: this.openTime, exit: true });
            // var _url = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=info&id=" + that.id;
            // window.parent.activeEvent({ 'name': '卡片详情', 'url': _url });

            window.location.href = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=info&id=" + that.id;

        },
        last () {
            var that = this;
            var arr = JSON.parse(layui.data("assetIds").ids);
            that.id = arr[arr.length - 1];
            // $.ajax({
            //     url: contextPath + '/facard/cardvo/' + that.id,
            //     type: 'post',
            //     success: function (data) {
            //         that.card = data.data;
            //     }
            // });

            // window.parent.closeCurrentTab({ openTime: this.openTime, exit: true });
            // var _url = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=info&id=" + that.id;
            // window.parent.activeEvent({ 'name': '卡片详情', 'url': _url });

            window.location.href = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=info&id=" + that.id;
        },
        list () {
            // window.parent.closeCurrentTab({ openTime: this.openTime, exit: true });
            var _url = contextPath + "/finance/FixedAssets/InitialFixedAssetsList/index.html?_opentime=" + new Date().getTime();
            window.parent.activeEvent({ 'name': '固定资产管理', 'url': _url });
        },
        copy () {
            let name;
            if (this.startUsing) {
                name = '新增复制';
            } else {
                name = '初始化复制';
            }
            var _url = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=copy&id=" + this.card.id;
            window.parent.activeEvent({ 'name': name, 'url': _url });
        },
        //新增卡片
        addCard () {
            var that = this;
            var _name = "";
            var _url = "";
            if (that.startUsing) {
                _name = "卡片新增";
                _url = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=add&_opentime=" + new Date().getTime();
                // _url = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=add";
            } else {
                _name = "初始化";
                _url = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=init";
            }
            // var _url=contextPath+"/finance/FixedAssets/InitialFixedAssets/index.html?type=init";
            window.parent.activeEvent({ 'name': _name, 'url': _url });
        },
        //查询是否已经启用固定资产
        // getStartUsing () {
        //     var that = this;
        //     $.ajax({
        //         url: rcContextPath + '/financeCommon/sysIsEnabled/' + 4,
        //         type: "post",
        //         success: function (data) {
        //             that.startUsing = data.data;
        //         }
        //     })
        // },
        //查询当前期间固定资产是否已生成凭证
        getHasVoucher () {
            var that = this;
            $.ajax({
                url: contextPath + '/financeCommon/faWhetherVourcher',
                type: 'post',
                success: function (data) {
                    that.hasVoucher = data.data;
                }
            });
        },
        //查询当前会计期间字符串
        getCurrentPeriodStr () {
            var that = this;
            $.ajax({
                url: contextPath + '/facard/getperiodstr',
                type: 'post',
                success: function (data) {
                    that.currentPeriodStr = data.data;
                }
            });
        },
        //查询当前已使用期间数
        getNumberOfPeriodInUse () {
            var that = this;
            $.ajax({
                url: contextPath + '/facard/periodinuse/' + that.card.id,
                type: 'post',
                success: function (data) {
                    that.numberOfPreiodInUse = data.data;
                }
            });
        },
        getCurrencyName (list, id) {
            var temp;
            list.forEach(item => {
                if (item.id == id) {
                    temp = item.currencyName;
                }
            });
            return temp;
        }


    },
    computed: {
        attachTotal: function () {
            var that = this;
            var sum = 0;
            that.dataList.forEach(item => {
                sum = floatObj.add(sum, item.amount);
            });
            return sum;
        },
        departmentTip: function () {
            var that = this;
            var str = '';
            if (that.deptSingleMul == 1) {
                if (that.stringIsEmpty(that.deptName)) {
                    return '';
                }
                str = that.deptName + ":100%";
            } else {
                // that.SDARdataList.forEach(item => {
                //     str += item.departmentName + ':' + item.rate + '%  ';
                // });
                $.each(that.SDARdataList, function (i, val) {
                    if (that.stringIsEmpty(val.departmentName) || that.moneyIsZero(val.rate)) {
                        return '';
                    }
                    str += val.departmentName + ':' + val.rate + '%  ';
                });
            }

            return str;
        },
        subjectTip: function () {
            var that = this;
            var str = '';
            if (that.subjectSingleMul == 1) {
                if (that.stringIsEmpty(that.allotSubjectName)) {
                    return '';
                }
                str = that.allotSubjectName.split(' ')[1] + ':100%';
            } else {
                var tempDeptList;
                if (that.deptSingleMul == 1) {
                    tempDeptList = that.singleDepartmentList;
                } else {
                    tempDeptList = that.mulDepartmentList;
                }
                // that.MDCAdataList.forEach(subject => {
                //     str += that.getDepartmentName(tempDeptList, subject.deptId) + ': ' + (subject.expenseSubjectName == null ? 'null' : subject.expenseSubjectName.split(' ')[1]);
                //     subject.itemRelateDetailList.forEach(project => {
                //         str += '/' + project.itemClassName + '-' + that.getItemName(project.itemList, project.itemId);
                //     });
                //     str += ':' + subject.rate + '% ';
                // });
                $.each(that.MDCAdataList, function (i, subject) {
                    if (that.moneyIsZero(subject.deptId) || that.stringIsEmpty(subject.expenseSubjectName) || that.moneyIsZero(subject.rate)) {
                        return '';
                    }
                    str += that.getDepartmentName(tempDeptList, subject.deptId) + ': ' + subject.expenseSubjectName.split(' ')[1];
                    // $.each(subject.itemRelateDetailList,function (j, project) {
                    //     str += '/' + project.itemClassName + '-' + that.getItemName(project.itemList, project.itemId);
                    // });
                    for (var i = 0; i < subject.itemRelateDetailList.length; i++) {
                        if (that.moneyIsZero(subject.itemRelateDetailList[i].itemId)) {
                            return '';
                        }
                        str += '/' + subject.itemRelateDetailList[i].itemClassName + '-' + that.getItemName(subject.itemRelateDetailList[i].itemList, subject.itemRelateDetailList[i].itemId);
                    }
                    str += ':' + subject.rate + '% ';
                })
            }
            // if (str.indexOf('null') >= 0 || str.indexOf('undefined') >= 0) {
            //     return '';
            // }
            return str;
        },
        currencyTip: function () {
            var that = this;
            if (that.currencySingleMul == 1) {
                return that.getCurrencyName(that.currencyList, that.singleCurrency.currencyId) + ':' + that.singleCurrency.orgValFor;
            } else {
                var str = '';
                that.mulCurrencyList.forEach(item => {
                    str += that.getCurrencyName(that.currencyList, item.currencyId) + ':' + item.orgValFor + ' ';
                });
                return str;
            }
        },
        currencyAdjust: function () {
            let that = this;
            if (that.currencySingleMul == 1) {
                if (that.managerType == 'init' || that.managerType == 'add') {
                    return floatObj.multiply(that.singleCurrency.orgValFor, that.singleCurrency.exchangeRate, 2);
                } else if (that.managerType == 'update' || that.managerType == 'change') {
                    return floatObj.subtract(floatObj.multiply(that.singleCurrency.orgValFor, that.singleCurrency.exchangeRate, 2), that.card.totalVal, 2);
                }
            }
            return 0;
        }

    },
    watch: {
        'singleCurrency.currencyId' () {
            var that = this;
            $.ajax({
                url: contextPath + '/facard/getratebyid/' + that.singleCurrency.currencyId,
                type: 'post',
                success: function (data) {
                    that.singleCurrency.exchangeRate = data.data;
                }
            })
        },
        deptSingleMul (val, oldVal) {
            // var that = this;
            // if (val == 1) {
            //     that.card.financeFaAssignDeptList = that.singleDepartmentList;
            // } else {
            //     that.card.financeFaAssignDeptList = that.mulDepartmentList;
            // }
            var that = this;
            if (that.firstWatchDeptSingleMul && (that.managerType == 'update' || that.managerType == 'copy' || that.managerType == 'info' || that.managerType == 'change')) {
                that.firstWatchDeptSingleMul = false;
                return;
            }
            //清空挂载的折旧费用分配情况
            for (var i = 0; i < that.singleDepartmentList.length; i++) {
                that.singleDepartmentList[i].financeFaAssignExpenseList = [];
            }
            for (var i = 0; i < that.mulDepartmentList.length; i++) {
                that.mulDepartmentList[i].financeFaAssignExpenseList = [];
            }
            that.singleSubjectList = [];
            that.mulSubjectList = [];
            that.allotSubjectName = '';
            that.MDCAdataList = [];
            that.singleProjectList = [];

            // that.departmentTip = '';
            // if (val == 1) {
            //     if (that.deptName != '') {
            //         that.departmentTip = that.deptName + ":100%";
            //     }
            // } else {
            //
            //     that.mulDepartmentList.forEach(item => {
            //         that.departmentTip += item.departmentName + ':' + item.rate + '%  ';
            //     });
            // }

        },
        subjectSingleMul (val, oldVal) {
            var that = this;
            if (that.firstWatchSubjectSingleMul && (that.managerType == 'update' || that.managerType == 'copy' || that.managerType == 'info' || that.managerType == 'change')) {
                that.firstWatchSubjectSingleMul = false;
                return;
            }
            if (val == 1) {
                // 清空卡片的折旧费用科目分配
                // for (var i=0;i<that.card.financeFaAssignDeptList.length;i++) {
                //     that.card.financeFaAssignDeptList[i].financeFaAssignExpenseList = [];
                // }

                //singleSubjectList挂载到部门分配上
                if (that.deptSingleMul == 1) {
                    //先清空
                    for (var i = 0; i < that.singleDepartmentList.length; i++) {
                        that.singleDepartmentList[i].financeFaAssignExpenseList = [];
                    }

                    for (var j = 0; j < that.singleSubjectList.length; j++) {
                        if (that.singleDepartmentList[0].deptId == that.singleSubjectList[j].deptId) {
                            that.singleDepartmentList[0].financeFaAssignExpenseList = [that.singleSubjectList[j]];
                            break;
                        }
                    }

                } else {

                    //先清空
                    for (var i = 0; i < that.mulDepartmentList; i++) {
                        that.mulDepartmentList[i].financeFaAssignExpenseList = [];
                    }
                    for (var i = 0; i < that.mulDepartmentList.length; i++) {
                        for (var j = 0; j < that.singleSubjectList.length; j++) {
                            if (that.mulDepartmentList.deptId == that.singleSubjectList[j].deptId) {
                                that.mulDepartmentList[i].financeFaAssignExpenseList = [that.singleSubjectList[j]];
                                break;
                            }
                        }
                    }
                }

            } else {
                if (that.deptSingleMul == 1) {
                    //先清空
                    for (var i = 0; i < that.singleDepartmentList.length; i++) {
                        that.singleDepartmentList[i].financeFaAssignExpenseList = [];
                    }
                    //挂载到部门分配list中
                    for (var i = 0; i < that.singleDepartmentList.length; i++) {
                        for (var j = 0; j < that.mulSubjectList.length; j++) {
                            if (that.mulSubjectList[j].deptId == that.singleDepartmentList[i].deptId) {
                                that.singleDepartmentList[i].financeFaAssignExpenseList.push(that.mulSubjectList[j]);
                            }
                        }
                    }
                } else {
                    //先清空
                    for (var i = 0; i < that.mulDepartmentList.length; i++) {
                        that.mulDepartmentList[i].financeFaAssignExpenseList = [];
                    }
                    //挂载到部门分配list中
                    for (var i = 0; i < that.mulDepartmentList.length; i++) {
                        that.mulDepartmentList[i].financeFaAssignExpenseList = [];
                        for (var j = 0; j < that.mulSubjectList.length; j++) {
                            if (that.mulSubjectList[j].deptId == that.mulDepartmentList[i].deptId) {
                                that.mulDepartmentList[i].financeFaAssignExpenseList.push(that.mulSubjectList[j]);
                            }
                        }
                    }
                }
            }

            // that.subjectTip = '';
            // if (that.subjectSingleMul == 1) {
            //     if (that.allotSubjectName != '') {
            //         that.subjectTip = that.allotSubjectName.split(' ')[1] + ':100%';
            //     }
            // } else {
            //     var tempDeptList;
            //     if (that.deptSingleMul == 1) {
            //         tempDeptList = that.singleDepartmentList;
            //     } else {
            //         tempDeptList = that.mulDepartmentList;
            //     }
            //     tempDeptList.forEach(dept=>{
            //         dept.financeFaAssignExpenseList.forEach(subject=>{
            //             that.subjectTip += dept.departmentName + ': ' + subject.expenseSubjectName.split(' ')[1];
            //             subject.itemRelateDetailList.forEach(project=>{
            //                 that.subjectTip += '/' + project.itemClassName + '-' + that.getItemName(project.itemList, project.itemId);
            //             });
            //             that.subjectTip += ':' + subject.rate + '% ';
            //         })
            //     });
            // }
        },

        'singleCurrency.orgValFor' () {
            let that = this;
            this.singleCurrency.orgVal = floatObj.multiply(that.singleCurrency.orgValFor, that.singleCurrency.exchangeRate, 2);
        },
        'singleCurrency.exchangeRate' () {
            let that = this;
            this.singleCurrency.orgVal = floatObj.multiply(that.singleCurrency.orgValFor, that.singleCurrency.exchangeRate, 2);
        },
        'singleCurrency.orgVal' () {
            let that = this;
            if (that.currencySingleMul == 1) {
                if (!that.moneyIsZero(that.assetType.netResidualRate)) {
                    that.card.expectNetSalvage = floatObj.multiply(that.singleCurrency.orgVal, that.assetType.netResidualRate, 2);
                }
            }
        },
        mulStandardAmount () {
            let that = this;
            if (!that.moneyIsZero(that.assetType.netResidualRate)) {
                that.card.expectNetSalvage = floatObj.multiply(that.mulStandardAmount, that.assetType.netResidualRate, 2);
            }
        },
        currencySingleMul () {
            let that = this;
            if (that.currencySingleMul == 1) {
                if (!that.moneyIsZero(that.assetType.netResidualRate)) {
                    that.card.expectNetSalvage = floatObj.multiply(that.singleCurrency.orgVal, that.assetType.netResidualRate, 2);
                }
            } else {
                if (!that.moneyIsZero(that.assetType.netResidualRate)) {
                    that.card.expectNetSalvage = floatObj.multiply(that.mulStandardAmount, that.assetType.netResidualRate, 2);
                }
            }
        }
        //         if (currencySingleMul == 1) {
        //     if (!that.moneyIsZero(assetType.netResidualRate)) {
        //         that.card.expectNetSalvage = floatObj.multiply(that.singleCurrency.orgVal, assetType.netResidualRate, 2);
        //     }
        // } else {
        //     if (!that.moneyIsZero(assetType.netResidualRate)) {
        //         that.card.expectNetSalvage = floatObj.multiply(that.mulStandardAmount, assetType.netResidualRate, 2);
        //     }
        // }

    },
    created () {

        var that = this;
        that.id = that.getQueryString("id");
        that.managerType = that.getQueryString("type");

        this.getStartUsing();

        if (that.managerType == "update" || that.managerType == "copy" || that.managerType == "info" || that.managerType == "change") {
            $.ajax({
                url: contextPath + '/facard/cardvo/' + that.id,
                type: 'post',
                async: false,
                success: function (data) {
                    that.card = data.data;
                    var _sl = [
                        { 'id': 1, 'value': that.card.assetSubjectId },
                        { 'id': 2, 'value': that.card.deprSubjectId }
                    ];
                    that.initSubjectList = _sl;

                    // $.ajax({
                    //     url: contextPath + '/assetsclassescontroller/assetsClassesList',
                    //     type: 'post',
                    //     contentType: 'application/json',
                    //     async: false,
                    //     success: function (data) {
                    //         that.assetTypeTree = data.data;
                    //         setTimeout(function () {
                    //             var treeObj = $.fn.zTree.getZTreeObj(that.zclbId);//ztree树的ID
                    //             var _node = treeObj.getNodeByParam("id", that.card.assetTypeId);//根据ID找到该节点
                    //             if (_node != null) {
                    //                 treeObj.selectNode(_node);//根据该节点选中
                    //                 that.assetTypeName = _node.name;
                    //             }
                    //         }, 500);
                    //     }
                    // })
                }
            })
        }

        if (this.managerType == 'change') {
            this.card.alterTypeId = null;
        }

        if (that.managerType == 'init' || (that.managerType == 'copy' && !that.startUsing) || (that.managerType == 'update' && !that.startUsing)) {
            this.getEnabledAccountYear();
            this.getEnabledAccountPeriod();
        } else if (that.managerType == 'add' || that.managerType == 'copy' || that.managerType == 'change' || that.managerType == 'update') {
            this.getDateScope();
        }

        if (that.managerType == 'init' || (that.managerType == 'copy' && !that.startUsing) || (that.managerType == 'update' && !that.startUsing)) {
            if (that.enabledAccountPeriod == 1) {
                that.card.enterAccountDate = new Date(that.enabledAccountYear - 1, 12, 0);
            } else {
                that.card.enterAccountDate = new Date(that.enabledAccountYear, that.enabledAccountPeriod - 1, 0);
            }
        } else if (that.managerType == 'add' || that.managerType == 'change' || that.managerType == 'copy') {
            // if (that.currentAccountPeriod == 1) {
            //     that.card.enterAccountDate = new Date(that.currentAccountYear - 1, 12, 0);
            // } else {
            //     that.card.enterAccountDate = new Date(that.currentAccountYear, that.currentAccountPeriod, 0);
            // }
            // that.card.enterAccountDate = new Date(that.currentAccountYear, that.currentAccountPeriod, 0);
            that.card.enterAccountDate = new Date(that.changeDateScope.endDate);
        }


        that.allTree();


        var id = that.getQueryString("id");

        if (that.managerType == "info" || that.managerType == "copy" || that.managerType == "update" || that.managerType == "change") {
            that.deptSingleMul = 100;
            that.subjectSingleMul = 100;
        }

        if (that.managerType == 'copy' || that.managerType == 'update' || that.managerType == 'change') {
            $.ajax({
                url: contextPath + '/assetsclassescontroller/getClassesById',
                type: 'post',
                async: false,
                data: { id: that.card.assetTypeId },
                success: function (data) {
                    that.assetType = data.data;
                }
            });
        }

        if (that.managerType == 'copy') {
            that.card.voucherId = null;
        }


    },
    //获取会计科目列表
    mounted () {
        var that = this;


        this.getOrgList();      //查询组织列表
        this.listUnitGroup();       //查询单位组列表
        this.listUnitByGroupId();


        if (that.managerType == 'update' || that.managerType == 'copy' || that.managerType == 'info' || that.managerType == 'change') {
            that.echoTree();
            that.dataList = JSON.parse(JSON.stringify(that.card.financeFaAttachDeviceList));
            for (var i = 0; i < that.dataList.length; i++) {
                $.ajax({
                    url: contextPath + "/facard/listunitbygroupid/" + that.dataList[i].unitGroupId,
                    type: "post",
                    async: false,
                    success: function (data) {
                        that.dataList[i].unitList = data.data;
                    }

                });
            }

            that.supplierName = that.card.supplierName;
            // that.assetSubjectName=that.card.assetSubjectName;
            // that.depreciationSubjectName=that.card.deprSubjectName;

            //部门分配
            if (that.card.financeFaAssignDeptList.length == 1) {
                that.deptSingleMul = 1;
                that.singleDepartmentList = JSON.parse(JSON.stringify(that.card.financeFaAssignDeptList));

                setTimeout(function () {
                    var bmTree = $.fn.zTree.getZTreeObj(that.bmId);//ztree树的ID
                    var bmNode = bmTree.getNodeByParam("id", that.card.financeFaAssignDeptList[0].deptId);//根据ID找到该节点
                    if (bmNode != null) {
                        bmTree.selectNode(bmNode);//根据该节点选中
                        that.deptName = bmNode.name;
                    }
                }, 500);

            } else {
                that.deptSingleMul = 2;
                that.SDARdataList = JSON.parse(JSON.stringify(that.card.financeFaAssignDeptList));
                that.mulDepartmentList = JSON.parse(JSON.stringify(that.card.financeFaAssignDeptList));

                setTimeout(function () {
                    for (var i = 0; i < that.SDARdataList.length; i++) {
                        var bmTree = $.fn.zTree.getZTreeObj(that.bmId + (i));//ztree树的ID
                        var bmNode = bmTree.getNodeByParam("id", that.SDARdataList[i].deptId);//根据ID找到该节点
                        if (bmNode != null) {
                            bmTree.selectNode(bmNode);//根据该节点选中
                            that.SDARdataList[i].departmentName = bmNode.name;
                        }
                    }
                }, 500);


            }

            that.subjectSingleMul = 1;
            for (var i = 0; i < that.card.financeFaAssignDeptList.length; i++) {
                if (that.card.financeFaAssignDeptList[i].financeFaAssignExpenseList.length > 1) {
                    that.subjectSingleMul = 2;
                    break;
                }
            }
            if (that.subjectSingleMul == 1) {
                for (var i = 1; i < that.card.financeFaAssignDeptList.length; i++) {
                    if (that.card.financeFaAssignDeptList[0].financeFaAssignExpenseList[0].expenseSubjectId != that.card.financeFaAssignDeptList[i].financeFaAssignExpenseList[0].expenseSubjectId) {
                        that.subjectSingleMul = 2;
                        break;
                    }
                }
            }

            if (that.subjectSingleMul == 1) {
                that.allotSubjectName = that.card.financeFaAssignDeptList[0].financeFaAssignExpenseList[0].expenseSubjectName;
                that.card.financeFaAssignDeptList.forEach(dept => {
                    that.singleSubjectList = that.singleSubjectList.concat(JSON.parse(JSON.stringify(dept.financeFaAssignExpenseList)));
                });
                // for (var i=0;i<that.singleSubjectList.length;i++) {
                //     that.singleSubjectList[i].id = null;
                //     that.singleSubjectList[i].departmentAllotId = null;
                //     for (var j=0;j<that.singleSubjectList[i].itemRelateDetailList.length;j++) {
                //         that.singleSubjectList[i].itemRelateDetailList[j].id = null;
                //         that.singleSubjectList[i].itemRelateDetailList[j].relateId = null;
                //     }
                // }
                that.singleSubjectList.forEach(subject => {
                    subject.id = null;
                    subject.departmentAllotId = null;
                    $.ajax({
                        url: contextPath + '/facard/listaccountingproject/' + that.card.financeFaAssignDeptList[0].financeFaAssignExpenseList[0].expenseSubjectId,
                        type: 'post',
                        async: false,
                        success: function (data) {
                            // that.MDCAdataList[i].itemRelateDetailList = data.data;
                            that.singleProjectList = data.data;
                        }
                    });
                    for (var i = 0; i < that.singleProjectList.length; i++) {
                        for (var j = 0; j < subject.itemRelateDetailList.length; j++) {
                            if (that.singleProjectList[i].itemClassId == subject.itemRelateDetailList[j].itemClassId) {
                                that.singleProjectList[i].id = null;
                                that.singleProjectList[i].relateType = 5;
                                that.singleProjectList[i].itemId = subject.itemRelateDetailList[j].itemId;
                                that.singleProjectList[i].relateId = null;
                                that.singleProjectList[i].sobId = null;
                            }
                        }
                    }
                    subject.itemRelateDetailList = that.singleProjectList;
                    // for (var i=0;i<subject.itemRelateDetailList.length;i++) {
                    //     subject.itemRelateDetailList[i].id = null;
                    //     subject.itemRelateDetailList[i].relateId = null;
                    //
                    // }

                });
            } else {
                var MDCAdataListTemp = [];
                for (var i = 0; i < that.card.financeFaAssignDeptList.length; i++) {
                    MDCAdataListTemp = MDCAdataListTemp.concat(JSON.parse(JSON.stringify(that.card.financeFaAssignDeptList[i].financeFaAssignExpenseList)));
                }
                that.MDCAdataList = JSON.parse(JSON.stringify(MDCAdataListTemp));
            }

            if (that.subjectSingleMul == 1) {

                // $.ajax({
                //     url: contextPath + '/facard/listaccountingproject/' + that.card.financeFaAssignDeptList[0].financeFaAssignExpenseList[0].expenseSubjectId,
                //     type: 'post',
                //     async: false,
                //     success: function (data) {
                //         // that.MDCAdataList[i].itemRelateDetailList = data.data;
                //         that.singleProjectList = data.data;
                //     }
                // });

            } else {
                for (var i = 0; i < that.MDCAdataList.length; i++) {
                    var result;
                    $.ajax({
                        url: contextPath + '/facard/listaccountingproject/' + that.MDCAdataList[i].expenseSubjectId,
                        type: 'post',
                        async: false,
                        success: function (data) {
                            // that.MDCAdataList[i].itemRelateDetailList = data.data;
                            result = data.data;
                        }
                    });
                    for (var j = 0; j < that.MDCAdataList[i].itemRelateDetailList.length; j++) {
                        that.MDCAdataList[i].itemRelateDetailList[j].itemClassName = result[j].itemClassName;
                        that.MDCAdataList[i].itemRelateDetailList[j].itemList = result[j].itemList;
                    }
                }
                that.mulSubjectList = JSON.parse(JSON.stringify(that.MDCAdataList));
            }

            if (that.card.financeFaOrginValList.length == 1) {
                that.currencySingleMul = 1;
            } else {
                that.currencySingleMul = 2;
            }

            if (that.currencySingleMul == 1) {
                that.singleCurrency.currencyId = that.card.financeFaOrginValList[0].currencyId;
                that.singleCurrency.exchangeRate = that.card.financeFaOrginValList[0].exchangeRate;
                that.singleCurrency.orgValFor = that.card.financeFaOrginValList[0].orgValFor;
            } else {
                that.MMCDdataList = JSON.parse(JSON.stringify(that.card.financeFaOrginValList));
                that.mulCurrencyList = JSON.parse(JSON.stringify(that.card.financeFaOrginValList));
                that.mulStandardAmount = that.card.totalVal;
            }
        }


        //查询单位列表
        // debugger
        // if (this.managerType == 'info' || this.managerType == 'update' || this.managerType == 'change') {
        //     this.init();
        // }
        this.init();
        this.listLocation();        //查询存放地点列表
        this.listEconomyUse();      //查询经济用途列表
        this.listCurrency();        //查询币别列表
        this.listDepreciationMethod();      //查询折旧方法列表

        this.getCurrentPeriodStr();
        this.getNumberOfPeriodInUse();
        // this.pageInit();
        this.openTime = window.parent.params && window.parent.params.openTime;

    },
    beforeDestroy () {
        var that = this;

    }
});

Vue.component('ht-modal-subject', {
    data () {
        return {
            show: this.value,
            cashSetting: {
                callback: {
                    onClick: this.clickTab,
                    onDblClick: this.dblClickTab
                }
            },
            id1: 1,
            tabs: {
                'zichan': '资产',
                'fuzhai': '负债',
                'gongtong': '共同',
                'quanyi': '权益',
                'chengben': '成本',
                'sunyi': '损益',
                'biaowai': '表外'
            },
            tabSelected: this.customTypes[0] || 'zichan',
            treeUrl: this.url,
            nodeSelected: '',
            nodeData: {}
        }
    },
    methods: {
        closeModal () {
            this.$emit('close')
        },
        updateRow () {

        },
        save () {
            this.$emit('save', this.nodeSelected);
            this.$emit('close');

            // 请求数据，返回

            /* var _this = this;
            var _url = './treedata.json';
            $.ajax({
                type: 'get',
                data: '',
                url: _url,
                dataType: 'json',
                success: function(res){
                    let data = res.data;
                    _this.$emit('save',_this.nodeSelected)
                    _this.$emit('close')
                },
                error: function(code){
                    console.log(code);
                }
            }); */
        },
        clickTab (event, treeId, treeNode) {
            this.nodeSelected = treeNode;
        },
        dblClickTab (event, treeId, treeNode) {
            this.nodeSelected = treeNode;
            this.save();
        },
        tabClick (name) {
            /* switch(name){
                case 'name1':
                    this.treeUrl = './treedata.json';
                    break;
                case 'name2':
                    this.treeUrl = './treedata2.json';
                    break;
                case 'name3':
                    this.treeUrl = './treedata.json';
                    break;
                default:
                    break;
            } */
        },
    },
    watch: {
        value (val) {
            this.show = val;
        }
    },
    created () {
        let vm = this;
        $.ajax({
            type: "POST",
            url: vm.url,
            dataType: "json",
            success: function (result) {
                var obj = {};
                if (vm.customTypes.length) {
                    $.each(result.data, function (key, val) {
                        if ($.inArray(key, vm.customTypes) > -1) {
                            obj[key] = result.data[key];
                        }
                    });
                } else {
                    obj = result.data;
                }

                if (vm.initid.length) {
                    var _sl = [];
                    vm.initid.forEach(function (_i) {
                        for (_variable in result.data) {
                            result.data[_variable].forEach(function (_item) {
                                if (_i.value === _item.id) {
                                    var _it = { 'id': _i.id, 'value': _item }
                                    _sl.push(_it);
                                }
                            });
                        }
                    });
                    vm.$emit('initidfn', _sl);
                }
                vm.nodeData = obj;
            }
        });
    },
    props: {
        value: {
            default () {
                return false;
            }
        },
        url: {
            default () {
                return contextPath + '/tfinancebalance/listaccountsubject';
            }
        },
        row: {
            default () {
                return {};
            }
        },
        customTypes: {
            default () {
                return [];
            }
        },
        isParentClick: {
            default () {
                return false;
            }
        },
        initid: {
            require: false,
            type: Array,
            default () {
                return [];
            }
        },
    },
    template: `
        <Modal
        title="选择科目"
        v-model="show"
        
        @on-cancel='closeModal'
        :mask-closable="false">
        <tabs v-model="tabSelected" type="card" :animated="false" @on-click="tabClick">
            <tab-pane v-for="(label, key, idx) in tabs" v-if="key in nodeData" :label="label" :name="key" style="height:200px;overflow-y:auto;">
                <ht-tree v-if="!$.isEmptyObject(nodeData[key])"
                    :setting="cashSetting"
                    :isparentclick="isParentClick"
                    :tid="'ztree_' + key"
					:type="[key]"
					:tree-data="nodeData[key]"
                    v-show="tabSelected === key"></ht-tree>
				<span v-else>木有“{{label}}”的科目</span>
            </tab-pane>			
        </tabs>
        <div slot="footer">
            <i-button type="primary" @click="save">确定</i-button>
            <i-button @click="closeModal">取消</i-button>
        </div>
    </Modal>
    `
})

