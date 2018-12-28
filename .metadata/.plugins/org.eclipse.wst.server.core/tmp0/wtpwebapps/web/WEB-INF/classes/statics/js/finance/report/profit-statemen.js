var reportVue = new Vue({
    el: '#profit-statement',
    data () {
        var This = this;
        return {
            data_config: {
                url: contextPath+'/reportProfit/profitStatemen?accountYear=1&accountPeriod=1',
                mtype: 'POST',
                datatype: "json",
                styleUI: 'Bootstrap',
                colNames: ['项目', '行次', '本年累计金额', '本月金额'],
                colModel: [
                    {
                        name: 'fieldName', width: 400, align: "left",
                        formatter: function (value, grid, rows, state) {
                            var cssClass = ".detail" + rows.id;
                                                           if (rows.isCompute==1){
                            $(document).off('click', cssClass).on("click", cssClass, function () {
                                 This.detailClick(rows)
                            });
                            let div = `<div class="detail${rows.id}">${rows.fieldName}</div>`;
                            return div
                                                           }else{
                                                               return value;
                                                           }
                        }
                    },
                    { name: 'lineNum', width: 200, align: "center" },
                    // {
                    //     name: 'amount1', width: 200, align: "center",
                    //     formatter: function (value, grid, rows, state) {
                    //         var cssClass = ".amount" + rows.id;
                    //         $(document).off('click', cssClass).on("click", cssClass, function () {
                    //             This.amountClick(rows)
                    //         });
                    //         let div = `<div class="amount${rows.id}">${rows.fieldName}</div>`;
                    //         return div
                    //     }
                    // },
                    { name: 'amount1', width: 200, align: "center" },
                    { name: 'amount2', width: 200, align: "center" },
                ],
                jsonReader: {
                    root: "data",
                    cell: "data",
                    userdata: "userdata",
                    repeatitems: false
                },
                // footerrow: true,
                // userDataOnFooter: false,
                height:$(window).height() - 170,
                rowNum: '999999',
                pager: '#page',
                viewrecords: true,
            },
            reload: false,
            formData: '',
            // selected:[],
            dateList: [],
            editTitle: '',
            editVisable: false,
            reportContentId: 0,
            reportContentName: '',
        }
    },
    created: function () {
        var _this = this;
        var _url = contextPath+'/reportProfit/accountPeriodList'; //获取总帐会计期间列表
        $.ajax({
            type: 'post',
            data: '',
            url: _url,
            //                dataType: 'json',
            analysis: false,
            success: function (res) {
                _this.dateList = res.data;
                if (res.data && res.data.length) {
                    _this.formData = _this.dateList[0].value;
                }
                _this.$nextTick(() => {
                    _this.jqGridInit();
                })
            },
            error: function (code) {
                console.log(code);
            }
        });
    },
    mounted () {
        // this.reloadGrid();
    },
    methods: {
        reflistM(){
            this.dateChange();
        },
        // 生成jqGrid
        jqGridInit () {
            console.log("jqGridInit = " + this.formData);
            var arr = this.formData.split('_');
            this.data_config.url = `/web/reportProfit/profitStatemen?accountYear=${arr[0]}&accountPeriod=${arr[1]}`;
            //                let config = Object.assign({},this.data_config,{});
            jQuery("#grid").jqGrid(this.data_config);
        },
        detailClick (row) {
            this.editTitle = `编辑公式 - ${row.fieldName}`;
            this.editVisable = true;
            this.reportContentId = row.id;
            this.reportContentName = row.fieldName;
        },
        amountClick (row) {
            // 跳转到总账
        },
        editClose () {
            this.editVisable = false;
        },
        exportProfitStatemen () {
            console.log("执行导出excel...");
             var _formData = this.formData;
             window.open(`/web/reportProfit/exportProfitStatemen?formData=${_formData}`);
        },
        dateChange () {
            var arr = this.formData.split('_');
            this.data_config.url = `/web/reportProfit/profitStatemen?accountYear=${arr[0]}&accountPeriod=${arr[1]}`;
           //this.data_config.url = `/web/reportProfit/profitStatemen?accountYear=201\8&accountPeriod=1`;
            $("#grid").jqGrid('setGridParam', this.data_config).trigger("reloadGrid");
        },
        print(){
            //打印
            console.log("执行htPrint()");
            htPrint();
            //window.print();
        },
    },
    watch: {
    },
    computed: {
    }
})