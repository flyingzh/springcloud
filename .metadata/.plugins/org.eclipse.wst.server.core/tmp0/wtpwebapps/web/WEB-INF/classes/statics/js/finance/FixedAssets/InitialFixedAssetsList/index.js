var ve = new Vue({
    el: '#initial-fixed-assets-list',
    data () {
        let This = this;
        return {
            idArr: [],      //列表id数组
            currentYear: '',        //当前会计年度
            currentPeriod: '',      //当前会计期间
            startUsing: false,
            documentTypeList: [],
            faCardVOList: [], //
            organizationList: [],
            filter: {
                cardValid: 0,
                sobId: null,
                assetTypeId: null,
                useType: null,
                assetName: null,
                accountYearBegin: null,
                accountYearEnd: null,
                useStateId: null,
                accountPeriodBegin: null,
                accountPeriodEnd: null,
                alterTypeId: null,
                enterAccountDateBegin: null,
                enterAccountDateEnd: null,
                locationId: null,
                deptId: null,     //使用部门id
                model: null,      //型号
                createId: null,   //制单人
                changType: null   //新增标志
            },
            assetTypeName: '',
            useStateName: '',
            alterTypeName: '',
            deptName: '',
            changeDateScope: '',
            economyUseList: [],     //经济用途
            deprMethodList: [],     //折旧方法
            accountYearPeriodList: [],      //可用会计年度期间
            locationList: [],       //存放地点
            userList: [],       //用户列表
            changeTypeList: [],     //变动类型
            showAssetType: false,
            showUseState: false,
            showChangeMethod: false,
            showDepartment: false,
            showBatchUseMode: false,
            hasVoucher: false,      //当前期间固定资产是否已生成凭证
            faClearCardParmsVO: {
                id: '',
                sobName: layui.data('user').currentOrgName,
                assetCode: '',
                assetName: '',
                changeType: '',
                clearDate: '',
                alterTypeId: '',
                num: 1,
                clearNum: '',
                clearAmount: '',
                salvageIncome: '',
                accountYear: '',
                accountPeriod: '',
                remark:''
            },
            formData: {
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
                for19: '',
                for20: '',
                for21: '',
                for22: '',
                for23: '',
                for24: '',
                AssetClass: '',
                UseState: '',
                UseMode: '',
                Department: '',
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
            },
            selected: [],
            filterVisible: false,
            organisationList: [],
            showAssetClass: false,
            showUseState: false,
            showUseMode: false,
            showDepartment: false,
            treeUrl: "",
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
            departmentTreeSetting: {
                callback: {
                    onClick: this.departmentTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            treeSetting: {
                callback: {
                    onClick: this.treeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            alterTypeSetting: {
                callback: {
                    onClick: this.alterTypeCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            alterTypeBatchSetting: {
                callback: {
                    onClick: this.alterTypeBatchCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            mulDepartmentTreeSetting: {
                callback: {
                    onClick: this.mulDepartmentTreeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            assetNumShow: false,
            clearOneShow: false,
            clearMoreShow: false,
            changeMoreShow: false,
            cudiId: 'alterTypeId111',
            cudiBatchId: 'alterTypeId111',
            editIsDisabled: true, // 清理 时 是否可以保存与删除
            saveIsDisabled:false, // 清理 时 是否可以保存
            infoIsDisabled:true, // 清理 时 是否可以查看变动记录
            clearToUpdate:false,
            card: {
                orginCardId: null,
                sobId: 0,
                accountYear: 2018,
                accountPeriod: 10,
                changeType: 1,
                assetTypeId: 1,
                assetCode: "klfdlkljlj",
                assetName: "极高的",
                unitId: "1",
                num: 100,
                enterAccountDate: new Date(),
                locationId: 1,
                useType: "非食用",
                useStateId: 1,
                alterTypeId: 1,
                model: "荣耀13",
                originPlace: "中国",
                supplierId: 3,
                manufacturer: "华为",
                remark: "且行且珍惜",
                assetSubjectId: 1,
                deprSubjectId: 1,
                buyOrgVal: 999,
                buyDepr: 99,
                orgValAdjust: 9,
                beginUsedate: "2018-1-1",
                expectUsePeriods: 30,
                usePeriodsBeforeservice: 2,
                deprService: 22,
                deprServiceAdjust: 3,
                expectNetSalvage: 100,
                devalPreparation: 4,
                deductionAmount: 333,

                financeFaAttachDeviceList: [
                    {

                        deviceCode: "sb007",
                        deviceName: "sb",
                        recordDate: "2018-1-1",
                        specModel: "007",
                        measureUnit: "斤两",
                        num: 22,
                        amount: 123,
                        locationId: 1,
                        remark: "天上地下"

                    },
                    {

                        deviceCode: "sb007",
                        deviceName: "sb",
                        recordDate: "2018-1-1",
                        specModel: "007",
                        measureUnit: "斤两",
                        num: 22,
                        amount: 123,
                        locationId: 1,
                        remark: "天上地下"

                    }
                ],
                financeFaAssignDeptList: [
                    {

                        deptId: 10,
                        rate: 0.22,
                        financeFaAssignExpenseList: [
                            {

                                deptId: 10,
                                expenseSubjectId: 1,
                                rate: 0.33
                            },
                            {

                                deptId: 10,
                                expenseSubjectId: 1,
                                rate: 0.33
                            }
                        ]
                    },
                    {

                        deptId: 11,
                        rate: 0.78,
                        financeFaAssignExpenseList: [
                            {

                                deptId: 11,
                                expenseSubjectId: 1,
                                rate: 0.33
                            },
                            {

                                deptId: 11,
                                expenseSubjectId: 1,
                                rate: 0.33
                            }
                        ]
                    }
                ],
                financeFaOrginValList: [
                    {

                        currencyId: 1,
                        exchangeRate: 0.22,
                        orgValFor: 234,
                        orgVal: 234
                    },
                    {

                        currencyId: 1,
                        exchangeRate: 0.22,
                        orgValFor: 234,
                        orgVal: 234
                    }
                ]

            },
            showAll: false,
            changeMethodName: "",
            assetSubjectName: '',   //固定资产科目名称
            dataList: [],
            MDCAListVisible: false,
            MDCAclick_all: false,
            allShow: false,
            MDCAdataList: [],
            subjectTpye: "",
            subjectVisable: false,
            SDARListVisible: false,
            SDARallShow: false,
            SDARdataList: [],
            showMulDepartment: false,
            deptSingleMul: 1,  //分配部门是单个还是多个
            singleDepartmentList: [],
            clearTables: [
                {
                    id: 1,
                },
                {
                    id: 2,
                },
                {
                    id: 3,
                },
                {
                    id: 4,
                },
                {
                    id: 5,
                },
                {
                    id: 2,
                },
                {
                    id: 3,
                },
                {
                    id: 4,
                },
                {
                    id: 5,
                },
                {
                    id: 2,
                },
                {
                    id: 3,
                },
                {
                    id: 4,
                },
                {
                    id: 5,
                },
                {
                    id: 2,
                },
                {
                    id: 3,
                },
                {
                    id: 4,
                },
                {
                    id: 5,
                },


            ],
            clearOptions: {
                disabledDate(date) {
                    return date.valueOf() < new Date(This.changeDateScope.startDate).valueOf() || date.valueOf() > new Date(This.changeDateScope.endDate).valueOf()
                }
            },
        }

    },
    created () {

    },
    mounted () {
        this.getOrgList();
        this.listEconomyUse();
        this.listDeprMethod();
        this.listAccountYearPeriod();
        this.listLocation();
        this.listSysUser();
        this.listChangeType();
        this.getStartUsing();
        this.getCurrentYear();
        this.getCurrentPeriod();
        this.initPage();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods: {

        showDepartmentTree (value, which, index) {
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
                    if (this.showMulDepartment == true) {
                        this.showMulDepartment = false;
                        return;
                    }
                    this.showMulDepartment = value;
                    break;
            }
            // if (this.showDepartment === true) {
            //     this.showDepartment = false;
            //     return;
            // }
            // this.showDepartment = value;
        },

        mulDepartmentTreeClickCallBack (event, treeId, treeNode) {
            var that = this;
            console.log(event);
            console.log("treeId:" + treeId);
            console.log(treeNode);

            that.SDARdataList[that.idx].deptId = treeNode.id;
            that.SDARdataList[that.idx].departmentName = treeNode.name;
            this.showMulDepartment = false;
        },
        // <!-- 多个折扣费用分配 操作-->
        actionMDCAListBtnMth (_type) {
            var that = this;
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
        // <!-- 选择部门及分配比例 操作-->
        actionSDARListBtnMth (_type) {
            var that = this;
            // 插入行 是在 选择 上面插入一条数据， 复制行 是在选择下面 插入一条数据并复制选择的数据值。 插入和复制都是单条，删除为多条

            var _info = {
                show: false,
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
        showSDARListModal (_t) {
            this.SDARListVisible = _t;
        },
        //选择部门及分配比例
        saveDept () {
            this.SDARListVisible = false;
        },
        SDARclick_all () {
            this.SDARallShow = !this.SDARallShow;
            this.SDARdataList.forEach(row => {
                row.show = this.SDARallShow;
            })
        },
        // 科目下拉框
        showSubjectVisable (type) {
            this.subjectVisable = true;
            this.subjectTpye = type;
        },
        subjectClose () {
            this.subjectVisable = false;
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

            }
            // console.log(treeNode, '====treeNode');
            // var that = this;
            // this.card.assetSubjectId = treeNode.id;
            // this.assetSubjectName = treeNode.subjectName;

            // that.openData.relateSubjectId = treeNode.id;
            // that.openData.subjectCode = treeNode.subjectCode;
            // that.openData.subjectName = treeNode.subjectName;

        },
        //多个折旧费用分配点击确定
        saveMulExpense () {
            var that = this;
            //检查是否有空值
            for (var i = 0; i < that.MDCAdataList.length; i++) {
                if (that.MDCAdataList[i].deptId == null) {
                    that.wrapAlert("部门不能为空！");
                    // alert("部门不能为空！");
                    return;
                }
                if (that.MDCAdataList[i].expenseSubjectId == null) {
                    that.wrapAlert("科目不能为空！");
                    // alert("科目不能为空！");
                    return;
                }
                if (that.MDCAdataList[i].rate == null) {
                    that.wrapAlert("分配比例不能为空！");
                    // that.wrapAlert("分配比例不能为空！");
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
                delete that.mulSubjectList[i].expenseSubjectName;
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


            this.MDCAListVisible = false;
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
        queryDataList () {
            let that = this;
            let url = contextPath + '/facard/listcard';
            let param = JSON.stringify(that.filter);
            console.log('filter:', that.filter);
            $.ajax({
                type: "POST",
                url: url,
                data: param,
                async: false,
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    if (res.code === '100100' && res.data.length > 0) {
                        that.faCardVOList = res.data;
                    }
                },
                error: function (err) {
                },
            });

        },
        clearOneFun () {
            let that = this;
            if (that.hasVoucher) {
                that.wrapAlert("当期凭证已过账！");
                return false;
            }
            //查询列表
            that.queryDataList();
            //校验勾选数据数量
            let flag = that.selectOneFun();
            if (!flag) return;
            // that.clearOneShow = true;
            //当选择的数据条数为1时 查询选择数据
            //校验数据
            that.verifyClearOneCard();
        },
        clearMoreFun () {
            let flag = this.selectMoreFun();
            if (!flag) return;
            this.clearMoreShow = true;
        },
        /*变动单个卡片*/
        changeOneFun () {
            let that = this;
            if (that.hasVoucher) {
                that.wrapAlert("当期凭证已过账！");
                return false;
            }
            //查询列表
            that.queryDataList();
            //校验勾选数据数量
            let flag = this.selectOneFun();
            if (!flag) return;
            //查询列表
            //校验数据
            that.verifyChangeOneCard();

        },
        changeMoreFun () {
            let flag = this.selectMoreFun();
            if (!flag) return;
            this.changeMoreShow = true;
        },
        verifyClearOneCard () {
            let that = this;
            let cardId = Number(that.selected[0]);
            let _url = contextPath + '/faClearChange/verifyClearOneCard/' + cardId;
            $.ajax({
                type: "POST",
                url: _url,
                data: '',
                async: false,
                dataType: "json",
                success: function (res) {
                    that.getDateScope();
                    that.faClearCardParmsVO = {};
                    let card = that.faCardVOList.find(item => { return item.id === cardId });
                    if (res.code === '100100') {
                        // that.faClearCardParmsVO = card;
                        that.faClearCardParmsVO.id = cardId;
                        that.faClearCardParmsVO.sobName = layui.data('user').currentOrgName;
                        that.faClearCardParmsVO.changeType = card.changeType;
                        that.faClearCardParmsVO.assetCode = card.assetCode;
                        that.faClearCardParmsVO.assetName = card.assetName;
                        that.faClearCardParmsVO.num = card.num;
                        that.faClearCardParmsVO.clearNum = card.num;
                        that.faClearCardParmsVO.clearDate = that.changeDateScope.endDate;
                        that.faClearCardParmsVO.accountYear = card.accountYear;
                        that.faClearCardParmsVO.accountPeriod = card.accountPeriod;
                        //校验通过 - 弹出清理数据输入数据编辑框
                        that.clearOneShow = true;
                        that.editIsDisabled = true;
                        that.infoIsDisabled = true;

                    } else if (res.code === '1001001' || res.code === '1001006') {

                        res.code === '1001006' && (that.editIsDisabled = true) && (that.infoIsDisabled = true)
                        //全部清理
                        //要确定提示
                        let _msg = res.msg;
                        that.$Modal.confirm({
                            title: '信息提示',
                            content: '<p>' + _msg + '</p>',
                            onOk: () => {
                                //弹出编辑页面
                                that.faClearCardParmsVO = res.data;
                                //
                                let dataRemark =(res.data.remark==null ? '':res.data.remark.split('/')[0]);
                                that.faClearCardParmsVO.remark = dataRemark;
                                that.faClearCardParmsVO.num = 1;

                                that.faClearCardParmsVO.sobName = layui.data('user').currentOrgName;
                                that.clearOneShow = true;
                                that.editIsDisabled = false;
                                that.infoIsDisabled = false;
                                var treeObj = $.fn.zTree.getZTreeObj(that.cudiId);//ztree树的ID
                                var _node = treeObj.getNodeByParam("id", res.data.alterTypeId);//根据ID找到该节点
                                if (_node != null) {
                                    treeObj.selectNode(_node);//根据该节点选中
                                    that.faClearCardParmsVO.alterTypeName = _node.name;
                                }
                                if( res.code === '1001001'){
                                    that.saveIsDisabled = true;
                                    that.editIsDisabled = true;
                                }
                                that.clearToUpdate = (res.code === '1001006' ? true:false);
                            },
                            onCancel: () => {
                                //关闭弹框
                                // this.$Message.info('Clicked cancel');
                            }
                        });

                    } else if (res.code === '1001002') {
                        //部分清理
                    } else if (res.code === '-1') {
                        //失败
                        //提示
                        that.instance('error', "提示信息", res.msg);
                    }
                    // that.clearOneShow = true;
                },
                error: function (err) {
                },
            });
        },
        verifyChangeOneCard () {
            let that = this;
            let cardId = Number(that.selected[0]);
            let _url = contextPath + '/faClearChange/verifyChangeOneCard/' + cardId;
            $.ajax({
                type: "POST",
                url: _url,
                data: '',
                async: false,
                dataType: "json",
                success: function (res) {
                    let code = res.code;
                    let _msg = res.msg;
                    let card = that.faCardVOList.find(item => { return item.id === cardId });
                    if (code == '100100') {
                        //100100校验成功 调用编辑页面 直接跳转数据回显
                        let _url = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=change&id=" + res.data;
                        window.parent.activeEvent({ 'name': '卡片变动', 'url': _url });
                    } else if (code == '1001005') {
                        //1001005本期已有变动记录，是否继续变动该变动记录
                        that.$Modal.confirm({
                            title: '信息提示',
                            content: `<p>${_msg}</p>`,
                            onOk: () => {
                                let _url = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=change&id=" + res.data;
                                window.parent.activeEvent({ 'name': '卡片变动', 'url': _url });
                            },
                            onCancel: () => { }
                        });

                    } else if (code == '1001001' || code == '1001002' || code == '1001003' || code == '-1') {
                        //1001001 1001002该固定资产现已被完全(部分)清理，不能再变动
                        //1001003本期或以后期间已经生成计提折旧凭证并过账，不允许修改和新增固定资产卡片
                        that.$Modal.confirm({
                            title: '信息提示',
                            content: `<p>${_msg}</p>`,
                            onOk: () => { },
                            onCancel: () => { }
                        });
                    } else if (code == '1001004') {
                        //本期新增的固定资产不能再本期变动,修改该卡片
                        that.$Modal.confirm({
                            title: '信息提示',
                            content: `<p>${_msg}</p>`,
                            onOk: () => {
                                let _url = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=update&id=" + res.data;
                                window.parent.activeEvent({ 'name': '卡片修改', 'url': _url });
                            },
                            onCancel: () => { }
                        });
                    }
                },
                error: function (err) {
                },
            });
        },
        selectOneFun () {
            // this.selected = [1,2];
            if (!this.selected.length) {
                this.$Modal.info({
                    title: "提示信息",
                    content: "请勾选一条记录"
                });
                return false;
            }
            if (this.selected.length > 1) {
                this.$Modal.info({
                    title: "提示信息",
                    content: "此功能不允许一次处理多张卡片或变动"
                });
                return false;
            }
            return true;
        },
        selectMoreFun () {
            // this.selected = [2,1];
            if (!this.selected.length) {
                this.$Modal.info({
                    title: "提示信息",
                    content: "请勾选多条卡片记录"
                });
                return false;
            }
            if (this.selected.length === 1) {
                this.$Modal.info({
                    title: "提示信息",
                    content: "要进行批量清理，请选择多个固定资产！"
                });
                return false;
            }
            return true;
        },
        //正则表达式法获取url参数值
        getQueryString (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return r[2]; return '';
        },

        //提示alert
        wrapAlert(msg) {
            this.$Message.info({
                content: msg,
                duration: 3
            });
        },
        //新增卡片
        addCard () {
            var that = this;
            if (that.hasVoucher) {
                that.wrapAlert("当期凭证已过账！");
                return false;
            }
            var _name = "";
            var _url = "";
            if (that.startUsing) {
                _name = "卡片新增";
                _url = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=add";
            } else {
                _name = "初始化";
                _url = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=init";
            }
            // var _url=contextPath+"/finance/FixedAssets/InitialFixedAssets/index.html?type=init";
            window.parent.activeEvent({ 'name': _name, 'url': _url });
        },
        //修改卡片
        update () {
            var that = this;
            if (that.hasVoucher) {
                that.wrapAlert("当期凭证已过账！");
                return false;
            }
            var ids = $("#grid").jqGrid('getGridParam', 'selarrrow');
            if (ids.length == 0) {
                that.wrapAlert("请选择一个需要修改的卡片！");
                return;
            }
            if (ids.length > 1) {
                that.wrapAlert("每次只能修改一个卡片！");
                return;
            }
            var rowData = $("#grid").jqGrid('getRowData', ids[0]);
            if (that.startUsing) {
                if (Number(rowData.accountYear) < Number(that.currentYear)) {
                    that.wrapAlert("不能编辑当前会计期间以前的数据！");
                    return;
                } else if (Number(rowData.accountPeriod) < Number(that.currentPeriod)) {
                    that.wrapAlert("不能编辑当前会计期间以前的数据！");
                    return;
                }
            }
            var _url = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=update&id=" + rowData.id;
            window.parent.activeEvent({ 'name': '卡片修改', 'url': _url });
        },
        //复制卡片
        copy () {
            var that = this;
            if (that.hasVoucher) {
                that.wrapAlert("当期凭证已过账！");
                return false;
            }
            var ids = $("#grid").jqGrid('getGridParam', 'selarrrow');
            var rowData = $("#grid").jqGrid('getRowData', ids[0]);
            if (ids.length == 0) {
                that.wrapAlert("请选择一个需要复制的卡片！");
                return;
            }
            if (ids.length > 1) {
                that.wrapAlert("每次只能复制一个卡片！");
                return;
            }
            let name;
            if (that.startUsing) {
                name = '新增复制';
            } else {
                name = '初始化复制';
            }
            var _url = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=copy&id=" + rowData.id;
            window.parent.activeEvent({ 'name': name, 'url': _url });
        },
        doSelectSource () {
            console.log(123)
            this.assetNumShow = !this.assetNumShow;
        },
        assetTypeTreeClickCallBack (event, treeId, treeNode) {
            console.log(treeNode);
            this.filter.assetTypeId = treeNode.id;
            this.assetTypeName = treeNode.name;
            this.showAssetType = false;
        },
        useStateTreeClickCallBack (event, treeId, treeNode) {
            console.log(treeNode);
            this.filter.useStateId = treeNode.id;
            this.useStateName = treeNode.name;
            this.showUseState = false;
        },
        changeMethodTreeClickCallBack (event, treeId, treeNode) {
            console.log(treeNode);
            this.filter.alterTypeId = treeNode.id;
            this.alterTypeName = treeNode.name;
            this.showChangeMethod = false;
        },
        departmentTreeClickCallBack (event, treeId, treeNode) {
            console.log("treeNode:" + treeNode);
            this.filter.deptId = treeNode.id;
            this.deptName = treeNode.name;
            this.showDepartment = false;
        },
        alterTypeCallBack (event, treeId, treeNode) {
            console.log("treeNode:" + treeNode);
            this.faClearCardParmsVO.alterTypeId = treeNode.id;
            this.faClearCardParmsVO.alterTypeName = treeNode.name;
            this.showUseMode = false;
        },
        alterTypeBatchCallBack (event, treeId, treeNode) {
            console.log("treeNode:" + treeNode);
            // this.faClearCardParmsVO.alterTypeId = treeNode.id;
            // this.faClearCardParmsVO.alterTypeName = treeNode.name;
            this.showUseMode = false;
        },
        treeClickCallBack (event, treeId, treeNode) {
            let arr = ['showAssetClass', 'showUseState', 'showUseMode', 'showDepartment'];
            let url = "";
            console.log(111)
            arr.map(row => {
                if (!!this[row]) {
                    switch (row) {
                        case 'showAssetClass':
                            url = contextPath + "/testDocument/getEmployeesByDeptId";
                            break;
                        case 'showUseState':
                            url = contextPath + "/tbasestylecategory/list";
                            break;
                        case 'showUseMode':
                            url = contextPath + "/testDocument/getEmployeesByDeptId2";
                            break;
                        case 'showDepartment':
                            url = contextPath + "/testDocument/getEmployeesByDeptId3";
                            break;
                        default:
                            break;
                    }
                    let obj = row.slice(4, row.length);

                    this.formData[obj] = treeNode.name;
                    this.formData[obj + 'Id'] = treeNode.id;
                    this[row] = false;
                    return;
                }
            });
            // console.log(this.formData)
            console.log(url)
            // this.loadTestEmp(treeNode.id, url)
        },
        treeBeforeClick (treeId, treeNode, clickFlag) {
            console.log("treeBeforeClick:" + treeNode.isParent);
            return !treeNode.isParent; //当单击父节点，返回false，不让选取
        },
        showTree (which, value) {
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
                case 'showDepartment':
                    if (this.showDepartment === true) {
                        this.showDepartment = false;
                        return;
                    }
                    this.showDepartment = value;
                    break;
                case 'showBatchUseMode':
                    if (this.showBatchUseMode === true) {
                        this.showBatchUseMode = false;
                        return;
                    }
                    this.showBatchUseMode = value;
                    break;
            }
            // if (this.showDepartment === true) {
            //     this.showDepartment = false;
            //     return;
            // }
            // this.showDepartment = value;
        },
        // //加载质检员下拉框
        // loadTestEmp(deptId, url){
        //     if(!deptId){
        //         return false;
        //     }
        //     let _this = this;
        //     $.ajax({
        //         type: "POST",
        //         url: url,
        //         dataType: "json",
        //         data:{deptId:deptId},
        //         success: function(res) {
        //             _this.testEmps=[];
        //             // _this.imcoming.tQcTestDocumentEntity.inspectorId='';
        //             if(res.code === '100100' && res.data.length > 0){
        //                 for(let emp of res.data){
        //                     _this.testEmps.push({label:emp.empName,value:emp.id,code:emp.empCode});
        //                 }
        //             }
        //         },
        //         error: function(err){
        //         },
        //     });
        // },
        getNameFromCodeList(list,value) {
            for (let i=0;i<list.length;i++) {
                if (list[i].value == value) {
                    return list[i].name;
                }
            }
        },
        initPage () {
            let that = this;
            console.log(JSON.stringify(that.filter));
            var submit = JSON.stringify(that.filter);
            jQuery("#grid").jqGrid(
                {

                    url: contextPath + '/facard/listcard',
                    ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                    datatype: "json",
                    postData: JSON.stringify(that.filter),
                    multiselect: true,
                    colNames: [
                        '流水号', '年度', '期间', ' 入账日期或变动日期', '备注', '编码', '名称', '型号', '类别', '变动方式',
                        '使用状态', '部门', '单位', '数量', '期初数量', '币别', '汇率', '原值原币', '原值本币', '购进原值', '期初原值',
                        '原值调整', '预计净残值', '预计使用期间数或预计工作总量', '已使用期间数或已使用工作总量', '减值准备',
                        '减值准备调整', '可抵扣税额', '折旧方法', '购进累计折旧', '期初累计折旧', '累计折旧调整', '折旧费用项目',
                        '经济用途', '存放地点', '开始使用日期', '制造商', '产地', '供应商', '制单', '附属设备', '变动类型'
                    ],
                    colModel: [
                        { name: 'id', width: 50 },
                        { name: 'accountYear', width: 100, align: "right" },
                        { name: 'accountPeriod', width: 100, align: "center" },
                        { name: 'enterAccountDate', width: 100, align: "center" },
                        { name: 'remark', width: 100, align: "center" },
                        { name: 'assetCode', width: 100, align: "center" },
                        { name: 'assetName', width: 100, align: "center" },
                        { name: 'model', width: 100, align: "center" },
                        { name: 'assetTypeName', width: 100, align: "center" },
                        { name: 'alterTypeName', width: 100, align: "center" },
                        { name: 'useStateName', width: 100, align: "center" },
                        { name: 'departmentStr', width: 100, align: "center" },
                        { name: 'unitName', width: 100, align: "center" },
                        { name: 'num', width: 100, align: "center" },
                        { name: 'periodBeginNum', width: 100, align: "center" },
                        { name: 'currencyNameStr', width: 100, align: "center" },
                        { name: 'exchangeRateStr', width: 100, align: "center" },
                        { name: 'originValueOriginCurrencyStr', width: 100, align: "center" },
                        { name: 'originValueLocalCurrency', width: 100, align: "center" },
                        { name: 'buyOrgVal', width: 100, align: "center" },
                        { name: 'periodBeginOriginal', width: 100, align: "center" },
                        { name: 'orgValAdjust', width: 100, align: "center" },
                        { name: 'expectNetSalvage', width: 100, align: "center" },
                        { name: 'expectUsePeriods', width: 100, align: "center" },
                        { name: 'usePeriodsBeforeservice', width: 100, align: "center" },
                        { name: 'devalPreparation', width: 100, align: "center" },
                        { name: 'devalPreparationAdjust', width: 100, align: "center" },
                        { name: 'deductionAmount', width: 100, align: "center" },
                        { name: 'deprMethodName', width: 100, align: "center",
                            formatter: function (value,grid,rows,state) {
                                return that.getNameFromCodeList(that.deprMethodList, value);
                            }
                        },
                        { name: 'buyDepr', width: 100, align: "center" },
                        { name: 'periodBeginDepr', width: 100, align: "center" },
                        { name: 'accumulatedDepreciationAdjust', width: 100, align: "center" },
                        { name: 'depreciationCostItemStr', width: 100, align: "center" },
                        { name: 'useType', width: 100, align: "center",
                            formatter: function (value, grid, rows, state) {
                                console.log("---------------grid------------------");
                                console.log(value);
                                return that.getNameFromCodeList(that.economyUseList, value);
                            }
                        },
                        { name: 'locationName', width: 100, align: "center" },
                        { name: 'beginUsedate', width: 100, align: "center" },
                        { name: 'manufacturer', width: 100, align: "center" },
                        { name: 'originPlace', width: 100, align: "center" },
                        { name: 'supplierName', width: 100, align: "center" },
                        { name: 'updateName', width: 100, align: "center" },
                        { name: 'hasAttachDevice', width: 100, align: "center" },
                        { name: 'changeType', width: 100, align: "center", hidden: true }
                        // {
                        //     name: 'tab3', width: 100, align: "center",
                        //     formatter: function (value, grid, rows, state) {
                        //         return accounting.formatMoney(value, '', this.floatNum);
                        //     }
                        // },
                        // {
                        //     name: 'tab4', width: 100, align: "center",
                        //     formatter: function (value, grid, rows, state) {
                        //         return accounting.formatMoney(value, '', this.floatNum);
                        //     }
                        // },
                    ],
                    rowNum: 999999999,//一页显示多少条
                    mtype: "post",//向后台请求数据的ajax的类型。可选post,get
                    jsonReader: {
                        root: "data",
                    },
                    styleUI: 'Bootstrap',
                    height: $(window).height() - 120,
                    viewrecords: true,
                    footerrow: true,
                    userDataOnFooter: true,
                    onSelectAll: function (data, status) { // 且点击头部的checkbox时才会触发此事件
                        that.handlerId(data, status);

                    },
                    onSelectRow: function (data, status) { // 当选择行时触发此事件
                        console.log("data:" + data);
                        console.log("status:" + status);
                        that.handlerId(data, status);
                    },
                    ondblClickRow: function (row) {
                        var rowData = $('#grid').jqGrid('getRowData', row);
                        var _url = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=info&id=" + rowData.id;
                        window.parent.activeEvent({ 'name': '卡片详情', 'url': _url });
                    },
                    loadComplete: function () {
                        jQuery("#grid").jqGrid('destroyGroupHeader');
                        $("#grid").jqGrid('setGroupHeaders', {
                            useColSpanStyle : true , // 没有表头的列是否与表头列位置的空单元格合并
                            groupHeaders : [ {
                                startColumnName : 'currencyNameStr' , // 对应colModel中的name
                                numberOfColumns : 3, // 跨越的列数
                                titleText : '原值原币'
                            }
                            ]
                        });

                        that.idArr = $("#grid").jqGrid('getDataIDs');
                        layui.data('assetIds', {
                            key: 'ids',
                            value: JSON.stringify(that.idArr)
                        });
                    }
                });
        },
        showTree (attr, value) {
            let arr = ['showAssetClass', 'showUseState', 'showUseMode', 'showDepartment'];
            arr.map(row => {
                if (row !== attr) {
                    this[row] = false;
                }
            })
            if (this[attr] === true) {
                this[attr] = false;
                return;
            }
            this[attr] = value;
        },
        filterFun () {
            this.filterVisible = true;
        },
        deleteCommon(ids,includeChange) {
            let that = this;
            let cardAccountYear = that.faClearCardParmsVO.accountYear;
            let cardAccountPeriod = that.faClearCardParmsVO.accountPeriod;

            if (this.hasVoucher) {
                this.wrapAlert("当期凭证已过账！");
                return false;
            }


            var ids = $("#grid").jqGrid('getGridParam', 'selarrrow');

            if (ids.length == 0) {
                that.wrapAlert("请选择需要删除的行");
                return false;
            }

            //（使用固定资产管理页面同时有可能发生结账，导致当前期间更新）
            //查询当前会计年度
            $.ajax({
                url: contextPath + '/facard//sysproval/' + 'assetCurrentAccountingYear',
                type: 'post',
                async: false,
                success: function (data) {
                    that.currentYear = data.data;
                }
            });
            //查询当前会计期间
            $.ajax({
                url: contextPath + '/facard//sysproval/' + 'assetCurrentAccountingPeriod',
                type: 'post',
                async: false,
                success: function (data) {
                    that.currentPeriod = data.data;
                }
            });

            for (let i = 0; i < ids.length; i++) {
                var rowData = $("#grid").jqGrid('getRowData', ids[i]);
                var accountYear = rowData.accountYear;
                var accountPeriod = rowData.accountPeriod;
                if (this.startUsing) {
                    if (Number(accountYear) < Number(this.currentYear) || (Number(accountYear) == Number(this.currentYear) && Number(accountPeriod) < Number(this.currentPeriod))) {
                        that.wrapAlert("不能删除当期以前的数据！");
                        return false;
                    }
                } else {
                    if (accountYear != 0 || accountPeriod != 0) {
                        that.wrapAlert("反初始化后不能删除系统启用后的数据！");
                        return false;
                    }
                }
                if (!(cardAccountYear==rowData.accountYear && cardAccountPeriod==rowData.accountPeriod)&& rowData.changeType == '3') {
                    that.wrapAlert("不能删除由清理功能生成的变动记录！");
                    return false;
                }
            }
            for (let i = 0; i < ids.length; i++) {
                var rowData = $("#grid").jqGrid('getRowData', ids[i]);
                if (rowData.changeType == '2' || rowData.changeType == '3') {
                    includeChange = true;
                }
            }


            let vm = this;
            let content = '';
            this.$Modal.confirm({
                title: '信息提示',
                content: '<p>确认删除所选数据吗？</p>',
                onOk: () => {
                    $.ajax({
                        url: contextPath + "/facard/deletecard/" + includeChange,
                        type: "post",
                        contentType: "application/json",
                        data: JSON.stringify(ids),
                        success: function (data) {
                            if (true == data.data) {
                                that.wrapAlert("删除成功");
                                that.refresh();
                            } else {
                                that.wrapAlert("删除失败");
                            }

                        }
                    });
                    // $.ajax({
                    //     type: 'post',
                    //     url: 'index.json',
                    //     data: '',
                    //     contentType: 'application/json;charset=utf-8',
                    //     dataType: 'json',
                    //     success: function (res) {
                    //         if (res.code == '100100') {
                    //             content = `<p>${res.msg}</p>`;
                    //             vm.instance('success', '删除成功', content);
                    //             $('#grid').setGridParam({postData: JSON.stringify(this.formData)}).trigger("reloadGrid");
                    //         } else {
                    //             content = `<p>${res.msg}</p>`;
                    //             vm.instance('error', '删除成功', content);
                    //         }
                    //     }
                    // })
                },
                onCancel: () => {
                    this.$Message.info('Clicked cancel');
                }
            });
        },
        deleteFun () {

            let includeChange = false;      //删除的数据包含变动生成的
            var ids = $("#grid").jqGrid('getGridParam', 'selarrrow');
            this.deleteCommon(ids,includeChange);
        },
        //删除清理
        deleteClearOne(){
            let includeChange = false;      //删除的数据包含变动生成的
            let ids =[];
            ids.push(this.faClearCardParmsVO.id);
            this.deleteCommon(ids,includeChange);
            this.clearOneShow = false;

        },
        //查看清理
        selectClearOne(){
            var _url = contextPath + "/finance/FixedAssets/InitialFixedAssets/index.html?type=info&id=" + this.faClearCardParmsVO.id;
            window.parent.activeEvent({ 'name': '卡片详情', 'url': _url });
        },
        refresh () {
            this.selected =[];
            jQuery("#grid").trigger("reloadGrid");
        },
        reachToLedger () {
            this.$Modal.confirm({
                title: '信息提示',
                content: '<p>只能传送固定资产科目、累计折旧科目、减值准备科目，是否确定要覆盖总账对应科目的初始数据？</p>',
                onOk: () => {
                    $.ajax({
                        url: contextPath + "/facard/transferInitialData",
                        type: "post",
                        data: '',
                        contentType: 'application/json;charset=utf-8',
                        dataType: 'json',
                        success: function (res) {
                            if (res.code == '100100') {
                                layer.alert('将初始数据传至总账成功!', { icon: 1 });
                            } else {
                                layer.alert(res.msg, { icon: 0 });
                            }
                        }
                    })
                },
                onCancel: () => {
                }
            });
        },
        checkCard () {
            let title = '卡片检查结果';
            let content = '';
            let that = this;
            refresh
            $.ajax({
                type: 'post',
                url: 'index.json',
                data: '',
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: function (res) {
                    if (res.code == '100100') {
                        content = `<p>${res.msg}</p>`;
                        that.instance('success', title, content);
                    } else {
                        content = `<p>${res.msg}</p>`;
                        that.instance('error', title, content);
                    }
                }
            })
        },
        beginExport () {
            let title = '卡片引出结果';
            let content = '';
            let that = this;

            $.ajax({
                type: 'post',
                url: 'index.json',
                data: '',
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: function (res) {
                    if (res.code == '100100') {
                        content = `<p>${res.msg}</p>`;
                        that.instance('success', title, content);
                    } else {
                        content = `<p>${res.msg}</p>`;
                        that.instance('error', title, content);
                    }
                }
            })

        },
        instance (type, title, content) {
            switch (type) {
                case 'success':
                    this.$Modal.success({
                        title: title,
                        content: content
                    });
                    break;
                case 'error':
                    this.$Modal.error({
                        title: title,
                        content: content
                    });
                    break;
            }
        },
        handlerId (data, status) {
            if (typeof data === 'object' && status) {
                this.selected = data.filter(row => {
                    if (row != 'null' && row != '0') {
                        return row
                    }
                });
            }
            if (typeof data === 'object' && !status) {
                this.selected = [];
            }
            if (typeof data === 'string') {
                if (status) {
                    let flag = (data != 'null' && data != '0');
                    if (flag) {
                        (this.selected.indexOf(data.toString()) > -1) ? null : this.selected.push(data.toString());
                    }
                } else {
                    let index = this.selected.indexOf(data.toString());
                    index > -1 ? this.selected.splice(index, 1) : null;
                }
            }
            // console.log(this.selected)
        },
        saveData () {
            var that = this;
            $('#grid').setGridParam({ postData: JSON.stringify(that.filter) }).trigger("reloadGrid");
            this.cancelData();
        },
        cancelData () {
            this.filterVisible = false;
        },
        //获取组织列表
        getOrgList () {
            var that = this;
            $.ajax({
                url: contextPath + "/bankdepositstatement/getognlist",
                type: "post",
                success: function (data) {
                    that.organizationList = data.data;
                    // that.card.sobId = that.organizationList[0].id;
                    // console.log(that.card.sobId);
                    that.filter.sobId = data.data[0].id;
                    console.log(that.filter.sobId);
                    // that.$nextTick(() => {
                    //     that.filter.sobId = data.data[0].id;
                    //     console.log(that.filter.sobId);
                    // });

                }
            });
        },
        //查询经济用途列表
        listEconomyUse () {
            this.economyUseList = getCodeList("fixedAssets_economicUse");
            // this.filter.useType = this.economyUseList[0].mark;
        },

        listDeprMethod() {
            this.deprMethodList = getCodeList("fixedAssets_depreciation");
        },
        //查询启用到结账的会计年度期间列表
        listAccountYearPeriod () {
            var that = this;
            $.ajax({
                url: contextPath + '/facard/periods',
                type: 'post',
                success: function (data) {
                    that.accountYearPeriodList = data.data;
                    // that.filter.accountYearBegin  = data[data.length - 1].accountingYear;
                    // that.filter.accountYearEnd  = data[data.length - 1].accountingYear;
                    // that.filter.accountPeriodBegin = data[data.length - 1].accountingPeriod;
                    // that.filter.accountPeriodEnd = data[data.length - 1].accountingPeriod;
                }
            });
        },
        //查询存放地点列表
        listLocation () {
            var that = this;
            $.ajax({
                url: contextPath + "/falocation/initTree",
                type: "post",
                success: function (data) {
                    that.locationList = data.data;
                }
            })
        },
        //查询用户列表
        listSysUser () {
            var that = this;
            $.ajax({
                url: contextPath + "/facard/listuser",
                type: "post",
                success: function (data) {
                    that.userList = data.data;
                }
            });
        },
        //查询变动类型列表
        listChangeType () {
            var that = this;
            $.ajax({
                url: contextPath + "/facard/listchangetype",
                type: "post",
                success: function (data) {
                    that.changeTypeList = data.data;
                    that.changeTypeList.unshift({
                        id: -1,
                        name: '全部'
                    });
                    // that.filter.changeType = data.data[0].id;
                }
            });
        },
        //查询是否已经启用固定资产
        getStartUsing () {
            var that = this;
            $.ajax({
                url: rcContextPath + '/financeCommon/sysIsEnabled/' + 4,
                type: "post",
                success: function (data) {
                    that.startUsing = data.data;
                }
            })
        },
        //查询当前会计年度
        getCurrentYear () {
            var that = this;
            $.ajax({
                url: contextPath + '/facard//sysproval/' + 'assetCurrentAccountingYear',
                type: 'post',
                success: function (data) {
                    that.currentYear = data.data;
                }
            });
        },
        //查询当前会计期间
        getCurrentPeriod () {
            var that = this;
            $.ajax({
                url: contextPath + '/facard//sysproval/' + 'assetCurrentAccountingPeriod',
                type: 'post',
                success: function (data) {
                    that.currentPeriod = data.data;
                }
            })
        },
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
        //清理
        saveClear () {

            let that = this;
            let _url = '';
            this.$Modal.confirm({
                title: '提示信息',
                content: '<p>保存清理数据前必须生成一条变动记录，确认要生成吗？</p>',
                onOk: () => {
                    //执行清理
                    if(that.clearToUpdate){
                        _url=contextPath + '/faClearChange/clearToUpdate';
                    }else {
                        _url=contextPath + '/faClearChange/clearOneCard';
                    }
                    $.ajax({
                        type: 'POST',
                        url: _url,
                        data: JSON.stringify(that.faClearCardParmsVO),
                        async: false,
                        contentType: 'application/json;charset=utf-8',
                        success: function (res) {
                            if (res != null) {
                                // layer.alert(res.msg);
                                that.$Message.info({
                                    content: res.msg,
                                    duration: 3
                                })
                                //置空清理参数对象
                                that.faClearCardParmsVO ={};
                            }
                        },
                        error: function (res) {

                        }
                    })
                    // this.$Message.info('Clicked ok');
                    that.clearOneShow = false;
                    that.refresh();
                },
                onCancel: () => {
                    this.clearOneShow = false;
                }
            });

        },
        //清理情况下日期选择范围
        getDateScope() {
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
        //关闭窗口
        quit () {
            window.parent.closeCurrentTab({ openTime: this.openTime, exit: true });
        },
        exporting() {
            $('#export_form')[0].submit();
        },
        cancel () {
            this.clearOneShow = false;
        }
    },

    computed: {
    }
})


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
        },

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
});
