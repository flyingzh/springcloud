var ve = new Vue({
    el: '#gainProfit', //银行对账单
    data() {
        let that = this;
        return {
            currentYear: 0,
            currentMonth: 0,
            currentLastDay: 0,
            voucher: '',    //未过账的结转损益凭证字符串
            voucherVisible: false,
            voucherStatus: 1,
            editData: {
                datetime: "2018-9-12",
                pzNumber: '',
                remark: '',
            },
            pzNumberList: [
                {lable: 'test', id: 1},
            ],
            remarkVisable: false, // 摘要弹窗
            // 摘要列表
            remarklist: [],
            selectListId: [],
            lastSelection: '',
            base_config: {
                // multiselect: true,
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/transferprofitloss/listprofitlosssubject',
                ajaxGridOptions: {contentType: 'application/json;charset=utf-8'},
                datatype: 'json',
                rownumbers: true,
                jsonReader: {
                    root: "data",
                    // cell: "list",
                    // userdata: "data.userData",
                    // repeatitems: false
                },
                viewrecords: true,
                rowNum: 999999999,
                beforeRequest: function () {
                    that.selectListId = [];
                },
                onCellSelect: function (rowid) {
                    let rowData = jQuery("#list").jqGrid('getRowData', rowid);
                    console.log(rowData, "选中单行数据---------=>")

                },
                onSelectAll: function (aRowids, status) {  // 且点击头部的checkbox时才会触发此事件
                    // console.log(aRowids, status, '===aRowids,status==');
                    // status ? that.selectListId = aRowids : that.selectListId = [];
                },

                ondblClickRow: function (rowid) {

                },


            },
        }
    },
    methods: {

        getYear() {
            var that = this;
            $.ajax({
                url: contextPath + '/transferprofitloss/year',
                type: 'post',
                dataType: 'json',
                async: false,
                success: function (data) {
                    that.currentYear = data.data;
                }
            });
        },

        getMonth() {
            var that = this;
            $.ajax({
                url: contextPath + '/transferprofitloss/month',
                type: 'post',
                dataType: 'json',
                async: false,
                success: function (data) {
                    that.currentMonth = data.data;
                }
            });
        },
        getLastDay(y, m) {
            var dt = new Date(y, m, 1);
            cdt = new Date(dt.getTime() - 1000 * 60 * 60 * 24);
            // alert(cdt.getFullYear() + "年" + (Number(cdt.getMonth()) + 1) + "月的最后一天是:" + cdt.getDate() + "日");

            return cdt.getDate();
        },
        lastday() {
            var that = this;

            that.currentLastDay = that.getLastDay(that.currentYear, that.currentMonth);
        },
        transfer() {
            var that = this;
            var transferCommitVo = {};
            transferCommitVo.voucherDate = this.editData.datetime.getFullYear() + '-' + (this.editData.datetime.getMonth() + 1) + '-' + this.editData.datetime.getDate();
            transferCommitVo.voucherWordId = this.editData.pzNumber;
            transferCommitVo.explains = this.editData.remark;
            $.ajax({
                url: contextPath + "/transferprofitloss/transfer",
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify(transferCommitVo),
                success: function (data) {
                    if ('100100' == data.code && data.data.count > 0) {
                        that.$Message.info({
                            content: "已经生成一张转账凭证，凭证字号分别为" + data.data.voucherEntity.voucherGroupName + '-' + data.data.voucherEntity.voucherNumber,
                            duration: 3
                        });
                        setTimeout(function(){
                            window.parent.closeCurrentTab({ openTime: that.openTime, exit: true });
                        },2000);
                        // layer.alert("已经生成一张转账凭证，凭证字号分别为" + data.data.voucherEntity.voucherGroupName + '-' + data.data.voucherEntity.voucherNumber, {
                        //     icon: 1,
                        //     title: "信息"
                        // });
                    } else if ('100100' == data.code && data.data.count == 0) {
                        that.$Message.info({
                            content: "各损益科目余额为零，不需要结转！",
                            duration: 3
                        });
                        setTimeout(function(){
                            window.parent.closeCurrentTab({ openTime: that.openTime, exit: true });
                        },2000);
                        // layer.alert("各损益科目余额为零，不需要结转！", {
                        //     icon: 2,
                        //     title: "信息"
                        // });
                    } else {
                        that.$Message.info({
                            content: "服务器正在维护，请稍后再试！",
                            duration: 3
                        });
                        setTimeout(function(){
                            window.parent.closeCurrentTab({ openTime: that.openTime, exit: true });
                        },2000);
                        // layer.alert("服务器正在维护，请稍后再试！", {
                        //     icon: 2,
                        //     title: "信息"
                        // });
                    }

                }
            });
        },
        quit() {
            window.parent.closeCurrentTab({openTime: this.openTime, exit: true});
        },
        saveVoucher() {
            if (this.voucherStatus == 1) {
                $.ajax({
                    url: contextPath + "/transferprofitloss/posttransfervoucher",
                    type: "post",
                    dataType: "json",
                    success: function (data) {

                    }
                });
            } else {
                $.ajax({
                    url: contextPath + "/transferprofitloss/deletetransfervoucher",
                    type: "post",
                    dataType: "json",
                    success: function (data) {

                    }
                });
            }
            this.voucherVisible = false;

        },
        cancelVoucher() {
            window.parent.closeCurrentTab({openTime: this.openTime, exit: true});
        },
        // 文摘弹窗
        clickDigest() {
            this.remarkVisable = true;
        },
        onDblclickRemarkRow(remark) {
            let that = this;
            that.editData.remark = remark.content;
            //	vm.row.abstract = remark.content;
            // vm.row.explains = remark.content;
            // vm.row.explainsLabel = remark.content;
            // vm.row.explainsValue = remark.id || '';
            that.remarkVisable = false;
        },
        onRemarkModalChange(val) {
            this.remarkVisable = val;
        },
        onRemarkListChange(val) {
            this.remarklist = val;
        },

        initPage() {
            var that = this;
            this.colNames = ['id', '科目代码', '科目名称', '结转科目名称'];
            this.colModel = [
                {name: 'id', width: 30, hidden: true},
                {name: 'subjectCode'},
                {name: 'subjectName'},
                {
                    name: 'transferSubjectName'
                    // editable: true,
                    // edittype: "select",
                    // editoptions: {
                    //     value: "1:2018;2:2019"
                    // }
                },

            ],
                this.tableHeaders = [];
            this.base_config.height = $(window).height() - 120;
            that.jqGridInit(this.colNames, this.colModel, this.tableHeaders);
        },
        // 生成jqGrid
        jqGridInit(colNames, colModel, headers) {
            console.log(colNames, colModel, headers);
            var _date = {
                "createId": 63,
                "currencyId": 1,
                "currencyName": "人民币",
                "endCreditFor": "",
                "endDate": "2018-08-31",
                "endDebitFor": "",
                "endPeriod": 8,
                "endYear": "2018",
                "explains": "",
                "isCheck": -1,
                "isCheckList": [
                    {
                        "id": -1,
                        "name": "全部"
                    },
                    {
                        "id": 1,
                        "name": "未勾对"
                    },
                    {
                        "id": 2,
                        "name": "已勾对"
                    }
                ],
                "openCurrencyList": [
                    {
                        "currencyName": "人民币",
                        "exchangeRate": 1,
                        "currencyId": 1,
                        "currencyCode": "RMB"
                    }
                ],
                "relateSubjectId": "",
                "showDaySum": true,
                "showDetailRecord": true,
                "showInitBalance": true,
                "showPeriodSum": true,
                "showTotalSum": true,
                "showYearSum": true,
                "sobId": "",
                "startCreditFor": "",
                "startDate": "2018-08-01",
                "startDebitFor": "",
                "startPeriod": 8,
                "startYear": "2018",
                "subjectCode": "",
                "subjectId": 229,
                "subjectName": "银行存款",
                "type": 1
            }
            let _vm = this;
            let config = Object.assign({}, this.base_config, {
                colNames: colNames,
                colModel: colModel,
                postData: JSON.stringify(_date),
                // postData: JSON.stringify(_vm.editData),
                loadComplete: function (xhr) {

                    if (xhr.code != '100100') {
                        layer.alert(xhr.msg);
                        return;
                    }


                },
                onSelectRow: function (rowid, status) {  // 当选择行时触发此事件
                    // let rowData = jQuery("#list").jqGrid('getRowData', rowid);
                    // that.selectListId = [rowData.id];
                    // console.log("当前选择的id===" + that.selectListId);

                    // if (rowid && rowid !== _vm.lastSelection) {
                    //     var grid = $("#list");
                    //     grid.jqGrid('restoreRow', _vm.lastSelection);
                    //     grid.jqGrid('editRow', rowid, { keys: true, focusField: 4 });
                    //     _vm.lastSelection = rowid;
                    // }
                    jQuery('#list').editRow(rowid, true);
                },
                gridComplete: function () {
                    // $("table[id='list'] tr[id='null'] input").attr('style', 'display:none');
                    // $("table[id='list'] tr[id='0'] input").attr('style', 'display:none');
                    var allCountID = $("#list").jqGrid('getDataIDs');
                    allCountID.forEach(_id => {
                        jQuery('#list').editRow(_id, true);
                    });


                },
            });
            jQuery("#list").jqGrid(config);
        },
        listVoucherWord() {
            var that = this;
            $.ajax({
                url: contextPath + "/transferprofitloss/listvoucherword",
                type: "post",
                dataType: "json",
                success: function (data) {
                    that.pzNumberList = data.data;
                    that.editData.pzNumber = data.data[0].id;
                }
            });
        },
        listTransferNotPost() {
            var that = this;
            $.ajax({
                url: contextPath + "/transferprofitloss/listtransfernotpost",
                type: "post",
                dataType: "json",
                async: false,
                success: function (data) {
                    if (data.data.length > 0) {
                        that.voucherVisible = true;
                        that.voucher = data.data[0].voucherWord;
                    }

                }
            });
        }
    },
    //获取会计科目列表
    mounted() {

        this.getYear();
        this.getMonth();
        this.lastday();

        this.editData.datetime = this.currentYear + '-' + this.currentMonth + '-' + this.currentLastDay;

        this.listVoucherWord();
        this.listTransferNotPost();
        // this.voucherVisible = true;

        this.initPage();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    watch: {},
});