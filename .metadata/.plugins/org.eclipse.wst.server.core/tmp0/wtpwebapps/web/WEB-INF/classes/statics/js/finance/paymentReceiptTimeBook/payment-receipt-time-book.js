new Vue({
    el: '#paymentReceiptTimeBook',
    data() {
        return {
            isInit: true,
            showFilter: false,
            subjectVisable: false,
            visible_filter: false,
            // 保存主表id
            id:'',
            auditStatus:'',
            confirmConfig: {
                showConfirm: false,
                title: '提示',
                content: '这是内容',
                onlySure: true,
                success: true
            },
            filterBody: {
                timeStart: '',
                timeEnd: '',
                dateScore: '',
                auditStatus: '',
                isVoucher: '',
                documentNumber: ''
            },
            detailDate: [
                {
                    label: '今天',
                    value: 'today'
                },
                {
                    label: '昨天',
                    value: 'yesterday'
                },
                {
                    label: '近7天',
                    value: 'interval7'
                },
                {
                    label: '近30天',
                    value: 'interval30'
                },
                {
                    label: '本月',
                    value: 'thisMon'
                },
                {
                    label: '上月',
                    value: 'lastMon'
                },
                {
                    label: '本季度',
                    value: 'thisQuarter'
                },
                {
                    label: '上季度',
                    value: 'lastQuarter'
                },
                {
                    label: '本年',
                    value: 'thisYear'
                },
                {
                    label: '去年',
                    value: 'lastYear'
                }
            ],
            auditStatusList: [
                {
                    label: '未审核',
                    value: 1
                },
                {
                    label: '已审核',
                    value: 2
                }
            ],
            isVoucherList: [
                {
                    label: '未记账',
                    value: 1
                },
                {
                    label: '已记账',
                    value: 2
                }
            ]
        }
    },
    methods: {
        // sortData(value, grid, rows, state) {        
        //     let str = "";
        //     console.log(value)
        //     value.map(function (val, index) {
        //         str += "<div class='sumCol'>"+val + "</div>"
        //     })
        //     return str;
        // },
        // getColSum(name){
        //     let sum = 0;
        //     $(`td[aria-describedby='list_${name}']`).children("div.sumCol").each((i,e)=>{
        //         sum += parseFloat($(e).text())*1000
        //     })
        //     return sum/1000 ;

        // },
        sortData(value, grid, rows, state) {
            let str = "";
            value.map(function (val, index) {
                if (typeof val === "number") {
                    val = accounting.formatMoney(val, '', 2);
                }
                str += "<div class='sumCol'>" + val + "</div>"
            })
            return str;
        },
        getColSum(name) {
            let rs = $(`td[aria-describedby='list_${name}']`);
            let sum = 0;
            if (rs.children("div.sumCol").length !== 0) {
                rs = $(`td[aria-describedby='list_${name}']`).children("div.sumCol")
            } else {
                rs = $(`td[aria-describedby='list_${name}']:not(:last)`)
            }
            rs.each((i, e) => {
                sum += accounting.unformat($(e).text()) * 1000
            })
            sum /= 1000;
            sum = accounting.formatMoney(sum, '', 2);
            return sum;
        },
        pageInit() {
            let that = this;
            jQuery("#list").jqGrid(
                {
                    url: './bookData2.json',
                    datatype: "json",
                    colNames: ['审核标志', '日期', '单据号', '源单编号', '结算账号', '折扣科目', '折后金额', '折后金额本位币',
                        '凭证字号', '整单折扣', '币别', '汇率', '表头收(付)款金额', '表头收(付)款金额本位币', '收(付款)款类型',
                        '单据日期', '单据金额', '单据金额本位币', '已核销金额', '未核销金额', '本次核销', '本次核销本位币', '发票币别', '表体汇率',
                        '摘要', '部门', '主管', '客户(供应商)', '业务员', '制单人', '审核人', '审核日期', '打印次数', '备注'],
                    colModel: [
                        {
                            name: 'paymentReceiptEntity.auditMark', width: 70,
                            formatter: function (value, grid, rows, state) {
                                return value === 2 ? "Y" : ""
                            }
                        },
                        {
                            name: 'paymentReceiptEntity.orderDate', index: 'orderDate', sortable: true, sortorder: "asc", width: 90,
                            formatter: function (value, grid, rows, state) {
                                return value.slice(0, 10)
                            }
                        },
                        { name: 'paymentReceiptEntity.documentNumber', width: 80, align: "left" },
                        {
                            name: 'financeSourceSingleDataEntities', width: 100, align: "left",
                            formatter: function (value, grid, rows, state) {
                                let str = "";
                                rows.financeSourceSingleDataEntities.map(function (val, index) {
                                    str += val.sourceListNumber + "<br>"
                                })
                                return str;
                            }
                        },
                        { name: 'paymentReceiptEntity.clearanceAccount', width: 80, align: "left" },
                        { name: 'paymentReceiptEntity.discountSubject', width: 80, align: "right" },
                        {
                            name: 'paymentReceiptEntity.reducedAmountFor', width: 80, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return accounting.formatMoney(value, '', 2);
                            }
                        },
                        {
                            name: 'paymentReceiptEntity.reducedAmount', width: 120, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return accounting.formatMoney(value, '', 2);
                            }
                        },
                        { name: 'paymentReceiptEntity.voucherSize', width: 80, align: "left" },
                        { name: 'paymentReceiptEntity.bulkDiscount', width: 80, align: "right" },
                        { name: 'paymentReceiptEntity.coinStop', width: 80, align: "left" },
                        { name: 'paymentReceiptEntity.exchangeRate', width: 50, align: "right" },
                        {
                            name: 'paymentReceiptEntity.watchPaymentFor', width: 120, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return accounting.formatMoney(value, '', 2);
                            }
                        },
                        {
                            name: 'paymentReceiptEntity.watchPayment', width: 150, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return accounting.formatMoney(value, '', 2);
                            }
                        },
                        { name: 'paymentReceiptEntity.typePaymentReceived', index: 'typePaymentReceived', width: 120, align: "right" },
                        {
                            name: 'financeSourceSingleDataEntities', width: 80, align: "right",
                            formatter: function (value, grid, rows, state) {
                                let str = "";
                                rows.financeSourceSingleDataEntities.map(function (val, index) {
                                    str += val.documentDate + "<br>"
                                })
                                return str;
                            }
                        },
                        {
                            name: 'paymentReceiptEntity.documentaryAmountForList', width: 80, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return that.sortData(value, grid, rows, state)
                            }
                        },
                        {
                            name: 'paymentReceiptEntity.documentaryAmountList', width: 100, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return that.sortData(value, grid, rows, state);
                            }
                        },
                        {
                            name: 'paymentReceiptEntity.cancellationAmountList', width: 100, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return that.sortData(value, grid, rows, state);
                            }
                        },
                        {
                            name: 'paymentReceiptEntity.notCancellationAmountList', width: 100, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return that.sortData(value, grid, rows, state);
                            }
                        },
                        {
                            name: 'paymentReceiptEntity.thisTiemCancellationForList', width: 100, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return that.sortData(value, grid, rows, state);
                            }
                        },
                        {
                            name: 'paymentReceiptEntity.thisTiemCancellationList', width: 100, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return that.sortData(value, grid, rows, state);
                            }
                        },
                        {
                            name: 'financeSourceSingleDataEntities', width: 100, align: "right",
                            formatter: function (value, grid, rows, state) {
                                let str = "";
                                rows.financeSourceSingleDataEntities.map(function (val, index) {
                                    str += val.invoiceCoinType + "<br>"
                                })
                                return str;
                            }
                        },
                        {
                            name: 'financeSourceSingleDataEntities', width: 100, align: "right",
                            formatter: function (value, grid, rows, state) {
                                let str = "";
                                rows.financeSourceSingleDataEntities.map(function (val, index) {
                                    str += val.surfaceExchangeRate + "<br>"
                                })
                                return str;
                            }
                        },
                        { name: 'paymentReceiptEntity.summary', width: 80, align: "right" },
                        { name: 'paymentReceiptEntity.department', width: 80, align: "right" },
                        { name: 'paymentReceiptEntity.director', width: 80, align: "right" },
                        { name: 'paymentReceiptEntity.occurrenceObject', width: 80, align: "right" },
                        { name: 'paymentReceiptEntity.salesman', width: 80, align: "right" },
                        { name: 'paymentReceiptEntity.singlePerson', width: 80, align: "right" },
                        { name: 'paymentReceiptEntity.auditorName', width: 80, align: "right" },
                        { name: 'paymentReceiptEntity.auditDate', width: 80, align: "right" },
                        { name: 'paymentReceiptEntity.printingTimes', width: 80, align: "right" },
                        {
                            name: 'financeSourceSingleDataEntities', width: 100, align: "right",
                            formatter: function (value, grid, rows, state) {
                                let str = "";
                                rows.financeSourceSingleDataEntities.map(function (val, index) {
                                    str += val.remark + "<br>"
                                })
                                return str;
                            }
                        },
                    ],
                    rowNum: 999999999,//一页显示多少条
                    // rowList : [ 10, 20, 30 ],//可供用户选择一页显示多少条
                    // pager : '#pager',//表格页脚的占位符(一般是div)的id
                    // sortname: 'orderDate',//初始化的时候排序的字段
                    sortorder: "desc",//排序方式,可选desc,asc
                    mtype: "post",//向后台请求数据的ajax的类型。可选post,get
                    jsonReader: {
                        root: "data",
                    },
                    styleUI: 'Bootstrap',
                    height: $(window).height() * 0.7,
                    viewrecords: true,
                    caption: "收款单序时簿",//表格的标题名字
                    footerrow: true,
                    userDataOnFooter: true,
                    gridComplete: that.completeMethod,
                    onCellSelect:function(rowid){
                        let rowData = jQuery("#list").jqGrid('getRowData',rowid);
                        console.log(rowData)
                        console.log(rowData['paymentReceiptEntity.orderDate'])
                        // 用于保存主表id 确保后续操作
                        // that.id = rowData.id
                        // that.auditStatus = rowData.paymentReceiptEntity;
                    },
                    ondblClickRow:function(rowid){
                        // 双击事件
                        console.log(7574777579757)
                    }
                })
        },
        completeMethod() {
            $("#list").footerData('set', {
                "paymentReceiptEntity.orderDate": '合计',
                'paymentReceiptEntity.documentaryAmountForList': [0],
                'paymentReceiptEntity.documentaryAmountList': [0],
                'paymentReceiptEntity.cancellationAmountList': [0],
                'paymentReceiptEntity.notCancellationAmountList': [0],
                'paymentReceiptEntity.thisTiemCancellationForList': [0],
                'paymentReceiptEntity.thisTiemCancellationList': [0],
            });
            var sum_reducedAmountFor = this.getColSum('paymentReceiptEntity.reducedAmountFor')
            var sum_reducedAmount = this.getColSum('paymentReceiptEntity.reducedAmount')
            var sum_watchPaymentFor = this.getColSum('paymentReceiptEntity.watchPaymentFor')
            var sum_watchPayment = this.getColSum('paymentReceiptEntity.watchPayment')
            var sum_documentaryAmountForList = this.getColSum('paymentReceiptEntity.documentaryAmountForList')
            var sum_documentaryAmountList = this.getColSum('paymentReceiptEntity.documentaryAmountList')
            var sum_cancellationAmountList = this.getColSum('paymentReceiptEntity.cancellationAmountList')
            var sum_notCancellationAmountList = this.getColSum('paymentReceiptEntity.notCancellationAmountList')
            var sum_thisTiemCancellationForList = this.getColSum('paymentReceiptEntity.thisTiemCancellationForList')
            var sum_thisTiemCancellationList = this.getColSum('paymentReceiptEntity.thisTiemCancellationList')

            $("#list").footerData('set', {
                "paymentReceiptEntity.orderDate": '合计',
                'paymentReceiptEntity.reducedAmountFor': sum_reducedAmountFor,
                'paymentReceiptEntity.reducedAmount': sum_reducedAmount,
                'paymentReceiptEntity.watchPayment': sum_watchPayment,
                'paymentReceiptEntity.watchPaymentFor': sum_watchPaymentFor,
                'paymentReceiptEntity.documentaryAmountForList': [sum_documentaryAmountForList],
                'paymentReceiptEntity.documentaryAmountList': [sum_documentaryAmountList],
                'paymentReceiptEntity.cancellationAmountList': [sum_cancellationAmountList],
                'paymentReceiptEntity.notCancellationAmountList': [sum_notCancellationAmountList],
                'paymentReceiptEntity.thisTiemCancellationForList': [sum_thisTiemCancellationForList],
                'paymentReceiptEntity.thisTiemCancellationList': [sum_thisTiemCancellationList],
            });

        },
        handleOpen() {
            this.visible_filter = true;
        },
        detailClick(data) {

        },
        iconPopup(type) {
            this.subjectVisable = true;
        },
        //关闭选择科目弹窗
        subjectClose() {
            this.subjectVisable = false;
        },
        conformCancel() {
            this.confirmConfig.showConfirm = false;
        },
        conformSure() {
            this.confirmConfig.showConfirm = false;
            this.confirmConfig.onlySure = !this.confirmConfig.onlySure;
        },
        //点击保存，获取所选科目id
        subjectDate(value) {
            // this.search.ieSubject = value;
            // console.log(this.search.ieSubject);
        },
        sure(type) {
            console.log(this.filterBody)
            // if(type === false){
            //
            // }else {
            //
            // }
            this.visible_filter = false;
        },
        addRow(){
            console.log("add")
        },
        delRow(){
            console.log("del")
            if( this.id === '') return;
            this.confirmConfig = {
                showConfirm: true,
                title: '提示',
                content: '确认删除这条数据',
                onlySure: false,
                success: true,         
            }
        },
        copyRow(){
            console.log("复制")
        },
        review(){
            console.log("审核")
            console.log(this.auditStatus)
            if( this.auditStatus === '') {
                this.confirmConfig = {
                    showConfirm: true,
                    title: '提示',
                    content: '该数据不能审核',
                    onlySure: true,
                    success: true,         
                }
            }else{
                // 调用接口
            }
        },
        reReview(){
            console.log("反审核")
        },
        derivation  (){
            console.log("引出")
        },
        print(){
            console.log("打印")
        },
        voucher(){
            console.log("凭证1111111")
        },
    },
    mounted() {
        this.pageInit()
    }
})