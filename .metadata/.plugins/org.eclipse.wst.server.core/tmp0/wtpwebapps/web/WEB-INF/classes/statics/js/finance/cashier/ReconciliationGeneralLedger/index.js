var vm = new Vue({
    el: '#reconciliationGeneralLedger',
    data () {
        var that = this;
        return {
            openTime:'',
            yearList:[],
            monthList:[],
            subjectList:[],
            exportList:[
                {value:1,name:'出纳管理数据系统'},
                {value:2,name:'总账管理数据系统'}
           ],
            exportId:1,
            systemId:1, //系统Id 1:出纳系统数据，2:总账系统数据
            formData:{
                currentYear:'',
                currentMonth:'',
                currencyId:0,
                subjectId:0
            },
            queryData:{
                year:'',
                month:'',
                subjectId:0,
                currencyId:0,
                periodDate:''
            },
            titleData:{
                currencyName:'',
                fullSubjectName:'',
                dateStr:''
            },
            disabled:false,
            show:false,
            tableList: [],
            tableList2:[],
            printModal: false,
            printInfo: {},
            baseData: {
                standardCurrencyId: '',
                subjectName: '',
                currencyName: '',
                periodDate: ''
            },
            voucherFilter: {
                voucherWordId: 0,//凭证字id
                abnormalDataProcessing: '',//按单异常处理
                subjectMergerDebit: '', // 借方相同科目合并
                subjectMergerLender: '' //贷方相同科目合并
            },
            editData: {
                sobId: '',
                subjectId: '',
                subjectCode: '',
                subjectName: '',
                subjectValue: '',
                currencyId: '',
                datetime: '',
                periodDate: '',
                serialNumber: '',
                debitAmountFor: '',
                debitAmountForRate: '',
                creditAmountFor: '',
                creditAmountForRate: '',
                creditAmount: '',
                remark: '',
                relativeSubjectId: '',
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
                sobId: '',
                subjectId: '',
                currencyId: '',
                datetime: '',
                serialNumber: '',
                periodDate: '',
                debitAmountFor: '',
                debitAmountForRate: '',
                creditAmountFor: '',
                creditAmountForRate: '',
                creditAmount: '',
                remark: '',
                relativeSubjectId: '',
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
                type: "1",
                subjectName: '',
                currencyName: ''
            },
            importData: {
                startDate: "",
                endDate: "",
                voucherGroupId: "-1",
                startVoucherGroupNumber: "-1",
                endVoucherGroupNumber: "-1",
                audited: "-1",
                posted: "-1",
                preparerId: "",
                importId: []
            },
            filterVisible: false,
            editVisible: false,
            importVisible: false,
            exportVisible:false,
            base_config: {
                datatype: 'local',
                styleUI: 'Bootstrap',
                height: $(window).height() - 140,
                rowNum: 999999999
            },
            journalGeneralLedgerVOList:[],
            voucherEntryList:[],
            bankColNames: [],
            bankColModel: [],
            financeColNames: [],
            financeColModel: [],
            tableHeaders: [],
            organisationList: [
                { label: "金大祥", value: 1 },
            ],
            currencyList: [],
            //摘要列表
            voucherExpList: [],
            //凭证字列表
            voucherDataList: [],
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
            subjectTpye: "",
            selected: [],  // 获取列表列的勾选数组的rowId
            selectedId: [],   // 获取列表列的勾选数组的id
            importSelected: [], //获取引入弹框列表列的勾选数组的rowId
            addSubjectListOpt: [],
            addSubjectListOptShow: false,
            subjectOpts: {},
            optsVal: {

            },
            remarkVisable: false, // 摘要弹窗
            // 摘要列表
            remarklist: [],
            remarkType: 0,
            //经手人
            handManList: [],
            openMakerList: [],
            openHandleList: []

        }
    },
    created: function(){

    },
    mounted () {
        this.openTime = window.parent.params && window.parent.params.openTime;
        var subjectId =  parseInt(getUrlParam('subjectId'));
        var currencyId = parseInt(getUrlParam('currencyId'));
        var year =parseInt(getUrlParam('year'));
        var month =getUrlParam('month');
        this.initData(subjectId);
        this.formData.subjectId = subjectId;
        this.formData.currencyId = currencyId;
        this.queryData.subjectId =subjectId;
        this.queryData.currencyId =currencyId;
        this.formData.currentYear = year;
        this.formData.currentMonth = month;
        this.queryData.year = year;
        this.queryData.month = month;
        this.queryData.periodDate = year+'-'+month;
        this.titleParams();
        this.initMethod();
    },
    methods: {
        initData(subjectId){  //初始化过滤条件
            let that = this;
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath+'/app/bankAccount/initData',
                success: function (result) {
                    var data = result.data;
                    if (data!= null) {
                        that.yearList = data.systemProfile.yearList;
                        that.monthList = data.systemProfile.monthList;
                        that.formData.currentYear = data.systemProfile.currentYear;
                        that.formData.currentMonth = data.systemProfile.currentMonth;
                        that.subjectList= data.subject.data;
                    }
                }
            });
            that.currency(subjectId); //币种
            that.subjectList.splice(0,0,{"accountId":0, "accountName": "(所有科目)"});
        },
        currency(subjectId){ //币种
            let that = this;
            that.currencyList = [];
            if(subjectId==0){
                that.currencyList.splice(0,0,{"currencyId":0, "currencyName": "(所有币别)"});
                that.formData.currencyId = 0;
                that.disabled = true;
                return;
            }
            $.ajax({
                type: 'post',
                async:false,
                url: contextPath+'/cashierBalanceController/app/initCnCurrency',
                data: {accountId:subjectId},
                success: function(result){
                    var data =result.data;
                    if(data!=null){
                        that.currencyList=data;
                    }
                }
            });
            if(that.currencyList.length>1){
                that.currencyList.splice(0,0,{"currencyId":0, "currencyName": "(所有币别)"});
                that.formData.currencyId = 0;
                that.disabled = false;
            }
            if(that.currencyList.length==1){
                that.formData.currencyId = that.currencyList[0].currencyId;
                that.disabled = false;
            }
        },
        titleParams(){
            //科目
            var obj = this.subjectList;
            if(obj!=null){
                for (var i = 0;i<obj.length;i++){
                    if(obj[i].accountId==this.queryData.subjectId){
                        if(typeof(obj[i].accountCode) == "undefined"){
                            this.titleData.fullSubjectName = obj[i].accountName;
                            break;
                        }
                        this.titleData.fullSubjectName = obj[i].accountCode+' '+obj[i].accountName;
                        break;
                    }
                }
            }
            //币别
            var currency = this.currencyList;
            if(currency!=null){
                for (var i = 0;i<currency.length;i++){
                    if(currency[i].currencyId==this.queryData.currencyId){
                        this.titleData.currencyName = currency[i].currencyName;
                        break;
                    }
                }
            }
            //期间
            this.titleData.dateStr = this.queryData.year+'年第'+this.queryData.month+'期';
        },
        currencyChange (item) {
            $.each(vm.currencyList, function (idx, ele) {
                if (item == ele.id) {
                    vm.editData.debitAmountForRate = ele.exchangeRate;
                    vm.editData.creditAmountForRate = ele.exchangeRate;
                }
            });
        },
        bookDateChange (item) {
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
                    } else {
                        vm.$Modal.error({
                            title:'提示信息',
                            scrollable:true,
                            content:"请求错误!",
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
            that.remarkType === 1 ? that.editData.for6 = remark.content : that.openData.explains = remark.content;
            that.remarkVisable = false;
        },
        onRemarkModalChange (val) {
            this.remarkVisable = val;
        },
        onRemarkListChange (val) {
            this.remarklist = val;
        },
        // 初始值
        initMethod () {
            this.delTable();
            this.jqGridData();
        },
        setTableHeader () {
            this.bankColNames = ['行序号','id', '凭证字号','日期','摘要','科目代码','科目名称','币别','对方科目','原币借方金额','原币贷方金额',
            '本位币借方金额','本位币贷方金额','勾对','制单人','数据来源','对账结果','备注','isCash'];
            this.bankColModel = [
                    { name: 'rowNum', width: 30, hidden: true,key:true, frozen: true },
                    { name: 'id', width: 30, hidden: true, frozen: true },
                    { name: 'voucherName', width: 100, frozen: true },
                    { name: 'voucherDate', width: 100},
                    { name: 'summary', width: 100 },
                    { name: 'subjectCode', width: 100},
                    { name: 'subjectName', width: 120},
                    { name: 'currencyName', width: 60},
                    { name: 'fullRelativeSubjectName', width: 120},
                    {
                        name: 'debitAmountFor', width: 100, formatter: function (value, options, rowData) {
                            return value == 0 ? '' : value;
                        }
                    },
                    {
                        name: 'creditAmountFor', width: 100, formatter: function (value, options, rowData) {
                            return value == 0 ? '' : value;
                        }
                    },
                    {
                        name: 'debitAmount', width: 100, formatter: function (value, options, rowData) {
                            return value == 0 ? '' : value;
                        }
                    },
                    {
                        name: 'creditAmount', width: 100, formatter: function (value, options, rowData) {
                            return value == 0 ? '' : value;
                        }
                    },
                    { name: 'tick', width: 50 },
                    { name: 'createName', width: 90 },
                    { name: 'dataSourceName', width: 80 },
                    { name: 'result', width: 90},
                    { name: 'remark', width: 90},
                    { name: 'isCash', width: 20,hidden:true}
                ];
            this.financeColNames = ['行序号','id', '凭证字号','日期','摘要','科目代码','科目名称','币别','原币借方金额','原币贷方金额',
                '本位币借方金额','本位币贷方金额','制单人','对账结果'];
            this.financeColModel = [
                { name: 'rowNum', width: 30, hidden: true,key:true, frozen: true },
                { name: 'id', width: 30, hidden: true, frozen: true },
                { name: 'voucherName', width: 100, frozen: true },
                { name: 'voucherDate', width: 100},
                { name: 'explains', width: 100 },
                { name: 'subjectCode', width: 100},
                { name: 'subjectName', width: 120},
                { name: 'currencyName', width: 60},
                {
                    name: 'debitAmountFor', width: 100, formatter: function (value, options, rowData) {
                        return value == 0 ? '' : value;
                    }
                },
                {
                    name: 'creditAmountFor', width: 100, formatter: function (value, options, rowData) {
                        return value == 0 ? '' : value;
                    }
                },
                {
                    name: 'debitAmount', width: 100, formatter: function (value, options, rowData) {
                        return value == 0 ? '' : value;
                    }
                },
                {
                    name: 'creditAmount', width: 100, formatter: function (value, options, rowData) {
                        return value == 0 ? '' : value;
                    }
                },
                { name: 'createName', width: 90 },
                { name: 'result', width: 90}
            ];
            this.jqGridBankInit(this.bankColNames,this.bankColModel);
            this.jqGridFinanceInit(this.financeColNames,this.financeColModel);
        },
        delTable () {
            $("#grid").empty();// 清空表格内容
            $("#grid2").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper"); // 获得整个表格容器
            var parent2 = $(".jqGrid_wrapper2"); // 获得整个表格容器
            parent.empty();
            parent2.empty();
            $(`<table id="grid"></table><div id="page"></div>`).appendTo(parent);
            $(`<table id="grid2"></table><div id="page2"></div>`).appendTo(parent2);
        },
        // 生成jqGrid
        jqGridBankInit (colNames, colModel) {
            let _vm = this;
            let config = Object.assign({}, this.base_config, {
                colNames: colNames,
                colModel: colModel,
               // caption :'出纳管理数据系统',
                data:_vm.journalGeneralLedgerVOList,
                loadComplete: function (ret) {
                    //获取表格所有行数据
                    let rows = jQuery("#grid").jqGrid('getRowData');
                    var allCountID = $("#grid").jqGrid('getDataIDs');
                    rows.push($("#grid").jqGrid('getRowData', allCountID[allCountID.length - 1]));
                    _vm.tableList = rows;
                },
                gridComplete:function(){
                  //  jQuery("#grid").jqGrid('setSelection', "1");  //默认选中第一行
                },
                onSelectRow: function (data, status) { // 当选择行时触发此事件
                    _vm.systemId = 1;
                    $("#grid").jqGrid("setCaption","<div style='text-align: center;font-size: 18px;font-weight: bold'>出纳管理数据系统</div>");
                    $("#grid2").jqGrid("setCaption","<div style='text-align: center;font-size: 18px;'>总账数据系统</div>");
                },
            });
            jQuery("#grid").jqGrid(config);
            jQuery("#grid").jqGrid("setCaption","<div style='text-align: center;font-size: 18px;'>出纳管理数据系统</div>");
            jQuery("#grid").jqGrid("setFrozenColumns");
           // jQuery("#grid").setSelection(1);
        },
        // 生成jqGrid
        jqGridFinanceInit (colNames, colModel) {
            let _vm = this;
            let config = Object.assign({}, this.base_config, {
                colNames: colNames,
                colModel: colModel,
               // caption :headers,
                data:_vm.voucherEntryList,
                loadComplete: function (ret) {
                    //获取表格所有行数据
                    let rows = jQuery("#grid2").jqGrid('getRowData');
                    var allCountID = $("#grid2").jqGrid('getDataIDs');
                    rows.push($("#grid2").jqGrid('getRowData', allCountID[allCountID.length - 1]));
                    _vm.tableList2 = rows;
                },
                onSelectRow: function (data, status) { // 当选择行时触发此事件
                    _vm.systemId = 2;
                    _vm.show =true;
                    $("#grid").jqGrid("setCaption","<div style='text-align: center;font-size: 18px;'>出纳管理数据系统</div>");
                    $("#grid2").jqGrid("setCaption","<div style='text-align: center;font-size: 18px;font-weight: bold'>总账数据系统</div>");
                },
            });
            jQuery("#grid2").jqGrid(config);
            jQuery("#grid2").jqGrid("setCaption","<div style='text-align: center;font-size: 18px;'>总账数据系统</div>");
            jQuery("#grid2").jqGrid("setFrozenColumns");
          //  $('#1').find("td").addClass("jqgrid-row-background-color");
        },
        jqGridData(){
            let  that = this;
            $.ajax({
                type: 'post',
                async: true,  //false 同步
                url: contextPath+'/app/journalGeneralLedger/accountDetailList',
                data:that.queryData,
                success: function (result) {
                    var data = result.data;
                    if (data!= null) {
                        that.journalGeneralLedgerVOList =data.journalGeneralLedgerVOList;
                        that.voucherEntryList = data.voucherEntryList;
                    }
                    that.setTableHeader();
                },
                error:function () {
                    that.setTableHeader();
                }
            });
           // jQuery("#grid").setGridParam({data: journalGeneralLedgerVOList}).trigger('reloadGrid');
           // jQuery("#grid2").setGridParam({data: voucherEntryList}).trigger('reloadGrid');
        },
        open () {
            this.filterVisible = true;
        },
        refresh () { //刷新
            this.initMethod();
            this.$Message.info('刷新数据完毕');
        },
        addFun () {
            var rowId =$('#grid').jqGrid('getGridParam','selrow');
            if (rowId==null) {
                this.$Message.info('请至少选择一行数据！');
                return;
            }
            console.log(rowId);
            var rowData = $('#grid').jqGrid('getRowData',rowId);
            console.log(rowData);
            this.editTitle = "现金日记账 - 新增";
            this.editVisible = true;
        },
        editFun () {
            this.editTitle = "现金日记账 - 编辑";
            this.editVisible = true;
        },
        openSave () {
            this.filterVisible = false;
            var year =this.formData.currentYear;
            var month =this.formData.currentMonth;
            this.queryData.year = year;
            this.queryData.month = month;
            this.queryData.subjectId = this.formData.subjectId;
            this.queryData.currencyId = this.formData.currencyId;
            this.queryData.periodDate = year+'-'+month;
            this.titleParams();
            this.initMethod();
        },
        exportExcel(){ //导出
            this.exportVisible=true;
        },
        exportData(){
            this.exportVisible=false;
            window.open(contextPath+"/app/journalGeneralLedger/exportExcelDetail?exportId="+this.exportId+"&subjectName="+this.titleData.fullSubjectName+"&currencyName="+this.titleData.currencyName+"&dateStr="+this.titleData.dateStr);
        },
        print() { //打印
            let that = this;
            that.printInfo={};
            //单行表头
            var  _info= {};
           if(that.systemId==1){
               if (!that.tableList || !that.tableList.length) {
                   that.$Message.info({
                       content: '无打印数据',
                       duration: 3
                   });
                   return;
              }
             _info = {
                    'title': '与总账对账_出纳管理系统数据',  // 标题
                    'template': 1,  // 模板
                    'titleInfo': [       // title
                        {'name': '科目', 'val': that.titleData.fullSubjectName},
                        {'name': '币别', 'val': that.titleData.currencyName},
                        {'name': '期间', 'val': that.titleData.dateStr}
                    ],
                    'colNames': [       // 列名与对应字段名
                        {'name': '凭证字号', 'col': 'voucherName'},
                        {'name': '日期', 'col': 'voucherDate'},
                        {'name': '摘要', 'col': 'summary'},
                        {'name': '科目代码', 'col': 'subjectCode'},
                        {'name': '科目名称', 'col': 'subjectName'},
                        {'name': '币别', 'col': 'currencyName'},
                        {'name': '对方科目', 'col': 'fullRelativeSubjectName'},
                        {'name': '原币借方金额', 'col': 'debitAmountFor'},
                        {'name': '原币贷方金额', 'col': 'creditAmountFor'},
                        {'name': '本位币借方金额', 'col': 'debitAmount'},
                        {'name': '本位币贷方金额', 'col': 'creditAmount'},
                        {'name': '勾对', 'col': 'tick'},
                        {'name': '制单人', 'col': 'createName'},
                        {'name': '数据来源', 'col': 'dataSourceName'},
                        {'name': '对账结果', 'col': 'result'},
                        {'name': '备注', 'col': 'remark'}
                    ],
                    'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                    'colMaxLenght': 16,  // 显示最大长度， 默认为7
                    'data': that.tableList,  // 打印数据  list
                    'totalRow': false
                }

              } else if(that.systemId==2){
                  if (!that.tableList2 || !that.tableList2.length) {
                      that.$Message.info({
                          content: '无打印数据',
                          duration: 3
                      });
                      return;
                  }
                   _info = {
                      'title': '与总账对账_总账系统数据',  // 标题
                      'template': 2,  // 模板
                      'titleInfo': [       // title
                          {'name': '科目', 'val': that.titleData.fullSubjectName},
                          {'name': '币别', 'val': that.titleData.currencyName},
                          {'name': '期间', 'val': that.titleData.dateStr}
                      ],
                      'colNames': [       // 列名与对应字段名
                          {'name': '凭证字号', 'col': 'voucherName'},
                          {'name': '日期', 'col': 'voucherDate'},
                          {'name': '摘要', 'col': 'explains'},
                          {'name': '科目代码', 'col': 'subjectCode'},
                          {'name': '科目名称', 'col': 'subjectName'},
                          {'name': '币别', 'col': 'currencyName'},
                          {'name': '原币借方金额', 'col': 'debitAmountFor'},
                          {'name': '原币贷方金额', 'col': 'creditAmountFor'},
                          {'name': '本位币借方金额', 'col': 'debitAmount'},
                          {'name': '本位币贷方金额', 'col': 'creditAmount'},
                          {'name': '制单人', 'col': 'createName'},
                          {'name': '对账结果', 'col': 'result'}
                      ],
                      'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                      'colMaxLenght': 13,  // 显示最大长度， 默认为7
                      'data': that.tableList2,  // 打印数据  list
                      'totalRow': false
                  }

              }

            // 弹窗选择列 模式
            that.printInfo = _info;
            that.printModalShow(true);
        },
        outHtml () { //退出
            window.parent.closeCurrentTab({ name: "与总账对账", openTime: this.openTime, exit: true })
        },
        printModalShow (_t) {
            this.printModal = _t;
        },
        editSave () {
            let _vm = this;
            let data = _vm.editData;
            if (data.serialNumber == null || data.serialNumber == 0) {
                _vm.$Message.error('当日序号不能小于1')
            }
            this.editVisible = false;
        },
        save (type) {
            switch (type) {
                case 'open':
                    this.openSave();
                    break;
                case 'edit':
                    this.editSave();
                    break;
                case 'export':
                    this.exportData();
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
                case 'export':
                    this.exportVisible = false;
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
                    that.editData.subjectId = treeNode.id;
                    that.editData.subjectCode = treeNode.subjectCode;
                    that.editData.subjectName = treeNode.subjectName;
                    that.editData.subjectValue = `${treeNode.subjectCode} ${treeNode.subjectName}`;
                    var _url = contextPath + '/voucherController/getListBySubjectId';
                    $.ajax({
                        type: 'POST',
                        data: { id: that.editData.subjectId },
                        url: _url,
                        success: function (result) {
                            if (result.code != '100100') {
                                let _msg = '页面初始化失败';
                                if (result.hasOwnProperty("data")){
                                    _msg  = result.msg;
                                }
                                vm.$Modal.error({
                                    title:'提示信息',
                                    scrollable:true,
                                    content:_msg,
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

        handlerId (data, status, type) {
            let _vm = this;
            if (typeof data === 'object' && status) {
                _vm[type] = data
            }
            if (typeof data === 'object' && !status) {
                _vm[type] = [];
            }
            if (typeof data === 'string') {
                if (status) {
                    (_vm[type].indexOf(data.toString()) > -1) ? null : _vm[type].push(data.toString());
                } else {
                    let index = _vm[type].indexOf(data.toString());
                    index > -1 ? _vm[type].splice(index, 1) : null;
                }
            }
            // console.log(_vm[type],type)
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
            });
        },
        openAddSubject () {
            console.log(this.addSubjectListOpt, '====this.addSubjectListOpt')
            this.addSubjectListOptShow = true;
        },
        addSubjectEnterd () {
            var that = this;
            // 9901 9902
            var _url = contextPath + '/cashier/getSubjectInfoByCode';
            $.ajax({
                type: 'POST',
                data: { 'code': that.editData.subjectValue },
                url: _url,
                success: function (result) {
                    if (result.code != '100100') {
                        let _msg = '页面初始化失败';
                        if (result.hasOwnProperty("data")){
                            _msg  = result.msg;
                        }
                        vm.$Modal.error({
                            title:'提示信息',
                            scrollable:true,
                            content:_msg,
                        })
                        return;
                    }
                    if (!result.data.subjectId) {
                        vm.$Modal.error({
                            title:'提示信息',
                            scrollable:true,
                            content:"查无此数据!",
                        })
                        return;
                    }
                    that.editData.subjectId = result.data.subjectId;
                    that.editData.subjectCode = result.data.subjectCode;
                    that.editData.subjectName = result.data.subjectName;
                    // that.editData.subjectValue = `${result.data.subjectCode} ${result.data.subjectName}`;

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
            $.each(that.optsVal, function (key, val) {
                if (val === '' || val === undefined) return;
                var _info = that.subjectOpts[key];
                var _f = _info.list[val]
                _t += `${_info.label}:${val}-${_f};`;
            });
            _t !== '' && (_t = `/${_t}`)
            that.editData.subjectValue = `${that.editData.subjectCode} ${that.editData.subjectName}${_t}`;
        },

        addSubjectFocus () {
            var that = this;
            that.editData.subjectValue = that.editData.subjectCode;
        },
        addSubjectBlur () {
            var that = this;
            // that.editData.subjectValue = `${that.editData.subjectCode} ${that.editData.subjectName}`;

            var _t = ``;
            $.each(that.optsVal, function (key, val) {
                if (val === '' || val === undefined) return;
                var _info = that.subjectOpts[key];
                var _f = _info.list[val]
                _t += `${_info.label}:${val}-${_f};`;
            });
            _t !== '' && (_t = `/${_t}`)
            that.editData.subjectValue = `${that.editData.subjectCode} ${that.editData.subjectName}${_t}`;
        },
        selectOpt () {

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
            console.log(123)
            vm.editData.debitAmount = vm.editData.debitAmountFor * vm.editData.debitAmountForRate;
        },
        'editData.creditAmountFor': function (curValue, oldVal) {
            vm.editData.creditAmount = vm.editData.creditAmountFor * vm.editData.creditAmountForRate;
        },
        'editData.debitAmountForRate': function (curValue, oldVal) {
            vm.editData.debitAmount = vm.editData.debitAmountFor * vm.editData.debitAmountForRate;
        },
        'editData.creditAmountForRate': function (curValue, oldVal) {
            vm.editData.creditAmount = vm.editData.creditAmountFor * vm.editData.creditAmountForRate;
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