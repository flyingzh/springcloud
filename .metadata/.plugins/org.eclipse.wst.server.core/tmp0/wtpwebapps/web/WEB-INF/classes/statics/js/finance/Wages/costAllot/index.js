new Vue({
    el: '#cost-allot',
    data() {
        return {
            formData: {
                id: 0,
                wageCategoryId: 0, // 工资类别id
                scarletLetterSterilisation: false, //红字冲销
                summaryOfCostItems: true, // 费用科目汇总
                summaryOfSalarySubjects: true, // 工资科目汇总
            },
            openTime: '',   //用于控制退出按钮
            wageCategoryName: "", //工资类别名称
            wageCategoryList: [],//工资类别列表
            coinStopList: [],//币别集合
            filterVisible: false,
            selected: [],  // 获取列表列的勾选数组的rowId
            tableList: [],  // 获取列表列的所有数据
            organizationList: [],
        }
    },
    created() {
    },
    mounted() {
        this.init();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods: {
        closeWindow: function () {
            //关闭当前页签
            var name = '费用分配';
            window.parent.closeCurrentTab({'name': name, 'openTime': this.openTime, 'url': this.openTime, exit: true})
        },
        //页面初始化
        init() {
            var _that = this;
            $.ajax({
                url: contextPath + "/wmCostAllot/init",
                type: "post",
                async: false,
                success: function (data) {
                    if (data.code == '100100') {
                        _that.coinStopList = data.data.tvde;
                        _that.wageCategoryList = data.data.category;
                        for (var i = 0; i < _that.wageCategoryList.length; i++) {
                            if (_that.wageCategoryList[i].sysDefault == 1) {
                                _that.formData.wageCategoryId = _that.wageCategoryList[i].id;
                                break;
                            }
                        }
                        console.log(data, "data")
                    } else {
                        _that.$Modal.error({
                            title: '提示',
                            content: "初始数据加载失败",
                        })
                    }
                    _that.pageInit();
                }
            });
        },
        //工资列表选择时设置为默认
        selectDefault() {
            var _that = this;
            var id = _that.formData.wageCategoryId;
            $.ajax({
                url: contextPath + "/category/select/" + id,
                type: "post",
                async: false,
                success: function (data) {
                    var _text = '';
                    if (data.code == '100100') {
                        _that.refresh();
                        _text = data.msg;
                    } else {
                        _text = data.msg;
                    }
                    _that.$Message.info({
                        content: _text,
                        duration: 3
                    });
                }
            });
        },
        pageInit() {
            let that = this;
            console.log("that.formData", that.formData)
            jQuery("#grid").jqGrid(
                {
                    datatype: "json",
                    mtype: 'POST',
                    postData: JSON.stringify(that.formData),
                    multiselect: true,
                    url: contextPath + '/wmCostAllot/getCostAllocationList',
                    ajaxGridOptions: {contentType: 'application/json;charset=utf-8'},
                    colNames: ['序号', '费用分配名称', '凭证字', '摘要类容', '分配比例(%)'],
                    colModel: [
                        {name: 'id', width: 200, align: "center", sortable: false, key: true},
                        {name: 'costAllocatioName', width: 200, align: "left", sortable: false},
                        {
                            name: 'voucherWordId',
                            width: 200,
                            align: "center",
                            sortable: false,
                            formatter: function (value, options, rowData) {
                                for (var i = 0, len = that.coinStopList.length; i < len; i++) {
                                    if (value == that.coinStopList[i].id) {
                                        return that.coinStopList[i].name;
                                    }
                                }
                            }
                        },
                        {name: 'summary', width: 200, align: "center", sortable: false},
                        {name: 'allocationProportion', width: 200, align: "center", sortable: false},
                    ],
                    rowNum: 999999999,//一页显示多少条
                    jsonReader: {
                        root: "data",
                    },
                    styleUI: 'Bootstrap',
                    height: 200,
                    onSelectAll: function (data, status) { // 且点击头部的checkbox时才会触发此事件
                        that.handlerId(data, status, "selected");
                        console.log(that.selected, 123)
                    },
                    onSelectRow: function (data, status) { // 当选择行时触发此事件
                        // console.log("data---------", data, status);
                        if (!!data) {
                            that.handlerId(data, status, "selected");
                            console.log(that.selected, 233)
                        }
                    },
                    loadComplete: function (ret) {
                        //获取表格所有行数据
                        if (ret.code === '100100') {
                            that.tableList = ret.data || [];
                        }
                    },
                })
        },
        addFun() {  //新增
            var url = contextPath + '/finance/Wages/costAllot/costAllotAndVou.html';
            window.parent.activeEvent({name: '费用分配与凭证', url: url, params: null});
        },
        editFun(voucherId) { // 修改
            var that = this;
            //获取最后一个选取的id
            var id = that.selected[that.selected.length - 1];
            if (id == null || id == 0) {
                that.$Modal.error({
                    title: '警告',
                    content: '请选择一行数据进行修改!!!',
                })
                return;
            }
            var url = contextPath + '/finance/Wages/costAllot/costAllotAndVou.html?id=' + id;
            window.parent.activeEvent({name: '费用分配与凭证', url: url, params: null});
        },
        delFun() {
            if (!this.selected.length) {
                this.$Message.info({
                    content: '请选择一行数据!!!',
                    duration: 3
                })
                return;
            }
            this.$Modal.confirm({
                title: '提示信息',
                content: '<p>确定要删除所选？</p>',
                onOk: () => {
                    this.deleteBatch();
                    setTimeout(() => {
                        this.$Modal.remove();
                    }, 2000);
                }
            });
        },
        //批量删除费用分配列表
        deleteBatch() {
            var that = this;
            var ids = that.selected;
            $.ajax({
                url: contextPath + "/wmCostAllot/deleteBatch",
                type: "post",
                data: {'ids': ids},
                async: false,
                success: function (data) {
                    var _text = '';
                    if (data.code == '100100') {
                        _text = data.msg
                    } else {
                        _text = data.msg
                    }
                    that.refresh();
                    that.$Message.info({
                        content: _text,
                        duration: 3
                    });
                }
            });
        },
        voucherFun() {
            if (!this.selected.length) {
                this.$Message.info({
                    content: '请选择一行数据!!!',
                    duration: 3
                })
                return;
            }
            this.$Modal.confirm({
                title: '提示信息',
                content: '<p>立刻建立凭证吗？</p>',
                onOk: () => {
                    setTimeout(() => {
                        this.generatingCertificate();
                    }, 1000);
                }
            });
        },
        //生成凭证
        generatingCertificate() {
            var that = this;
            var ids = that.selected;
            var prams = {
                'ids': ids,
                'categoryId': that.formData.wageCategoryId,
                'scarletLetterSterilisation': that.formData.scarletLetterSterilisation,
                'summaryOfCostItems': that.formData.summaryOfCostItems,
                'summaryOfSalarySubjects': that.formData.summaryOfSalarySubjects
            };
            console.log("prams", prams)
            $.ajax({
                url: contextPath + "/wmCostAllot/generatingCertificate",
                type: "post",
                data: prams,
                async: false,
                success: function (data) {
                    var _text = '';
                    var logList = []
                    if (data.code == '100100') {
                        logList = data.data;
                        for (var i = 0, len = data.data.length; i < len; i++) {
                            _text += data.data[i];
                        }
                    } else {
                        _text = data.msg;
                    }
                    that.$Modal.success({
                        title: '警告',
                        content: _text,
                        onOk: () => {
                            that.refresh();
                            setTimeout(() => {
                                that.$Modal.remove();
                            }, 2000);
                        }
                    })
                }
            });
        },
        vmFun(voucherId) { // 凭证管理
            var url = contextPath + '/finance/Wages/costAllot/voucherManagement.html';
            window.parent.activeEvent({name: '凭证管理', url: url, params: null});
        },
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
        delTable() {
            $("#grid").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper_parent"); // 获得整个表格容器
            parent.empty();
            $("<table id='grid'></table>").appendTo(parent);
            $("<div id='grid'></div>").appendTo(parent);  // 再根据数据重新绘制表格
        },
        refresh() {
            this.delTable();
            jQuery("#grid").trigger("reloadGrid");  //刷新
            this.pageInit();
            this.selected = [];
        },
    }
})