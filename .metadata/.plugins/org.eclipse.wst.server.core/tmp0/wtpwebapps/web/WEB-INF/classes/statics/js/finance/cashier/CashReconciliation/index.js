var vm = new Vue({
    el: '#cash-book',
    data() {
        return {
            formData:{
                subjectName: '',
                currencyName: '',
                periodDate: '',
                sobId: '',
                subjectId: '',
                currencyId: "",
                type: '1',
                dateTime: "",
                startYear: "",
                startPeriod: ""
            },
            lodoPList:[],
            organisationList: [],
            filterVisible: false,
            openTime:'',
            base_config: {
                // multiselect : true,
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/cashier/reconciliationDetail',
                ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                datatype: 'json',
                colNames: ['项目', '出纳管理系统', '总账系统', '差额', '日期', '实存金额'],
                colModel: [
                    {name: 'projectName', width: 120},
                    {name: 'cashierMoney', width: 150, align: "right",formatter: function (value, options, rowData) {

                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},
                    {name: 'accountMoney', width: 150, align: "right",formatter: function (value, options, rowData) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},
                    {name: 'differenceMoney', width: 150, align: "right",formatter: function (value, options, rowData) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},
                    {name: 'sheetDate', width: 120,formatter: function (value, options, rowData) {
                        return value == null || value == 0 ? '' : value;
                    }},
                    {name: 'sheetMoney', width: 150, align: "right",formatter: function (value, options, rowData) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }},
                ],
                jsonReader: {
                    root: "data.list",
                    // cell: "list",
                    // repeatitems: false
                },
                height:$(window).height() - 140,
                viewrecords: true,
            },
            currencyList:[],
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
            subjectList:[]
        }
    },
    mounted() {
        this.initPage();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods:{
        initPage () {
            let _vm = this;
            $.ajax({
                type: 'post',
                url: contextPath + '/cashier/reconciliationInit',
                dataType: 'json',
                success: function (result) {
                    console.log(result)
                    if (result.code != '100100') {
                        _vm.$Modal.error({
                            title:'错误',
                            content:result==null||result.msg==null||result.msg == ''?'页面初始化失败':result.msg
                        })
                        return;
                    }
                    let dataInfo = result.data;
                    _vm.organisationList = dataInfo.org;
                    _vm.currencyList = dataInfo.currencyList;
                    _vm.subjectList = dataInfo.subjectList;
                    _vm.periodYear = dataInfo.periodYear;
                    _vm.formData.sobId = dataInfo.org[0].value;
                    _vm.formData.subjectId = dataInfo.subjectList[0].accountId;
                    _vm.formData.subjectName = dataInfo.subjectList[0].accountName;
                    _vm.formData.currencyId = dataInfo.currencyList[0].id;

                    $.each(_vm.currencyList, function (idx, ele) {
                        if (_vm.formData.currencyId == ele.id) {
                            _vm.formData.currencyName = ele.currencyName;
                        }
                    });
                    _vm.formData.dateTime = dataInfo.endDate;

                    $.each(dataInfo.periodYear, function (idx, ele) {
                        if (ele.name == dataInfo.cnCurrentAccountYear) {
                            _vm.formData.startYear = ele.value;
                        }
                    });
                    $.each(_vm.periodList, function (idx, ele) {
                        if (ele.name == dataInfo.cnCurrentAccountPeriod) {
                            _vm.formData.startPeriod = ele.value;
                        }
                    });
                    _vm.jqGridInit();
                }
            });
        },
        // 生成jqGrid
        jqGridInit() {
            let that = this;
            that.operateData(that.formData.type);
            let config = Object.assign({},
                that.base_config, {
                postData: JSON.stringify(that.formData),
                loadComplete: function (ret) {
                    that.lodoPList = ret.data.list || [];
                    jQuery("#grid").jqGrid('destroyGroupHeader');
                    jQuery("#grid").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders: [
                            { startColumnName: 'sheetDate', numberOfColumns: 2, titleText: '现金盘点' },
                        ]
                    });
                },
                gridComplete: function () {
                },
            });
            jQuery("#grid").jqGrid(config);
        },
        printV(){
            let that = this;
            console.log(that.lodoPList, '=========that.lodoPList');
            if (!that.lodoPList || !that.lodoPList.length) {
                that.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }
            // 多表头固定打印
            var _d = that.lodoPList;
            var _thead = '', _tbody = '', _tfoot = '';
            _thead = `
                    <tr class='thCs'>
                        <th rowspan="2" style="width: 6%">项目</th>
                        <th rowspan="2" style="width: 6%">出纳管理系统</th>
                        <th rowspan="2" style="width: 6%">总账系统</th>
                        <th rowspan="2" style="width: 6%">差额</th>
                        <th colspan="2" style="width: 12%">现金盘点</th>
                    </tr>
                    <tr class='thCs'>
                        <th style="width: 6%">日期</th>
                        <th style="width: 6%">实存金额</th>
                    </tr>
                `;

            _d.forEach(row => {
                _tbody += `
                        <tr>
                            <td>${row.projectName}</td>
                            <td>${that.formartMoney(row.cashierMoney)}</td>
                            <td>${that.formartMoney(row.accountMoney)}</td>
                            <td>${that.formartMoney(row.differenceMoney)}</td>
                            <td>${that._nullData(row.sheetDate)}</td>
                            <td>${that.formartMoney(row.sheetMoney)}</td>
                        </tr>
                    `;
            });
            _tfoot = `<tr class="ht-foot"><td>单位名称：金大祥</td></tr> `;

            let data = {
                title: "现金对账",
                template: 12,
                'titleInfo': [       // title
                    { 'name': '科目', 'val': that.formData.subjectName },
                    { 'name': '币别', 'val': that.formData.currencyName },
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
        },
        _nullData (_t) {
            if (_t) {
                return _t;
            } else {
                return '';
            }
        },
        formartMoney(value){
            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
        },
        open() {
            this.filterVisible = true;
        },
        currencyOption(id){
            let _vm = this;
            $.each(_vm.currencyList, function (idx, ele) {
                if (id == ele.id) {
                    _vm.formData.currencyName = ele.currencyName;
                }
            });
        },
        // 格式化数字
        formatNum (f, digit) {
            // f = value  digit= 比例
            var m = Math.pow(1000, digit);
            return parseInt(f * m, 10) / m;
        },
        operateData(type){
            this.formData.dateTime = (new Date(this.formData.dateTime)).format('yyyy-MM-dd');
            if(type == 1){
                this.formData.periodDate = this.formData.dateTime;
            }else if(type == 2){
                this.formData.periodDate = this.formData.startYear +'年'+this.formData.startPeriod+'期';
            } else if(type == 3){
                this.formData.periodDate = this.formData.startYear +'年';
            }
            this.formData.type = type;
        },
        refresh() {
            this.operateData(this.formData.type);
            console.log(this.formData)
            $("#grid").jqGrid('clearGridData');  //清空表格
            $("#grid").jqGrid("setGridParam", {
                mtype: 'POST',
                postData: JSON.stringify(this.formData),
                ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
                dataType: 'json',
            }).trigger("reloadGrid");
            // $("#grid").jqGrid('setGridParam').trigger("reloadGrid");
        },
        save() {
            this.filterVisible = false;
            this.refresh();
        },
        cancel() {
            this.filterVisible = false;
        },
        exitHtml(){
            window.parent.closeCurrentTab({ name: '现金对账', openTime: this.openTime, exit: true })
        }
        
    },
    computed:{
        currencyName(){
            let find = this.currencyList.find(row=>{
                return row.value === this.formData.currencyId;
            })
            if(!find) return;
            return find.label;
        }
    },
    watch:{
        'formData.type':function (val) {

        }
    }
})