var vm = new Vue({
    el: '#app',
    data: {
        sobId: '',
        boolTrue: true,
        boolFalse: false,
        uploadExlVisible: false,
        openTime: '',
        showMsg: false,
        oppositeEndInit: false,
        enableFirstDay: '',
        uploadData: {},
        upload_config: {
            url: contextPath + '/rpinitialController/importExcel',
            uploadType: '父级文件导入'
        },
        deleteVisible: false,
        deleteLoading: true,
        tabsTypeVal: '1',
        currencySelectVal: '', // 币别选择值
        currencySelectObj: {}, //币别选择对象
        exchangeRate: 1,
        currencyList: [],	// 币别列表
        columns1: [
            {title: '客户代码', key: 'tab1'},
            {title: '客户名称', key: 'tab2'},
            {title: '应收账款（原币）', key: 'tab3'},
            {title: '预收账款（原币）', key: 'tab4'},
            {title: '期初余额（原币）', key: 'tab5'},
            {title: '明细', key: 'tab6'}
        ],
        columns2: [
            {title: '供应商代码', key: 'tab1'},
            {title: '供应商名称', key: 'tab2'},
            {title: '应付账款（原币）', key: 'tab3'},
            {title: '预付账款（原币）', key: 'tab4'},
            {title: '期初余额（原币）', key: 'tab5'},
            {title: '明细', key: 'tab6'}
        ],
        columns3: [
            {title: '客户', key: 'tab1'},
            {title: '应收账款（原币）', key: 'tab2'},
            {title: '预收账款（原币）', key: 'tab3'},
            {title: '期初余额（原币）', key: 'tab4'},
            {title: '业务发生时间', key: 'tab5'},
            {title: '收款期限', key: 'tab6'},
            {title: '部门', key: 'tab7'},
            {title: '业务员', key: 'tab8'},
            {title: '备注', key: 'tab9'}
        ],
        dataList: [],	// table数据
        customDataist: [],	// 自定义数据
        pageInfo: {		// 分页
            currentPage: 1,
            totalNumber: 0,
            size: 5,
            page: 1,
            totalPage: 0
        },
        currentSelectRow: '',	// table 选择单行数据
        currentClickRowItemId: '',	//当前点击明细弹出框行对应的itemId
        currentClickRowItemName: '',	//当前点击明细弹出框行对应的itemName
        dataTotal: {
            curTotal: {
                amountFor: 0,
                preAmountFor: 0,
                beginBalanceFor: 0
            },
            allTotal: {
                amountFor: 0,
                preAmountFor: 0,
                beginBalanceFor: 0
            }
        },
        detailVisible: false,
        detailTitle: '',
        detailDataList: [],	// 详情table数据
        detailInfo: {},
        detailCurrentSelectRow: '',	// 详情table 选择单行数据
        detailDeleteVisible: false,
        detailDeleteLoading: true,
        selectCustomerValue: '', // 空格列的下拉框
        selectCustomerName: '', // 空格列的下拉框对应名称
        selectCustomerArr: [],
        selectShopValue: '', // 空格列的下拉框
        selectShopName: '', // 空格列的下拉框对应的名称
        selectShopArr: [],
        selectDepartmentArr: [],
        selectEmployeeArr: [],
        detailIsSaveAll: 1, //监听明细表保存操作
        subjectActionVal: 1,
        subjectVisable: false,
        modelTitle1: '应收应付初始化数据传递到总账科目初始数据',
        modelTitle1Visible: false,
        modelFormDataClient: {
            'client1': {
                discountSubject: '',	//科目name!!
                discountSubjectCode: '',	//科目code!!
                discountSubjectId: 0,	//科目id!!
            },
            'client2': {
                discountSubject: '',
                discountSubjectCode: '',
                discountSubjectId: 0,
            }
        },
        modelFormDataSupplier: {
            'supplier1': {
                discountSubject: '',	//科目name!!
                discountSubjectCode: '',	//科目code!!
                discountSubjectId: 0,	//科目id!!
            },
            'supplier2': {
                discountSubject: '',
                discountSubjectCode: '',
                discountSubjectId: 0,
            }
        }
    },
    filters: {
        /*
        selectCustomerCodeFilter:function (val) {
            var selectCustomer = vm.selectCustomerArr.filter(function(item){
                if(item.id === val){
                    return item;
                }
            });
            return selectCustomer[0].code;
        },
        selectShopCodeFilter:function (val) {
            var selectShop = vm.selectShopArr.filter(function(item){
                if(item.supplierId === val){
                    return item;
                }
            });
            return selectShop[0].supplierCode;
        }
        */
    },
    created: function () {
        //                this.dataList = Object.assign({}, this.color)
        // 请求获取币别 字段名请参考 index.json 修改
        let _vm = this;
        _vm.refreshData();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    watch: {
        dataList: function (val, oldVal) {
            var that = this;
            this.pageInfo.totalNumber = val.length;
            var _info = val.filter(function (item, idx) {
                if (idx < that.pageInfo.size) {
                    item.amountFor = that.formatMoney(item.amountFor);
                    item.amount = that.formatMoney(item.amount);
                    item.preAmountFor = that.formatMoney(item.preAmountFor);
                    item.preAmount = that.formatMoney(item.preAmount);
                    item.beginBalanceFor = that.formatMoney(item.beginBalanceFor);
                    item.beginBalance = that.formatMoney(item.beginBalance);
                    return item;
                }
            });

            this.customDataist = _info;
        },
        customDataist: function (val, oldVal) {
            // 计算总和
            var _totalAmountFor = 0, _totalAmount = 0, _totalPreAmountFor = 0, _totalPreAmount = 0,
                _totalBeginBalanceFor = 0, _totalBeginBalance = 0;
            var _curtotalAmountFor = 0, _curtotalAmount = 0, _curtotalPreAmountFor = 0, _curtotalPreAmount = 0,
                _curtotalBeginBalanceFor = 0, _curtotalBeginBalance = 0;
            val.forEach(function (v, i) {
                _curtotalAmountFor = _curtotalAmountFor + parseFloat(v.amountFor);
                _curtotalAmount = _curtotalAmount + parseFloat(v.amount);
                _curtotalPreAmountFor = _curtotalPreAmountFor + parseFloat(v.preAmountFor);
                _curtotalPreAmount = _curtotalPreAmount + parseFloat(v.preAmount);
                _curtotalBeginBalanceFor = _curtotalBeginBalanceFor + parseFloat(v.beginBalanceFor);
                _curtotalBeginBalance = _curtotalBeginBalance + parseFloat(v.beginBalance);
            });
            this.dataList.forEach(function (v, i) {
                _totalAmountFor = _totalAmountFor + parseFloat(v.amountFor);
                _totalAmount = _totalAmount + parseFloat(v.amount);
                _totalPreAmountFor = _totalPreAmountFor + parseFloat(v.preAmountFor);
                _totalPreAmount = _totalPreAmount + parseFloat(v.preAmount);
                _totalBeginBalanceFor = _totalBeginBalanceFor + parseFloat(v.beginBalanceFor);
                _totalBeginBalance = _totalBeginBalance + parseFloat(v.beginBalance);
            });
            if (this.currencySelectObj.id === -1) {
                this.dataTotal = {
                    curTotal: {
                        amount: 0,
                        preAmount: 0,
                        beginBalance: 0
                    },
                    allTotal: {
                        amount: 0,
                        preAmount: 0,
                        beginBalance: 0
                    }
                };
                this.dataTotal.curTotal.amount = this.formatMoney(_curtotalAmount);
                this.dataTotal.curTotal.preAmount = this.formatMoney(_curtotalPreAmount);
                this.dataTotal.curTotal.beginBalance = this.formatMoney(_curtotalBeginBalance);
                this.dataTotal.allTotal.amount = this.formatMoney(_totalAmount);
                this.dataTotal.allTotal.preAmount = this.formatMoney(_totalPreAmount);
                this.dataTotal.allTotal.beginBalance = this.formatMoney(_totalBeginBalance);
            } else {
                if (this.currencySelectObj.currencyStatus === 0) {
                    this.dataTotal.curTotal.amountFor = this.formatMoney(_curtotalAmountFor);
                    this.dataTotal.curTotal.preAmountFor = this.formatMoney(_curtotalPreAmountFor);
                    this.dataTotal.curTotal.beginBalanceFor = this.formatMoney(_curtotalBeginBalanceFor);
                    this.dataTotal.allTotal.amountFor = this.formatMoney(_totalAmountFor);
                    this.dataTotal.allTotal.preAmountFor = this.formatMoney(_totalPreAmountFor);
                    this.dataTotal.allTotal.beginBalanceFor = this.formatMoney(_totalBeginBalanceFor);
                } else {
                    this.dataTotal = {
                        curTotal: {
                            amountFor: 0,
                            amount: 0,
                            preAmountFor: 0,
                            preAmount: 0,
                            beginBalanceFor: 0,
                            beginBalance: 0
                        },
                        allTotal: {
                            amountFor: 0,
                            amount: 0,
                            preAmountFor: 0,
                            preAmount: 0,
                            beginBalanceFor: 0,
                            beginBalance: 0
                        }
                    };
                    this.dataTotal.curTotal.amountFor = this.formatMoney(_curtotalAmountFor);
                    this.dataTotal.curTotal.preAmountFor = this.formatMoney(_curtotalPreAmountFor);
                    this.dataTotal.curTotal.beginBalanceFor = this.formatMoney(_curtotalBeginBalanceFor);
                    this.dataTotal.curTotal.amount = this.formatMoney(_curtotalAmount);
                    this.dataTotal.curTotal.preAmount = this.formatMoney(_curtotalPreAmount);
                    this.dataTotal.curTotal.beginBalance = this.formatMoney(_curtotalBeginBalance);
                    this.dataTotal.allTotal.amountFor = this.formatMoney(_totalAmountFor);
                    this.dataTotal.allTotal.preAmountFor = this.formatMoney(_totalPreAmountFor);
                    this.dataTotal.allTotal.beginBalanceFor = this.formatMoney(_totalBeginBalanceFor);
                    this.dataTotal.allTotal.amount = this.formatMoney(_totalAmount);
                    this.dataTotal.allTotal.preAmount = this.formatMoney(_totalPreAmount);
                    this.dataTotal.allTotal.beginBalance = this.formatMoney(_totalBeginBalance);
                }
            }
        },
        tabsTypeVal: function (val, oldVal) {
            //请求获取列表数据
            this._ajaxGetDataList(this.currencySelectVal);
        },
        currencySelectVal: function (val, oldVal) {
            var that = this;
            this.currencyList.forEach(function (v, i) {
                if (v.id === val) {
                    that.currencySelectObj = v;
                }
            });
            var currencyId = null;
            if (val === oldVal || val === '') return;
            //判断当前选择币别类型
            if (val === -1) {
                //综合本位币(只能查看,不能新增修改删除)
                that.columns1 = [
                    {title: '客户代码', key: ''},
                    {title: '客户名称', key: ''},
                    {title: '应收账款（本位币）', key: ''},
                    {title: '预收账款（本位币）', key: ''},
                    {title: '期初余额（本位币）', key: ''},
                    {title: '明细', key: ''}
                ];
                that.columns2 = [
                    {title: '供应商代码', key: ''},
                    {title: '供应商名称', key: ''},
                    {title: '应付账款（本位币）', key: ''},
                    {title: '预付账款（本位币）', key: ''},
                    {title: '期初余额（本位币）', key: ''},
                    {title: '明细', key: ''}
                ];
            } else {
                //迭代币别列表获取当前选中币别属性,判断当前币别是否本位币
                currencyId = that.currencySelectObj.id;
                if (that.currencySelectObj.currencyStatus === 0) {
                    //当前选中币别属于本位币
                    that.columns1 = [
                        {title: '客户代码', key: ''},
                        {title: '客户名称', key: ''},
                        {title: '应收账款（原币）', key: ''},
                        {title: '预收账款（原币）', key: ''},
                        {title: '期初余额（原币）', key: ''},
                        {title: '明细', key: ''}
                    ];
                    that.columns2 = [
                        {title: '供应商代码', key: ''},
                        {title: '供应商名称', key: ''},
                        {title: '应付账款（原币）', key: ''},
                        {title: '预付账款（原币）', key: ''},
                        {title: '期初余额（原币）', key: ''},
                        {title: '明细', key: ''}
                    ];
                } else {
                    //当前选中币别属于外币
                    that.columns1 = [
                        {title: '客户代码', key: ''},
                        {title: '客户名称', key: ''},
                        {title: '应收账款（原币）', key: ''},
                        {title: '应收账款（本位币）', key: ''},
                        {title: '预售账款（原币）', key: ''},
                        {title: '预售账款（本位币）', key: ''},
                        {title: '期初余额（原币）', key: ''},
                        {title: '期初余额（本位币）', key: ''},
                        {title: '明细', key: ''}
                    ];
                    that.columns2 = [
                        {title: '供应商代码', key: ''},
                        {title: '供应商名称', key: ''},
                        {title: '应付账款（原币）', key: ''},
                        {title: '应付账款（本位币）', key: ''},
                        {title: '预付账款（原币）', key: ''},
                        {title: '预付账款（本位币）', key: ''},
                        {title: '期初余额（原币）', key: ''},
                        {title: '期初余额（本位币）', key: ''},
                        {title: '明细', key: ''}
                    ];
                }
            }
            //请求获取列表数据
            this._ajaxGetDataList(currencyId);
        },
        detailIsSaveAll: function (val, oldVal) {
            var _this = this;
            var _url = contextPath + '/rpinitialController/listAll';
            $.ajax({
                type: 'post',
                data: JSON.stringify({
                    'sobId': _this.sobId,
                    'rpType': parseInt(_this.tabsTypeVal),
                    'currencyId': _this.currencySelectVal,
                    'itemId': _this.currentClickRowItemId
                }),
                url: _url,
                dataType: 'json',
                contentType: 'application/json',
                success: function (ret) {
                    if (ret && ret.data) {
                        //刷新明细表,清楚明细选中项
                        _this.detailDataList = ret.data;
                        _this.detailCurrentSelectRow = '';
                        _this.$nextTick(() => {
                            _this.detailVisible = true;
                        });
                    }
                },
                error: function (code) {
                    console.log(code);
                }
            });
        },
        detailVisible: function (val, oldVal) {
            var _this = this;
            if (!val && oldVal) {
                _this._ajaxGetDataList(_this.currencySelectVal);
                console.log(val, oldVal)
                _this.selectCustomerValue = '';
                _this.selectShopValue = '';
            }
        }
    },
    methods: {
        refreshData(){
            let _vm = this;
            $.ajax({
                type: 'post',
                url: contextPath + '/rpinitialController/isRpInitFinished',
                dataType: 'json',
                success: function (ret) {
                    console.log(ret)
                    if (ret.data == 1) {
                        //已完成初始化
                        _vm.showMsg = true;
                    } else {
                        _vm.initPage();
                        _vm._ajaxGetCurrencyList();
                    }
                }
            });
        },
        formatMoney(value) {
            return value == null || value == 0 ? '0' : accounting.formatNumber(value, 2, "");
        },
        showGo() {
            this.modelTitle1Visible = true;
        },
        closeGo() {
            this.modelTitle1Visible = false;
        },
        // 科目下拉框
        showSubjectVisable(_type) {
            this.subjectVisable = true;
            this.subjectActionVal = _type;
        },
        subjectClose() {
            this.subjectVisable = false;
        },
        subjectData(treeNode) {
            let that = this;
            console.log(treeNode, '====treeNode');
            console.log(that.subjectActionVal, '====subjectActionVal');
            if (that.subjectActionVal === 1) {
                that.modelFormDataClient.client1.discountSubject = treeNode.subjectName;
                that.modelFormDataClient.client1.discountSubjectCode = treeNode.subjectCode;
                that.modelFormDataClient.client1.discountSubjectId = treeNode.id;
            } else if (that.subjectActionVal === 2) {
                that.modelFormDataClient.client2.discountSubject = treeNode.subjectName;
                that.modelFormDataClient.client2.discountSubjectCode = treeNode.subjectCode;
                that.modelFormDataClient.client2.discountSubjectId = treeNode.id;
            } else if (that.subjectActionVal === 3) {
                that.modelFormDataSupplier.supplier1.discountSubject = treeNode.subjectName;
                that.modelFormDataSupplier.supplier1.discountSubjectCode = treeNode.subjectCode;
                that.modelFormDataSupplier.supplier1.discountSubjectId = treeNode.id;
            } else if (that.subjectActionVal === 4) {
                that.modelFormDataSupplier.supplier2.discountSubject = treeNode.subjectName;
                that.modelFormDataSupplier.supplier2.discountSubjectCode = treeNode.subjectCode;
                that.modelFormDataSupplier.supplier2.discountSubjectId = treeNode.id;
            }
            // vm.row.subjectLabel = treeNode.subjectName;
            // vm.row.subjectValue = treeNode.subjectCode.replace(/\./g, '');
            // vm.row.subject = vm.row.subjectValue + ' ' + vm.row.subjectLabel;
        },
        initProjectData() {
            let _v = this;
            var _url = contextPath + '/rpinitialController/portBalance';
            var param = {
                'sobId': _v.sobId,
                'preReceipt': _v.modelFormDataClient.client2.discountSubjectCode,
                'prePayment': _v.modelFormDataSupplier.supplier2.discountSubjectCode,
                'receipt': _v.modelFormDataClient.client1.discountSubjectCode,
                'payment': _v.modelFormDataSupplier.supplier1.discountSubjectCode
            };
            $.ajax({
                type: 'post',
                data: param,
                url: _url,
                dataType: 'json',
                success: function (ret) {
                    console.log(ret)
                    _v.$Modal.info({
                        title:'提示',
                        content:ret==null||ret.msg==null||ret.msg == ''?'系统异常':ret.msg
                    })
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        initPage() {
            let that = this;
            var _url = contextPath + '/rpinitialController/initPage';
            $.ajax({
                type: 'post',
                data: null,
                url: _url,
                dataType: 'json',
                success: function (ret) {
                    console.log(ret)
                    if (ret.data) {
                        that.selectCustomerArr = ret.data.customerList;
                        that.selectShopArr = ret.data.supplierList;
                        that.selectDepartmentArr = ret.data.sysDepList;
                        that.selectEmployeeArr = ret.data.empList;
                        that.sobId = ret.data.sobId;
                        that.enableFirstDay = ret.data.enableFirstDay;
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        selectCustomerCode: function (val) {
            var selectCustomer = this.selectCustomerArr.filter(function (item) {
                if (item.id === val) {
                    return item;
                }
            });
            if (selectCustomer && selectCustomer[0]) {
                return selectCustomer[0].code;
            } else {
                return "";
            }
        },
        selectShopCode: function (val) {
            var selectShop = this.selectShopArr.filter(function (item) {
                if (item.supplierId === val) {
                    return item;
                }
            });
            if (selectShop && selectShop[0]) {
                return selectShop[0].supplierCode;
            } else {
                return "";
            }
        },
        selectChange: function (value, status) {
            var that = this;
            if (!value) {
                if (status === 1) {
                    that.selectCustomerName = '';
                } else {
                    that.selectShopName = '';
                }
                return;
            }
            switch (status) {
                case 1:
                    this.selectCustomerValue = value;
                    //判断选中的客户是否已存在数据
                    this.dataList.filter(function (val) {
                        if (value === val.itemId) {
                            that.$Modal.error({
                                title: '错误提示',
                                content: '客户: ' + val.itemName + '的数据已录入,请重新选择!'
                            });
                            value = '';
                            that.selectCustomerValue = '';
                        }
                    });
                    this.selectCustomerArr.forEach(function (val) {
                        if (value === val.id) {
                            that.selectCustomerName = val.name;
                        }
                    })
                    break;
                case 2:
                    this.selectShopValue = value;
                    //判断选中的供应商是否已存在数据
                    this.dataList.filter(function (val) {
                        if (value === val.itemId) {
                            that.$Modal.error({
                                title: '选中错误',
                                content: '供应商: ' + val.itemName + '的数据已录入,请重新选择!'
                            });
                            value = '';
                            that.selectShopValue = '';
                        }
                    });
                    this.selectShopArr.forEach(function (val) {
                        if (value === val.supplierId) {
                            that.selectShopName = val.supplierName;
                        }
                    })
                    break;
                default:
                    break;
            }

        },
        _ajaxGetCurrencyList: function () {
            var that = this;
            var _url = contextPath + '/rpinitialController/queryCurrencyList';
            $.ajax({
                type: 'post',
                async: true,
                data: {'sobId': that.sobId},
                url: _url,
                dataType: 'json',
                success: function (ret) {
                    var d = ret.data;
                    that.currencyList = d;
                    if (that.currencyList.length > 0) {
                        var _info = that.currencyList.filter(function (item) {
                            if (item.currencyStatus === 0) {
                                return item;
                            }
                        });
                        that.currencySelectVal = _info[0].id;
                        that.exchangeRate = _info[0].exchangeRate;
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        _ajaxGetDataList: function (currencyId) {
            var that = this;
            var _url = contextPath + '/rpinitialController/listAllGroupBy';
            $.ajax({
                type: 'post',
                async: true,
                data: JSON.stringify({'sobId': that.sobId, 'rpType': that.tabsTypeVal, 'currencyId': currencyId}),
                url: _url,
                dataType: 'json',
                contentType: 'application/json',
                success: function (d) {
                    that.dataList = d.data;
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        currencyChange: function (val) {
            var _info = this.currencyList.filter(function (item) {
                if (item.id === val) {
                    return item;
                }
            });
            this.currencySelectVal = _info[0].id;
            this.exchangeRate = _info[0].exchangeRate;
            this.currentSelectRow = '';
        },
        tableChickTr: function (item) {
            this.currentSelectRow = item.itemId;
        },
        detailTableChickTr: function (item) {
            this.detailCurrentSelectRow = item.id;
        },
        tableChickTd: function (item) {
            //综合本位币控制点击事件失效
            if (this.currencySelectObj.id === -1) {
                return;
            }
            //设置详细列表表头
            if (this.currencySelectObj.currencyStatus === 0) {
                //原币
                if (this.tabsTypeVal === '1') {
                    //客户
                    this.columns3 = [
                        {title: '客户', key: 'tab1'},
                        {title: '应收账款（原币）', key: 'tab2'},
                        {title: '预收账款（原币）', key: 'tab3'},
                        {title: '期初余额（原币）', key: 'tab4'},
                        {title: '业务发生时间', key: 'tab5'},
                        {title: '收款期限', key: 'tab6'},
                        {title: '部门', key: 'tab7'},
                        {title: '业务员', key: 'tab8'},
                        {title: '备注', key: 'tab9'}
                    ];
                } else {
                    //供应商
                    this.columns3 = [
                        {title: '供应商', key: 'tab1'},
                        {title: '应付账款（原币）', key: 'tab2'},
                        {title: '预付账款（原币）', key: 'tab3'},
                        {title: '期初余额（原币）', key: 'tab4'},
                        {title: '业务发生时间', key: 'tab5'},
                        {title: '收款期限', key: 'tab6'},
                        {title: '部门', key: 'tab7'},
                        {title: '业务员', key: 'tab8'},
                        {title: '备注', key: 'tab9'}
                    ];
                }
            } else {
                //外币
                if (this.tabsTypeVal === '1') {
                    //客户
                    this.columns3 = [
                        {title: '客户', key: 'tab1'},
                        {title: '应收账款（原币）', key: 'tab2'},
                        {title: '应收账款（本位币）', key: 'tab3'},
                        {title: '预收账款（原币）', key: 'tab4'},
                        {title: '预收账款（本位币）', key: 'tab5'},
                        {title: '期初余额（原币）', key: 'tab6'},
                        {title: '期初余额（本位币）', key: 'tab7'},
                        {title: '业务发生时间', key: 'tab8'},
                        {title: '收款期限', key: 'tab9'},
                        {title: '部门', key: 'tab10'},
                        {title: '业务员', key: 'tab11'},
                        {title: '备注', key: 'tab12'}
                    ];
                } else {
                    //供应商
                    this.columns3 = [
                        {title: '供应商', key: 'tab1'},
                        {title: '应付账款（原币）', key: 'tab2'},
                        {title: '应付账款（本位币）', key: 'tab3'},
                        {title: '预付账款（原币）', key: 'tab4'},
                        {title: '预付账款（本位币）', key: 'tab5'},
                        {title: '期初余额（原币）', key: 'tab6'},
                        {title: '期初余额（本位币）', key: 'tab7'},
                        {title: '业务发生时间', key: 'tab8'},
                        {title: '收款期限', key: 'tab9'},
                        {title: '部门', key: 'tab10'},
                        {title: '业务员', key: 'tab11'},
                        {title: '备注', key: 'tab12'}
                    ];
                }
            }
            if (item instanceof Object) {
                this.detailTitle = `应收应付初始余额录入-${this.tabsTypeVal === '1' ? '客户' : '供应商'}-${item.itemName}`;
            } else {
                //判断新增栏是否选择了客户/供应商
                if (this.tabsTypeVal === '1') {
                    if (this.selectCustomerValue === '') {
                        return;
                    }
                } else {
                    if (this.selectShopValue === '') {
                        return;
                    }
                }
                this.detailTitle = `应收应付初始余额录入-${this.tabsTypeVal === '1' ? '客户' : '供应商'}-${this.selectCustomerName}`;
            }
            var _this = this;
            if (this.tabsTypeVal === '1') {
                _this.currentClickRowItemId = item ? item.itemId : _this.selectCustomerValue;
                _this.currentClickRowItemName = item ? item.itemName : _this.selectCustomerName;
            } else {
                _this.currentClickRowItemId = item ? item.itemId : _this.selectShopValue;
                _this.currentClickRowItemName = item ? item.itemName : _this.selectShopName;
            }
            var _url = contextPath + '/rpinitialController/listAll';
            $.ajax({
                type: 'post',
                data: JSON.stringify({
                    'sobId': _this.sobId,
                    'rpType': _this.tabsTypeVal,
                    'currencyId': _this.currencySelectVal,
                    'itemId': _this.currentClickRowItemId
                }),
                url: _url,
                dataType: 'json',
                contentType: 'application/json',
                success: function (ret) {
                    if (ret && ret.data) {
                        _this.detailDataList = ret.data;
                        _this.$nextTick(() => {
                            _this.detailVisible = true;
                        });
                    }
                },
                error: function (code) {
                    console.log(code);
                }
            });
        },
        changePage: function (val) {
            var that = this;
            var _cur = this.pageInfo.size * val;
            var _info = this.dataList.filter(function (item, idx) {
                if (idx > (_cur - that.pageInfo.size - 1) && idx < _cur) {
                    return item;
                }
            });
            this.customDataist = _info;
        },
        actionBtnMth: function (type) {
            var that = this;
            if (this.currentSelectRow === '') {
                this.$Message.info({
                    content: '请选择一条数据。',
                    duration: 5
                });
                return;
            }
            if (type === 'delete') {
                that.deleteVisible = true;
            }
        },
        detailActionBtnMth: function (type) {
            var that = this;
            let isBusinessTimeOK = false;
            if (type === 'saveAll') {
                //新增明细ID统一设置为-1
                that.detailDataList = that.detailDataList.filter(function (item) {
                    if (item.isNewEntity) {
                        item.id = -1;
                    }
                    return item;
                });
                //批量删除和保存数据
                if (that.detailDataList == null || that.detailDataList.length == 0) {
                    that.$Message.info({
                        content: '操作成功',
                        duration: 3
                    });
                    return;
                }

                console.log("that.detailDataList");
                console.log(that.detailDataList);
                console.log("enableFirstDay");
                console.log(that.enableFirstDay);
                console.log("enableFirstDay++++");
                //console.log(new Date(that.enableFirstDay.replace(/-/g,"\/")));

                let sysDate = new Date(Date.parse(that.enableFirstDay));
                console.log(sysDate);

                /*$.each(that.detailDataList,function (idex, item){
                    if ($.CompareDate(item.businessTime,that.enableFirstDay)==1){
                        layer.alert("第"+(idex+1)+"行的业务日期大于启用日期");
                        return;
                    }
                });*/

                $.each(that.detailDataList, function (idex, item) {
                    if (item.businessTime > sysDate) {
                        that.$Message.error("第" + (idex + 1) + "行的业务日期大于启用日期")
                        isBusinessTimeOK = true;
                        return;
                    }
                });

                if(isBusinessTimeOK){
                    return;
                }

                var _url = contextPath + '/rpinitialController/deleteAndSaveBatch';
                $.ajax({
                    type: 'post',
                    url: _url,
                    contentType: 'application/json',
                    data: JSON.stringify(that.detailDataList),
                    dataType: 'json',
                    success: function (ret) {
                        that.detailIsSaveAll = that.detailIsSaveAll + 1;
                        if (ret.data === true) {
                            that.$Modal.success({
                                title:'成功',
                                content:'操作成功'
                            })
                        } else {
                            that.detailDeleteVisible = false;
                            that.$Modal.error({
                                title: '错误提示',
                                content: '保存失败,原因:' + ret.msg
                            });
                        }
                    },
                    error: function (ret) {
                        console.log(ret);
                    }
                });
            } else if (type === 'add') {
                var _info = {
                    "id": new Date().getTime(),
                    "sobId": this.sobId,
                    "rpType": this.tabsTypeVal,
                    "currencyId": this.currencySelectVal,
                    "itemId": this.currentClickRowItemId,
                    "itemName": this.currentClickRowItemName,
                    "amountFor": 0.00,
                    "amount": 0.00,
                    "preAmountFor": 0.00,
                    "preAmount": 0.00,
                    "beginBalanceFor": 0.00,
                    "beginBalance": 0.00,
                    "businessTime": fecha.format(new Date(), 'yyyy-MM-dd'),
                    "deadlineTime": fecha.format(new Date(), 'yyyy-MM-dd'),
                    "departmentId": "",
                    "employeeId": "",
                    "remark": "",
                    "status": 1,
                    "isNewEntity": true
                };
                that.detailDataList.push(_info);
            } else {
                if (this.detailCurrentSelectRow === '') {
                    this.$Message.info({
                        content: '请选择一条数据。',
                        duration: 5
                    });
                    return;
                } else {
                    if (type === 'delete') {
                        that.detailDeleteVisible = true;
                    }
                }
            }

        },
        closeDetailModal: function () {
            this.detailVisible = false;
        },
        deleteOK: function () {
            var that = this;
            // 调用删除接口,删除数据
            var _url = contextPath + '/rpinitialController/deleteByEntity';
            $.ajax({
                type: 'post',
                url: _url,
                contentType: 'application/json',
                data: JSON.stringify({
                    'sobId': that.sobId,
                    'rpType': parseInt(that.tabsTypeVal),
                    'currencyId': that.currencySelectVal,
                    'itemId': that.currentSelectRow
                }),
                dataType: 'json',
                success: function (ret) {
                    if (ret.data === true) {
                        that.dataList = that.dataList.filter(function (item) {
                            return item.itemId !== that.currentSelectRow;
                        });
                        that.currentSelectRow = '';
                        that.deleteVisible = false;
                        that.$Message.info({
                            content: '删除成功',
                            duration: 3
                        });
                    } else {
                        that.deleteVisible = false;
                        that.$Modal.error({
                            title: '错误提示',
                            content: '删除失败,原因:' + ret.msg
                        });
                    }
                },
                error: function (ret) {
                    console.log(ret);
                }
            });
        },
        detailDeleteOK: function () {
            var that = this;
            var _info = that.detailDataList.filter(function (item) {
                return that.detailCurrentSelectRow === item.id;
            });
            if (_info.length) {
                if (_info[0].isNewEntity) {
                    that.detailDataList = that.detailDataList.filter(function (item) {
                        return item.id !== that.detailCurrentSelectRow;
                    });
                    that.detailCurrentSelectRow = '';
                    that.detailDeleteVisible = false;
                    that.$Message.info({
                        content: '删除成功',
                        duration: 3
                    });
                } else {
                    // 调用删除接口,删除数据
                    var _url = contextPath + '/rpinitialController/deleteByEntity';
                    $.ajax({
                        type: 'post',
                        url: _url,
                        contentType: 'application/json',
                        data: JSON.stringify({
                            'sobId': that.sobId,
                            'rpType': parseInt(that.tabsTypeVal),
                            'currencyId': that.currencySelectVal,
                            'id': that.detailCurrentSelectRow
                        }),
                        dataType: 'json',
                        success: function (ret) {
                            if (ret.data === true) {
                                that.detailDataList = that.detailDataList.filter(function (item) {
                                    return item.id !== that.detailCurrentSelectRow;
                                });
                                that.detailCurrentSelectRow = '';
                                that.detailDeleteVisible = false;
                                that.$Message.info({
                                    content: '删除成功',
                                    duration: 3
                                });
                            } else {
                                that.detailDeleteVisible = false;
                                that.$Modal.error({
                                    title: '错误提示',
                                    content: '删除失败,原因:' + ret.msg
                                });
                            }
                        },
                        error: function (ret) {
                            console.log(ret);
                        }
                    });
                }
            }
        },
        formatNum: function (f, digit) {
            var m = Math.pow(1000, digit);
            return parseInt(f * m, 10) / m;
        },
        blur_money: function (row, attr) {
            /*var amountFor = this.formatNum(row['amountFor'], 1);
            var amount = this.formatNum(row['amountFor'] * this.exchangeRate, 1);
            var preAmountFor = this.formatNum(row['preAmountFor'], 1);
            var preAmount = this.formatNum(row['preAmountFor'] * this.exchangeRate, 1);
            var beginBalanceFor = this.formatNum(row['beginBalanceFor'], 1);
            var beginBalance = this.formatNum(row['beginBalanceFor'] * this.exchangeRate, 1);
            attr === 'amountFor' && (row[attr] = this.formatMoney(amountFor)
                , row['amount'] = this.formatMoney(amount)
                , row['beginBalanceFor'] = this.formatMoney((amountFor - preAmountFor))
                , row['beginBalance'] = this.formatMoney(amount - preAmount));
            attr === 'preAmountFor' && (row[attr] = this.formatMoney(preAmountFor)
                , row['preAmount'] = this.formatMoney(preAmount)
                , row['beginBalanceFor'] = this.formatMoney(amountFor - preAmountFor)
                , row['beginBalance'] = this.formatMoney(amount - preAmount));*/

            var amountFor = this.formatNum(row['amountFor'], 1);
            var amount = this.formatNum(row['amountFor'] * this.exchangeRate, 1);
            var preAmountFor = this.formatNum(row['preAmountFor'], 1);
            var preAmount = this.formatNum(row['preAmountFor'] * this.exchangeRate, 1);
            var beginBalanceFor = this.formatNum(row['beginBalanceFor'], 1);
            var beginBalance = this.formatNum(row['beginBalanceFor'] * this.exchangeRate, 1);
            attr === 'amountFor' && (row[attr] = amountFor.toFixed(2)
                , row['amount'] = amount.toFixed(2)
                , row['beginBalanceFor'] = (amountFor - preAmountFor).toFixed(2)
                , row['beginBalance'] = (amount - preAmount).toFixed(2));
            attr === 'preAmountFor' && (row[attr] = preAmountFor.toFixed(2)
                , row['preAmount'] = preAmount.toFixed(2)
                , row['beginBalanceFor'] = (amountFor - preAmountFor).toFixed(2)
                , row['beginBalance'] = (amount - preAmount).toFixed(2));

            /* attr === 'beginBalanceFor' && (row[attr] = beginBalanceFor.toFixed(2)
                 , row['beginBalance'] = beginBalance.toFixed(2)
                 , row['amountFor'] = beginBalanceFor.toFixed(2)
                 , row['amountFor'] = beginBalance.toFixed(2));*/
        },
        uploadExlModal: function (type) {
            this.uploadExlVisible = type;
            this.uploadData = {'rpType': this.tabsTypeVal, 'currencyId': this.currencySelectVal};
            if (this.currencySelectVal == -1) {
                this.$Message.error('综合本位币无法引入');
                return false;
            }
        },
        exitInit() {
            var name = '应收应付初始化';
            window.parent.closeCurrentTab({name: name, openTime: this.openTime, exit: true})
        },
        exitInitOk() {
            let that = this;
            if (!that.oppositeEndInit) {
                that.exitInit();
            } else {
                //反结束初始化
                $.ajax({
                    type: 'post',
                    url: contextPath + '/rpinitialController/reverseInit',
                    data: null,
                    dataType: 'json',
                    success: function (ret) {
                        console.log(ret)
                        if (ret.code == '100100') {
                            that.$Modal.confirm({
                                title: '提示',
                                content: '<p>反初始化成功</p >',
                                onOk: () => {
                                    that.initPage();
                                    that._ajaxGetCurrencyList();
                                },
                                onCancel: () => {
                                    that.initPage();
                                    that._ajaxGetCurrencyList();
                                }
                            });
                        } else {
                            that.$Modal.confirm({
                                title: '提示',
                                content: ret.msg,
                                onOk: () => {
                                    that.exitInit();
                                },
                                onCancel: () => {
                                    that.exitInit();
                                }
                            });
                        }
                    },
                    error: function (ret) {
                        console.log(ret);
                    }
                });
            }
        },
        exportExcel() {
            if (this.currencySelectVal == -1) {
                //综合本位币，无法导出
                this.$Message.error('综合本位币无法导出');
            } else {
                var _url = contextPath + "/rpinitialController/exportExcel?rpType=" + this.tabsTypeVal + "&currencyId=" + this.currencySelectVal;
                console.log(_url)
                window.open(_url);
            }
        },
        submitInit() {
            let This = this;
            $.ajax({
                type: 'post',
                url: contextPath + '/rpinitialController/listAllS',
                data: null,
                dataType: 'json',
                success: function (ret) {
                    console.log(ret)
                    if (ret.code == '100100') {
                        This.$Modal.confirm({
                            title: '提示',
                            content: '<p>结束初始化成功</p >',
                            onOk: () => {
                                This.exitInit();
                            },
                            onCancel: () => {
                                This.exitInit();
                            }
                        });
                    } else {
                        This.$Modal.error({
                            title:'错误',
                            content:ret==null||ret.msg==null||ret.msg == ''?'系统异常':ret.msg
                        })
                    }
                },
                error: function (ret) {
                    console.log(ret);
                }
            });
        }
    },
    computed: {
        emptyCustomerRight() {
            return this.selectCustomerValue ? true : false
        },
        emptyShopRight() {
            return this.selectShopValue ? true : false
        },
        isOriginal() {
            if (this.currencySelectObj.currencyStatus == 0) {
                return true;
            }
            return false;
        },
        isForeign() {
            if (this.currencySelectObj.currencyStatus == 1) {
                return true;
            }
            return false;
        },
        isStandard() {
            if (this.currencySelectObj.id == -1) {
                return true;
            }
            return false;
        }
    }
})