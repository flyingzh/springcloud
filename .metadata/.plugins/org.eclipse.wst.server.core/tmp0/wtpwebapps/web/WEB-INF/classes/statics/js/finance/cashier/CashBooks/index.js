var vm = new Vue({
    el: '#cash-book-test',
    data () {
        var that = this;
        return {
            openTime: '',
            baseData: {
                standardCurrencyId: '',
                subjectName: '',
                currencyName: '',
                periodDate: '',
                curYear:'',
                curPeriod:'',
                startCnDate:'',
                cnStartYear:'',
                cnStartPeriod:''
            },
            voucherFilter: {
                voucherWordId: 0,//凭证字id
                abnormalDataProcessing: '1',//按单异常处理
                subjectMergerDebit: false, // 借方相同科目合并
                subjectMergerLender: false //贷方相同科目合并
            },
            editData: {
                id: '',
                sobId: '',
                subjectId: '',
                subjectCode: '',
                subjectName: '',
                subjectValue: '',
                relativeSubjectId: '',
                relativeSubjectCode: '',
                relativeSubjectName: '',
                relativeSubjectValue: '',
                currencyId: '',
                datetime: '',
                periodDate: '',
                serialNumber: '',
                debitAmount: '',
                debitAmountFor: '',
                debitAmountForRate: '',
                creditAmountFor: '',
                creditAmountForRate: '',
                creditAmount: '',
                remark: '',
                direction: '',
                exchangeRate: '',
                accountYear: '',
                accountPeriod: '',
                handleId: '',
                handleName: '',
                isProject: '',
                isCarryOver: '1',
                dataSource: '2',
                summary: ''
            },
            addData: {
                id: '',
                sobId: '',
                subjectId: '',
                currencyId: '',
                datetime: '',
                serialNumber: '',
                periodDate: '',
                debitAmount: '',
                debitAmountFor: '0.00',
                debitAmountForRate: '',
                creditAmountFor: '0.00',
                creditAmountForRate: '',
                creditAmount: '',
                remark: '',
                relativeSubjectId: '',
                relativeSubjectCode: '',
                relativeSubjectName: '',
                relativeSubjectValue: '',
                direction: '',
                exchangeRate: '',
                accountYear: '',
                accountPeriod: '',
                handleId: '',
                handleName: '',
                isProject: '',
                isCarryOver: '1',
                dataSource: '2',
                summary: ''
            },
            openData: {
                sobId: "",
                subjectId: "",
                currencyId: "",
                startYear: "",
                endYear: "",
                startPeriod: "",
                endPeriod: "",
                startDate: "",
                endDate: "",
                voucherGroupId: "-1",
                startVoucherGroupNumber: "",
                endVoucherGroupNumber: "",
                explains: "",
                relateSubjectId: "",
                handleId: "",
                prepareId: "",
                showInitBalance: true,
                showDetailRecord: true,
                showDaySum: true,
                showPeriodSum: true,
                showYearSum: true,
                showTotalSum: true,
                // period: "",
                type: "1",
                subjectName: '',
                currencyName: ''
            },
            importData: {
                startYear: "",
                startPeriod: "",
                voucherGroupId: "",
                startVoucherGroupNumber: "",
                endVoucherGroupNumber: "",
                audited: "",
                posted: "",
                preparerId: "",
                importId: []
            },
            filterVisible: false,
            editVisible: false,
            voucherModelTxt: '',
            viewReportTxt: '',
            showVoucherVisible: false,
            voucherVisible: false,
            importVisible: false,
            base_config: {
                multiselect: true,
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/cashier/cashierDetail',
                ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                datatype: 'json',
                jsonReader: {
                    root: "data.resultVo",
                    // cell: "list",
                    // userdata: "data.userData",
                    // repeatitems: false
                },
                height: $(window).height() - 140,
                viewrecords: true,
                rowNum: 999999999,
                onSelectAll: function (data, status) { // 且点击头部的checkbox时才会触发此事件
                    that.handlerId(data, status, "selected");
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
                        that.handlerId(data, status, "selected");
                        console.log(that.selected)
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
            organisationList: [
                { label: "金大祥", value: 1 },
            ],
            //科目列表
            subjectList: [],
            currencyList: [],
            //摘要列表
            voucherExpList: [],
            //凭证字列表
            voucherDataList: [],
            //凭证字列表
            voucherDataLists: [],
            //从总账引入--凭证字列表
            voucherDataListForImport: [],
            //会计年度列表
            periodYear: [],
            periodList: [
                { name: '1', value: 1 },
                { name: '2', value: 2 },
                { name: '3', value: 3 },
                { name: '4', value: 4 },
                { name: '5', value: 5 },
                { name: '6', value: 6 },
                { name: '7', value: 7 },
                { name: '8', value: 8 },
                { name: '9', value: 9 },
                { name: '10', value: 10 },
                { name: '11', value: 11 },
                { name: '12', value: 12 }
            ],
            //审核状态
            auditedList: [
                { id: -1, name: '全部' },
                { id: 1, name: '已审核' },
                { id: 2, name: '未审核' }
            ],
            //过账状态
            postedList: [
                { id: -1, name: '全部' },
                { id: 1, name: '已过账' },
                { id: 2, name: '未过账' }
            ],
            editTitle: "",
            subjectVisable: false,
            isContinue: false,
            viewReportVisible: false,
            subjectTpye: "",
            tableList: [],
            selected: [],  // 获取列表列的勾选数组的rowId
            selectedId: [],   // 获取列表列的勾选数组的id
            importSelected: [], //获取引入弹框列表列的勾选数组的rowId
            addSubjectListOpt: [],
            addSubjectListOptShow: false,
            subjectOpts: {},
            optsVal: {  // 核算项目取值

            },
            remarkVisable: false, // 摘要弹窗
            // 摘要列表
            remarklist: [],
            remarkType: 0,
            //经手人
            handManList: [],
            openMakerList: [],
            openHandleList: [],
            importVoucherHandleList: [],
            editExchangeRateDisabled: true,
            dataList:[],
            printModal: false,
            printInfo: {},
        }
    },
    mounted () {
        this.openTime = window.parent.params && window.parent.params.openTime;
        this.initPage();
        this._queryObject();
    },
    methods: {
        openSubjectChange(item){
            let entity = {};
            vm.subjectList.map(function (val, index) {
                if(val.accountId == item){
                    entity = val;
                }
            })
            console.log(entity)
          //根据科目id查询币别列表
            $.ajax({
                type: 'post',
                url: contextPath + '/cashier/getCurrencyListBySubjectId',
                data: {'subjectId':item},
                success: function (result) {
                    console.log(result)
                    if(result.code != '100100'){
                        vm.$Modal.warning({
                            title:'警告',
                            content:'获取币别列表异常'
                        })
                    }else{
                        vm.currencyList = result.data;
                    }
                }
            });
        },
        currencyChange (item) {
            $.each(vm.currencyList, function (idx, ele) {
                if (item == ele.id) {
                    vm.editData.debitAmountForRate = ele.exchangeRate;
                    vm.editData.creditAmountForRate = ele.exchangeRate;
                    if (item === vm.baseData.standardCurrencyId) {
                        vm.editExchangeRateDisabled = true;
                    } else {
                        vm.editExchangeRateDisabled = false;
                    }
                }
            });
        },
        bookDateChange (item) {
            if(item == null || item == ''){
                return;
            }
            let currentDate = (new Date(item)).format("yyyy-MM-dd")

            let pDate = { 'currentDate': currentDate, 'currencyId': vm.editData.currencyId };
            $.ajax({
                type: 'post',
                url: contextPath + '/cashier/getPeriodByDate',
                data: pDate,
                success: function (result) {
                    console.log(result)
                    if (result.code == '100100' && result.data != null) {
                        vm.editData.periodDate = result.data.year + '年' + result.data.month + '期'
                        vm.editData.serialNumber = result.data.serialNum;
                        vm.editData.datetime = item;
                    } else {
                        vm.$Modal.error({
                            title:'错误',
                            content:'请求错误'
                        })
                    }
                }
            });
        },
        // 文摘弹窗
        clickDigest (_t) {
            this.remarkType = _t;
            this.remarkVisable = true;
        },
        onDblclickRemarkRow (remark) {
            let that = this;
            that.remarkType === 1 ? that.editData.summary = remark.content : that.openData.explains = remark.content;
            //	vm.row.abstract = remark.content;
            // vm.row.explains = remark.content;
            // vm.row.explainsLabel = remark.content;
            // vm.row.explainsValue = remark.id || '';
            that.remarkVisable = false;
        },
        onRemarkModalChange (val) {
            this.remarkVisable = val;
        },
        onRemarkListChange (val) {
            this.remarklist = val;
        },
        //页面初始化
        initPage () {
            let _vm = this;
            $.ajax({
                type: 'post',
                url: contextPath + '/cashier/init',
                dataType: 'json',
                data: null,
                success: function (result) {
                    console.log(result)
                    if (result.code != '100100') {
                        _vm.$Modal.error({
                            title:'错误',
                            content:'页面初始化失败'
                        })
                        return;
                    }
                    let dataInfo = result.data;
                    _vm.organisationList = dataInfo.org;
                    _vm.baseData.standardCurrencyId = dataInfo.standardCurrencyId;
                    _vm.currencyList = dataInfo.currencyList;
                    _vm.voucherExpList = dataInfo.voucherExpList;
                    _vm.remarklist = dataInfo.voucherExpList;
                    _vm.subjectList = dataInfo.subjectList;
                    _vm.voucherDataList=$.extend(true,[], dataInfo.voucherDataList);
                    _vm.voucherDataLists=$.extend(true,[], dataInfo.voucherDataList);
                    _vm.voucherDataListForImport = dataInfo.voucherDataList;
                    _vm.periodYear = dataInfo.periodYear;
                    _vm.handManList = dataInfo.projectList[3];
                    _vm.addData.accountYear = dataInfo.cnCurrentAccountYear;
                    _vm.addData.accountPeriod = dataInfo.cnCurrentAccountPeriod;

                    _vm.baseData.curYear = dataInfo.cnCurrentAccountYear;
                    _vm.baseData.curPeriod = dataInfo.cnCurrentAccountPeriod;
                    _vm.baseData.cnStartYear = dataInfo.cnStartYearAndPeriod.generalLedgerYear;
                    _vm.baseData.cnStartPeriod = dataInfo.cnStartYearAndPeriod.generalLedgerPeriod;
                    _vm.baseData.startCnDate = dataInfo.startCnDate;

                    _vm.addData.sobId = dataInfo.org[0].value;
                    if (!$.isEmptyObject(dataInfo.subjectList) && dataInfo.subjectList.length != 0) {
                        _vm.addData.subjectId = dataInfo.subjectList[0].accountId;
                        _vm.openData.subjectId = dataInfo.subjectList[0].accountId;
                        _vm.openData.subjectName = dataInfo.subjectList[0].accountName;
                    }
                    _vm.addData.currencyId = dataInfo.currencyList[0].id;
                    $.each(_vm.currencyList, function (idx, ele) {
                        if (_vm.addData.currencyId == ele.id) {
                            _vm.addData.debitAmountForRate = ele.exchangeRate;
                            _vm.addData.creditAmountForRate = ele.exchangeRate;
                            _vm.openData.currencyName = ele.currencyName;
                        }
                    });
                    _vm.addData.serialNumber = dataInfo.serialNum;
                    _vm.addData.datetime = dataInfo.endDate;
                    _vm.addData.periodDate = dataInfo.cnCurrentAccountYear + '年' + dataInfo.cnCurrentAccountPeriod + '期'
                    Object.assign(_vm.editData, _vm.addData);

                    _vm.openData.startDate = dataInfo.startDate;
                    _vm.openData.endDate = dataInfo.endDate;
                    _vm.openData.sobId = dataInfo.org[0].value;
                    _vm.openData.currencyId = dataInfo.currencyList[0].id;

                    $.each(dataInfo.periodYear, function (idx, ele) {
                        if (ele.name == dataInfo.cnCurrentAccountYear) {
                            _vm.openData.startYear = ele.value;
                            _vm.openData.endYear = ele.value;

                            _vm.importData.startYear = ele.value;
                        }
                    });
                    $.each(_vm.periodList, function (idx, ele) {
                        if (ele.name == dataInfo.cnCurrentAccountPeriod) {
                            _vm.openData.startPeriod = ele.value;
                            _vm.openData.endPeriod = ele.value;

                            _vm.importData.startPeriod = ele.value;
                        }
                    });

                    _vm.subjectOpts = dataInfo.projectOpts;

                    //设置经手人列表
                    _vm.openMakerList = dataInfo.handleAndMakerList.handle;
                    _vm.openHandleList = dataInfo.handleAndMakerList.make;
                    _vm.importVoucherHandleList = dataInfo.handleAndMakerList.voucherMake;
                    let all1 = {'id':-1,'name':'全部'}
                    _vm.voucherDataListForImport.unshift(all1);
                    let all2 = {'preparerId':-1,'prepareName':'全部'}
                    _vm.importVoucherHandleList.unshift(all2);

                    _vm.importData.voucherGroupId = _vm.voucherDataListForImport[0].id;
                    _vm.importData.audited= _vm.auditedList[0].id;
                    _vm.importData.posted=_vm.postedList[0].id;
                    _vm.importData.preparerId=_vm.importVoucherHandleList[0].preparerId;

                    _vm.initMethod();
                    _vm.importInit();
                }
            });
        },
        showVoucherVisibleClose () {
            $('#list').setGridParam({ postData: JSON.stringify(this.openData) }).trigger("reloadGrid");
            this.selected = [];
            this.isContinue = false;
            this.initMethod();
        },
        showViewReport (_bool) {
            this.viewReportVisible = !this.viewReportVisible;
        },
        // 初始值
        initMethod () {
            let data = this.openData;
            if (data.type == 1) {
                //期间查询
                if(data.startYear>data.endYear || (data.startYear==data.endYear&&data.startPeriod>data.endPeriod)){
                    this.$Message.error('开始期间不能大于结束期间')
                    return;
                }
                if(data.startYear<this.baseData.cnStartYear||(data.startYear==this.baseData.cnStartYear&&data.startPeriod<this.baseData.cnStartPeriod)){
                    this.$Message.error('有效查询起始期间为：'+this.baseData.cnStartYear+'年第'+this.baseData.cnStartPeriod+'期');
                    return;
                }

                if(data.endYear>this.baseData.curYear ||(data.endYear==this.baseData.curYear&&data.endPeriod>(this.baseData.curPeriod+1))){
                    this.$Message.error('只允许查询'+this.baseData.curYear+'年第'+(this.baseData.curPeriod+1)+'期之前的日记账')
                    return;
                }

            }else if(data.type == 2){
                let startDate = Date.parse(data.startDate)/1000;
                let endDate = Date.parse(data.endDate)/1000;
                console.log(startDate,endDate)
                if(startDate>endDate){
                    this.$Message.error('开始日期不能大于结束日期')
                    return;
                }
                //按照日期筛选 startDate: "",  endDate: "",
                let s = this.baseData.startCnDate/1000;
                if(startDate<s){
                    var newDate = new Date();
                    newDate.setTime(this.baseData.startCnDate);
                    let date = (new Date(newDate.toDateString())).format("yyyy-MM-dd");
                    this.$Message.error('有效查询起始日期为：'+date)
                    return;
                }
                data.startDate = (new Date(data.startDate)).format("yyyy-MM-dd");
                data.endDate = (new Date(data.endDate)).format("yyyy-MM-dd");
            }
            this.delTable();
            this.setTableHeader();
            this.filterVisible = false;
        },
        printV(){
            let that = this;
            if (!that.dataList || !that.dataList.length) {
                that.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }
            $.each(that.dataList, function (idx, ele) {

                ele.audited = ele.audited==1?'Y':'N';
                ele.posted = ele.posted==1?'Y':'N';
                if (ele.dataSource == '1') {
                    ele.dataSource = '总账引入';
                } else if (ele.dataSource == '2') {
                    ele.dataSource =  '手工录入';
                } else if (ele.dataSource == '3') {
                    ele.dataSource =  'Excel导入';
                } else{
                    ele.dataSource = '';
                }
            });

            if(that.openData.currencyId == that.baseData.standardCurrencyId){
                //单行表头
                var _info = {
                    'title': '现金日记账',  // 标题
                    'template': 1,  // 模板
                    'titleInfo': [       // title
                        { 'name': '科目', 'val': that.baseData.subjectName },
                        { 'name': '币别', 'val': that.baseData.currencyName }
                    ],
                    'colNames': [       // 列名与对应字段名
                        { 'name': '日期', 'col': 'datetimeStr' },
                        { 'name': '当日序号', 'col': 'serialNumber' },
                        { 'name': '凭证字号', 'col': 'voucherGroupData' },
                        { 'name': '凭证期间', 'col': 'voucherPeriodData' },
                        { 'name': '凭证审核', 'col': 'audited' },
                        { 'name': '过账标志', 'col': 'posted' },
                        { 'name': '摘要', 'col': 'summary'},
                        { 'name': '对方科目', 'col': 'relateSubjectName'},
                        { 'name': '借方金额', 'col': 'debitAmount' , 'formatNub': true},
                        { 'name': '贷方金额', 'col': 'creditAmount' , 'formatNub': true},
                        { 'name': '余额', 'col': 'balance' , 'formatNub': true},
                        { 'name': '经手人', 'col': 'handleName' },
                        { 'name': '制单人', 'col': 'createName' },
                        { 'name': '数据来源', 'col': 'dataSource' },
                        { 'name': '备注', 'col': 'remark' },
                    ],
                    'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                    'colMaxLenght': 9,  // 显示最大长度， 默认为7
                    'data': that.dataList,  // 打印数据  list
                }
                // 弹窗选择列 模式
                that.printInfo = _info;
                that.printModalShow(true);
            }else{
                //固定多表头
                // 多表头固定打印
                var _d = that.dataList;
                var _thead = '', _tbody = '', _tfoot = '';

                _thead = `
                    <tr class='thCs'>
                        <th rowspan="2" style="width: 6%">日期</th>
                        <th rowspan="2" style="width: 6%">当日序号</th>
                        <th rowspan="2" style="width: 6%">凭证字号</th>
                        <th rowspan="2" style="width: 6%">凭证期间</th>
                        <th rowspan="2" style="width: 6%">凭证审核</th>
                        <th rowspan="2" style="width: 6%">过账标志</th>
                        <th rowspan="2" style="width: 6%">摘要</th>
                        <th rowspan="2" style="width: 6%">对方科目</th>
                        <th colspan="2" style="width: 12%">借方金额</th>
                        <th colspan="2" style="width: 12%">贷方金额</th>
                        <th colspan="2" style="width: 12%">余额</th>
                        <th rowspan="2" style="width: 6%">经手人</th>
                        <th rowspan="2" style="width: 6%">制单人</th>
                        <th rowspan="2" style="width: 6%">数据来源</th>
                        <th rowspan="2" style="width: 6%">备注</th>
                    </tr>
                     <tr class='thCs'>
                        <th style="width: 6%">原币</th>
                        <th style="width: 6%">本位币</th>
                        <th style="width: 6%">原币</th>
                        <th style="width: 6%">本位币</th>
                        <th style="width: 6%">原币</th>
                        <th style="width: 6%">本位币</th>
                    </tr>
                `;

                _d.forEach(row => {
                    _tbody += `
                        <tr>
                            <td>${that._nullData(row.datetimeStr)}</td>
                            <td>${that._nullData(row.serialNumber)}</td>
                            <td>${that._nullData(row.voucherGroupData)}</td>
                            <td>${that._nullData(row.voucherPeriodData)}</td>
                            <td>${that._nullData(row.audited)}</td>
                            <td>${that._nullData(row.posted)}</td>
                            <td>${that._nullData(row.summary)}</td>
                            <td>${that._nullData(row.relateSubjectName)}</td>
                            <td>${that.formartMoney(row.debitAmountFor)}</td>
                            <td>${that.formartMoney(row.debitAmount)}</td>
                            <td>${that.formartMoney(row.creditAmountFor)}</td>
                            <td>${that.formartMoney(row.creditAmount)}</td>
                            <td>${that.formartMoney(row.balanceFor)}</td>
                            <td>${that.formartMoney(row.balance)}</td>
                            <td>${that._nullData(row.handleName)}</td>
                            <td>${that._nullData(row.createName)}</td>
                            <td>${that._nullData(row.dataSource)}</td>
                            <td>${that._nullData(row.remark)}</td>
                        </tr>
                    `;
                });

                let data = {
                    title: "现金日记账",
                    template: 12,
                    'titleInfo': [       // title
                        { 'name': '科目', 'val': that.baseData.subjectName },
                        { 'name': '币别', 'val': that.baseData.currencyName }
                    ],
                    'data': [],
                    'colMaxLenght': 10,
                    'tbodyInfo': {
                        'theadTX': _thead,
                        'tbodyTX': _tbody,
                        'tfootTX': _tfoot
                    }

                }
                htPrint(data);
            }
        },
        _nullData (_t) {
            if (_t) {
                return _t;
            } else {
                return '';
            }
        },
        formartMoney(value){
            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, "");
        },
        printModalShow (_t) {
            this.printModal = _t;
        },
        setTableHeader () {
            if (this.baseData.standardCurrencyId === this.openData.currencyId) {
                this.colNames = ['id', '日期', '当日序号', '凭证字号', '凭证期间', '凭证审核', '过账标志', '摘要',
                    '对方科目', '借方金额', '贷方金额', '余额', '经手人', '制单人', '数据来源', '备注', 'voucherId', 'sobId'];
                this.colModel = [
                    { name: 'id', width: 30, hidden: true },
                    { name: 'datetimeStr', width: 100 },
                    {
                        name: 'serialNumber', width: 100, formatter: function (value, options, rowData) {
                            if (value != null && value != 0) {
                                return value;
                            } else {
                                return '';
                            }
                        }
                    },
                    { name: 'voucherGroupData', width: 100, },
                    { name: 'voucherPeriodData', width: 100 },
                    {
                        name: 'audited', width: 100, align: 'center', formatter: function (value, options, rowData) {
                            let icon = '<i class="ivu-icon ivu-icon-checkmark-round"></i>';
                            if (value == 1) {
                                return icon;
                            } else {
                                return '';
                            }
                        }
                    },
                    {
                        name: 'posted', width: 100, align: 'center', formatter: function (value, options, rowData) {
                            let icon = '<i class="ivu-icon ivu-icon-checkmark-round"></i>';
                            if (value == 1) {
                                return icon;
                            } else {
                                return '';
                            }
                        }
                    },
                    { name: 'summary', width: 120, },
                    {
                        name: 'relateSubjectName', width: 150, formatter: function (value, options, rowData) {
                            if (value != null && value != 0) {
                                return value;
                            } else {
                                return '';
                            }
                        }
                    },
                    {
                        name: 'debitAmount', width: 100, align:'right', formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    {
                        name: 'creditAmount', width: 100, align:'right', formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    {
                        name: 'balance', width: 100, align:'right', formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' :accounting.formatNumber(value, 2, ",");
                        }
                    },
                    { name: 'handleName', width: 90, },
                    { name: 'createName', width: 90, },
                    {
                        name: 'dataSource', width: 150, formatter: function (value, options, rowData) {
                            if (value == 1) {
                                return '总账引入';
                            } else if (value == 2) {
                                return '手工录入';
                            } else if (value == 3) {
                                return 'Excel导入';
                            } else {
                                return '';
                            }
                        }
                    },
                    { name: 'remark', width: 90, },
                    { name: 'voucherId', hidden: true },
                    { name: 'sobId', hidden: true },
                ];
                this.tableHeaders = [];
            } else {
                this.colNames = ['id', '日期', '当日序号', '凭证字号', '凭证期间', '凭证审核', '过账标志', '摘要', '对方科目',
                    '原币', '本位币', '原币', '本位币', '原币', '本位币', '经手人', '制单人', '数据来源', '备注', 'voucherId', 'sobId'];
                this.colModel = [
                    { name: 'id', width: 30, hidden: true },
                    { name: 'datetimeStr', width: 100 },
                    {
                        name: 'serialNumber', width: 100, formatter: function (value, options, rowData) {
                            if (value != null && value != 0) {
                                return value;
                            } else {
                                return '';
                            }
                        }
                    },
                    { name: 'voucherGroupData', width: 100, },
                    { name: 'voucherPeriodData', width: 100 },
                    {
                        name: 'audited', width: 100, align: 'center', formatter: function (value, options, rowData) {
                            let icon = '<i class="ivu-icon ivu-icon-checkmark-round"></i>';
                            if (value == 1) {
                                return icon;
                            } else {
                                return '';
                            }
                        }
                    },
                    {
                        name: 'posted', width: 100, align: 'center', formatter: function (value, options, rowData) {
                            let icon = '<i class="ivu-icon ivu-icon-checkmark-round"></i>';
                            if (value == 1) {
                                return icon;
                            } else {
                                return '';
                            }
                        }
                    },
                    { name: 'summary', width: 120, },
                    {
                        name: 'relateSubjectName', width: 150, formatter: function (value, options, rowData) {
                            if (value != null && value != 0) {
                                return value;
                            } else {
                                return '';
                            }
                        }
                    },
                    {
                        name: 'debitAmountFor', width: 100, align:'right', formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    {
                        name: 'debitAmount', width: 100, align:'right', formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    {
                        name: 'creditAmountFor', width: 100, align:'right', formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    {
                        name: 'creditAmount', width: 100, align:'right', formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    {
                        name: 'balanceFor', width: 100, align:'right', formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    {
                        name: 'balance', width: 100, align:'right', formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    { name: 'handleName', width: 90, },
                    { name: 'createName', width: 90, },
                    {
                        name: 'dataSource', width: 150, formatter: function (value, options, rowData) {
                            if (value == 1) {
                                return '总账引入';
                            } else if (value == 2) {
                                return '手工录入';
                            } else if (value == 3) {
                                return 'Excel导入';
                            } else {
                                return '';
                            }
                        }
                    },
                    { name: 'remark', width: 90, },
                    { name: 'voucherId', hidden: true },
                    { name: 'sobId', hidden: true },
                ];
                this.tableHeaders = [
                    { startColumnName: 'debitAmountFor', numberOfColumns: 2, titleText: '借方金额' },
                    { startColumnName: 'creditAmountFor', numberOfColumns: 2, titleText: '贷方金额' },
                    { startColumnName: 'balanceFor', numberOfColumns: 2, titleText: '余额' }
                ];
            }
            this.jqGridInit(this.colNames, this.colModel, this.tableHeaders);
        },
        showVoucher (_bool) {
            this.showVoucherVisible = _bool;
        },
        delTable () {
            $("#grid").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="grid"></table><div id="page"></div>`).appendTo(parent);
        },
        // 生成jqGrid
        jqGridInit (colNames, colModel, headers) {
            let _vm = this;
            let config = Object.assign({}, this.base_config, {
                colNames: colNames,
                colModel: colModel,
                postData: JSON.stringify(_vm.openData),
                // loadComplete: function () {
                //
                // },
                loadComplete: function (ret) {
                    console.log(ret)
                    if(ret!=null && ret.data!=null && ret.data.resultVo!=null){
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
                    if (ret.code == '100100') {
                        _vm.baseData.subjectName = ret.data.subjectName;
                        _vm.baseData.currencyName = ret.data.currencyName;
                        _vm.baseData.periodDate = ret.data.queryPeriod;
                    }else{
                        _vm.$Modal.info({
                            title:'提示',
                            content:ret==null||ret.msg==null||ret.msg==''?'页面初始化失败':ret.msg
                        })
                    }
                }
            });
            jQuery("#grid").jqGrid(config);
        },
        open () {
            this.filterVisible = true;
        },
        refresh () {
            window.top.home.loading('show');
            this.showVoucherVisibleClose();
            // this.initMethod();
        },
        exitPrevent () {
            window.parent.closeCurrentTab({ name: '现金日记账', openTime: this.openTime, exit: true })
        },
        addFun () {
            Object.assign(this.editData, this.addData);
            this.bookDateChange (this.openData.endDate);
            this.editTitle = "现金日记账 - 新增";
            this.editVisible = true;
        },
        editFun () {
            //获取选中日记账数据
            let _vm = this;
            Object.assign(_vm.editData, _vm.addData);
            let arrId = _vm.selected.filter(row => !!row);
            let ids = _vm.filterCashierId(arrId);
            if (ids.length != 1) {
                _vm.$Message.error('请选择一条日记账')
                return;
            }

            $.ajax({
                type: 'post',
                url: contextPath + "/cashier/info",
                data: { 'id': arrId[0] },
                dataType: 'json',
                success: function (result) {
                    console.log(result)
                    if (result.code == '100100') {
                        _vm.editTitle = "现金日记账 - 编辑";
                        _vm.editVisible = true;
                        let cash = result.data.cashJournal;
                        let opts = result.data.opts;
                        _vm.editData.id = cash.id;
                        _vm.editData.sobId = cash.sobId;
                        _vm.editData.subjectId = cash.subjectId;
                        _vm.editData.currencyId = cash.currencyId;
                        _vm.editData.datetime = (new Date(cash.datetime)).format('yyyy-MM-dd');
                        _vm.editData.periodDate = cash.accountYear + '年' + cash.accountPeriod + '期'
                        _vm.editData.serialNumber = cash.serialNumber;
                        _vm.editData.debitAmount = cash.debitAmount==0?'':cash.debitAmount;
                        _vm.editData.debitAmountFor = cash.debitAmountFor==0?'':cash.debitAmountFor;
                        _vm.editData.debitAmountForRate = cash.exchangeRate;
                        _vm.editData.creditAmount = cash.creditAmount==0?'':cash.creditAmount;
                        _vm.editData.creditAmountFor = cash.creditAmountFor==0?'':cash.creditAmountFor;
                        _vm.editData.creditAmountForRate = cash.exchangeRate;
                        _vm.editData.remark = cash.remark;
                        _vm.editData.relativeSubjectId = cash.relativeSubjectId;
                        _vm.editData.exchangeRate = cash.exchangeRate;
                        _vm.editData.accountYear = cash.accountYear;
                        _vm.editData.accountPeriod = cash.accountPeriod;
                        _vm.editData.handleId = cash.handleId;
                        _vm.editData.handleName = cash.handleName;
                        _vm.editData.isProject = cash.isProject;
                        _vm.editData.isCarryOver = cash.isCarryOver;
                        _vm.editData.dataSource = cash.dataSource;
                        _vm.editData.summary = cash.summary;
                        _vm.editData.relativeSubjectCode = cash.relativeSubjectCode || '';
                        _vm.editData.relativeSubjectName = cash.relativeSubjectName || '';
                        _vm.optsVal = opts || {};
                        _vm.addSubjectListOptClose();
                    } else {
                        _vm.$Modal.error({
                            title:'错误',
                            content:result==null||result.msg==null||result.msg==''?'数据请求异常':result.msg
                        })
                    }
                }
            })
        },
        importFun () {
            this.importVisible = true;
        },
        deleteCashierRecord(){
            let _vm = this;
            let arr = _vm.selected;
            if(arr == null || arr.length == 0){
                _vm.$Message.error('请选择一条日记账')
                return;
            }

            let ids = _vm.filterCashierId(arr);

            $.ajax({
                type: 'post',
                url: contextPath+"/cashier/deleteDailyAccount",
                data: { 'ids': ids },
                success: function (ret) {
                    if(ret.code == '100100'){
                        _vm.voucherModelTxt = ret.data.resultData;
                        var _t = '报告内容：';
                        /*json.data.log.forEach((_item) => {
                            _t += `${_item} , `;
                        });*/
                        _vm.viewReportTxt = ret.data.detailResult;
                        _vm.showVoucher(true)
                        _vm.isContinue = false;
                        // _vm.showVoucherVisibleClose();
                        // _vm.refresh();
                    }else{
                        _vm.$Modal.error({
                            title:'错误',
                            content:ret==null||ret.msg==null||ret.msg==''?'数据请求异常':ret.msg
                        })
                    }
                }
            })

        },
        creatVoucher () {
            this.voucherVisible = true;
        },
        openSave () {
            // this.initMethod();
            // this.selected = [];
            this.showVoucherVisibleClose();
        },
        editSave () {
            let _vm = this;
            let data = _vm.editData;
            if (data.serialNumber == null || data.serialNumber == 0) {
                _vm.$Message.error('当日序号不能小于1')
                return;
            }
            if (data.summary == null || data.summary == '') {
                _vm.$Message.error('摘要不能为空')
                return;
            }

            if (!data.debitAmountFor && !data.creditAmountFor) {
                _vm.$Message.error('请输入借方金额或贷方金额')
                return;
            }

            let debit = data.debitAmountFor&&parseFloat(data.debitAmountFor);
            let credit = data.creditAmountFor&&parseFloat(data.creditAmountFor);

            if (!!debit && !!credit) {
                _vm.$Message.error('不能同时输入借方金额和贷方金额')
                return;
            }
						if(_vm.handManList != null && _vm.handManList.length != 0){
							$.each(_vm.handManList, function (idx, ele) {
									if (ele.name == data.handleId) {
											data.handleName = ele.value;
									}
							});
							
						}
            
            let param = { 'cashJournal': data, 'opts': _vm.optsVal };
            console.log(param)

            $.ajax({
                type: 'post',
                url: contextPath + "/cashier/saveOrUpdate",
                data: JSON.stringify(param),
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: function (result) {
                    if (result.code == '100100') {
                        _vm.$Modal.success({
                            title:'成功',
                            content:'操作成功'
                        })
                        _vm.editVisible = false;
                        _vm.showVoucherVisibleClose();
                        // _vm.initMethod();
                    } else {
                        _vm.$Modal.error({
                            title:'错误',
                            content:result==null||result.msg==null||result.msg==''?'数据请求异常':result.msg
                        })
                    }
                },
                error:function(ret){
                    _vm.$Modal.error({
                        title:'错误',
                        content:'系统异常，请退出重试'
                    })
                }
            })
        },
        importSave () {
            let _vm = this;
            console.log(_vm.importData);
            $.ajax({
                type: 'post',
                url: contextPath + "/cashier/importCashierJournal",
                data: JSON.stringify(_vm.importData),
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: function (result) {
                    if (result.code == '100100') {
                        _vm.$Modal.success({
                            title:'成功',
                            content:'操作成功'
                        })
                        _vm.importSelected = [];
                        _vm.importData.importId = [];
                        _vm.importVisible = false;
                        // _vm.initMethod();
                        _vm.showVoucherVisibleClose();
                    } else {
                        _vm.$Modal.error({
                            title:'错误',
                            content:result==null||result.msg==null||result.msg==''?'系统异常':result.msg
                        })
                    }
                }
            })
        },
        //查询凭证选项
        _queryObject: function () {
            var that = this;
            var _url = baseURL + 'generatingCredentialOption/getCredentialOption';
            let _formData = new FormData();
            _formData.append("ownershipSystem", 31);
            http.post(_url, _formData).then((json) => {
                if (json.code === '100100') {
                    that.voucherFilter = json.data;
                }
            }, (json) => { })
        },
        //更新生成凭证选项
        voucherSave () {
            var that = this;
            console.log(that.voucherFilter, '===that.voucherFilter');
            var _url = baseURL + 'generatingCredentialOption/update';
            let _formData = new FormData();
            _formData.append("voucherWordId", parseInt(that.voucherFilter.voucherWordId));
            _formData.append("abnormalDataProcessing", parseInt(that.voucherFilter.abnormalDataProcessing));
            _formData.append("subjectMergerDebit", that.voucherFilter.subjectMergerDebit);
            _formData.append("subjectMergerLender", that.voucherFilter.subjectMergerLender);
            _formData.append("ownershipSystem", 31);//出纳系统
            http.post(_url, _formData).then((json) => {
                if (json.code === '100100') {
                    // that.dataList = json.data;
                    that.cancel('voucher');
                }
                that.$Message.info({
                    content: json.msg,
                    duration: 3
                });

            }, (json) => { })
            this.voucherVisible = false;
        },
        filterCashierId(ids){
            var parame = ids.filter(function (item, index, array) {
                //元素值，元素的索引，原数组。
                return (item!='' && item != '0' && item != 'null');
            });
            return parame;
        },
        //根据type的值不同分为按单,汇总,查看,删除凭证
        selectRowAction (type) {
            console.log("type", type);
            var that = this;
            var _url = '';
            // var _ids = [3];
            var _parame = that.selected; //无论是按单还是汇总，参数都为集合，装id
            console.log("选中的id数组为====>>", _parame);
            var parame = _parame.filter(function (item, index, array) {
                //元素值，元素的索引，原数组。
                return (item != '0' && item != 'null');
            });
            if(parame.length === 0){
                that.$Message.info({
                    content: "请选择至少一条单据",
                    duration: 3
                });
                return;
            }
            console.log("id数组为====>>", parame);
            if (type === 'according') {
                //按单生成凭证
                that._ajaxAccording(parame);
            } else if (type === 'summary') {
                //汇总生成凭证
                _url = baseURL + 'cashier/setPoolVoucher';
                $.ajax({
                    type: 'post',
                    async: false,
                    url: _url,
                    data: { 'ids': parame },
                    success: function (json) {
                        var _text = '';
                        if (json.code === '100100') {
                            //跳转到编辑凭证页面
                            if (json.data.gcoe.abnormalDataProcessing === '1') {

                                var _h = `${contextPath}/finance/voucher-lrt/index.html?key=${json.data.key}&sys=31&type=3`;
                                var _p = {
                                    'name': '查看凭证',
                                    'url': _h
                                }
                                window.parent.activeEvent(_p);
                            }
                            _text = json.msg;
                        } else {
                            _text = json.msg;
                        }
                        that.refresh ();
                        that.$Message.info({
                            content: _text,
                            duration: 3
                        });
                    }
                });
            } else if (type === 'voucher') {
                //查看凭证
                console.log("that.parame", parame);
                if (parame.length === 0) {
                    that.$Message.info({
                        content: '请选择一个单据。',
                        duration: 3
                    });
                    return;
                };
                //获取到最后一个id
                var id = parame[parame.length - 1];
                var _d = '';
                for (var i = 0; i < that.tableList.length; i++) {
                    if (that.tableList[i].id == id) {
                        _d = that.tableList[i];
                        break;
                    }
                }
                console.log("_d", _d);
                console.log("_d", _d.voucherId);
                if (_d.voucherGroupData === '' || typeof _d.voucherId === undefined) {
                    that.$Message.info({
                        content: '最后选取的单据暂未生成凭证。',
                        duration: 3
                    });
                    return;
                }
                console.log("parame", parame);

                var _h = `${contextPath}/finance/voucher-lrt/index.html?voucherId=${_d.voucherId}&sobId=${_d.sobId}`;
                var _p = {
                    'name': '查看凭证',
                    'url': _h
                }
                window.parent.activeEvent(_p);
                //删除凭证
            } else if (type === 'delete') {
                //获取选中的id
                parame
                //声明数组 存放voucherId
                var _voucherIds = [];
                for (var i = 0; i < that.tableList.length; i++) {
                    for (var j = 0; j < parame.length; j++) {
                        if (that.tableList[i].id === parame[j]) {
                            _voucherIds.push(that.tableList[i].voucherId);
                        }
                    }
                }
                console.log("_voucherId", _voucherIds);
                var _result = [], i, j, len = _voucherIds.length;
                for (i = 0; i < len; i++) {
                    for (j = i + 1; j < len; j++) {
                        if (_voucherIds[i] === _voucherIds[j]) {
                            j = ++i;
                        }
                    }
                    _result.push(_voucherIds[i]);
                }
                console.log("_result", _result);
                _url = baseURL + 'voucherController/deleteMechanismVoucherBatch'
                $.ajax({
                    type: 'post',
                    async: false,
                    url: _url,
                    data: { 'sobId': 1, 'ids': _result },
                    success: function (json) {
                        var _text = '';
                        if (json.code === '100100') {
                            that.showVoucher(true);
                            that.voucherModelTxt = json.data.resultData;
                            that.viewReportTxt = json.data.detailResult;
                        } else {
                            _text = json.msg;
                            that.$Message.info({
                                content: _text,
                                duration: 3
                            });
                        }

                    }
                });
            }
        },
        //按单生成凭证
        _ajaxAccording (parame) {
            var that = this;
            var _url = baseURL + 'cashier/setGeneratingCertificate';
            console.log("parame", parame);
            $.ajax({
                type: 'post',
                async: false,
                url: _url,
                data: { 'ids': parame },

                success: function (json) {
                    if (json.code === '100100') {
                        console.log('按单生成凭证成功！')
                        if (json.data.gcoe.abnormalDataProcessing === '1') {
                            //编辑凭证
                            var _h = `${contextPath}/finance/voucher-lrt/index.html?key=${json.data.key}&sys=31&type=3`;
                            var _p = {
                                'name': '查看凭证',
                                'url': _h
                            }
                            window.parent.activeEvent(_p);
                            that.refresh ();
                            return;
                        } else if (json.data.gcoe.abnormalDataProcessing === '2') {
                            that.showVoucher(true);
                            //跳过该凭证
                        } else if (json.data.gcoe.abnormalDataProcessing === '3') {
                            //停止生成凭证
                            that.showVoucher(true);
                            that.isContinue = false;
                        }
                        console.log("json.data.vses.length",json.data.vses)
                        that.voucherModelTxt = json.data.vses.length === parame.length ? '生成凭证成功！' : '生成凭证失败！';
                        var _t = '报告内容：';
                        // json.data.log.forEach((_item) => {
                        //     _t += `${_item} , `;
                        // });
                        that.viewReportTxt = json.data.log;
                    } else {
                        that.$Message.info({
                            content: json.msg,
                            duration: 3
                        });
                    }
                }
            })
        },
        accordingAction () {
            var that = this;
            that.showVoucher(false);
            that.showVoucherVisibleClose();
            // that.initMethod();
        },
        save (type) {
            switch (type) {
                case 'open':
                    this.openSave();
                    break;
                case 'edit':
                    this.editSave();
                    break;
                case 'import':
                    this.importSave();
                    break;
                case 'voucher':
                    this.voucherSave();
                    break;
                default:
                    break;
            }

        },
        cancel (type) {
            switch (type) {
                case 'open':
                    this.filterVisible = false;
                    break;
                case 'edit':
                    this.editVisible = false;
                    break;
                case 'import':
                    this.importVisible = false;
                    break;
                case 'voucher':
                    this.voucherVisible = false;
                    break;
                default:
                    break;
            }
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
            console.log(treeNode, '====treeNode');
            var that = this;
            switch (that.subjectTpye) {
                case 1:
                    that.openData.relateSubjectId = treeNode.id;
                    that.openData.subjectCode = treeNode.subjectCode;
                    that.openData.subjectName = treeNode.subjectName;
                    break;
                case 2:
                    that.editData.relativeSubjectId = treeNode.id;
                    that.editData.relativeSubjectCode = treeNode.subjectCode;
                    that.editData.relativeSubjectName = treeNode.subjectName;
                    // that.editData.relativeSubjectValue = `${treeNode.subjectCode}  ${treeNode.subjectName}`;
                    that.editData.relativeSubjectValue = `${treeNode.subjectCode}  ${treeNode.fullName}`;
                    var _url = contextPath + '/voucherController/getListBySubjectId';
                    $.ajax({
                        type: 'POST',
                        data: { id: that.editData.relativeSubjectId },
                        url: _url,
                        success: function (result) {
                            if (result.code != '100100') {
                                that.$Modal.error({
                                    title:'错误',
                                    content:'页面初始化失败'
                                })
                                return;
                            }
                            that.addSubjectListOpt = result.data.opts;

                            if (result.data.opts.length) {
                                var _arr = {};
                                $.each(result.data.opts, function (key, val) {
                                    _arr[val] = '';
                                });
                                that.optsVal = _arr;
                                that.addSubjectListOptShow = true;
                            }
                        },
                        error: function (code) {
                            console.log(code);
                        }
                    });
                    break;
            }
            this.subjectClose();
        },
        importInit () {
            let that = this;
            jQuery("#importGrid").jqGrid(
                {
                    multiselect: true,
                    datatype: "local",
                    colNames: ['id', '科目'],
                    colModel: [
                        { name: 'id', width: 70, align: "center", sortable: false, key: true, hidden: true },
                        {
                            name: 'name', width: 250, align: "left", sortable: false,
                            // formatter: function (value, grid, rows, state) {
                            //     $(document).off("click",".detaila"+rows.id).on("click",".detaila"+rows.id,function(){
                            //         that.detailClick(rows)
                            //     });
                            //     let div =`<a class="detaila${rows.id} ht-link">${rows.subjectCode}</a>`;
                            //     return div
                            // }
                        },
                    ],
                    rownumbers: true,
                    rowNum: 999999999,//一页显示多少条
                    styleUI: 'Bootstrap',
                    height: 210,
                    onSelectAll: function (data, status) { // 且点击头部的checkbox时才会触发此事件
                        that.handlerId(data, status, "importSelected");
                        // that.getListId(that.importSelected, that.importData.importId, that.importTableList)
                        that.getImportId()
                    },
                    onSelectRow: function (data, status) { // 当选择行时触发此事件
                        if (!!data) {
                            that.handlerId(data, status, "importSelected");
                            // that.getListId(that.importSelected, that.importData.importId, that.importTableList)
                            that.getImportId()
                        }
                    },
                })
            for (var i = 0; i <= that.importTableList.length; i++) {
                jQuery("#importGrid").jqGrid('addRowData', i + 1, that.importTableList[i]);
            }
        },
        handlerId (data, status, type) {
            let _vm = this;
            if (typeof data === 'object' && status) {
                _vm[type] = data.filter(row=>{
                    if (row !='null' && row !='0'){
                        return row;
                    }
                });
            }
            if (typeof data === 'object' && !status) {
                _vm[type] = [];
            }
            if (typeof data === 'string') {
                if (status) {
                    let flag = (data !='null' && data !='0');
                    if (flag){
                        (_vm[type].indexOf(data.toString()) > -1) ? null : _vm[type].push(data.toString());
                    }
                } else {
                    let index = _vm[type].indexOf(data.toString());
                    index > -1 ? _vm[type].splice(index, 1) : null;
                }
            }
        },
        // oldArr ---旧数组(rowid),newArr---新数组（id）,rootArr---来源数组
        // getListId (oldArr, newArr, rootArr) {
        //     newArr = [];
        //     oldArr.map(item => {
        //         newArr.push(rootArr[item - 1].id)
        //     })
        //     console.log(newArr,'==========newArr')
        // },
        getImportId () {
            this.importData.importId = [];
            this.importSelected.map(item => {
                this.importData.importId.push(this.importTableList[item - 1].id)
                console.log(item+"---item")
            });
            console.log(this.importData.importId)
        },
        openAddSubject () {
            console.log(this.addSubjectListOpt, '====this.addSubjectListOpt')
            this.addSubjectListOptShow = true;
        },
        addSubjectEnterd () {
            let that = this;
            // 9901 9902
            var _url = contextPath + '/cashier/getSubjectInfoByCode';
            $.ajax({
                type: 'POST',
                data: { 'code': that.editData.relativeSubjectValue },
                url: _url,
                success: function (result) {
                    if (result.code != '100100') {
                        that.$Modal.error({
                            title:'错误',
                            content:'页面初始化失败'
                        })
                        return;
                    }
                    if (!result.data.subjectId) {
                        that.$Modal.error({
                            title:'错误',
                            content:'查询无数据'
                        })
                        return;
                    }
                    that.editData.relativeSubjectId = result.data.subjectId;
                    that.editData.relativeSubjectCode = result.data.subjectCode;
                    that.editData.relativeSubjectName = result.data.subjectName;
                    // that.editData.relativeSubjectValue = `${result.data.subjectCode} ${result.data.subjectName}`;

                    that.addSubjectListOpt = result.data.opts;
                    if (result.data.opts.length) {
                        var _arr = {};
                        $.each(result.data.opts, function (key, val) {
                            _arr[val] = '';
                        });
                        that.optsVal = _arr;
                        that.addSubjectListOptShow = true;
                    }
                },
                error: function (code) {
                    console.log(code);
                }
            });
        },
        addSubjectListOptClose () {
            var that = this;
            var _t = ``;
            console.log(that.optsVal, '===that.optsVal');
            $.each(that.optsVal, function (key, val) {
                if (val === '' || val === undefined) return;
                var _info = that.subjectOpts[key];
                var _f = _info.list[val]
                _t += `${_info.label}:${_f.code}-${_f.name};`;
            });
            _t !== '' && (_t = `/${_t}`)
            that.editData.relativeSubjectValue = `${that.editData.relativeSubjectCode} ${that.editData.relativeSubjectName}${_t}`;
        },

        addSubjectFocus () {
            var that = this;
            that.editData.relativeSubjectValue = that.editData.relativeSubjectCode;
        },
        addSubjectBlur () {
            var that = this;
            // that.editData.relativeSubjectValue = `${that.editData.relativeSubjectCode} ${that.editData.relativeSubjectName}`;
            if(that.editData.relativeSubjectValue == null || that.editData.relativeSubjectValue == ''){
                that.editData.relativeSubjectCode = '';
                that.editData.relativeSubjectName = '';
                that.optsVal = {};
                that.editData.relativeSubjectValue = '';
                that.editData.relativeSubjectId = '';
                return;
            }
            var _t = ``;
            $.each(that.optsVal, function (key, val) {
                if (val === '' || val === undefined) return;
                var _info = that.subjectOpts[key];
                var _f = _info.list[val]
                _t += `${_info.label}:${_f.code}-${_f.name};`;
            });
            _t !== '' && (_t = `/${_t}`)
            that.editData.relativeSubjectValue = `${that.editData.relativeSubjectCode} ${that.editData.relativeSubjectName}${_t}`;
        },
        selectOpt () {
                this.addSubjectListOptClose();
                this.addSubjectListOptShow = false;
        },
        exportExcel(){
            let data = vm.openData;
            let _url = contextPath+"/cashier/exportExcel?sobId="+data.sobId+"&subjectId="+data.subjectId+
                "&currencyId="+data.currencyId+"&startYear="+data.startYear+"&endYear="+data.endYear+
                "&startPeriod="+data.startPeriod+"&endPeriod="+data.endPeriod+"&startDate="+data.startDate+
                "&endDate="+data.endDate+"&voucherGroupId="+data.voucherGroupId+"&startVoucherGroupNumber="+data.startVoucherGroupNumber+
                "&endVoucherGroupNumber="+data.endVoucherGroupNumber+"&explains="+data.explains+"&relateSubjectId="+data.relateSubjectId+
                "&handleId="+data.handleId+"&prepareId="+data.prepareId+"&showInitBalance="+data.showInitBalance+
                "&showDetailRecord="+data.showDetailRecord+"&showDetailRecord="+data.showDetailRecord+
                "&showDaySum="+data.showDaySum+"&showPeriodSum="+data.showPeriodSum+"&showYearSum="+data.showYearSum+
                "&showTotalSum="+data.showTotalSum+"&type="+data.type+"&subjectName="+data.subjectName+"&currencyName="+data.currencyName;
            console.log(_url)
            window.open(_url);
        },

    },
    computed: {
        importTableList: function () {
            let arr = [];
            this.subjectList.forEach(row => {
                this.currencyList.forEach(item => {
                    let obj = {
                        id: `${row.accountId}-${item.id}`,
                        name: `${row.accountCode} ${row.accountName} - ${item.currencyName}`
                    }
                    arr.push(obj)
                })
            })
            return arr
        },
        addSubjectDisabled: function () {
            return this.addSubjectListOpt.length === 0
        },

    },
    watch: {
        'editData.debitAmountFor': function (curValue, oldVal) {
            // vm.editData.debitAmount = (formatNum(vm.editData.debitAmountFor, 3) * vm.editData.debitAmountForRate).toFixed(2);
            vm.editData.debitAmount = vm.formartMoney(vm.editData.debitAmountFor*vm.editData.debitAmountForRate);
        },
        'editData.creditAmountFor': function (curValue, oldVal) {
            // vm.editData.creditAmount = (formatNum(vm.editData.creditAmountFor, 3) * vm.editData.creditAmountForRate).toFixed(2);
            vm.editData.creditAmount = vm.formartMoney(vm.editData.creditAmountFor * vm.editData.creditAmountForRate);
        },
        'editData.debitAmountForRate': function (curValue, oldVal) {
            // vm.editData.debitAmount = (formatNum(vm.editData.debitAmountFor, 3) * vm.editData.debitAmountForRate).toFixed(2);
            vm.editData.debitAmount = vm.formartMoney(vm.editData.debitAmountFor * vm.editData.debitAmountForRate);
        },
        'editData.creditAmountForRate': function (curValue, oldVal) {
            // vm.editData.creditAmount = (formatNum(vm.editData.creditAmountFor, 3) * vm.editData.creditAmountForRate).toFixed(2);
            vm.editData.creditAmount = vm.formartMoney(vm.editData.creditAmountFor * vm.editData.creditAmountForRate);
        },
        'openData.currencyId': function (curValue, oldVal) {
            $.each(vm.currencyList, function (idx, ele) {
                if (curValue == ele.id) {
                    vm.openData.currencyName = ele.currencyName;
                }
            });
        }
    },
})