new Vue({
    el: '#cash-book',
    data () {
        return {
            formData: {
                bankName: '',
                bankAccount: '',
                fullSubjectName: '',
                currencyName: '',
                period: '',
                subjectId: "",
                currencyId: "",
                date: "",
                dateStr: "",
                type: "1",
                year: "",
                year2: "",
                month: "",
                openTime: ''
            },
            organisationList: [],
            filterVisible: true,
            base_config: {
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + "/app/bankAccount/bankReconciliation",
                colNames: ['id', '项目', '出纳管理系统', '总账系统', '差额'],
                colModel: [
                    { name: 'id', width: 30, hidden: true },
                    //{name: 'tab1', width: 70},
                    { name: 'name', width: 200 },
                    { name: 'bank', width: 200, align: "right" },
                    { name: 'ifnance', width: 200, align: "right" },
                    { name: 'difference', width: 200, align: "right" }
                ],
                // ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                datatype: 'json',
                //postData: this.formData,
                jsonReader: {
                    root: "data",
                    cell: "list",
                    repeatitems: false
                },
                height: $(window).height() - 140,
                viewrecords: true,
            },
            subjectList: [],
            currencyList: [],
            yearList: [],
            monthList: [],
            printModal: false,
            printInfo: {},
            dataList: []

        }
    },
    created () {
        var _vm = this;
        _vm.openTime = window.parent.params && window.parent.params.openTime;
        _vm.initData();
    },
    mounted () {
        this.jqGridInit();
    },
    methods: {
        initData () {  //银行科目
           let that = this;
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + '/app/bankAccount/initData',
                data: { isCash: 1 },
                success: function (result) {
                    if (result.data != null) {
                        that.organisationList = result.data.orgList;
                        that.formData.sobId = result.data.sobId;
                        that.subjectList = result.data.subject.data;
                        if(that.subjectList.length>0){
                            that.formData.subjectId = that.subjectList[0].accountId;
                            that.getCnCurrencyList(that.formData.subjectId);  //币别
                        }
                        that.yearList = result.data.systemProfile.yearList;
                        that.monthList = result.data.systemProfile.monthList;
                        var currentYear = result.data.systemProfile.currentYear;
                        var currentMonth = result.data.systemProfile.currentMonth;
                        that.formData.year = currentYear;  //设置当前会计年度
                        that.formData.year2 = currentYear;
                        that.formData.month = currentMonth;  //设置当前会计期间
                        that.formData.dateStr = that.getDefaultDay(currentYear, currentMonth);
                    }
                }
            });
        },
        getDefaultDay (year, month) { //获取默认日期
            var dt = new Date(year, month, 1);
            var cdt = new Date(dt.getTime() - 1000 * 60 * 60 * 24);
            return cdt.getFullYear() + "-" + (Number(cdt.getMonth()) + 1) + "-01";
        },
        getCnCurrencyList (subjectId) {
            let that = this;
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + '/cashierBalanceController/app/initCnCurrency',
                data: { accountId: subjectId, isCash: 1, status: 0 },
                success: function (result) {
                    that.currencyList = result.data;
                    if (that.currencyList.length>0) {
                        that.formData.currencyId = that.currencyList[0].currencyId;
                    }
                }
            });
        },
        // 生成jqGrid
        jqGridInit () {
            let that = this;
            jQuery("#grid").jqGrid({
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + "/app/bankAccount/bankReconciliation",
                colNames: ['id', '项目', '出纳管理系统', '总账系统', '差额'],
                colModel: [
                    { name: 'id', width: 30, hidden: true },
                    //{name: 'tab1', width: 70},
                    { name: 'name', width: 200 },
                    { name: 'bank', width: 200, align: "right" },
                    { name: 'ifnance', width: 200, align: "right" },
                    { name: 'difference', width: 200, align: "right" }
                ],
                // ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                datatype: 'json',
                //postData: this.formData,
                jsonReader: {
                    root: "data",
                    cell: "list",
                    repeatitems: false
                },
                height: $(window).height() - 140,
                viewrecords: true,
                loadComplete: function (ret) {
                    that.dataList = ret.data || [];
                }
            });
            /* let config = Object.assign({}, this.base_config, {
                 loadComplete: function () {
 
                 },
                 gridComplete: function () {
                 },
             });
             jQuery("#grid").jqGrid(config);*/
        },
        open () {
            this.filterVisible = true;
        },
        operateDate (date) {
            return new Date(date).format("yyyy-MM-dd");
        },
        refresh () {
            // $("#grid").jqGrid('clearGridData');  //清空表格
            $("#grid").jqGrid('setGridParam', { postData: this.formData }).trigger("reloadGrid");
        },
        save () {
            this.filterVisible = false;
            var length = this.subjectList.length;
            if (length > 0) {   //科目信息
                for (var i = 0; i < length; i++) {
                    if (this.subjectList[i].accountId == this.formData.subjectId) {
                        var obj = this.subjectList[i];
                        this.formData.bankName = obj.bankName;
                        this.formData.bankAccount = obj.bankAccount;
                        this.formData.fullSubjectName = obj.accountCode + ' ' + obj.accountName;
                        break;
                    }
                }
            }

            var length = this.currencyList.length;
            if (length > 0) {   //币别信息
                for (var i = 0; i < length; i++) {
                    if (this.currencyList[i].currencyId == this.formData.currencyId) {
                        var obj = this.currencyList[i];
                        this.formData.currencyName = obj.currencyName;
                        break;
                    }
                }
            }

            var type = this.formData.type;
            if (type == '1') {
                this.formData.period = this.formData.year + '年' + this.formData.month + "期";
                this.formData.date = this.formData.year + "-" + this.formData.month;
            }
            if (type == '2') {
                console.log(this.formData.dateStr);
                this.formData.period = this.operateDate(this.formData.dateStr);
                this.formData.date = this.operateDate(this.formData.dateStr);
            }
            if (type == '3') {
                this.formData.period = this.formData.year2 + '年';
                this.formData.date = this.formData.year2;
            }
            this.refresh();
        },
        cancel () {
            this.filterVisible = false;
        },
        exitPrevent () {
            window.parent.closeCurrentTab({ name: '银行存款与总账对账', openTime: this.openTime, exit: true })
        },
        exportExcel () {
            var formData = this.formData;
            window.open(contextPath + "/app/bankAccount/exportExcel?fullSubjectName=" + formData.fullSubjectName + "&bankName=" + formData.bankName + "&bankAccount=" + formData.bankAccount + "&currencyName=" + formData.currencyName + "&period=" + formData.period);
        },
        print () {  //打印
            let that = this;
            if (!that.dataList || !that.dataList.length) {
                that.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }
            //单行表头
            var _info = {
                'title': '银行存款与总账对账',  // 标题
                'template': 1,  // 模板
                'titleInfo': [       // title
                    { 'name': '科目', 'val': that.formData.fullSubjectName },
                    { 'name': '银行', 'val': that.formData.bankName },
                    { 'name': '账号', 'val': that.formData.bankAccount },
                    { 'name': '币别', 'val': that.formData.currencyName },
                    { 'name': '期间', 'val': that.formData.period }
                ],
                'colNames': [       // 列名与对应字段名
                    { 'name': '项目', 'col': 'name' },
                    { 'name': '出纳管理系统', 'col': 'bank' },
                    { 'name': '总账系统', 'col': 'ifnance' },
                    { 'name': '差额', 'col': 'difference' }
                ],
                'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                'colMaxLenght': 4,  // 显示最大长度， 默认为7
                'data': that.dataList,  // 打印数据  list
                'totalRow': false
            }
            // 弹窗选择列 模式
            that.printInfo = _info;
            that.printModalShow(true);
        },
        printModalShow (_t) {
            this.printModal = _t;
        },

    },
    computed: {
        currencyName () {
            let find = this.currencyList.find(row => {
                return row.value === this.formData.currencyId;
            })
            if (!find) return;
            return find.label;
        }
    }
})