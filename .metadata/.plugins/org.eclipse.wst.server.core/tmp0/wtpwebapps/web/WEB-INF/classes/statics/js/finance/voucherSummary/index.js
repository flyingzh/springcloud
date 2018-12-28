
new Vue({
    el: '#voucher-summary',
    data(){
        return {
            formData:{
                startDate:'2018-01-01',
                endDate:'2018-01-31',
                voucherId:'',
                startVoucherNum:'',
                endVoucherNum: '',
                subjctStartNum: 1,
                subjctEndNum: 1,
                voucherCount: 0,
                attachmentsCount: 0
            },
            formDataList:[] ,
            visible:false,
            optionList:[
                {label:'月报', value: 1},
                {label:'季报', value: 2},
            ],
            reload: false,
            dateList:[],
            editTitle: '',
            editVisable: false,
            // tableName:'list',
            // pageName:'page',
            floatNum:2,
            filterVisible: false,
        }
    },
    created() {
        this.getVoucher();
    },
    mounted() {
        this.formData.startDate = this.operateDate(this.formData.startDate);
        this.formData.endDate = this.operateDate(this.formData.endDate);
        this.pageInit();
        this.queryVoucherEnclosure();
    },
    methods:{
        openFun(){
            this.filterVisible = true;
        },
        pageInit() {
            let that = this;
            jQuery("#list").jqGrid(
                {
                    datatype: "json",
                    postData:that.formData,
                    url: contextPath+'/voucherController/voucherCount',
                    colNames : [ 'id', '科目编码', '科目名称', '借方金额', '贷方金额' ],
                    colModel : [
                        {name : 'id',width :10, align : "center",sortable:false,key:true,hidden:true},
                        {name : 'subjectCode',width : 200, align: "left",sortable:false,
                            formatter: function (value, grid, rows, state) {
                               $(document).off("click",".detaila"+rows.id).on("click",".detaila"+rows.id,function(){
                                    that.detailClick(rows)
                                });
                                let div =`<a class="detaila${rows.id} ht-link">${rows.subjectCode}</a>`;
                                return div
                            }
                        },
                        {name : 'subjectName',width :200, align : "center",sortable:false},
                        {name : 'debitTotal',width : 200, align : "center",sortable:false,
                            formatter: function (value, grid, rows, state) {
                                return accounting.formatMoney(value, '', this.floatNum);
                            }
                        },
                        {name : 'creditTotal',width : 200,align : "center",sortable:false,
                            formatter: function (value, grid, rows, state) {
                                return accounting.formatMoney(value, '', this.floatNum);
                            }
                        },
                    ],
                    rowNum: 999999999,//一页显示多少条
                    // rowList : [ 10, 20, 30 ],//可供用户选择一页显示多少条
                    pager : '#pager',//表格页脚的占位符(一般是div)的id
                    // sortname: 'orderDate',//初始化的时候排序的字段
                    sortorder: "desc",//排序方式,可选desc,asc
                    mtype: "post",//向后台请求数据的ajax的类型。可选post,get
                    jsonReader: {
                        root: "data",
                    },
                    styleUI: 'Bootstrap',
                    height: $(window).height() - 210,
                    viewrecords: true,
                    // caption: "凭证汇总表",//表格的标题名字
                    footerrow: true,
                    userDataOnFooter: false,
                    gridComplete: this.completeMethod,
                    onCellSelect:function(rowid){
                       // let rowData = jQuery("#list").jqGrid('getRowData',rowid);
                        //console.log(rowData)
                        //console.log(rowData['paymentReceiptEntity.orderDate'])
                        // 用于保存主表id 确保后续操作
                        // that.id = rowData.id
                        // that.auditStatus = rowData.paymentReceiptEntity;
                    },
                    ondblClickRow:function(rowid,index,grid){
                        // 双击事件
                        console.log(rowid);
                        console.log(grid);
                      // var  url = contextPath + '/finance/detail-account/detail-account.html?subjectCode=' + code;
                       // var url = contextPath+'/finance/voucher-lrt/index.html?voucherId='+rowid+"&sobId="+1;
                        //window.parent.activeEvent({name: '查看凭证', url: url, params: null});
                    }
                })
        },
        queryVoucherEnclosure(){
            var data = {};
            $.ajax({
                type: 'post',
                async:false,
                url: contextPath+'/voucherController/queryVoucherEnclosure',
                data: this.formData,
                success: function(result){
                    if(result.data!=null){
                        data=result.data;
                    }
                }
            });
            let voucherCount = data.voucherCount;
            let attachmentsCount =  data.attachmentsCount;
            this.formData.attachmentsCount = typeof(attachmentsCount) == "undefined"?0:attachmentsCount;
            this.formData.voucherCount = typeof(voucherCount) == "undefined"?0:voucherCount;
          //  return data;
        },
        getVoucher(){
            var data = [];
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath+'/voucherController/initQueryVoucherFormData',
                data: null,
                success: function (result) {
                    if (result.data != null) {
                        data = result.data;
                    }
                }
            });
            //凭证字
            this.formDataList = data.voucherGroupName.data;
            this.formDataList.splice(0, 0, {"id": '', "name": "不限"});
            //会计期间
            var currentAccountYear = data.currentAccountYear;
            var currentAccountPeriod = data.currentAccountPeriod;
            this.formData.startDate = currentAccountYear+'-'+currentAccountPeriod+'-'+'01';
            this.formData.endDate =this.getLastDay(currentAccountYear,currentAccountPeriod);
        },
        completeMethod() {
            var debitTotal = this.getColSum('debitTotal');
            var creditTotal = this.getColSum('creditTotal');
            $("#list").footerData('set', {
                'id':'',
                'subjectCode': '',
                'subjectName': '合计',
                'debitTotal': debitTotal,
                'creditTotal': creditTotal
            });
        },
        getColSum(name) {
            let rs = $(`td[aria-describedby='list_${name}']`);
            let code = $(`td[aria-describedby='list_subjectCode']`);
            var level = this.formData.subjctStartNum;
            let sum = 0;
            rs.each((i, e) => {
                var value = code[i].title;
                if(value!=''){
                    var length = code[i].title.split(".").length;
                    if(level==length){
                        sum += accounting.unformat($(e).text()) * 1000;
                    }
                }
            });
            sum /= 1000;
            sum = accounting.formatMoney(sum, '', 2);
            return sum;
        },
        operateDate(date){
            return new Date(date).format("yyyy-MM-dd");
        },
        getLastDay(y,m){//根据年月获取当月最后一天
            var dt = new Date(y,m,1);
            cdt = new Date(dt.getTime()-1000*60*60*24);
            return cdt.getFullYear()+"-"+(Number(cdt.getMonth())+1)+"-"+cdt.getDate();
        },
        detailClick(row){
            console.log(row.subjectCode);
             var  url = contextPath + '/finance/detail-account/detail-account.html?subjectCode=' + row.subjectCode;
             window.parent.activeEvent({name: '明细账', url: url, params: null});
        },
        more(){
            this.visible = true; 
        },
        nomore(){
            this.visible = false; 
        },
        blur(ev,attr){
            let value = Number(ev.target.value);
            if(value>=1) return ;
            this.formData[attr] = value;
        },
        save(){
           // $("#list").jqGrid('clearGridData');  //清空表格
            this.formData.startDate = this.operateDate(this.formData.startDate);
            this.formData.endDate = this.operateDate(this.formData.endDate);
            $("#list").jqGrid('setGridParam',{  // 重新加载数据
                postData:this.formData
            }).trigger("reloadGrid");
            this.queryVoucherEnclosure();
            this.cancel()
        },
        cancel(){
            this.filterVisible = false;
        },
        exportExcel(){
            this.formData.startDate = this.operateDate(this.formData.startDate);
            this.formData.endDate = this.operateDate(this.formData.endDate);
            console.log(this.formData.subjctStartNum);
            window,open(contextPath+'/voucherController/exportExcel?voucherId='+this.formData.voucherId+"&startVoucherNum="+this.formData.startVoucherNum+"&endVoucherNum="+this.formData.endVoucherNum+"&startDate="+this.formData.startDate+"&endDate="+this.formData.endDate+"&subjctStartNum="+this.formData.subjctStartNum+"&subjctEndNum="+this.formData.subjctEndNum);
        },
        refresh(){
           // $("#list").jqGrid('clearGridData');
            jQuery("#list").trigger("reloadGrid");  //刷新
        },
        clear(){
            this.formData.startDate = '2018-01-01';
            this.formData.endDate = '2018-01-31';
            this.formData.voucherId = '';
            this.formData.startVoucherNum = '';
            this.formData.endVoucherNum = '';
            this.formData.subjctStartNum = 1;
            this.formData.subjctEndNum = 1;
            this.cancel();
        },
    }
})