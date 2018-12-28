var vem=new Vue({
    el: '#other-payment-receipt-time-book',
    data() {
        return {
            isInit: true,
            showFilter: false,
            subjectVisable: false,
            visible_filter: false,
            confirmConfig: {
                showConfirm: false,
                title: '提示',
                content: '这是内容',
                onlySure: true,
                success: true
            },
            filterBody: {
                timeStart:'',
                timeEnd:'',
                dateSource:'',
                auditStatus:'',
                isVoucher:'',
                documentNumber:''
            },
            detailDate:[
                {
                    label:'今天',
                    value:'today'
                },
                {
                    label:'昨天',
                    value:'yesterday'
                },
                {
                    label:'近7天',
                    value:'interval7'
                },
                {
                    label:'近30天',
                    value:'interval30'
                },
                {
                    label:'本月',
                    value:'thisMon'
                },
                {
                    label:'上月',
                    value:'lastMon'
                },
                {
                    label:'本季度',
                    value:'thisQuarter'
                },
                {
                    label:'上季度',
                    value:'lastQuarter'
                },
                {
                    label:'本年',
                    value:'thisYear'
                },
                {
                    label:'去年',
                    value:'lastYear'
                }
            ],
            auditStatusList:[
                {
                    label:'未审核',
                    value:1
                },
                {
                    label:'已审核',
                    value:2
                }
            ],
            isVoucherList:[
                {
                    label:'未记账',
                    value:1
                },
                {
                    label:'已记账',
                    value:2
                }
            ],
            // 保存主表id
            id:'',
            auditStatus:'',
            rowData:'',

        }
    },
    methods: {
        getRowData(rowid){
            console.log(rowid)
        },
        sortData(value, grid, rows, state) {
            let str = "";
            (value||[]).map(function (val, index) {
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
                    url:"./../../otherPaymentReceipt/getPageByType",
                    postData:{otherTypesDocuments:getUrlParam("otherTypesDocument")},
                    datatype: "json",
                    colNames: ['序号','审核标志', '日期', '单据号', '单据类型', '结算账户', '客户', '币别',
                        '汇率', '收款金额', '收款金额(本位币)', '收入类别', '(收款/付款)期限', '应结算金额', '已结算金额',
                        '凭证字号', '摘要', '部门', '经手人', '制单人', '审核人', '审核日期', '打印次数', '备注'],
                        colModel: [
                         {
                           name: 'id', width: 70,
                         },
                        {
                            name: 'auditStatus', width: 70,
                            formatter: function (value, grid, rows, state) {
                                return value === 2 ? "Y" : ""
                            }
                        },
                        {
                            name: 'documentDate', index: 'orderDate', sortable: true, sortorder: "asc", width: 90,
                            formatter:function (value,grid,rows,state) {
                                return value.slice(0,10)
                            }

                        },
                        { name: 'documentNumber', width: 80, align: "left" },
                        {
                            name: 'documentTypeName', width: 100, align: "left",
                        },
                        { name: 'clearanceAccount', width: 80, align: "left" },
                        { name: 'occurrenceObject', width: 80, align: "right" },
                        { name: 'coinStop', width: 80, align: "left" },
                        { name: 'exchangeRate', width: 60, align: "left" },
                        {
                            name: 'amountPaymentReceivedFors', width: 80, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return that.sortData(value, grid, rows, state);
                            }
                        },
                        {
                            name: 'amountPaymentReceiveds', width: 110, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return that.sortData(value, grid, rows, state);
                            }
                        },
                        {
                            name: 'genrePaymentsReceiveds', width: 80, align: "left",
                            formatter: function (value, grid, rows, state) {
                                return that.sortData(value, grid, rows, state);
                            }
                        },
                        {
                            name: 'receiptPaymentPeriod', width: 100, align: "right",
                            formatter:function (value,grid,rows,state) {
                                return value.slice(0,10)
                            }
                        },
                        {
                            name: 'payableAmount', width: 80, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return accounting.formatMoney(value, '', 2)
                            }
                        },
                        {
                            name: 'settledAmount', width: 80, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return accounting.formatMoney(value, '', 2)
                            }
                        },
                        { name: 'voucherSize', index: 'typePaymentReceived', width: 80, align: "left" },
                        {
                            name: 'summary', width: 100, align: "left",
                        },
                        {
                            name: 'department', width: 80, align: "left",

                        },
                        {
                            name: 'brokerage', width: 100, align: "left",

                        },
                        {
                            name: 'createName', width: 100, align: "left",
                        },
                        {
                            name: 'auditorName', width: 100, align: "left",

                        },
                        {
                            name: 'auditorDate', width: 100, align: "left",
                            formatter:function (value,grid,rows,state) {
                               return value.slice(0,10)
                            }
                        },
                        {name: 'printingTimes', width: 70, align: "right",},
                        {
                            name: 'remarks', width: 100, align: "left",
                            formatter: function (value, grid, rows, state) {
                                return that.sortData(value, grid, rows, state);
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
                    caption: "其他收款单序时簿",//表格的标题名字
                    footerrow: true,
                    userDataOnFooter: true,
                    gridComplete: that.completeMethod,
                    cellEdit:true,
                    onCellSelect:function(rowid){
                       var rowData = jQuery("#list").jqGrid('getRowData',rowid);
                       console.log(rowData)
                        // 用于保存主表id 确保后续操作
                       vem.rowData=rowData;
                    },
                    ondblClickRow:function(rowid){
                        // 双击事件
                        console.log(7574777579757)
                    }
                })
        },
        completeMethod() {
            $("#list").footerData('set', {
                "auditStatus": '合计',
                'amountPaymentReceivedFors': [0],
                'amountPaymentReceived': [0]
            });
            var sum_payableAmount = this.getColSum('payableAmount')
            var sum_settledAmount = this.getColSum('settledAmount')
            var sum_amountPaymentReceivedFors = this.getColSum('amountPaymentReceivedFors')
            var sum_amountPaymentReceiveds = this.getColSum('amountPaymentReceiveds')

            $("#list").footerData('set', {
                "auditStatus": '合计',
                'payableAmount': sum_payableAmount,
                'settledAmount': sum_settledAmount,
                'amountPaymentReceivedFors': [sum_amountPaymentReceivedFors],
                'amountPaymentReceiveds': [sum_amountPaymentReceiveds],
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
            this.search.ieSubject = value;
            console.log(this.search.ieSubject);
        },
        delRow(){
            console.log(vem.rowData);
            if(vem.rowData.id!=null && vem.rowData.auditStatus !="Y"){
                    $.ajax({
                        type: 'POST',
                        async: true,
                        data: {id:vem.rowData.id,
                            auditStatus:1},
                        url: '/finance/otherPaymentReceipt/deleteById/',
                        dataType: 'json',
                        success: function (d) {
                            if(d.data=="true"){
                                alert("数据删除成功！");
                                //刷新表格
                                location.reload();
                            }else{
                                alert(d.msg);
                            }
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    });
            }else{
                alert("请选择未审核的数据行")
            }
        },
        sure(type) {
            console.log(vem.filterBody)
            if(type){
                vem.pageInit();
                jQuery("#list").jqGrid('setGridParam',{
                    url:'/finance/otherPaymentReceipt/getPageByFilter',
                    postData:vem.filterBody
                }).trigger("reloadGrid");
            }
            this.visible_filter = false;
        },
        addRow(){
            window.location.href='/finance/modules/otherReceipts/index.htm?otherTypesDocument=1';
        },
        copyRow(){
            var param ={"id":vem.id};
            window.location.href='/finance/modules/otherReceipts/index.htm?otherTypesDocument=2';
            console.log("复制");
                /*$.ajax({
                    type: 'post',
                    async: true,
                    data:param,
                    url: '/finance/otherPaymentReceipt/executeCopy',
                    dataType: 'json',
                    success: function (d) {
                        if(d.data=="true"){
                            alert("复制成功！");
                            //刷新表格
                            location.reload();
                        }else{
                            alert(d.message);
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });*/

        },
        review(){
            console.log("审核");
            if(vem.rowData.id!=null && vem.rowData.auditStatus !="Y"){
                    $.ajax({
                        type: 'post',
                        async: true,
                        data: {id:vem.rowData.id,auditStatus:1},
                        url: '/finance/otherPaymentReceipt/executeAudit/',
                        dataType: 'json',
                        success: function (d) {
                            if(d.data=="true"){
                                alert("审核成功！");
                                //刷新表格
                                window.location.reload();
                            }else{
                                alert(d.msg);
                            }
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    });
                }else{
                    alert("已审核数据不能再进行审核！")
                }

        },
        reReview(){
            console.log("反审核");
            var s=vem.rowData.auditStatus;
            if(s=='Y'){
                s=2;
            }else{
                s=1;
            }
                $.ajax({
                    type: 'post',
                    async: true,
                    data: {id:vem.rowData.id,
                        auditStatus:s},
                    url: '/finance/otherPaymentReceipt/reverseAudit/',
                    dataType: 'json',
                    success: function (d) {
                        if(d.data=="true"){
                            alert("反审核成功！");
                            //刷新表格
                            location.reload();
                        }else{
                            alert(d.msg);
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
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