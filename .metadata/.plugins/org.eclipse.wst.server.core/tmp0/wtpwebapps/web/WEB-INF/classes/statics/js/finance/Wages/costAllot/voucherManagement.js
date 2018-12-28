new Vue({
    el: '#voucher-management',
    data() {
        return {
            openTime: '',   //用于控制退出按钮
            formData: {
                sobId: 1,  // 上面的不要请全部删掉
                year: 0, //年度
                startPeriod: 0,//开始期间
                endPeriod: 0,//结束期间
            },
            selected: [],  // 获取列表列的勾选数组的rowId
            tableList: [],  // 获取列表列的所有数据
            organizationList: [],
            periodList: [],
            selecteId:0,
        }
    },
    created() {
    },
    mounted() {
        this.inint();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods: {
        selectionPeriod() {
            for (var i = 0, len = this.organizationList.length; i < len; i++) {
                if (this.organizationList[i].year == this.formData.year) {
                    this.periodList = this.organizationList[i].period;
                }
            }
            this.refresh();
            console.log(this.periodList, " this.periodList ")
        },
        inint() {
            var _that = this;
            $.ajax({
                url: contextPath + "/wmCostAllot/voucherPageInit",
                type: "post",
                async: false,
                success: function (data) {
                    console.log("data", data)
                    if (data.code == '100100') {
                        _that.organizationList = data.data.list;
                        _that.formData.year = data.data.year;
                        _that.formData.startPeriod = data.data.period;
                        _that.formData.endPeriod = data.data.period;
                        _that.selectionPeriod();
                        _that.pageInit();
                    }

                }
            });
        },
        pageInit() {
            let that = this;
            var parameter = {
                year: parseInt(that.formData.year),
                startPeriod: parseInt(that.formData.startPeriod),
                endPeriod: parseInt(that.formData.endPeriod)
            }
            console.log("parameter", parameter)
            jQuery("#grid").jqGrid(
                {
                    datatype: "json",
                    mtype: 'POST',
                    postData: parameter,
                    // multiselect: true, 开启多选
                    url: contextPath + '/wmCostAllot/wageVoucherManagement',
                    colNames: ['序号', '年份', '期间', '凭证号', '摘要', '分录数', '借方合计', '贷方合计'],
                    colModel: [
                        {name: 'id', width: 100, align: "center", sortable: false, key: true},
                        {name: 'accountingYear', width: 100, align: "left", sortable: false},
                        {name: 'accountingPeriod', width: 100, align: "center", sortable: false},
                        {name: 'voucherNumber', width: 100, align: "center", sortable: false},
                        {name: 'summary', width: 200, align: "left", sortable: false},
                        {name: 'entryCount', width: 100, align: "center", sortable: false},
                        {name: 'totalDebit', width: 100, align: "center", sortable: false},
                        {name: 'totalCredit', width: 100, align: "left", sortable: false},
                    ],
                    rowNum: 999999999,//一页显示多少条
                    jsonReader: {
                        root: "data",
                    },
                    styleUI: 'Bootstrap',
                    height: $(window).height() - 210,
                    onSelectAll: function (data, status) { // 且点击头部的checkbox时才会触发此事件
                        that.handlerId(data, status, "selected");
                        console.log(that.selected, 123)
                    },
                    onSelectRow: function (data, status) { // 当选择行时触发此事件
                        // console.log("data---------", data, status);
                        if (!!data && status) {
                            // that.handlerId(data, status, "selected");
                            that.selecteId = data;//单选时的操作
                            console.log(that.selecteId, 233)
                        }
                    },
                    ondblClickRow: function (rowid) {
                        console.log("rowid", rowid)
                        // 双击事件
                        var url = contextPath + '/finance/voucher-lrt/index.html?voucherId=' + rowid + "&sobId=" + 1;
                        window.parent.activeEvent({name: '查看凭证', url: url, params: null});
                    },
                    loadComplete: function (ret) {
                        //获取表格所有行数据
                        if (ret.code === '100100') {
                            that.tableList = ret.data || [];
                        }
                    },
                })
        },
        delFun() {
            var that = this;
            if (!that.selecteId){
                that.$Message.info({
                    content: '请选择一条数据',
                    duration: 3
                });
                return;
            }
            that.$Modal.confirm({
                title: '提示信息',
                content: '<p>确定要删除所选？</p>',
                loading: true,
                onOk: () => {
                    that.deleteVoucher();
                    setTimeout(() => {
                        this.$Modal.remove();
                    });
                }
            });
        },
        //删除凭证
        deleteVoucher() {
            var that = this;
            var parameter = {voucherId:that.selecteId,sobId : 0};
            $.ajax({
                url: contextPath + "/voucherController/deleteMechanismVoucher",
                type: "post",
                data:parameter,
                datatype: "json",
                async: false,
                success: function (data) {
                    console.log("data", data)
                    var text = '';
                    if (data.code == '100100') {
                        text = data.msg;
                        that.refresh();
                    }else {
                        text = data.msg;
                    }
                    that.$Message.info({
                        content: text,
                        duration: 3
                    });
                }
            });
        },
        //查看凭证
        checkCredentials() {
            var that = this;
            if (!that.selecteId){
                that.$Message.info({
                    content: '请选择一条数据',
                    duration: 3
                });
                return;
            }
            console.log(that.selecteId,"that.selecteId")
            var url = contextPath + '/finance/voucher-lrt/index.html?voucherId=' + that.selecteId + "&sobId=" + 1;
            window.parent.activeEvent({name: '查看凭证', url: url, params: null});
        },
        //打印
        mimeograph() {

        },
        closeWindow: function () {
            //关闭当前页签
            var name = '凭证管理';
            window.parent.closeCurrentTab({'name': name, 'openTime': this.openTime, 'url': this.openTime, exit: true})
        },
        //复选框时的获取选中行的id
        handlerId(data, status, type) {
            let _vm = this;
            if (typeof data === 'object' && status) {
                _vm[type] = data.filter(row => {
                    if (row != 'null' && row != '0') {
                        return row;
                    }
                });
            }
            if (typeof data === 'object' && !status) {
                _vm[type] = [];
            }
            if (typeof data === 'string') {
                if (status) {
                    let flag = (data != 'null' && data != '0');
                    if (flag) {
                        (_vm[type].indexOf(data.toString()) > -1) ? null : _vm[type].push(data.toString());
                    }
                } else {
                    let index = _vm[type].indexOf(data.toString());
                    index > -1 ? _vm[type].splice(index, 1) : null;
                }
            }
        },
        delTable(){
            $("#grid").empty();// 清空表格内容
            var parent=$(".jqGrid_wrapper_parent"); // 获得整个表格容器
            parent.empty();
            $("<table id='grid'></table>").appendTo(parent);
            $("<div id='grid'></div>").appendTo(parent);  // 再根据数据重新绘制表格
        },
        refresh() {
            this.delTable();
            jQuery("#list").trigger("reloadGrid");  //刷新
            this.pageInit();
            this.selecteId = 0;
            console.log("this.selecteId",this.selecteId)
        },
    }
})