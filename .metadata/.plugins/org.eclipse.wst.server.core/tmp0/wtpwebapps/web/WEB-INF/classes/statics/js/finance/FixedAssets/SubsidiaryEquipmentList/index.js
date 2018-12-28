var ve = new Vue({
    el: '#subsidiary-equipment-list',
    data () {
        return {
            openTime: '',
            formData: {
                fiscalPeriod: '',
                accountYear: '',
                contains: false,
                assetCode: '',
                assetName: '',
                specModel: '',
                startStr: '',
                endStr: '',
                deviceCode: '',
                deviceName: '',
                locationId: '',
                sobId: '',
            },
            fiscalPeriodList: [],
            storagePlaceList:[], // 存放地点
            accountYearList: [],
            isEdit: true,
            filterVisible: false,
            dataList: [],
            printModal: false,
            printInfo: {},
            organizationList: [],
            showAssetsList: false,
            selectAssets: '',
        }
    },
    //获取会计科目列表
    mounted () {
        this.init();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods: {
        //资产列表弹窗
        onAssets () {
            // if (this.showReceive || this.showUserInfo) {
            //     return;
            // }
            this.showAssetsList = true;
        },
        //关闭资产列表弹窗
        closeAssets () {
            // this.card.AssetsId = this.selectAssets.id;
            this.formData.assetCode = this.selectAssets.assetCode;
            this.showAssetsList = false;
            console.log("assetsName:", this.selectAssets);
        },
        // 生成jqGrid
        jqGridInit () {
            let that = this;
            console.log("that.formData----", that.formData)
            jQuery("#grid").jqGrid({
                mtype: 'POST',
                // postData: that.formData,
                styleUI: 'Bootstrap',
                // datatype: 'json',
                url: contextPath + "/webFinanceFaAttachDevice/obtainSubsidiaryEquipmentDetails",
                colNames: ['id', '资产编码', '资产名称', '设备代码', '设备名称', '存放地点', '日期'
                    , '型号', '单位', '数量', '金额', '备注'],
                colModel: [
                    { name: 'id', width: 30, hidden: true },
                    { name: 'assetCode', width: 80, align: "right" },
                    { name: 'assetName', width: 100, align: "right" },
                    { name: 'deviceCode', width: 80, align: "right" },
                    { name: 'deviceName', width: 100, align: "right" },
                    { name: 'locationName', width: 100, align: "right" },
                    {
                        name: 'recordDate', width: 80, align: "right", formatter: function (value, options, rowData) {
                            return value ? (new Date(value)).format("yyyy-MM-dd") : '';
                        }
                    },
                    { name: 'specModel', width: 80, align: "right" },
                    { name: 'unitName', width: 50, align: "right" },
                    { name: 'num', width: 50, align: "right" },
                    {
                        name: 'amount', width: 80, align: "right", formatter: function (value, options, rowData) {
                            return value == 0 ? "" : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    { name: 'remark', width: 100, align: "right" },
                ],
                ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                datatype: 'json',
                postData: JSON.stringify(that.formData),
                jsonReader: {
                    root: "data",
                    cell: "list",
                    repeatitems: false
                },
                height: $(window).height() - 140,
                viewrecords: true,
                loadComplete: function (ret) {
                    console.log("that.dataList", that.dataList);
                    if (ret.code === '100100') {
                        that.dataList = ret.data || [];
                    }
                }
            });
        },
        init () {
            var _that = this;
            $.ajax({
                type: 'post',
                url: contextPath + '/webFinanceFaAttachDevice/init',
                dataType: 'json',
                data: null,
                success: function (d) {
                    if (d.code === '100100') {
                        console.log(d, "======>");
                        _that.formData.accountYear = d.data.years.presents[0];
                        _that.formData.fiscalPeriod = d.data.years.presents[1];
                        _that.accountYearList = d.data.years.year;
                        _that.fiscalPeriodList = d.data.years.period;
                        _that.formData.startStr = d.data.startDate
                        _that.formData.endStr = d.data.endDate;
                        _that.organizationList = d.data.org;
                        _that.formData.sobId = d.data.org[0].value;
                        _that.formData.storagePlaceList = d.data.faLocationEntity;
                        _that.jqGridInit();
                    } else {
                        _that.$Message.info({
                            content: '初始页面失败:' + d.msg,
                            duration: 3
                        });
                    }
                },
            });
        },
        openFun () {
            this.filterVisible = true;
        },
        _nullData (_t) {
            if (_t) {
                return _t;
            } else {
                return '';
            }
        },
        formartMoney (value) {
            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
        },
        //点击确认
        saveFun: function () {
            var _that = this;
            console.log("_that.formData--", _that.formData)
            this.cancelFun();
            $('#grid').setGridParam({
                postData: JSON.stringify(_that.formData)
            }).trigger("reloadGrid");
        },
        //点击取消或者x
        cancelFun: function () {
            this.filterVisible = false;

        },
        //导出Excel表格  暂时不能用
        exportExcel () {
            var _that = this;
            var containsCleanedUp = _that.formData.containsCleanedUp ? 1 : 0;
            let _url = contextPath + "/webFinanceFaAttachDevice/exportExcel?fiscalPeriod=" + _that.formData.fiscalPeriod + "&accountYear=" + _that.formData.accountYear +
                "&containsCleanedUp=" + containsCleanedUp;
            window.open(_url);
        },
        //刷新
        refreshFun () {
            var _that = this;
            $('#grid').setGridParam({
                postData: JSON.stringify(_that.formData)
            }).trigger("reloadGrid");
        },
        //退出
        dropOut () {
            //退出,关闭当前页签
            var name = '固定资产附属设备明细表';
            window.parent.closeCurrentTab({ name: name, openTime: this.openTime, exit: true })
        },
        //打印
        mimeograph () {
            console.log("--------")
            let that = this;
            if (!that.dataList || !that.dataList.length) {
                that.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }
            var _info = {
                'title': '固定资产附属设备明细表',  // 标题
                'template': 1,  // 模板
                'totalRow': false, //false不显示合计
                'titleInfo': [       // title
                    { 'name': '会计期间', 'val': that.formData.accountYear + '年' + that.formData.fiscalPeriod + '期' },
                ],
                'colNames': [       // 列名与对应字段名
                    { 'name': '资产编码', 'col': 'assetCode' },
                    { 'name': '资产名称', 'col': 'assetName' },
                    { 'name': '设备编码', 'col': 'deviceCode' },
                    { 'name': '设备名称', 'col': 'deviceName' },
                    { 'name': '存放地点', 'col': 'locationName' },
                    { 'name': '日期', 'col': 'recordDate' },
                    { 'name': '型号', 'col': 'specModel' },
                    { 'name': '单位', 'col': 'unitName' },
                    { 'name': '数量', 'col': 'num' },
                    { 'name': '金额', 'col': 'amount', 'formatNub': true },
                    { 'name': '备注', 'col': 'remark' },
                ],
                'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                'colMaxLenght': 9,  // 显示最大长度， 默认为7
                'data': that.dataList,  // 打印数据  list
            }
            // 弹窗选择列 模式
            that.printInfo = _info;
            that.printModalShow(true);
        },
        printModalShow (_t) {
            this.printModal = _t;
        },
    }
})